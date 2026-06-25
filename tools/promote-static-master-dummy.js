const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const STATIC_DIR = path.join(ROOT, "drafts", "static-views");
const BODY_DIR = path.join(ROOT, "master-dummy", "v1", "body");
const MANIFEST_PATH = path.join(ROOT, "manifests", "mpc-master-dummy-frame-pack-v1.json");
const QA_DIR = path.join(ROOT, "exports", "qa");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function idlePath(direction) {
  return path.join(BODY_DIR, direction, "idle", `body_${direction}_idle_01.png`);
}

async function copyStaticView(sourceFile, direction) {
  const out = idlePath(direction);
  ensureDir(path.dirname(out));
  await sharp(path.join(STATIC_DIR, sourceFile))
    .resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  return path.relative(ROOT, out).replace(/\\/g, "/");
}

async function compositeCell(direction) {
  const cellW = 320;
  const labelH = 44;
  const img = await sharp(idlePath(direction))
    .resize(cellW, cellW, { fit: "contain" })
    .png()
    .toBuffer();
  const checker = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${cellW}" height="${cellW}">
      <defs>
        <pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 0h12v12H0zM12 12h12v12H12z" fill="#efefef"/>
          <path d="M12 0h12v12H12zM0 12h12v12H0z" fill="#ffffff"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p)"/>
    </svg>
  `);
  const text = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${cellW}" height="${labelH}">
      <rect width="100%" height="100%" fill="#101010"/>
      <text x="14" y="28" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#fff">${direction} idle 01</text>
    </svg>
  `);

  return sharp({
    create: {
      width: cellW,
      height: cellW + labelH,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite([
      { input: checker, left: 0, top: 0 },
      { input: img, left: 0, top: 0 },
      { input: text, left: 0, top: cellW },
    ])
    .png()
    .toBuffer();
}

async function writeContactSheet() {
  ensureDir(QA_DIR);
  const directions = ["front", "back", "left", "right"];
  const cells = await Promise.all(directions.map(compositeCell));
  const gap = 24;
  const margin = 32;
  const cellW = 320;
  const cellH = 364;
  const sheetW = margin * 2 + cellW * 2 + gap;
  const sheetH = margin * 2 + cellH * 2 + gap;

  await sharp({
    create: {
      width: sheetW,
      height: sheetH,
      channels: 4,
      background: "#e9e9e9",
    },
  })
    .composite(cells.map((input, i) => ({
      input,
      left: margin + (i % 2) * (cellW + gap),
      top: margin + Math.floor(i / 2) * (cellH + gap),
    })))
    .png()
    .toFile(path.join(QA_DIR, "static-master-dummy-v1-contact-sheet.png"));
}

async function main() {
  const frames = [];

  frames.push(await copyStaticView("master-dummy-front-idle-01-alpha.png", "front"));
  frames.push(await copyStaticView("master-dummy-back-idle-01-alpha.png", "back"));
  frames.push(await copyStaticView("master-dummy-right-idle-01-alpha.png", "right"));

  const leftOut = idlePath("left");
  ensureDir(path.dirname(leftOut));
  await sharp(idlePath("right"))
    .flop()
    .png()
    .toFile(leftOut);
  frames.splice(2, 0, path.relative(ROOT, leftOut).replace(/\\/g, "/"));

  const manifest = {
    version: "1.0.0-static",
    status: "static_four_view_review",
    source: "front/back/right promoted from static review plates; left is an exact mirror of right",
    frames,
    canvas: {
      width: 1024,
      height: 1024,
      background: "transparent",
    },
  };
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeContactSheet();

  console.log(`Promoted ${frames.length} static master dummy body frames.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

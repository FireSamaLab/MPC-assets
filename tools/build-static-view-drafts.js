const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const STATIC_DIR = path.join(ROOT, "drafts", "static-views");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function keyToAlpha(input, output) {
  const image = sharp(input).ensureAlpha();
  const meta = await image.metadata();
  const data = await image.raw().toBuffer();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const greenDominant = g > r + 18 && g > b + 18;
    const brightKey = g > 135 && greenDominant;
    const darkFringe = r < 95 && b < 95 && g > 24 && greenDominant;

    if (brightKey || darkFringe) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width: meta.width, height: meta.height, channels: 4 } })
    .resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(output);
}

async function compositeCell(imgPath, label) {
  const cellW = 320;
  const labelH = 44;
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
  const layer = await sharp(imgPath).resize(cellW, cellW, { fit: "contain" }).png().toBuffer();
  const text = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${cellW}" height="${labelH}">
      <rect width="100%" height="100%" fill="#101010"/>
      <text x="14" y="28" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#fff">${label}</text>
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
      { input: layer, left: 0, top: 0 },
      { input: text, left: 0, top: cellW },
    ])
    .png()
    .toBuffer();
}

async function main() {
  ensureDir(STATIC_DIR);

  await keyToAlpha(
    path.join(STATIC_DIR, "master-dummy-back-idle-01-chromakey.png"),
    path.join(STATIC_DIR, "master-dummy-back-idle-01-alpha.png"),
  );
  await keyToAlpha(
    path.join(STATIC_DIR, "master-dummy-left-idle-01-chromakey.png"),
    path.join(STATIC_DIR, "master-dummy-left-idle-01-alpha.png"),
  );
  await sharp(path.join(STATIC_DIR, "master-dummy-left-idle-01-alpha.png"))
    .flop()
    .png()
    .toFile(path.join(STATIC_DIR, "master-dummy-right-idle-01-alpha.png"));

  const views = [
    ["master-dummy-front-idle-01-alpha.png", "front idle 01"],
    ["master-dummy-back-idle-01-alpha.png", "back idle 01"],
    ["master-dummy-left-idle-01-alpha.png", "left idle 01"],
    ["master-dummy-right-idle-01-alpha.png", "right idle 01"],
  ];
  const cells = [];
  for (const [file, label] of views) {
    cells.push(await compositeCell(path.join(STATIC_DIR, file), label));
  }

  const gap = 24;
  const margin = 32;
  const cellW = 320;
  const cellH = 364;
  const sheetW = margin * 2 + cellW * 2 + gap;
  const sheetH = margin * 2 + cellH * 2 + gap;
  const composites = cells.map((input, i) => ({
    input,
    left: margin + (i % 2) * (cellW + gap),
    top: margin + Math.floor(i / 2) * (cellH + gap),
  }));

  await sharp({
    create: {
      width: sheetW,
      height: sheetH,
      channels: 4,
      background: "#e9e9e9",
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(STATIC_DIR, "master-dummy-static-views-contact-sheet.png"));

  const manifest = {
    status: "draft_static_views_for_review",
    source: "approved front alpha plus generated back and generated left side; right side mirrored from left",
    frames: views.map(([file, label]) => ({ label, file })),
  };
  fs.writeFileSync(path.join(STATIC_DIR, "static-views-manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(path.join(STATIC_DIR, "master-dummy-static-views-contact-sheet.png"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

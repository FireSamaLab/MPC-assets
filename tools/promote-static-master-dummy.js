const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const STATIC_DIR = path.join(ROOT, "drafts", "static-views");
const BODY_DIR = path.join(ROOT, "master-dummy", "v1", "body");
const MANIFEST_PATH = path.join(ROOT, "manifests", "mpc-master-dummy-frame-pack-v1.json");
const QA_DIR = path.join(ROOT, "exports", "qa");
const APPROVED_SIDE_LEFT = path.join(STATIC_DIR, "master-dummy-side-left-lock-alpha.png");
const CANVAS = 1024;
const SIDE_TARGET = {
  height: 858,
  footY: 928,
  rightCenterX: 543,
};
const OUTLINE = [17, 17, 17];
const SKIN_TOP = [255, 207, 151];
const SKIN_MID = [252, 184, 108];
const SKIN_BOTTOM = [247, 168, 91];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a.map((channel, i) => Math.round(channel + (b[i] - channel) * t));
}

function skinAtY(y, bounds) {
  const t = clamp((y - bounds.top) / Math.max(1, bounds.height), 0, 1);
  if (t < 0.55) {
    return mix(SKIN_TOP, SKIN_MID, t / 0.55);
  }
  return mix(SKIN_MID, SKIN_BOTTOM, (t - 0.55) / 0.45);
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
  await normalizeSpritePalette(out);
  return path.relative(ROOT, out).replace(/\\/g, "/");
}

async function alphaBounds(input) {
  const image = sharp(input).ensureAlpha();
  const meta = await image.metadata();
  const data = await image.raw().toBuffer();
  let minX = meta.width;
  let minY = meta.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < meta.height; y += 1) {
    for (let x = 0; x < meta.width; x += 1) {
      if (data[(y * meta.width + x) * 4 + 3] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < 0 || maxY < 0) {
    throw new Error(`No visible pixels found in ${input}`);
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

async function normalizeSpritePalette(file) {
  const image = sharp(file).ensureAlpha();
  const meta = await image.metadata();
  const data = await image.raw().toBuffer();
  const bounds = await alphaBounds(file);

  for (let y = 0; y < meta.height; y += 1) {
    for (let x = 0; x < meta.width; x += 1) {
      const i = (y * meta.width + x) * 4;
      const alpha = data[i + 3];
      if (alpha === 0) {
        continue;
      }

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const skin = skinAtY(y, bounds);
      const lineCandidate = (lum < 112 && r < 150 && g < 135 && b < 120) || (r < 95 && g < 95 && b < 95);
      const lineT = lineCandidate ? clamp((126 - lum) / 86, 0, 1) : 0;
      const color = lineT > 0 ? mix(skin, OUTLINE, lineT) : skin;

      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
    }
  }

  const tmp = `${file}.tmp.png`;
  await sharp(data, { raw: { width: meta.width, height: meta.height, channels: 4 } })
    .png()
    .toFile(tmp);
  fs.renameSync(tmp, file);
}

async function normalizeSideFrame(file) {
  const bounds = await alphaBounds(file);
  const width = Math.round((bounds.width / bounds.height) * SIDE_TARGET.height);
  const layer = await sharp(file)
    .extract(bounds)
    .resize(width, SIDE_TARGET.height, { fit: "fill" })
    .png()
    .toBuffer();
  const tmp = `${file}.tmp.png`;

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{
      input: layer,
      left: Math.round(SIDE_TARGET.rightCenterX - width / 2),
      top: SIDE_TARGET.footY - SIDE_TARGET.height + 1,
    }])
    .png()
    .toFile(tmp);
  fs.renameSync(tmp, file);
}

async function buildApprovedSide(output) {
  await sharp(APPROVED_SIDE_LEFT)
    .resize(CANVAS, CANVAS, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(output);
  await normalizeSideFrame(output);
  await normalizeSpritePalette(output);
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
  const leftOut = idlePath("left");
  ensureDir(path.dirname(leftOut));
  await buildApprovedSide(leftOut);
  frames.push(path.relative(ROOT, leftOut).replace(/\\/g, "/"));

  const rightOut = idlePath("right");
  ensureDir(path.dirname(rightOut));
  await sharp(idlePath("left"))
    .flop()
    .png()
    .toFile(rightOut);
  frames.push(path.relative(ROOT, rightOut).replace(/\\/g, "/"));

  const manifest = {
    version: "1.0.0-static",
    status: "locked_static_four_view_v1",
    lockedAt: "2026-06-26",
    lockTag: "mpc-master-dummy-v1.0.0-locked",
    approvedBaselineCommit: "af8b188",
    source: "front/back promoted from static review plates; left side imported from approved no-ear side reference; all views use one normalized skin palette; right is an exact mirror of left",
    lockRule: "Do not change these body frames in v1.0. Create MPC Master Dummy v2.0 for proportion or silhouette changes.",
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

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = process.cwd();
const directions = ["front", "back", "left", "right"];
const manifestPath = path.join(root, "manifests", "mpc-master-dummy-frame-pack-v1.json");

async function checkFile(p) {
  if (!fs.existsSync(p)) {
    console.log("Missing:", p);
    return false;
  }

  const meta = await sharp(p).metadata();
  if (meta.width !== 1024 || meta.height !== 1024) {
    console.log("Wrong dimensions:", p, `${meta.width}x${meta.height}`);
    return false;
  }

  if (!meta.hasAlpha) {
    console.log("Missing alpha channel:", p);
    return false;
  }

  return true;
}

async function checkLeftMirrorsRight() {
  const leftPath = path.join(root, "master-dummy/v1/body/left/idle/body_left_idle_01.png");
  const rightPath = path.join(root, "master-dummy/v1/body/right/idle/body_right_idle_01.png");
  const left = await sharp(leftPath).raw().toBuffer();
  const mirroredRight = await sharp(rightPath).flop().raw().toBuffer();

  if (Buffer.compare(left, mirroredRight) !== 0) {
    console.log("Left is not an exact mirror of right.");
    return false;
  }

  return true;
}

async function checkPack() {
  let ok = true;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const expectedFrames = directions.map((dir) => `master-dummy/v1/body/${dir}/idle/body_${dir}_idle_01.png`);

  if (JSON.stringify(manifest.frames) !== JSON.stringify(expectedFrames)) {
    console.log("Manifest does not match the static four-view body frame list.");
    ok = false;
  }

  for (const frame of expectedFrames) {
    ok = (await checkFile(path.join(root, frame))) && ok;
  }

  ok = (await checkLeftMirrorsRight()) && ok;
  return ok;
}

async function main() {
  console.log("Checking static master dummy body pack...");
  const bodyOk = await checkPack();

  if (bodyOk) {
    console.log("Frame-pack validation passed.");
    process.exit(0);
  }

  console.log("Frame-pack validation failed.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

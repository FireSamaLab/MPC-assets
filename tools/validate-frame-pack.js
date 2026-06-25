const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = process.cwd();
const directions = ['front', 'back', 'left', 'right'];
const idleFrames = Array.from({ length: 8 }, (_, i) => String(i + 1).padStart(2, '0'));
const walkFrames = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

async function checkFile(p) {
  if (!fs.existsSync(p)) {
    console.log('Missing:', p);
    return false;
  }

  const meta = await sharp(p).metadata();
  if (meta.width !== 1024 || meta.height !== 1024) {
    console.log('Wrong dimensions:', p, `${meta.width}x${meta.height}`);
    return false;
  }

  if (!meta.hasAlpha) {
    console.log('Missing alpha channel:', p);
    return false;
  }

  return true;
}

async function checkPack(baseDir, prefix) {
  let ok = true;
  for (const dir of directions) {
    for (const n of idleFrames) {
      const p = path.join(root, baseDir, dir, 'idle', `${prefix}_${dir}_idle_${n}.png`);
      ok = (await checkFile(p)) && ok;
    }
    for (const n of walkFrames) {
      const p = path.join(root, baseDir, dir, 'walk', `${prefix}_${dir}_walk_${n}.png`);
      ok = (await checkFile(p)) && ok;
    }
  }
  return ok;
}

async function main() {
  console.log('Checking body pack...');
  const bodyOk = await checkPack('master-dummy/v1/body', 'body');
  console.log('Checking black shorts pack...');
  const shortsOk = await checkPack('assets/bottoms/shorts_black', 'shorts_black');

  if (bodyOk && shortsOk) {
    console.log('Frame-pack validation passed.');
    process.exit(0);
  }

  console.log('Frame-pack validation failed.');
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

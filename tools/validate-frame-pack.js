const fs = require('fs');
const path = require('path');

const root = process.cwd();
const directions = ['front', 'back', 'left', 'right'];
const idleFrames = Array.from({ length: 8 }, (_, i) => String(i + 1).padStart(2, '0'));
const walkFrames = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

function checkPack(baseDir, prefix) {
  let ok = true;
  for (const dir of directions) {
    for (const n of idleFrames) {
      const p = path.join(root, baseDir, dir, 'idle', `${prefix}_${dir}_idle_${n}.png`);
      if (!fs.existsSync(p)) {
        console.log('Missing:', p);
        ok = false;
      }
    }
    for (const n of walkFrames) {
      const p = path.join(root, baseDir, dir, 'walk', `${prefix}_${dir}_walk_${n}.png`);
      if (!fs.existsSync(p)) {
        console.log('Missing:', p);
        ok = false;
      }
    }
  }
  return ok;
}

console.log('Checking body pack...');
const bodyOk = checkPack('master-dummy/v1/body', 'body');
console.log('Checking black shorts pack...');
const shortsOk = checkPack('assets/bottoms/shorts_black', 'shorts_black');

if (bodyOk && shortsOk) {
  console.log('✅ Frame-pack validation passed.');
  process.exit(0);
} else {
  console.log('❌ Frame-pack validation failed.');
  process.exit(1);
}

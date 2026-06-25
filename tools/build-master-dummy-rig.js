const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const SIZE = 1024;
const DIRECTIONS = ["front", "back", "left", "right"];
const ANIMATIONS = { idle: 8, walk: 12 };

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function z(n) {
  return String(n).padStart(2, "0");
}

function frameState(animation, frameIndex) {
  const count = ANIMATIONS[animation];
  const t = (frameIndex / count) * Math.PI * 2;
  const s = Math.sin(t);
  const c = Math.cos(t);
  if (animation === "idle") {
    return {
      bob: Math.round(s * 3),
      arm: s * 4,
      leftStep: 0,
      rightStep: 0,
      leftLift: 0,
      rightLift: 0,
      lean: 0,
    };
  }
  return {
    bob: Math.round(Math.abs(c) * -5 + 3),
    arm: s * 18,
    leftStep: s * 22,
    rightStep: -s * 22,
    leftLift: Math.max(0, s) * 18,
    rightLift: Math.max(0, -s) * 18,
    lean: s * 2,
  };
}

function svgShell(content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <radialGradient id="skin" cx="42%" cy="24%" r="78%">
      <stop offset="0%" stop-color="#ffd197"/>
      <stop offset="60%" stop-color="#f7bf79"/>
      <stop offset="100%" stop-color="#eda965"/>
    </radialGradient>
    <linearGradient id="shorts" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#232323"/>
      <stop offset="100%" stop-color="#101010"/>
    </linearGradient>
    <style>
      .skin{fill:url(#skin);stroke:#0b0b0b;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}
      .line{fill:none;stroke:#0b0b0b;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
      .thin{fill:none;stroke:#0b0b0b;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
      .cloth{fill:url(#shorts);stroke:#0b0b0b;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}
    </style>
  </defs>
  ${content}
</svg>`;
}

function frontBackBody(direction, state) {
  const isBack = direction === "back";
  const earLines = isBack
    ? ""
    : `<path class="thin" d="M342 311 C362 294 371 327 351 344"/>
       <path class="thin" d="M682 311 C662 294 653 327 673 344"/>`;
  const torsoBackLine = isBack
    ? `<path class="thin" d="M430 512 C405 575 400 650 406 724"/>
       <path class="thin" d="M594 512 C619 575 624 650 618 724"/>`
    : `<path class="thin" d="M421 505 C389 579 378 639 382 704"/>
       <path class="thin" d="M603 505 C635 579 646 639 642 704"/>`;

  const leftLegX = Math.round(state.leftStep);
  const rightLegX = Math.round(state.rightStep);
  const leftLift = Math.round(state.leftLift);
  const rightLift = Math.round(state.rightLift);
  const leftArm = Math.round(state.arm);
  const rightArm = Math.round(-state.arm);

  return svgShell(`
    <g transform="translate(0 ${state.bob}) rotate(${state.lean} 512 520)">
      <path class="skin" d="M414 ${690 - leftLift} C402 ${744 - leftLift} 402 ${818 - leftLift} 413 ${858 - leftLift} C426 ${875 - leftLift} 465 ${875 - leftLift} 479 ${858 - leftLift} L476 ${685 - leftLift} Z" transform="translate(${leftLegX} 0)"/>
      <path class="skin" d="M548 ${685 - rightLift} L545 ${858 - rightLift} C559 ${875 - rightLift} 598 ${875 - rightLift} 611 ${858 - rightLift} C622 ${818 - rightLift} 622 ${744 - rightLift} 610 ${690 - rightLift} Z" transform="translate(${rightLegX} 0)"/>
      <path class="skin" d="M399 ${852 - leftLift} C356 ${854 - leftLift} 326 ${875 - leftLift} 331 ${904 - leftLift} C336 ${936 - leftLift} 407 ${943 - leftLift} 454 ${923 - leftLift} C478 ${913 - leftLift} 485 ${884 - leftLift} 463 ${864 - leftLift} C446 ${853 - leftLift} 424 ${851 - leftLift} 399 ${852 - leftLift} Z" transform="translate(${leftLegX} 0)"/>
      <path class="skin" d="M625 ${852 - rightLift} C668 ${854 - rightLift} 698 ${875 - rightLift} 693 ${904 - rightLift} C688 ${936 - rightLift} 617 ${943 - rightLift} 570 ${923 - rightLift} C546 ${913 - rightLift} 539 ${884 - rightLift} 561 ${864 - rightLift} C578 ${853 - rightLift} 600 ${851 - rightLift} 625 ${852 - rightLift} Z" transform="translate(${rightLegX} 0)"/>

      <path class="skin" d="M394 454 C344 506 319 608 324 722 C326 787 371 829 432 827 L592 827 C653 829 698 787 700 722 C705 608 680 506 630 454 C590 421 434 421 394 454 Z"/>
      ${torsoBackLine}

      <path class="skin" d="M391 459 C346 535 326 606 337 676 C346 697 386 690 387 665 C383 604 401 541 431 489 Z" transform="translate(${leftArm} 0)"/>
      <ellipse class="skin" cx="${350 + leftArm}" cy="681" rx="37" ry="41"/>
      <path class="skin" d="M633 459 C678 535 698 606 687 676 C678 697 638 690 637 665 C641 604 623 541 593 489 Z" transform="translate(${rightArm} 0)"/>
      <ellipse class="skin" cx="${674 + rightArm}" cy="681" rx="37" ry="41"/>

      <ellipse class="skin" cx="342" cy="321" rx="36" ry="52"/>
      <ellipse class="skin" cx="682" cy="321" rx="36" ry="52"/>
      <ellipse class="skin" cx="512" cy="303" rx="181" ry="181"/>
      ${earLines}
    </g>
  `);
}

function sideBody(direction, state) {
  const mirror = direction === "right";
  const side = mirror ? -1 : 1;
  const origin = mirror ? 1024 : 0;
  const nearStep = Math.round(state.leftStep * side);
  const farStep = Math.round(state.rightStep * side);
  const nearLift = Math.round(state.leftLift);
  const farLift = Math.round(state.rightLift);
  const arm = Math.round(state.arm * 0.6);

  return svgShell(`
    <g transform="translate(${origin} ${state.bob}) scale(${mirror ? -1 : 1} 1) rotate(${state.lean * side} 512 520)">
      <path class="skin" d="M470 ${694 - farLift} C458 ${752 - farLift} 458 ${821 - farLift} 472 ${858 - farLift} C487 ${873 - farLift} 524 ${872 - farLift} 535 ${856 - farLift} L528 ${690 - farLift} Z" transform="translate(${farStep} 0)" opacity="0.98"/>
      <path class="skin" d="M536 ${687 - nearLift} L529 ${858 - nearLift} C543 ${876 - nearLift} 592 ${875 - nearLift} 608 ${855 - nearLift} C618 ${804 - nearLift} 615 ${744 - nearLift} 600 ${690 - nearLift} Z" transform="translate(${nearStep} 0)"/>
      <path class="skin" d="M467 ${851 - farLift} C430 ${854 - farLift} 407 ${873 - farLift} 411 ${900 - farLift} C417 ${930 - farLift} 482 ${936 - farLift} 522 ${919 - farLift} C546 ${909 - farLift} 551 ${883 - farLift} 532 ${864 - farLift} C515 ${852 - farLift} 492 ${850 - farLift} 467 ${851 - farLift} Z" transform="translate(${farStep} 0)" opacity="0.98"/>
      <path class="skin" d="M592 ${851 - nearLift} C633 ${855 - nearLift} 661 ${875 - nearLift} 657 ${903 - nearLift} C651 ${933 - nearLift} 581 ${939 - nearLift} 536 ${919 - nearLift} C513 ${909 - nearLift} 507 ${883 - nearLift} 527 ${864 - nearLift} C544 ${852 - nearLift} 567 ${850 - nearLift} 592 ${851 - nearLift} Z" transform="translate(${nearStep} 0)"/>

      <path class="skin" d="M434 456 C392 515 378 632 404 743 C420 808 474 833 557 825 C608 817 633 773 625 709 C614 588 590 501 545 456 C514 431 466 431 434 456 Z"/>
      <path class="thin" d="M443 508 C420 579 414 646 428 710"/>
      <path class="thin" d="M571 508 C592 580 596 646 582 710"/>
      <path class="skin" d="M441 494 C409 565 404 626 420 681 C431 701 467 692 466 668 C455 611 461 551 484 499 Z" transform="translate(${arm} 0)"/>
      <ellipse class="skin" cx="${431 + arm}" cy="684" rx="34" ry="38"/>
      <path class="skin" d="M571 493 C602 563 606 625 591 681 C580 701 545 692 546 668 C557 610 551 550 528 499 Z" opacity="0.88" transform="translate(${-arm * 0.45} 0)"/>
      <ellipse class="skin" cx="${579 - arm * 0.45}" cy="683" rx="31" ry="36" opacity="0.9"/>

      <ellipse class="skin" cx="512" cy="303" rx="144" ry="183"/>
      <ellipse class="skin" cx="620" cy="324" rx="34" ry="48"/>
      <path class="thin" d="M614 314 C633 298 641 329 623 346"/>
    </g>
  `);
}

function bodySvg(direction, animation, frameIndex) {
  const state = frameState(animation, frameIndex);
  if (direction === "front" || direction === "back") return frontBackBody(direction, state);
  return sideBody(direction, state);
}

function frontBackShorts(direction, state) {
  const isBack = direction === "back";
  const leftLegX = Math.round(state.leftStep * 0.4);
  const rightLegX = Math.round(state.rightStep * 0.4);
  const seam = isBack ? "" : `<path class="thin" d="M512 694 L512 768"/>`;
  return svgShell(`
    <g transform="translate(0 ${state.bob}) rotate(${state.lean} 512 520)">
      <path class="cloth" d="M375 666 C415 681 470 688 512 688 C554 688 609 681 649 666 L662 752 C619 768 566 772 525 762 L512 724 L499 762 C458 772 405 768 362 752 Z"/>
      <path class="cloth" d="M362 752 C398 772 449 777 499 762 L492 807 C448 820 402 816 367 795 Z" transform="translate(${leftLegX} 0)"/>
      <path class="cloth" d="M662 752 C626 772 575 777 525 762 L532 807 C576 820 622 816 657 795 Z" transform="translate(${rightLegX} 0)"/>
      ${seam}
    </g>
  `);
}

function sideShorts(direction, state) {
  const mirror = direction === "right";
  const origin = mirror ? 1024 : 0;
  const side = mirror ? -1 : 1;
  const nearStep = Math.round(state.leftStep * side * 0.35);
  return svgShell(`
    <g transform="translate(${origin} ${state.bob}) scale(${mirror ? -1 : 1} 1) rotate(${state.lean * side} 512 520)">
      <path class="cloth" d="M405 668 C455 685 556 685 620 668 L635 760 C573 785 486 782 417 758 Z"/>
      <path class="cloth" d="M417 758 C466 781 535 784 590 766 L594 810 C540 825 466 820 422 796 Z" transform="translate(${nearStep} 0)"/>
    </g>
  `);
}

function shortsSvg(direction, animation, frameIndex) {
  const state = frameState(animation, frameIndex);
  if (direction === "front" || direction === "back") return frontBackShorts(direction, state);
  return sideShorts(direction, state);
}

async function writeFrame(svg, outPath) {
  ensureDir(path.dirname(outPath));
  await sharp(Buffer.from(svg)).png().toFile(outPath);
}

async function buildFrames() {
  for (const direction of DIRECTIONS) {
    for (const [animation, count] of Object.entries(ANIMATIONS)) {
      for (let i = 0; i < count; i += 1) {
        const frame = z(i + 1);
        await writeFrame(
          bodySvg(direction, animation, i),
          path.join(ROOT, "master-dummy", "v1", "body", direction, animation, `body_${direction}_${animation}_${frame}.png`),
        );
        await writeFrame(
          shortsSvg(direction, animation, i),
          path.join(ROOT, "assets", "bottoms", "shorts_black", direction, animation, `shorts_black_${direction}_${animation}_${frame}.png`),
        );
      }
    }
  }
}

async function buildContactSheet() {
  const cells = [
    ["front", "idle", 1],
    ["front", "walk", 1],
    ["front", "walk", 4],
    ["back", "idle", 1],
    ["back", "walk", 4],
    ["left", "idle", 1],
    ["left", "walk", 4],
    ["right", "idle", 1],
    ["right", "walk", 4],
  ];
  const cellW = 300;
  const cellH = 342;
  const gap = 22;
  const margin = 40;
  const cols = 3;
  const rows = Math.ceil(cells.length / cols);
  const width = margin * 2 + cols * cellW + (cols - 1) * gap;
  const height = margin * 2 + rows * cellH + (rows - 1) * gap;

  const composites = [];
  for (let idx = 0; idx < cells.length; idx += 1) {
    const [direction, animation, n] = cells[idx];
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const left = margin + col * (cellW + gap);
    const top = margin + row * (cellH + gap);
    const bodyPath = path.join(ROOT, "master-dummy", "v1", "body", direction, animation, `body_${direction}_${animation}_${z(n)}.png`);
    const shortsPath = path.join(ROOT, "assets", "bottoms", "shorts_black", direction, animation, `shorts_black_${direction}_${animation}_${z(n)}.png`);
    const bodyLayer = await sharp(bodyPath).resize(cellW, cellW, { fit: "contain" }).png().toBuffer();
    const shortsLayer = await sharp(shortsPath).resize(cellW, cellW, { fit: "contain" }).png().toBuffer();
    const frame = await sharp({
      create: {
        width: cellW,
        height: cellW,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        { input: bodyLayer, top: 0, left: 0 },
        { input: shortsLayer, top: 0, left: 0 },
      ])
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${cellW}" height="42">
        <rect width="100%" height="100%" fill="#101010"/>
        <text x="14" y="27" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${direction} ${animation} ${z(n)}</text>
      </svg>
    `);
    composites.push({ input: frame, left, top });
    composites.push({ input: label, left, top: top + cellW });
  }

  ensureDir(path.join(ROOT, "exports", "qa"));
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 238, g: 238, b: 238, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(ROOT, "exports", "qa", "master-dummy-v1-contact-sheet.png"));
}

async function main() {
  await buildFrames();
  await buildContactSheet();
  console.log("Built MPC Master Dummy v1 rig frames and QA sheet.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

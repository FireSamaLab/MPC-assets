# MPC Master Dummy Rig Pipeline

## Source Of Truth

The rebuildable source for the current game-ready dummy is:

```txt
tools/build-master-dummy-rig.js
```

This script generates:

```txt
master-dummy/v1/body/{direction}/{animation}/body_{direction}_{animation}_{frame}.png
assets/bottoms/shorts_black/{direction}/{animation}/shorts_black_{direction}_{animation}_{frame}.png
exports/qa/master-dummy-v1-contact-sheet.png
```

## Why This Format

The game should consume simple transparent PNG frames, but the art must come from a deterministic rig so all future layers remain aligned.

This gives us:

- editable source geometry
- consistent proportions across frames
- transparent `1024 x 1024` PNG exports
- repeatable idle and walk animation frames
- separate body and clothing layers
- a QA contact sheet for visual review

## Commands

```bash
npm install
npm run qa
```

`npm run qa` rebuilds the frame pack and validates that every exported body and shorts frame exists, is `1024 x 1024`, and has transparency.

## Frame Contract

```txt
directions: front, back, left, right
animations: idle, walk
idle frames: 8
walk frames: 12
body frames: 80
shorts frames: 80
```

## Production Rule

Do not hand-edit individual PNG frames as the normal workflow.

Tune the rig source, rebuild the pack, review the contact sheet, then commit the generated outputs.


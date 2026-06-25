# Meme Park City Assets

This repository is the source of truth for **Meme Park City** toon assets.

The goal is to support the website avatar customizer and the future 2D game/world using one shared asset pipeline.

## Phase 1 Status

**Phase 1 is the foundation phase.**

Before creating hundreds of cosmetics, Meme Park City needs a fixed avatar standard so every asset fits, animates, and exports correctly.

The live motion test uses the real PNG frame pack:

```txt
https://firesamalab.github.io/MPC-assets/motion-test/
```

Phase 1 defines:

- MPC Master Dummy v1.0
- canvas rules
- body proportions
- layer order
- animation frame counts
- anchor points
- naming conventions
- folder structure
- compatibility checklist

## Golden Rule

Every asset must fit the **MPC Master Dummy v1.0**.

Do not resize, crop, stretch, or manually shift assets per frame. If an asset does not align with the Master Dummy, the asset is not MPC-compatible.

## Asset Standard

| Rule | Standard |
|---|---|
| Canvas | `1024 x 1024 px` |
| Background | Transparent |
| Character centerline | `X = 512` |
| Feet baseline | `Y = 900` |
| Export scale | `1x` |
| Movement | Whole-pixel positioning only |
| Directions | `front`, `back`, `left`, `right` |
| Launch animations | `idle`, `walk` |
| Idle frames | `8` |
| Walk frames | `12` |

## Master Dummy Purpose

The Master Dummy defines:

- body proportions
- head size
- shoulder width
- hand positions
- waist line
- feet baseline
- layer order
- animation frame count
- anchor points for hats, hair, eyes, mouth, shoes, hand items, and back accessories

This prevents low-quality scaling, walking-size changes, blurry exports, and cosmetic clipping.

## Repository Structure

```txt
MPC-assets/
├── README.md
├── docs/
│   ├── MPC_MASTER_DUMMY.md
│   ├── MPC_ASSET_STANDARD.md
│   ├── MPC_ANIMATION_STANDARD.md
│   └── MPC_LAYER_STANDARD.md
├── manifests/
│   └── mpc-master-dummy-v1.json
├── anchors/
│   ├── front/
│   ├── back/
│   ├── left/
│   └── right/
├── master-dummy/
│   ├── body/
│   ├── animation/
│   ├── guides/
│   └── exports/
├── assets/
│   ├── skins/
│   ├── faces/
│   ├── eyes/
│   ├── eyebrows/
│   ├── mouths/
│   ├── hair/
│   ├── hats/
│   ├── shirts/
│   ├── jackets/
│   ├── pants/
│   ├── shoes/
│   ├── accessories/
│   └── extras/
└── exports/
    ├── sprite-sheets/
    └── avatar-combos/
```

## Naming Convention

```txt
{category}_{asset_id}_{direction}_{animation}_{frame}.png
```

Example:

```txt
shirt_black_hoodie_front_walk_01.png
```

## Layer Order

```txt
01 skin_body
02 skin_head
03 face_base
04 eyes
05 eyebrows
06 mouth
07 hair_back
08 shirt
09 jacket
10 pants
11 shoes
12 hair_front
13 face_accessory
14 hand_item_left
15 hand_item_right
16 back_accessory
17 hat
18 fx
```

## Launch Asset Requirement

For an asset to be launch-ready, it should include:

```txt
front_idle_01 to front_idle_08
front_walk_01 to front_walk_12
```

Full game-ready assets should eventually include:

```txt
front
back
left
right
```

for both:

```txt
idle
walk
```

## MPC Compatibility Checklist

Before an asset is accepted:

- [ ] Uses the 1024 x 1024 transparent canvas
- [ ] Keeps the feet on the shared baseline
- [ ] Uses the official Master Dummy proportions
- [ ] Uses whole-pixel positioning
- [ ] Does not require manual resizing in the website
- [ ] Does not jump between animation frames
- [ ] Follows the naming convention
- [ ] Exports clean transparent PNGs

## Version

Current standard: **MPC Master Dummy v1.0**

Future versions should be created as new standards rather than breaking existing assets.

---

Built for Meme Park City / `$MPC`.

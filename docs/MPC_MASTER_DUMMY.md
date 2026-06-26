# MPC Master Dummy v1.0

The MPC Master Dummy is the official anchor for every Meme Park City avatar asset.

It defines the fixed canvas, proportions, anchor points, animation frame counts, and export rules used by the website avatar customizer and the future 2D game/world.

## Locked Baseline

Status: `LOCKED`

The static four-view body baseline is locked as `MPC Master Dummy v1.0`.

```txt
lock tag: mpc-master-dummy-v1.0.0-locked
approved baseline commit: af8b188
lock record: docs/MPC_MASTER_DUMMY_V1_LOCK.md
```

Do not change v1 proportions, silhouette, canvas, baseline, or side direction. If the base body must change, create `MPC Master Dummy v2.0`.

## Golden Rule

All assets must be built on the same 1024 x 1024 canvas and align to the same dummy.

Never resize, crop, stretch, or manually shift an individual asset to make it fit.

## Canvas

| Property | Value |
|---|---:|
| Canvas width | 1024 px |
| Canvas height | 1024 px |
| Centerline | X = 512 |
| Feet baseline | Y = 900 |
| Background | Transparent |
| Export | PNG |
| Source files | Layered source preferred |

## Body Proportion Target

The approved Meme Park City toon silhouette uses:

- large rounded head
- minimal / hidden neck
- simple rounded torso
- short arms
- circular hands
- short legs
- large readable feet / shoes

The body must remain simple enough that cosmetics can be layered easily.

## Directions

Every full game-ready asset should support:

```txt
front
back
left
right
```

Phase 1 launch priority is front-facing first, then all directions.

## Required Animation Frames

```txt
idle: 8 frames
walk: 12 frames
```

Future-safe animation set:

```txt
run: 12 frames
wave: 8 frames
celebrate: 10 frames
sit: 6 frames
dance: 12 frames
```

## Anchor Points

The following anchors must remain consistent across frames:

```txt
head_center
hat_top
hair_front
hair_back
left_eye
right_eye
mouth
neck
chest
waist
left_hand
right_hand
back_item
left_foot
right_foot
feet_baseline
```

## Acceptance Rule

An asset is MPC-compatible only if it fits the Master Dummy without custom repositioning in the website or game.

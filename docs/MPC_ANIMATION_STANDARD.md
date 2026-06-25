# MPC Animation Standard

This document defines the official animation frame counts and timing rules for Meme Park City avatar assets.

## Required Launch Animations

| Animation | Frames | Purpose |
|---|---:|---|
| idle | 8 | standing / avatar preview |
| walk | 12 | movement in the 2D world |

## Future Animation Set

| Animation | Frames |
|---|---:|
| run | 12 |
| wave | 8 |
| celebrate | 10 |
| sit | 6 |
| dance | 12 |

## Direction Support

```txt
front
back
left
right
```

Every animation should eventually support all four directions.

## Timing Rule

All cosmetics use the same frame timing as the Master Dummy.

A shirt, hat, hair, shoes, and accessory must all use the same animation frame number as the body.

Example:

```txt
body_front_walk_05.png
shirt_black_hoodie_front_walk_05.png
hair_spiky_black_front_walk_05.png
shoes_black_front_walk_05.png
```

## Stability Rules

- character scale must remain constant
- feet baseline must remain stable
- no half-pixel movement
- no per-frame crop changes
- no browser scaling to fix frame issues
- every layer must follow the same dummy frame

## Walk Cycle Goal

The 12-frame walk cycle should feel smooth, premium, and readable without making asset production impossible.

# MPC Asset Standard

This document defines how every Meme Park City cosmetic asset should be created, named, exported, and validated.

## Asset Categories

```txt
skins
faces
eyes
eyebrows
mouths
hair
hats
shirts
jackets
pants
shoes
accessories
extras
```

## File Naming

```txt
{category}_{asset_id}_{direction}_{animation}_{frame}.png
```

Example:

```txt
shirt_black_hoodie_front_walk_01.png
```

## Export Rules

- PNG format
- transparent background
- 1024 x 1024 canvas
- whole-pixel positioning only
- no anti-pattern cropping per frame
- no per-frame manual scaling
- no background layer in final export

## Launch-Ready Requirement

Minimum front-facing launch asset:

```txt
front_idle_01.png to front_idle_08.png
front_walk_01.png to front_walk_12.png
```

Full game-ready asset:

```txt
front/back/left/right
idle/walk
all required frames
```

## Quality Rules

Assets should be clean, readable, toon-style, and built for layering.

Avoid:

- blurry upscaled art
- mismatched outline thickness
- inconsistent shadows
- clothing that does not match the torso boundary
- accessories that drift between frames
- transparent pixels with hidden background artifacts

## Compatibility Checklist

- [ ] Uses the official canvas
- [ ] Aligns to the Master Dummy
- [ ] Uses the correct naming convention
- [ ] Uses transparent PNG export
- [ ] Supports required frames
- [ ] Does not clip with base body
- [ ] Does not jump during walk cycle
- [ ] Is readable at game size

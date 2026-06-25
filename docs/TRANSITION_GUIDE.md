# Transition Guide

## Objective
Move the MPC avatar system out of ad-hoc image testing and into a proper folder-driven asset pipeline that can be worked on in VS Code.

## Immediate goal
Use **real PNG frame assets** as the source of truth instead of:
- screenshots,
- canvas placeholders,
- or manually redrawn test characters.

## Core principle
Every future asset must align to the locked MPC Master Dummy v1 frame map.

## Required frame map
- 4 directions
- 8 idle frames each
- 12 walk frames each
- 80 total frames per modular pack

## First two packs already prepared
1. Body pack
2. Black shorts starter clothing pack

## After import into your repo
Verify these work first:
- file paths resolve,
- motion test displays body + shorts,
- directions switch correctly,
- no missing frames.

## After that
Start the next asset category one pack at a time.
Recommended order:
1. Hair
2. Hats / head accessories
3. Shirts / tops
4. Pants / bottoms
5. Shoes
6. Extra accessories

# Phase 1 QA Checklist

Phase 1 is complete only when the Master Dummy is visually approved and technically ready for asset production.

## QA-001: Locked Front Dummy

Status: `PASS`

Review the locked front-facing dummy against the original approved reference.

Checklist:

- [x] Proportions match the locked reference
- [x] Head size is unchanged
- [x] Body width is unchanged
- [x] Arm placement is unchanged
- [x] Hand size and position are unchanged
- [x] Shorts/leg position is unchanged
- [x] Feet size and baseline are unchanged
- [x] Style is clean and readable
- [x] Works at small village size
- [x] Ready to become the permanent front body anchor

Decision:

```txt
PASS
```

Notes:

```txt
Front static body is locked in MPC Master Dummy v1.0.
```

## QA-002: Construction Guide

Status: `PENDING`

The construction guide is not a game asset. It is an overlay used to create future assets.

Checklist:

- [ ] Centerline added
- [ ] Head boundary added
- [ ] Eye line added
- [ ] Mouth line added
- [ ] Shoulder line added
- [ ] Shirt safe zone added
- [ ] Waist line added
- [ ] Hand anchors added
- [ ] Shoe anchors added
- [ ] Feet baseline added

Decision:

```txt
PASS / REVISE
```

## QA-003: Direction Set

Status: `PASS`

Required directions:

```txt
front
back
left
right
```

Checklist:

- [x] Front approved
- [x] Back matches locked proportions
- [x] Left matches locked proportions
- [x] Right matches locked proportions
- [x] All directions share same canvas
- [x] All directions share same baseline
- [x] All directions feel like the same toon

Decision:

```txt
PASS
```

Notes:

```txt
Static four-view body is locked. Right side is an exact horizontal mirror of left.
```

## QA-004: Idle Animation

Status: `PENDING`

Required frames:

```txt
idle_front_01 to idle_front_08
```

Checklist:

- [ ] 8 frames completed
- [ ] Character scale stays consistent
- [ ] Feet remain stable
- [ ] Movement feels subtle and premium
- [ ] No wobble or size drift
- [ ] Works with future layered assets

Decision:

```txt
PASS / REVISE
```

## QA-005: Walk Animation

Status: `PENDING`

Required frames:

```txt
walk_front_01 to walk_front_12
```

Checklist:

- [ ] 12 frames completed
- [ ] Character scale stays consistent
- [ ] Feet do not slide unnaturally
- [ ] Body movement feels smooth
- [ ] Hands move naturally
- [ ] Head bob is controlled
- [ ] No frame feels off-model
- [ ] Ready for village movement

Decision:

```txt
PASS / REVISE
```

## Phase 1 Lock Rule

Once Phase 1 passes, the Master Dummy v1.0 cannot be changed unless a future `MPC Master Dummy v2.0` is created.

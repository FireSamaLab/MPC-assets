# MPC Frame Pack QA Audit

## Verdict

The original imported `body_*` frame pack is rejected for production use.

It is structurally valid because it has the expected folder and frame count, but it does not match the approved MPC Master Dummy v1.0 mockup style.

It has been replaced by a rebuildable generated rig pipeline. See:

```txt
docs/RIG_PIPELINE.md
tools/build-master-dummy-rig.js
```

## Approved Target

Reference file:

```txt
reference/mpc-master-dummy-approved-front-spec.png
```

The target look requires:

- large rounded head
- clean simple torso
- rounded hands and feet
- smooth confident outline
- readable MPC toon proportions
- no skinny side-view body
- no placeholder generated canvas look

## Rejected Candidate Examples

```txt
master-dummy/v1/body/front/idle/body_front_idle_01.png
master-dummy/v1/body/left/idle/body_left_idle_01.png
```

The left/right/back frames fail the art direction especially hard. They should not be treated as approved just because they load in the motion test.

## Root Cause

The transition package contains generated frame exports, but it does not contain the actual mockup-quality transparent frame named on the approved board, such as:

```txt
master_dummy_front_idle_01.png
```

The package therefore mixed a correct technical folder structure with unacceptable visual assets.

## Recovery Plan

1. Create or export the true approved master dummy as a transparent `1024 x 1024` PNG.
2. Validate the front idle frame against the approved reference before animating.
3. Build front idle and front walk frames from the same approved source.
4. Only after front QA passes, create back, left, and right turns.
5. Reject any future pack that passes filename/frame-count validation but fails visual QA.

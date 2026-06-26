# Next Steps

## Phase 1 - Static Dummy Locked

- MPC Master Dummy v1.0 static four-view body is locked.
- Use `docs/MPC_MASTER_DUMMY_V1_LOCK.md` as the baseline record.
- Do not change v1 proportions, silhouette, canvas, baseline, or side direction.
- Build future frames and cosmetics against this locked dummy.

## Phase 2 - Improve QA Tooling

- Upgrade motion-test to show frame number, direction, animation.
- Add frame stepping.
- Add layer toggles.
- Add PNG preloading.

## Phase 3 - Build Locked-Base Animation

- Create idle frames from the locked body.
- Create walk frames from the locked body.
- Confirm no scale, baseline, or side-direction drift.

## Phase 4 - Start Modular Expansion

Recommended next modular pack:

- `assets/hair/spiky_black/...`

## Phase 5 - Production Prep

- Create atlas build pipeline.
- Add asset registry / manifest schema.
- Add validator for missing frames.
- Build avatar composer for the website customizer.

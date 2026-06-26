# MPC Master Dummy v1.0 Lock

Status: `LOCKED`
Locked date: `2026-06-26`
Approved baseline commit: `af8b188`
Lock tag: `mpc-master-dummy-v1.0.0-locked`

This is the approved static four-view body baseline for Meme Park City.

## Locked Assets

```txt
master-dummy/v1/body/front/idle/body_front_idle_01.png
master-dummy/v1/body/back/idle/body_back_idle_01.png
master-dummy/v1/body/left/idle/body_left_idle_01.png
master-dummy/v1/body/right/idle/body_right_idle_01.png
drafts/static-views/master-dummy-side-left-lock-alpha.png
exports/qa/static-master-dummy-v1-contact-sheet.png
```

## Lock Rules

- Do not change v1 body proportions, silhouette, canvas, baseline, or side direction.
- Do not redraw, resize, crop, or manually shift these locked body frames.
- Build all cosmetics and animation frames to fit this dummy.
- If the base body must change, create `MPC Master Dummy v2.0` instead of mutating v1.

## QA Facts

```txt
canvas: 1024x1024 transparent PNG
front bounds: 451x861, top y=70, bottom y=930
back bounds: 462x863, top y=69, bottom y=931
left bounds: 381x858, top y=71, bottom y=928
right bounds: 381x858, top y=71, bottom y=928
side mirror rule: right equals horizontal flip of left
```

## SHA256

```txt
43b600426b660ffd73841bb00e29b78bfbb2cd55f5669b7c56eee3afca88e5cd  master-dummy/v1/body/front/idle/body_front_idle_01.png
a36f79836cae4c15cc6e5396338ecada539da3eda639481782d61fa21fd420e1  master-dummy/v1/body/back/idle/body_back_idle_01.png
eee71d0f9dbc80d9903f644a1477bf54ee20c8eff3826ecbcf4471f8452813e8  master-dummy/v1/body/left/idle/body_left_idle_01.png
c3409600cb0f4a199ac2b74189059d598b1814b705ad576798a6ba9879fcf2af  master-dummy/v1/body/right/idle/body_right_idle_01.png
98a7438bf20ff3ece11085e7afbd4f10af96460bd9bb9b7b10d1ae67488b0406  exports/qa/static-master-dummy-v1-contact-sheet.png
```


# MPC Layer Standard

This document defines the default layer stack for Meme Park City avatars.

The website avatar customizer and future game should render layers in this order.

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

## Layer Rules

- Each layer must use the same canvas size.
- Each layer must align to the same Master Dummy frame.
- Layer order should not be changed per asset.
- Accessories should not require custom rendering logic unless explicitly defined.
- Hair can use both `hair_back` and `hair_front` when needed.
- Hats render above hair unless a special rule is defined later.

## Website Customizer Logic

The website should compose the avatar by stacking PNGs in the official layer order.

No asset should depend on manual CSS offsets to look correct.

## Game Logic

The game should use the same layer order or pre-composed sprite sheets exported from this order.

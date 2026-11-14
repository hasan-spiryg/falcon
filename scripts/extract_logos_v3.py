#!/usr/bin/env python3
"""Extract logo assets v3 - exact tile interiors from border line detection."""
from PIL import Image
import numpy as np
import os

Image.MAX_IMAGE_PIXELS = None

img = Image.open('/tmp/render/identity-1.png').convert('RGB')

# Tile interiors in ORIGINAL image coordinates (content offset 7800,7000 + detected borders)
ox, oy = 7800, 7000
tiles = {
    'wordmark_latin': {'light': (488+ox, 601+oy, 2808+ox, 1650+oy),   'dark': (2972+ox, 601+oy, 5292+ox, 1650+oy)},
    'icon_falcon':    {'light': (488+ox, 1816+oy, 2808+ox, 2865+oy),  'dark': (2972+ox, 1816+oy, 5292+ox, 2865+oy)},
    'wordmark_arabic':{'light': (488+ox, 2978+oy, 2808+ox, 4027+oy),  'dark': (2972+ox, 2978+oy, 5292+ox, 4027+oy)},
}

outdir = '/home/z/my-project/assets_src'
os.makedirs(outdir, exist_ok=True)

for name, variants in tiles.items():
    for mode, (x0, y0, x1, y1) in variants.items():
        tile = img.crop((x0, y0, x1, y1))
        gray = np.asarray(tile.convert('L'))
        if mode == 'light':
            content = gray < 128
        else:
            content = gray > 128
        # Remove any full-width horizontal or full-height vertical artifacts
        h, w = content.shape
        rs = content.sum(axis=1) / w
        cs = content.sum(axis=0) / h
        content[rs > 0.90, :] = False
        content[:, cs > 0.90] = False
        alpha = np.where(content, 255, 0).astype(np.uint8)
        ys, xs = np.where(alpha > 0)
        if len(xs) == 0:
            print(f'{name}_{mode}: EMPTY')
            continue
        pad = 50
        x_min, x_max = max(xs.min()-pad, 0), min(xs.max()+pad, tile.width)
        y_min, y_max = max(ys.min()-pad, 0), min(ys.max()+pad, tile.height)
        rgba = np.dstack([np.asarray(tile), alpha])[y_min:y_max, x_min:x_max]
        out = Image.fromarray(rgba)
        if out.width > 900:
            r = 900 / out.width
            out = out.resize((900, int(out.height*r)), Image.LANCZOS)
        fn = f'{outdir}/{name}_{mode}.png'
        out.save(fn)
        # Edge check: content margin from tile edges
        print(f'{name}_{mode}: size={out.size} margins L={xs.min()} R={tile.width-xs.max()} T={ys.min()} B={tile.height-ys.max()}')

print('done')

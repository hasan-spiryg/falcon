#!/usr/bin/env python3
"""Extract each logo tile and create transparent PNG versions for the website."""
from PIL import Image
import numpy as np

Image.MAX_IMAGE_PIXELS = None

img = Image.open('/tmp/render/identity-1.png').convert('RGB')

# Content region crop offset was (7800, 7000)
ox, oy = 7800, 7000

# Tiles in original coordinates (from runs + margin inside borders)
col_light = (777 + ox, 2606 + ox)     # light tiles: dark artwork on white
col_dark  = (2888 + ox, 5379 + ox)    # dark tiles: white artwork on black
rows = [(585 + oy, 1667 + oy), (1817 + oy, 2866 + oy), (2867 + oy, 4045 + oy)]
names = ['wordmark_latin', 'icon_falcon', 'wordmark_arabic']

import os
outdir = '/home/z/my-project/assets_src'
os.makedirs(outdir, exist_ok=True)

for ri, (y0, y1) in enumerate(rows):
    for ci, (x0, x1, mode) in enumerate([(col_light[0], col_light[1], 'light'), (col_dark[0], col_dark[1], 'dark')]):
        tile = img.crop((x0 + 60, y0 + 60, x1 - 60, y1 - 60))
        name = f'{names[ri]}_{mode}'
        tile.save(f'{outdir}/{name}_raw.png')

        a = np.asarray(tile.convert('L')).astype(np.float32)
        alpha = np.where(a < 128, 255, 0).astype(np.uint8)  # dark pixels opaque
        if mode == 'dark':
            alpha = np.where(a > 128, 255, 0).astype(np.uint8)  # light pixels opaque
        rgba = np.dstack([np.asarray(tile), alpha])
        # Trim to content bbox
        ys, xs = np.where(alpha > 0)
        if len(xs) > 0:
            pad = 40
            x_min, x_max = max(xs.min()-pad, 0), min(xs.max()+pad, tile.width)
            y_min, y_max = max(ys.min()-pad, 0), min(ys.max()+pad, tile.height)
            rgba = rgba[y_min:y_max, x_min:x_max]
        out = Image.fromarray(rgba, 'RGBA')
        # Resize to reasonable width (max 900px)
        if out.width > 900:
            ratio = 900 / out.width
            out = out.resize((900, int(out.height * ratio)), Image.LANCZOS)
        out.save(f'{outdir}/{name}.png')
        print(name, out.size)
print('done')

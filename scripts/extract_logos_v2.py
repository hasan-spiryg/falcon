#!/usr/bin/env python3
"""Extract logo assets v2 - careful border removal, divider line removal, edge clearance."""
from PIL import Image
import numpy as np
import os

Image.MAX_IMAGE_PIXELS = None

img = Image.open('/tmp/render/identity-1.png').convert('RGB')
ox, oy = 7800, 7000

col_light = (777 + ox, 2606 + ox)
col_dark  = (2888 + ox, 5379 + ox)
rows = [(585 + oy, 1667 + oy), (1817 + oy, 2866 + oy), (2867 + oy, 4045 + oy)]
names = ['wordmark_latin', 'icon_falcon', 'wordmark_arabic']

outdir = '/home/z/my-project/assets_src'
os.makedirs(outdir, exist_ok=True)

def clean_alpha(tile_gray, mode):
    """Create alpha mask; remove thin horizontal divider lines and border remnants."""
    if mode == 'light':
        content = tile_gray < 128
    else:
        content = tile_gray > 128
    # Remove full-width thin horizontal runs (dividers): rows where content spans > 90% width
    h, w = content.shape
    row_span = content.sum(axis=1) / w
    for y in range(h):
        if row_span[y] > 0.85:
            content[y, :] = False
    # Remove near-full-height thin vertical runs (borders): cols where content spans > 85% height
    col_span = content.sum(axis=0) / h
    for x in range(w):
        if col_span[x] > 0.85:
            content[:, x] = False
    alpha = np.where(content, 255, 0).astype(np.uint8)
    return alpha

for ri, (y0, y1) in enumerate(rows):
    for ci, (x0, x1, mode) in enumerate([(col_light[0], col_light[1], 'light'), (col_dark[0], col_dark[1], 'dark')]):
        # Larger inset to get inside the tile border
        inset = 150
        tile = img.crop((x0 + inset, y0 + inset, x1 - inset, y1 - inset))
        gray = np.asarray(tile.convert('L'))
        alpha = clean_alpha(gray, mode)
        # Trim to content with extra clearance
        ys, xs = np.where(alpha > 0)
        if len(xs) == 0:
            print(f'{names[ri]}_{mode}: EMPTY!')
            continue
        pad = 60
        x_min, x_max = max(xs.min()-pad, 0), min(xs.max()+pad, tile.width)
        y_min, y_max = max(ys.min()-pad, 0), min(ys.max()+pad, tile.height)
        rgba = np.dstack([np.asarray(tile), alpha])[y_min:y_max, x_min:x_max]
        out = Image.fromarray(rgba)
        if out.width > 800:
            ratio = 800 / out.width
            out = out.resize((800, int(out.height * ratio)), Image.LANCZOS)
        name = f'{names[ri]}_{mode}'
        out.save(f'{outdir}/{name}.png')
        print(name, out.size, f'content bbox: x[{xs.min()},{xs.max()}] y[{ys.min()},{ys.max()}] of {tile.size}')
print('done')

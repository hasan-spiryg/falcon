#!/usr/bin/env python3
"""Analyze the Falcon identity sheet layout to locate logo tiles, then export crops."""
from PIL import Image
import numpy as np

Image.MAX_IMAGE_PIXELS = None

img = Image.open('/tmp/render/identity-1.png').convert('RGB')
W, H = img.size
print('Full size:', W, H)

# Downscale for analysis
small = img.resize((W // 20, H // 20))
a = np.asarray(small)
sw, sh = small.size
print('Small size:', sw, sh)

# Detect dark tiles: rows/cols where many pixels are dark
gray = a.mean(axis=2)
dark = gray < 100

# Column profile of darkness (to find dark tiles in the grid)
col_dark = dark.mean(axis=0)
row_dark = dark.mean(axis=1)

print('Column darkness profile (every 10th):')
for x in range(0, sw, 10):
    bar = '#' * int(col_dark[x] * 50)
    print(f'{x*20:6d} {col_dark[x]:.3f} {bar}')
print('Row darkness profile (every 10th):')
for y in range(0, sh, 10):
    bar = '#' * int(row_dark[y] * 50)
    print(f'{y*20:6d} {row_dark[y]:.3f} {bar}')

#!/usr/bin/env python3
"""Debug: find exact tile rectangles via long border lines, then extract precisely."""
from PIL import Image
import numpy as np

Image.MAX_IMAGE_PIXELS = None

img = Image.open('/tmp/render/identity-1.png').convert('RGB')
content = img.crop((7800, 7000, 13600, 11600))
gray = np.asarray(content.convert('L')).astype(np.float32)

# Border lines are thin light-gray strokes (~#E8E8E8) on white, and gray on black tiles.
# Detect edges: gradient magnitude
gx = np.abs(np.diff(gray, axis=1))
gy = np.abs(np.diff(gray, axis=0))

# Long vertical lines: columns with consistently high gradient
col_edge = (gx > 25).mean(axis=0)
row_edge = (gy > 25).mean(axis=1)

vlines = [x for x in range(len(col_edge)) if col_edge[x] > 0.5]
hlines = [y for y in range(len(row_edge)) if row_edge[y] > 0.5]

def group(vals, gap=5):
    if not vals: return []
    groups = [[vals[0]]]
    for v in vals[1:]:
        if v - groups[-1][-1] <= gap:
            groups[-1].append(v)
        else:
            groups.append([v])
    return [(g[0], g[-1]) for g in groups]

print('Vertical lines:', group(vlines))
print('Horizontal lines:', group(hlines))

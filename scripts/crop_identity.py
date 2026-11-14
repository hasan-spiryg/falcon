#!/usr/bin/env python3
"""Crop the identity sheet content region and identify tiles."""
from PIL import Image
import numpy as np

Image.MAX_IMAGE_PIXELS = None

img = Image.open('/tmp/render/identity-1.png').convert('RGB')

# Content region found: cols 8200-13200, rows 7400-11200 (with margin)
crop = img.crop((7800, 7000, 13600, 11600))
crop.save('/tmp/render/content.png')

a = np.asarray(crop)
gray = a.mean(axis=2)
dark = gray < 100
h, w = dark.shape

# Find tile boundaries via column/row profiles within the crop
col_prof = dark.mean(axis=0)
row_prof = dark.mean(axis=1)

def runs(profile, thresh=0.05):
    res = []
    in_run = False
    for i, v in enumerate(profile):
        if v > thresh and not in_run:
            start = i; in_run = True
        elif v <= thresh and in_run:
            res.append((start, i)); in_run = False
    if in_run:
        res.append((start, len(profile)))
    return res

# Border lines: thin lines with moderate darkness
col_runs = [r for r in runs(col_prof, 0.03) if r[1]-r[0] > 30]
row_runs = [r for r in runs(row_prof, 0.03) if r[1]-r[0] > 30]
print('Column dark regions:', col_runs)
print('Row dark regions:', row_runs)

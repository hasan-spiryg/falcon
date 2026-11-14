#!/usr/bin/env python3
"""Despeckle all logo assets: remove tiny isolated opaque specks and soft edges."""
from PIL import Image
import numpy as np
from scipy import ndimage
import os

srcdir = '/home/z/my-project/assets_src'
for fn in sorted(os.listdir(srcdir)):
    if not fn.endswith('.png') or fn.endswith('_raw.png'):
        continue
    path = os.path.join(srcdir, fn)
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im).copy()
    alpha = a[:,:,3]
    # Hard threshold
    alpha = np.where(alpha > 200, 255, 0).astype(np.uint8)
    # Remove components smaller than 150px
    lbl, n = ndimage.label(alpha)
    if n > 1:
        sizes = ndimage.sum(alpha, lbl, range(1, n+1))
        for i, s in enumerate(sizes):
            if s < 150:
                alpha[lbl == i+1] = 0
    a[:,:,3] = alpha
    # Trim to content
    ys, xs = np.where(alpha > 0)
    pad = 24
    x0, x1 = max(xs.min()-pad, 0), min(xs.max()+pad, im.width)
    y0, y1 = max(ys.min()-pad, 0), min(ys.max()+pad, im.height)
    out = Image.fromarray(a[y0:y1, x0:x1])
    out.save(path)
    print(fn, out.size)
print('cleaned')

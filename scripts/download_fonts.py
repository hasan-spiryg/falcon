#!/usr/bin/env python3
"""Download Cairo + Tajawal woff2 files (arabic + latin subsets) and build local fonts.css"""
import re, subprocess, os

os.chdir('/home/z/my-project/public/fonts')

def process(css_file, prefix):
    css = open(f'/tmp/{css_file}').read()
    # Parse blocks: subset comment, font-face body
    blocks = re.findall(r'/\* (\w+(?:-\w+)?) \*/\s*@font-face\s*\{(.*?)\}', css, re.S)
    out = []
    seen = set()
    for subset, body in blocks:
        if subset not in ('arabic', 'latin'):
            continue
        weight = re.search(r'font-weight:\s*(\d+)', body).group(1)
        url = re.search(r'url\((https://[^)]+)\)', body).group(1)
        fname = f'{prefix}-{weight}-{subset}.woff2'
        if fname not in seen:
            subprocess.run(['curl', '-s', '-o', fname, url], check=True)
            seen.add(fname)
            sz = os.path.getsize(fname)
            assert sz > 1000, f'{fname} too small: {sz}'
        # local font-face rule
        local_body = body.replace(url, f'/fonts/{fname}')
        out.append(f'/* {subset} {weight} */\n@font-face {{{local_body}}}')
    return '\n'.join(out)

cairo = process('cairo.css', 'cairo')
tajawal = process('tajawal.css', 'tajawal')
open('fonts.css', 'w').write(cairo + '\n' + tajawal)
print('Downloaded:', sorted(os.listdir('.')))

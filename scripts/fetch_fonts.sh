#!/bin/bash
# Download Cairo + Tajawal Arabic fonts for local hosting
set -e
cd /home/z/my-project/public/fonts

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

fetch_font() {
  local family="$1"; local weights="$2"; local outprefix="$3"
  local css
  css=$(curl -s -A "$UA" "https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap")
  # Extract arabic + latin subset URLs in order
  echo "$css" > /tmp/${outprefix}.css
  echo "--- $family CSS saved, $(echo "$css" | wc -l) lines"
}

# Cairo: 400,600,800,900 ; Tajawal: 400,500,700
fetch_font "Cairo" "400;600;800;900" "cairo"
fetch_font "Tajawal" "400;500;700" "tajawal"
echo "done"

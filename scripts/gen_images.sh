#!/bin/bash
# Generate FALCON watch product images - monochrome brand identity
set -e
cd /home/z/my-project/public/brand

echo "1/6 hero watch..."
z-ai image -p "Luxury matte black rugged sports wristwatch, dramatic studio product photography, floating on pure dark charcoal background, strong rim lighting from side, black dial with luminous white markers, black silicone strap, bold athletic design, monochrome black and white aesthetic, premium advertising shot, ultra detailed, 8k" -o watch-hero.png -s 1440x768

echo "2/6 product black..."
z-ai image -p "Professional studio product photo of an all-black tactical sports wristwatch on dark stone pedestal, black ceramic bezel, black dial with large white hour markers, crown protector, matte black strap, dark grey seamless background, monochrome, high contrast lighting, premium product photography" -o watch-black.png -s 1024x1024

echo "3/6 product steel..."
z-ai image -p "Professional studio product photo of a brushed silver steel sports wristwatch, white dial with black indices, chunky octagonal bezel, steel bracelet, on dark grey seamless background, monochrome black and white palette, high contrast studio lighting, premium product photography" -o watch-steel.png -s 1024x1024

echo "4/6 product desert white..."
z-ai image -p "Professional studio product photo of a sports wristwatch with white dial and black numerals, black rotating bezel, white silicone sport strap, standing upright on dark background, monochrome black and white aesthetic, dramatic side light, premium product photography" -o watch-white.png -s 1024x1024

echo "5/6 lifestyle athlete..."
z-ai image -p "Black and white cinematic photo of an athlete's wrist wearing a rugged black sports watch, arm mid-motion, dramatic backlight, dust particles in air, dark moody atmosphere, high contrast monochrome, sports campaign photography" -o watch-lifestyle.png -s 1152x864

echo "6/6 macro detail..."
z-ai image -p "Extreme macro photography of a black sports watch case and knurled bezel detail, water droplets on sapphire glass, brushed metal texture, shallow depth of field, black and white monochrome, dramatic lighting, luxury craftsmanship detail shot" -o watch-macro.png -s 1152x864

echo "ALL DONE"
ls -la *.png

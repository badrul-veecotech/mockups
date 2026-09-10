import xml.etree.ElementTree as ET
from PIL import Image, ImageFilter
import vtracer
import resvg_py
import os

os.makedirs('Graphic', exist_ok=True)

src = Image.open(r'C:/Users/justi/.gemini/antigravity/brain/4d602bf2-1dc1-4ca8-bce8-1632df942c02/.user_uploaded/media_1788852185393.png').convert('RGBA')
w, h = src.size

# Extract red letters (AUTO-CITY), ignore the (R) mark located at x >= 488, y <= 35
clean = Image.new('L', (w, h), 255)
for x in range(w):
    for y in range(h):
        r, g, b, a = src.getpixel((x, y))
        if x <= 487 and r > 120 and (r - g) > 28 and (r - b) > 28:
            clean.putpixel((x, y), 0)

bbox = clean.point(lambda p: 255 if p < 128 else 0).getbbox()
print('Bounding box:', bbox)

pad = 8
crop = clean.crop((bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad))

# 6x upscale with gentle smoothing
scale = 6
up = crop.resize((crop.width * scale, crop.height * scale), Image.Resampling.LANCZOS)
b = up.filter(ImageFilter.GaussianBlur(radius=3.0))
bin_img = b.point(lambda p: 0 if p < 135 else 255, mode='1')
temp_png = 'Graphic/clean_logo_6x.png'
bin_img.convert('RGB').save(temp_png)

raw_svg = 'Graphic/raw_traced.svg'
vtracer.convert_image_to_svg_py(temp_png, raw_svg)

tree = ET.parse(raw_svg)
root = tree.getroot()

letters = []
holes = []
for i, el in enumerate(root):
    if i == 0:
        continue
    fill = el.attrib.get('fill', '').upper()
    d = el.attrib.get('d', '')
    trans = el.attrib.get('transform', '')
    if fill == '#000000':
        letters.append((d, trans))
    elif fill == '#FFFFFF':
        holes.append((d, trans))

print(f'Identified {len(letters)} letters and {len(holes)} holes.')

svg_w = root.attrib.get('width', '2880')
svg_h = root.attrib.get('height', '450')

def make_svg(color):
    mask_id = 'acMask_' + color.replace('#', '').replace('currentColor', 'Cur')
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="100%">',
        f'  <defs>',
        f'    <mask id="{mask_id}">',
        f'      <rect width="{svg_w}" height="{svg_h}" fill="black" />'
    ]
    for d, trans in letters:
        parts.append(f'      <path d="{d}" transform="{trans}" fill="white" />')
    for d, trans in holes:
        parts.append(f'      <path d="{d}" transform="{trans}" fill="black" />')
    parts.append('    </mask>')
    parts.append('  </defs>')
    parts.append(f'  <rect width="{svg_w}" height="{svg_h}" fill="{color}" mask="url(#{mask_id})" />')
    parts.append('</svg>')
    return '\n'.join(parts)

# 1. Primary Red Logo (#e10021)
red_svg = make_svg('#e10021')
with open('Graphic/auto-city-logo.svg', 'w', encoding='utf-8') as f:
    f.write(red_svg)

# 2. White Logo
white_svg = make_svg('#FFFFFF')
with open('Graphic/auto-city-logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(white_svg)

# 3. Dynamic currentColor Logo
mono_svg = make_svg('currentColor')
with open('Graphic/auto-city-logo-mono.svg', 'w', encoding='utf-8') as f:
    f.write(mono_svg)

# 4. High-resolution PNG preview
png_data = resvg_py.svg_to_bytes(svg_string=red_svg)
with open('Graphic/auto-city-logo.png', 'wb') as f:
    f.write(png_data)

print('Generated clean SVGs and PNG preview!')

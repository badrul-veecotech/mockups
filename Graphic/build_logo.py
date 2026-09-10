import xml.etree.ElementTree as ET
from PIL import Image, ImageFilter
import vtracer
import resvg_py
import os

os.makedirs('Graphic', exist_ok=True)

# 1. Load original image
src_path = r'C:/Users/justi/.gemini/antigravity/brain/4d602bf2-1dc1-4ca8-bce8-1632df942c02/.user_uploaded/media_1788852185393.png'
img = Image.open(src_path).convert('RGBA')
w, h = img.size

# 2. Isolate red logo letters (AUTO-CITY) and completely ignore the (R) mark at the top right
clean = Image.new('RGBA', (w, h), (255, 255, 255, 255))
for x in range(w):
    for y in range(h):
        r, g, b, a = img.getpixel((x, y))
        # Exclude right-most region where (R) is located (x >= 488, y <= 35) and ensure red channel dominance
        if x <= 487 and r > 120 and (r - g) > 30 and (r - b) > 30:
            clean.putpixel((x, y), (0, 0, 0, 255))
        else:
            clean.putpixel((x, y), (255, 255, 255, 255))

bbox = clean.convert('L').point(lambda p: 255 if p < 128 else 0).getbbox()
print('Raw Logo BBox:', bbox)

pad = 10
cropped = clean.crop((bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad))

scale = 4
up = cropped.resize((cropped.width * scale, cropped.height * scale), Image.Resampling.LANCZOS)
up_gray = up.convert('L').filter(ImageFilter.GaussianBlur(radius=1.8))
smooth_binary = up_gray.point(lambda p: 0 if p < 135 else 255, mode='1')
temp_png = 'Graphic/temp_clean_binary.png'
smooth_binary.convert('RGB').save(temp_png)

raw_svg_path = 'Graphic/temp_raw.svg'
vtracer.convert_image_to_svg_py(temp_png, raw_svg_path)

tree = ET.parse(raw_svg_path)
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

print(f'Identified {len(letters)} letter parts and {len(holes)} hole cutouts.')

svg_w = root.attrib.get('width', '1936')
svg_h = root.attrib.get('height', '348')

def build_svg(color_val, mask_id):
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
    parts.append(f'  <rect width="{svg_w}" height="{svg_h}" fill="{color_val}" mask="url(#{mask_id})" />')
    parts.append('</svg>')
    return '\n'.join(parts)

red_svg = build_svg('#e10021', 'autoCityMaskRed')
with open('Graphic/auto-city-logo.svg', 'w', encoding='utf-8') as f:
    f.write(red_svg)

white_svg = build_svg('#FFFFFF', 'autoCityMaskWhite')
with open('Graphic/auto-city-logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(white_svg)

mono_svg = build_svg('currentColor', 'autoCityMaskMono')
with open('Graphic/auto-city-logo-mono.svg', 'w', encoding='utf-8') as f:
    f.write(mono_svg)

png_red = resvg_py.svg_to_bytes(svg_string=red_svg)
with open('Graphic/auto-city-logo-preview.png', 'wb') as f:
    f.write(png_red)

print('Generated SVGs and PNG preview successfully!')

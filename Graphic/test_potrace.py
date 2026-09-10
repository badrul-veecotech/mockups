import potrace
from PIL import Image, ImageFilter
import numpy as np
import resvg_py
import os

os.makedirs('Graphic', exist_ok=True)

src = Image.open(r'C:/Users/justi/.gemini/antigravity/brain/4d602bf2-1dc1-4ca8-bce8-1632df942c02/.user_uploaded/media_1788852185393.png').convert('RGBA')
w, h = src.size

# Extract red letters without (R)
clean = Image.new('L', (w, h), 255)
for x in range(w):
    for y in range(h):
        r, g, b, a = src.getpixel((x, y))
        if x <= 487 and r > 120 and (r - g) > 28 and (r - b) > 28:
            clean.putpixel((x, y), 0)

bbox = clean.point(lambda p: 255 if p < 128 else 0).getbbox()
pad = 6
crop = clean.crop((bbox[0]-pad, bbox[1]-pad, bbox[2]+pad, bbox[3]+pad))

# Upscale 4x with Gaussian blur to smooth pixel stairsteps
up = crop.resize((crop.width * 4, crop.height * 4), Image.Resampling.LANCZOS)
b = up.filter(ImageFilter.GaussianBlur(radius=2.2))
arr = np.array(b) < 135

# Trace with potrace
bmp = potrace.Bitmap(arr)
# alphamax controls curve smoothness: higher = smoother curves, fewer points
path = bmp.trace(turdsize=10, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.2, opttolerance=0.4)

# Build clean SVG with minimal points and evenodd fill-rule for automatic cutouts
svg_w = crop.width * 4
svg_h = crop.height * 4

d_parts = []
total_segments = 0
for curve in path:
    fs = curve.start_point
    d_parts.append(f'M{fs.x:.1f} {fs.y:.1f}')
    for seg in curve.segments:
        total_segments += 1
        if seg.is_corner:
            c = seg.c
            e = seg.end_point
            d_parts.append(f'L{c.x:.1f} {c.y:.1f} L{e.x:.1f} {e.y:.1f}')
        else:
            c1 = seg.c1
            c2 = seg.c2
            e = seg.end_point
            d_parts.append(f'C{c1.x:.1f} {c1.y:.1f} {c2.x:.1f} {c2.y:.1f} {e.x:.1f} {e.y:.1f}')
    d_parts.append('Z')

path_data = ' '.join(d_parts)

def build_clean_svg(color):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="100%">
  <path fill="{color}" fill-rule="evenodd" d="{path_data}" />
</svg>'''

svg_str = build_clean_svg('#e10021')
with open('Graphic/test_potrace.svg', 'w', encoding='utf-8') as f:
    f.write(svg_str)

png_bytes = resvg_py.svg_to_bytes(svg_string=svg_str)
with open('Graphic/test_potrace.png', 'wb') as f:
    f.write(png_bytes)

print(f'Potrace completed! Total segments: {total_segments}, SVG size: {len(svg_str)} bytes')

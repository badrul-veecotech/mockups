import potrace
import resvg_py
from PIL import Image
import numpy as np
from scipy.ndimage import gaussian_filter
import shutil

src = Image.open(r'C:/Users/justi/.gemini/antigravity/brain/4d602bf2-1dc1-4ca8-bce8-1632df942c02/.user_uploaded/media_1788852185393.png').convert('RGBA')
w, h = src.size

# Extract red letters without (R) symbol
fg = Image.new('L', (w, h), 0)
for x in range(w):
    for y in range(h):
        r, g, b, a = src.getpixel((x, y))
        if x <= 487 and r > 120 and (r - g) > 28 and (r - b) > 28:
            fg.putpixel((x, y), 255)

bbox = fg.point(lambda p: 255 if p > 128 else 0).getbbox()
pad = 6
crop = fg.crop((bbox[0]-pad, bbox[1]-pad, bbox[2]+pad, bbox[3]+pad))

scale = 2
up = crop.resize((crop.width * scale, crop.height * scale), Image.Resampling.LANCZOS)
arr = gaussian_filter((np.array(up) > 128).astype(float), sigma=scale * 0.7) > 0.5

bmp = potrace.Bitmap(arr)
path = bmp.trace(turdsize=20, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.2, opttolerance=1.5)

d_parts = []
total_segs = 0
for curve in list(path)[1:]:
    fs = curve.start_point
    d_parts.append(f'M{fs.x:.1f} {fs.y:.1f}')
    for seg in curve.segments:
        total_segs += 1
        if seg.is_corner:
            c, e = seg.c, seg.end_point
            d_parts.append(f'L{c.x:.1f} {c.y:.1f} L{e.x:.1f} {e.y:.1f}')
        else:
            c1, c2, e = seg.c1, seg.c2, seg.end_point
            d_parts.append(f'C{c1.x:.1f} {c1.y:.1f} {c2.x:.1f} {c2.y:.1f} {e.x:.1f} {e.y:.1f}')
    d_parts.append('Z')

svg_w = crop.width * scale
svg_h = crop.height * scale
path_data = ' '.join(d_parts)

def make_svg(color):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="100%">
  <path fill="{color}" fill-rule="evenodd" d="{path_data}" />
</svg>'''

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

# 4. Render PNG
png_bytes = resvg_py.svg_to_bytes(svg_string=red_svg)
with open('Graphic/auto-city-logo.png', 'wb') as f:
    f.write(png_bytes)

# Copy to brain artifact dir for walkthrough embedding
shutil.copyfile('Graphic/auto-city-logo.png', r'C:/Users/justi/.gemini/antigravity/brain/4d602bf2-1dc1-4ca8-bce8-1632df942c02/auto-city-logo-preview.png')

print(f'Final clean SVG logos exported! Segments: {total_segs}, Filesize: {len(red_svg)} bytes')

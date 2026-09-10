import potrace
import resvg_py
from PIL import Image
import numpy as np
from scipy.ndimage import gaussian_filter, binary_opening, binary_closing

src = Image.open(r'C:/Users/justi/.gemini/antigravity/brain/4d602bf2-1dc1-4ca8-bce8-1632df942c02/.user_uploaded/media_1788852185393.png').convert('RGBA')
w, h = src.size

# Foreground mask
fg = Image.new('L', (w, h), 0)
for x in range(w):
    for y in range(h):
        r, g, b, a = src.getpixel((x, y))
        if x <= 487 and r > 120 and (r - g) > 28 and (r - b) > 28:
            fg.putpixel((x, y), 255)

bbox = fg.point(lambda p: 255 if p > 128 else 0).getbbox()
pad = 8
crop = fg.crop((bbox[0]-pad, bbox[1]-pad, bbox[2]+pad, bbox[3]+pad))

# Upscale 8x
scale = 8
up = crop.resize((crop.width * scale, crop.height * scale), Image.Resampling.LANCZOS)
arr = np.array(up) > 128

# Morphological cleanup on binary array to remove pixel stairsteps
# Disk kernel for opening and closing
structure = np.ones((5, 5), dtype=bool)
arr_clean = binary_closing(arr, structure=structure)
arr_clean = binary_opening(arr_clean, structure=structure)

# Smooth gradient blur then crisp threshold
arr_float = gaussian_filter(arr_clean.astype(float), sigma=4.2)
arr_final = arr_float > 0.5

bmp = potrace.Bitmap(arr_final)
for tol in [2.5, 3.5, 4.5]:
    path = bmp.trace(turdsize=40, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.25, opttolerance=tol)
    total_segs = sum(len(c.segments) for c in list(path)[1:])
    d_parts = []
    for curve in list(path)[1:]:
        fs = curve.start_point
        d_parts.append(f'M{fs.x:.1f} {fs.y:.1f}')
        for seg in curve.segments:
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

    svg_w = crop.width * scale
    svg_h = crop.height * scale
    path_data = ' '.join(d_parts)

    svg_str = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="100%">
  <path fill="#e10021" fill-rule="evenodd" d="{path_data}" />
</svg>'''

    with open(f'Graphic/test_tol_{tol}.svg', 'w', encoding='utf-8') as f:
        f.write(svg_str)
    png_bytes = resvg_py.svg_to_bytes(svg_string=svg_str)
    with open(f'Graphic/test_tol_{tol}.png', 'wb') as f:
        f.write(png_bytes)
    print(f'tol={tol}: segments={total_segs}, Filesize={len(svg_str)}')

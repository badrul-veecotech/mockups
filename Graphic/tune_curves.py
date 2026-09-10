import potrace
from PIL import Image, ImageFilter
import numpy as np
import resvg_py

src = Image.open(r'C:/Users/justi/.gemini/antigravity/brain/4d602bf2-1dc1-4ca8-bce8-1632df942c02/.user_uploaded/media_1788852185393.png').convert('RGBA')
w, h = src.size

# Extract red letters
fg = Image.new('L', (w, h), 0)
for x in range(w):
    for y in range(h):
        r, g, b, a = src.getpixel((x, y))
        if x <= 487 and r > 120 and (r - g) > 28 and (r - b) > 28:
            fg.putpixel((x, y), 255)

bbox = fg.point(lambda p: 255 if p > 128 else 0).getbbox()
pad = 8
crop = fg.crop((bbox[0]-pad, bbox[1]-pad, bbox[2]+pad, bbox[3]+pad))

for blur_rad, opt_tol in [(3.8, 1.0), (4.5, 1.2), (5.2, 1.4)]:
    up = crop.resize((crop.width * 8, crop.height * 8), Image.Resampling.LANCZOS)
    b = up.filter(ImageFilter.GaussianBlur(radius=blur_rad))
    arr = np.array(b) > 128

    bmp = potrace.Bitmap(arr)
    path = bmp.trace(turdsize=30, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.1, opttolerance=opt_tol)

    d_parts = []
    seg_count = 0
    # Skip curve 0 (boundary rectangle)
    for curve in list(path)[1:]:
        fs = curve.start_point
        d_parts.append(f'M{fs.x:.1f} {fs.y:.1f}')
        for seg in curve.segments:
            seg_count += 1
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

    svg_w = crop.width * 8
    svg_h = crop.height * 8
    path_data = ' '.join(d_parts)

    svg_str = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="100%">
  <path fill="#e10021" fill-rule="evenodd" d="{path_data}" />
</svg>'''

    out_name = f'Graphic/test_smooth_b{blur_rad}_opt{opt_tol}'
    with open(f'{out_name}.svg', 'w', encoding='utf-8') as f:
        f.write(svg_str)
    png_bytes = resvg_py.svg_to_bytes(svg_string=svg_str)
    with open(f'{out_name}.png', 'wb') as f:
        f.write(png_bytes)
    print(f'b={blur_rad}, opt={opt_tol}: segments={seg_count}, filesize={len(svg_str)}')

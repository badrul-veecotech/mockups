import potrace
from shapely.geometry import Polygon
import test_opt as to
import resvg_py

svg_w = to.crop.width * 4
svg_h = to.crop.height * 4

d_parts = []
total_pts = 0
for i, curve in enumerate(list(to.path)[1:]):
    pts = [(curve.start_point.x, curve.start_point.y)]
    for s in curve.segments:
        pts.append((s.end_point.x, s.end_point.y))
    poly = Polygon(pts)
    sim = poly.simplify(tolerance=2.2, preserve_topology=True)
    coords = list(sim.exterior.coords)
    total_pts += len(coords)
    d_parts.append(f'M{coords[0][0]:.1f} {coords[0][1]:.1f}')
    for pt in coords[1:]:
        d_parts.append(f'L{pt[0]:.1f} {pt[1]:.1f}')
    d_parts.append('Z')

path_data = ' '.join(d_parts)
svg_str = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="100%">
  <path fill="#e10021" fill-rule="evenodd" d="{path_data}" />
</svg>'''

with open('Graphic/test_poly_simplify.svg', 'w', encoding='utf-8') as f:
    f.write(svg_str)

png_bytes = resvg_py.svg_to_bytes(svg_string=svg_str)
with open('Graphic/test_poly_simplify.png', 'wb') as f:
    f.write(png_bytes)

print(f'Done! Total points: {total_pts}')

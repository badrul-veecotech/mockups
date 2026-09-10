import numpy as np
from shapely.geometry import Polygon
import test_opt as to
import resvg_py

# Chaikin's algorithm to smooth polygon vertices into clean curves
def chaikin_smooth(points, iterations=2):
    pts = list(points)
    if len(pts) < 3:
        return pts
    # If closed polygon (first == last)
    is_closed = np.allclose(pts[0], pts[-1])
    if is_closed:
        pts = pts[:-1]
    
    for _ in range(iterations):
        new_pts = []
        n = len(pts)
        for i in range(n):
            p0 = np.array(pts[i])
            p1 = np.array(pts[(i + 1) % n])
            # Q = 3/4 P0 + 1/4 P1
            # R = 1/4 P0 + 3/4 P1
            q = 0.75 * p0 + 0.25 * p1
            r = 0.25 * p0 + 0.75 * p1
            new_pts.append(tuple(q))
            new_pts.append(tuple(r))
        pts = new_pts
    
    if is_closed:
        pts.append(pts[0])
    return pts

# Convert points to smooth cubic beziers using Catmull-Rom / cardinal spline
def points_to_cubic_beziers(pts):
    if len(pts) < 4:
        return ''
    is_closed = np.allclose(pts[0], pts[-1])
    if is_closed:
        pts = pts[:-1]
    n = len(pts)
    
    d = [f'M{pts[0][0]:.1f} {pts[0][1]:.1f}']
    # For each segment i to i+1, compute control points using neighbors
    for i in range(n):
        p0 = np.array(pts[(i - 1) % n])
        p1 = np.array(pts[i])
        p2 = np.array(pts[(i + 1) % n])
        p3 = np.array(pts[(i + 2) % n])
        
        # Standard Catmull-Rom to Cubic Bezier conversion (tension = 0.5)
        c1 = p1 + (p2 - p0) / 6.0
        c2 = p2 - (p3 - p1) / 6.0
        
        d.append(f'C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}')
    d.append('Z')
    return ' '.join(d)

d_parts = []
total_segments = 0

for i, curve in enumerate(list(to.path)[1:]):
    raw_pts = [(curve.start_point.x, curve.start_point.y)]
    for s in curve.segments:
        raw_pts.append((s.end_point.x, s.end_point.y))
    
    # 1. Simplify polygon to remove noise
    poly = Polygon(raw_pts)
    # tolerance: 1.8 gives ideal balance of authentic shape and noise removal
    sim = poly.simplify(tolerance=1.8, preserve_topology=True)
    coords = list(sim.exterior.coords)
    
    # 2. Smooth with 1 iteration of Chaikin
    smoothed = chaikin_smooth(coords, iterations=1)
    total_segments += len(smoothed)
    
    # 3. Fit smooth cubic beziers
    bezier_str = points_to_cubic_beziers(smoothed)
    d_parts.append(bezier_str)

svg_w = to.crop.width * 4
svg_h = to.crop.height * 4
path_data = ' '.join(d_parts)

svg_str = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="100%">
  <path fill="#e10021" fill-rule="evenodd" d="{path_data}" />
</svg>'''

with open('Graphic/test_spline_clean.svg', 'w', encoding='utf-8') as f:
    f.write(svg_str)

png_bytes = resvg_py.svg_to_bytes(svg_string=svg_str)
with open('Graphic/test_spline_clean.png', 'wb') as f:
    f.write(png_bytes)

print(f'Spline smoothing done! Total segments: {total_segments}')

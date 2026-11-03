// -----------------------------------------------------------------------------
// scripts/generate-routes.mjs
//
// Reads every GPX file in public/routes/ (route-<n>-*.gpx) and writes
// src/data/routes.generated.json with, for each route:
//   - distance (km), estimated ascent (m), min/max elevation
//   - a simplified SVG path of the track (own drawn map, no third-party tiles)
//   - an elevation profile (distance/elevation samples)
//   - start point
// The site draws the map and the profile from this JSON. No map provider,
// no cookies, no external requests.
//
// To add a route: put route-<n>-<anything>.gpx in public/routes/, add its name
// and text to src/data/routes.meta.js (key = same number), run `npm run routes`.
//
// Ascent is an ESTIMATE: elevation is resampled every 50 m and lightly smoothed.
// GPS devices and apps report slightly different values.
// -----------------------------------------------------------------------------

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "public", "routes");
const OUT = join(ROOT, "src", "data", "routes.generated.json");

const R = 6371000;
const rad = (d) => (d * Math.PI) / 180;
function hav(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function parseGpx(xml) {
  const pts = [];
  const re = /<trkpt\s+[^>]*?lat="([-\d.]+)"[^>]*?lon="([-\d.]+)"[^>]*?>([\s\S]*?)<\/trkpt>|<trkpt\s+[^>]*?lon="([-\d.]+)"[^>]*?lat="([-\d.]+)"[^>]*?>([\s\S]*?)<\/trkpt>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const lat = parseFloat(m[1] ?? m[5]);
    const lon = parseFloat(m[2] ?? m[4]);
    const body = m[3] ?? m[6] ?? "";
    const e = /<ele>([-\d.]+)<\/ele>/.exec(body);
    pts.push({ lat, lon, ele: e ? parseFloat(e[1]) : null });
  }
  return pts;
}

// Ramer-Douglas-Peucker on projected points (x,y in metres)
function rdp(points, eps) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = 0;
    let idx = -1;
    const a = points[s];
    const b = points[e];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    for (let i = s + 1; i < e; i++) {
      const p = points[i];
      let d;
      if (len2 === 0) d = Math.hypot(p.x - a.x, p.y - a.y);
      else {
        const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
        d = Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
      }
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > eps && idx !== -1) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function smooth(values, win) {
  const half = Math.floor(win / 2);
  return values.map((_, i) => {
    let sum = 0;
    let n = 0;
    for (let j = Math.max(0, i - half); j <= Math.min(values.length - 1, i + half); j++) {
      sum += values[j];
      n++;
    }
    return sum / n;
  });
}

// Ascent: sum of the positive elevation deltas of the smoothed, resampled track.
function ascent(ele) {
  let total = 0;
  for (let i = 1; i < ele.length; i++) {
    const d = ele[i] - ele[i - 1];
    if (d > 0) total += d;
  }
  return total;
}

const files = readdirSync(DIR)
  .filter((f) => /^route-\d+-.*\.gpx$/.test(f))
  .sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));

const out = [];
for (const f of files) {
  const n = parseInt(f.split("-")[1]);
  const pts = parseGpx(readFileSync(join(DIR, f), "utf8"));
  if (pts.length < 10) throw new Error(`generate-routes: ${f} has too few track points`);

  // cumulative distance
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + hav(pts[i - 1], pts[i]));
  const totalM = cum[cum.length - 1];

  // elevation: fill gaps, resample every ~50 m, smooth, then ascent
  const eleRaw = pts.map((p) => p.ele);
  let last = eleRaw.find((v) => v !== null) ?? 0;
  const eleFilled = eleRaw.map((v) => (v === null ? last : (last = v)));
  const step = 50;
  const samples = [];
  let k = 0;
  for (let d = 0; d <= totalM; d += step) {
    while (k < cum.length - 2 && cum[k + 1] < d) k++;
    const span = cum[k + 1] - cum[k] || 1;
    const t = Math.max(0, Math.min(1, (d - cum[k]) / span));
    samples.push({ d, e: eleFilled[k] + t * (eleFilled[k + 1] - eleFilled[k]) });
  }
  const eleS = smooth(samples.map((s) => s.e), 5);
  const asc = Math.round(ascent(eleS));
  const minE = Math.round(Math.min(...eleS));
  const maxE = Math.round(Math.max(...eleS));

  // profile: ~120 points
  const every = Math.max(1, Math.floor(samples.length / 120));
  const profile = [];
  for (let i = 0; i < samples.length; i += every) profile.push([+(samples[i].d / 1000).toFixed(2), +eleS[i].toFixed(1)]);
  profile.push([+(totalM / 1000).toFixed(2), +eleS[eleS.length - 1].toFixed(1)]);

  // projection (equirectangular) and simplification
  const lat0 = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
  const kx = Math.cos(rad(lat0));
  const proj = pts.map((p) => ({ x: rad(p.lon) * R * kx, y: -rad(p.lat) * R }));
  const simp = rdp(proj, 25);
  const xs = simp.map((p) => p.x);
  const ys = simp.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX;
  const h = Math.max(...ys) - minY;
  const W = 1000;
  const scale = W / Math.max(w, h);
  const pad = 40;
  const vw = Math.round(w * scale) + pad * 2;
  const vh = Math.round(h * scale) + pad * 2;
  const path = simp
    .map((p, i) => `${i === 0 ? "M" : "L"}${((p.x - minX) * scale + pad).toFixed(1)} ${((p.y - minY) * scale + pad).toFixed(1)}`)
    .join("");
  const s0 = simp[0];
  const start = [+((s0.x - minX) * scale + pad).toFixed(1), +((s0.y - minY) * scale + pad).toFixed(1)];

  out.push({
    id: `route-${n}`,
    n,
    file: `/routes/${f}`,
    distanceKm: +(totalM / 1000).toFixed(1),
    ascentM: asc,
    minEle: minE,
    maxEle: maxE,
    viewBox: [vw, vh],
    path,
    start,
    profile,
    points: simp.length,
  });
  console.log(`generate-routes: ${f} -> ${(totalM / 1000).toFixed(1)} km, ascent ~${asc} m, ${simp.length} path points`);
}

writeFileSync(OUT, JSON.stringify(out), "utf8");
console.log(`generate-routes: wrote ${out.length} routes to src/data/routes.generated.json`);

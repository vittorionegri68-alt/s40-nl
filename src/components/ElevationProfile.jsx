import React from "react";

// Elevation profile drawn from the [km, metres] samples in routes.generated.json
export default function ElevationProfile({ route, label, unitKm, unitM }) {
  const W = 600;
  const H = 150;
  const pl = 38;
  const pr = 8;
  const pt = 10;
  const pb = 24;
  const pts = route.profile;
  const maxD = pts[pts.length - 1][0];
  let lo = Math.min(...pts.map((p) => p[1]));
  let hi = Math.max(...pts.map((p) => p[1]));
  if (hi - lo < 20) hi = lo + 20; // keep flat routes flat instead of exaggerating noise
  const x = (d) => pl + (d / maxD) * (W - pl - pr);
  const y = (e) => pt + (1 - (e - lo) / (hi - lo)) * (H - pt - pb);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join("");
  const area = `${line}L${x(maxD).toFixed(1)} ${H - pb}L${pl} ${H - pb}Z`;
  const ticks = [0, 0.5, 1].map((t) => Math.round(maxD * t));
  return (
    <svg className="elev" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="none">
      <path d={area} fill="#76A776" opacity=".22" />
      <path d={line} fill="none" stroke="#76A776" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <line x1={pl} x2={W - pr} y1={H - pb} y2={H - pb} stroke="#4C4F52" strokeWidth="1" />
      <text x="4" y={y(hi) + 4} className="elev__t">{Math.round(hi)} {unitM}</text>
      <text x="4" y={y(lo) + 4} className="elev__t">{Math.round(lo)} {unitM}</text>
      {ticks.map((t, i) => (
        <text key={t} x={x(t)} y={H - 6} className="elev__t" textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}>{t} {unitKm}</text>
      ))}
    </svg>
  );
}

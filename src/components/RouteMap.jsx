import React from "react";

// Own-drawn route map: simplified GPX track as an SVG path. No tiles, no third parties.
export default function RouteMap({ route, label, startLabel }) {
  const [vw, vh] = route.viewBox;
  return (
    <svg className="rmap" viewBox={`0 0 ${vw} ${vh}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="rmap-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="#393C3F" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={vw} height={vh} fill="url(#rmap-grid)" />
      <path key={route.id + "-shadow"} d={route.path} fill="none" stroke="#17191B" strokeWidth="11" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".6" />
      <path key={route.id} className="rmap__line" d={route.path} pathLength="1" fill="none" stroke="#76A776" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <g transform={`translate(${route.start[0]} ${route.start[1]})`}>
        <circle r="13" fill="#17191B" stroke="#76A776" strokeWidth="4" />
        <circle r="4.5" fill="#76A776" />
        <text x="22" y="-14" fontFamily="Saira Condensed, sans-serif" fontWeight="800" fontSize="26" fill="#FFFFFF" letterSpacing="1">{startLabel}</text>
      </g>
    </svg>
  );
}

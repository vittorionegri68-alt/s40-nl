import React from "react";

// The S//40 graphic mark (viewBox 330x100). Stroke paths use pathLength=1 so the
// hero intro can draw them with a dash animation (see .mark in index.css).
// tone="reversed": white strokes (for dark grounds). tone="positive": anthracite strokes.
export default function Mark({ tone = "reversed", className = "", title }) {
  const stroke = tone === "reversed" ? "#FFFFFF" : "#2A2D31";
  return (
    <svg
      className={`mark ${className}`}
      viewBox="0 0 330 100"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g transform="translate(25 0) skewX(-14)">
        <g fill="none" stroke={stroke} strokeWidth="24" strokeLinejoin="miter" strokeLinecap="butt">
          <path className="mark__s" pathLength="1" d="M70 12H30A18 18 0 0 0 12 30V32A18 18 0 0 0 30 50H32.5M37.5 50H40A18 18 0 0 1 58 68V70A18 18 0 0 1 40 88H0" />
          <path className="mark__4" pathLength="1" d="M162 0V64H193M210 0V100" />
          <path className="mark__0" pathLength="1" d="M266.5 12H264A18 18 0 0 0 246 30V70A18 18 0 0 0 264 88H266.5M271.5 12H274A18 18 0 0 1 292 30V70A18 18 0 0 1 274 88H271.5" />
        </g>
        <g fill="#76A776" className="mark__slashes">
          <polygon className="mark__sl1" points="78,100 94,100 116,0 100,0" />
          <polygon className="mark__sl2" points="104,100 120,100 142,0 126,0" />
        </g>
      </g>
    </svg>
  );
}

import React from "react";
import { copy } from "../config/copy.js";

// Photo mosaic with different parallax speeds per tile.
const SPEEDS = [0.05, -0.07, 0.1, -0.04, -0.09, 0.06, -0.05, 0.08];

export default function Workshop() {
  const c = copy.workshop;
  return (
    <section id={c.id} data-block data-theme="dark" className="block block--deep" aria-labelledby="workshop-h2">
      <div className="container">
        <header className="sechead sechead--row reveal">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="workshop-h2" className="h2">{c.title}</h2>
          </div>
          <p className="lead">{c.text}</p>
        </header>
        <ul className="mosaic">
          {c.photos.map((p, i) => (
            <li key={p.src} className={`mosaic__cell mosaic__cell--${i + 1}`}>
              <div className="mosaic__img" data-parallax={SPEEDS[i % SPEEDS.length]}>
                <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

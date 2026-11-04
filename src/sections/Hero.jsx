import React, { useEffect, useState } from "react";
import Mark from "../components/Mark.jsx";
import Icon from "../components/Icon.jsx";
import { copy } from "../config/copy.js";

// Hero: only the graphic S//40 mark. Intro = solid anthracite that dissolves (reverse dissolve)
// while the mark draws itself. Parallax layers: photo, big chainring, mark (+ pointer movement).
export default function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let t;
    const go = () => {
      t = setTimeout(() => setReady(true), 1400);
    };
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const img = new Image();
    img.src = "/assets/images/tool-wall.webp";
    const imgReady = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    Promise.all([fonts, imgReady]).then(go);
    const fallback = setTimeout(() => setReady(true), 12500);
    return () => {
      clearTimeout(t);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section id="home" data-block data-theme="dark" className={`hero ${ready ? "hero--in" : ""}`} aria-labelledby="hero-h1">
      <div className="hero__layer hero__bg" data-parallax="0.16">
        <img src="/assets/images/tool-wall.webp" alt="" width="1600" height="1200" decoding="async" />
      </div>
      <div className="hero__layer hero__ring" data-parallax="0.32" data-pointer="-26">
        <img src="/assets/motifs/chainring-green.svg" alt="" width="200" height="200" />
      </div>
      <div className="hero__layer hero__speed" data-parallax="0.08">
        <img src="/assets/motifs/diagonal-speedlines.svg" alt="" />
      </div>
      <div className="hero__layer hero__markwrap" data-parallax="-0.1" data-pointer="22">
        <Mark tone="reversed" title={copy.hero.markLabel} />
      </div>
      <h1 id="hero-h1" className="sr-only">{copy.hero.h1}</h1>
      <p className="sr-only">{copy.hero.sr}</p>
      <div className="hero__veil" aria-hidden="true" />
      <a className="hero__scroll" href="#diensten" aria-label={copy.hero.scroll}>
        <Icon name="chevron-down" size={28} strokeWidth={2.6} />
      </a>
    </section>
  );
}

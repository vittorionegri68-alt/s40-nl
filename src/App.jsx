import React, { useEffect, useState } from "react";
import Nav from "./components/Nav.jsx";
import Cursor from "./components/Cursor.jsx";
import PagerDots from "./components/PagerDots.jsx";
import Hero from "./sections/Hero.jsx";
import Services from "./sections/Services.jsx";
import About from "./sections/About.jsx";
import Workshop from "./sections/Workshop.jsx";
import QandA from "./sections/QandA.jsx";
import Routes from "./sections/Routes.jsx";
import News from "./sections/News.jsx";
import Contact from "./sections/Contact.jsx";
import { createPager, createParallax, createReveal } from "./lib/scrollfx.js";
import { copy } from "./config/copy.js";

export default function App() {
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const reveal = createReveal();
    const parallax = createParallax();
    const pager = createPager({ onActive: (_, id) => setActiveId(id || "home") });
    // Jump to a #hash target on load (no animation)
    const hash = window.location.hash.slice(1);
    if (hash) setTimeout(() => pager.goTo(hash, true), 60);
    return () => {
      reveal.destroy();
      parallax.destroy();
      pager.destroy();
    };
  }, []);

  return (
    <>
      <a className="skip" href="#diensten">{copy.skip}</a>
      <Cursor />
      <Nav activeId={activeId} />
      <PagerDots activeId={activeId} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Services />
        <About />
        <Workshop />
        <QandA />
        <Routes />
        <News />
        <Contact />
      </main>
    </>
  );
}

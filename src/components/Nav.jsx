import React, { useEffect, useState } from "react";
import Icon from "./Icon.jsx";
import Button from "./Button.jsx";
import { copy } from "../config/copy.js";
import { site, otherLanguageHref } from "../config/site_config.js";

export default function Nav({ activeId }) {
  const [open, setOpen] = useState(false);
  const [otherHref, setOtherHref] = useState(site.switcher.otherHrefFinal);
  const c = copy.nav;

  useEffect(() => setOtherHref(otherLanguageHref()), []);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav">
      <div className="nav__in">
        <a className="nav__logo" href="#home" aria-label={c.home} onClick={() => setOpen(false)}>
          <img src="/assets/s40-lockup-horizontal-reversed.svg?v=2" alt={copy.hero.markLabel} width="273" height="40" />
        </a>

        <nav className="nav__links" aria-label="Hoofdmenu">
          {c.items.map((it) => (
            <a key={it.id} href={`#${it.id}`} className={activeId === it.id ? "is-active" : ""} aria-current={activeId === it.id ? "true" : undefined}>
              {it.label}
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <div className="lang" role="group" aria-label={c.language}>
            <span className="lang__cur" aria-current="true">{site.switcher.current}</span>
            <a className="lang__other" href={otherHref} hreflang={site.switcher.other.toLowerCase()} lang={site.switcher.other.toLowerCase()} title={site.switcher.otherLabel}>
              {site.switcher.other}
            </a>
          </div>
          <Button href="#contact" size="sm" className="nav__cta">{c.cta}</Button>
          <button className="nav__burger" aria-label={open ? c.close : c.menu} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <Icon name={open ? "x" : "menu"} size={26} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mmenu ${open ? "is-open" : ""}`} hidden={!open}>
        {c.items.map((it) => (
          <a key={it.id} href={`#${it.id}`} onClick={() => setOpen(false)}>{it.label}</a>
        ))}
        <Button href="#contact" onClick={() => setOpen(false)}>{c.cta}</Button>
      </div>
    </header>
  );
}

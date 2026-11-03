import React from "react";
import { copy } from "../config/copy.js";

const ORDER = [{ id: "home", label: "Home" }, ...copy.nav.items.filter((i) => i.id !== "contact"), { id: "contact", label: copy.nav.items.find((i) => i.id === "contact").label }];

export default function PagerDots({ activeId }) {
  return (
    <nav className="dots" aria-label={copy.pager.label}>
      {ORDER.map((it) => (
        <a key={it.id} href={`#${it.id}`} className={activeId === it.id ? "is-active" : ""} aria-label={it.label} aria-current={activeId === it.id ? "true" : undefined}>
          <span className="dots__label">{it.label}</span>
          <i />
        </a>
      ))}
    </nav>
  );
}

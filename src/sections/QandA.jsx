import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import { copy } from "../config/copy.js";
import { qanda } from "../data/qanda.jsx";

export default function QandA() {
  const c = copy.qa;
  const [open, setOpen] = useState(() => new Set());
  const toggle = (id) =>
    setOpen((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const half = Math.ceil(qanda.length / 2);
  const cols = [qanda.slice(0, half), qanda.slice(half)];

  return (
    <section id={c.id} data-block data-theme="light" className="block block--light" aria-labelledby="qa-h2">
      <div className="container">
        <header className="sechead reveal">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="qa-h2" className="h2">{c.title}</h2>
          <p className="lead">{c.intro}</p>
        </header>
        <div className="qa reveal">
          {cols.map((col, ci) => (
            <div className="qa__col" key={ci}>
              {col.map((item) => {
                const isOpen = open.has(item.id);
                return (
                  <div className={`qa__item ${isOpen ? "is-open" : ""}`} key={item.id}>
                    <h3>
                      <button type="button" aria-expanded={isOpen} aria-controls={`qa-${item.id}`} id={`qa-btn-${item.id}`} onClick={() => toggle(item.id)}>
                        <span>{item.q}</span>
                        <Icon name="plus" size={22} strokeWidth={2.6} />
                      </button>
                    </h3>
                    <div id={`qa-${item.id}`} role="region" aria-labelledby={`qa-btn-${item.id}`} className="qa__panel" hidden={!isOpen}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Icon from "../components/Icon.jsx";
import { copy } from "../config/copy.js";
import { contact } from "../config/contact_info.js";

export default function About() {
  const c = copy.about;
  return (
    <section id={c.id} data-block data-theme="dark" className="block block--dark" aria-labelledby="about-h2">
      <div className="block__pattern" aria-hidden="true" data-parallax="0.1" />
      <div className="container about">
        <div className="about__main">
          <header className="sechead reveal">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="about-h2" className="h2">{c.title}</h2>
            <p className="lead">{c.lead}</p>
          </header>
          {c.paragraphs.map((p, i) => (
            <p key={i} className="reveal about__p">{p}</p>
          ))}
          <ul className="stats reveal">
            {c.stats.map((s) => (
              <li key={s.value}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="about__side">
          <h3 className="h4 reveal">{c.whyTitle}</h3>
          <ol className="why">
            {c.why.map((w, i) => (
              <li key={w.t} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="why__n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h4>{w.t}</h4>
                  <p>{w.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="team reveal">
          <h3 className="h4">{c.teamTitle}</h3>
          <ul>
            {c.team.map((m) => {
              const p = contact.people[m.key];
              return (
                <li key={m.key}>
                  <strong>{p.name}</strong>
                  <span>{m.role}</span>
                  {m.langs ? <small>{c.langsLabel}: {m.langs}</small> : null}
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}, ${c.profile}`}>
                      <Icon name="linkedin" size={18} /> {c.profile}
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

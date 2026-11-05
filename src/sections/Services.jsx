import React from "react";
import Icon from "../components/Icon.jsx";
import Button from "../components/Button.jsx";
import { copy } from "../config/copy.js";

export default function Services() {
  const c = copy.services;
  return (
    <section id={c.id} data-block data-theme="light" className="block block--light" aria-labelledby="diensten-h2">
      <div className="container">
        <header className="sechead reveal">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="diensten-h2" className="h2">{c.title}</h2>
          <p className="lead">{c.intro}</p>
        </header>

        <ul className="cards">
          {c.cards.map((card, i) => (
            <li key={card.title} className="card reveal" style={{ transitionDelay: `${i * 45}ms` }}>
              <span className="card__icon"><Icon name={card.icon} size={30} strokeWidth={2} /></span>
              <h3 className="card__title">{card.title}</h3>
              <p>{card.text}</p>
            </li>
          ))}
          <li className="card card--price reveal" style={{ transitionDelay: "320ms" }}>
            <h3 className="card__title">{c.price.title}</h3>
            <p>{c.price.text}</p>
            <Button href="#contact" variant="dark" tone="light" size="sm">{c.price.cta}</Button>
          </li>
        </ul>

        <div className="also reveal">
          <ul className="also__list">
            {c.also.map((a) => (
              <li key={a}><Icon name="check" size={18} strokeWidth={3} /> {a}</li>
            ))}
          </ul>
        </div>

        <div className="brandline reveal">
          <p className="brandline__label">{c.brandsLabel}</p>
          <p className="brandline__text">
            {c.brands.split(/(YOONIT|CyclOn|Izumi)/gi).map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t))}
          </p>
        </div>
      </div>
    </section>
  );
}

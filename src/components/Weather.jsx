import React, { useEffect, useState } from "react";
import Icon from "./Icon.jsx";
import WeatherIcon, { symbolKey } from "./WeatherIcon.jsx";
import { copy } from "../config/copy.js";
import { site } from "../config/site_config.js";

// Weather card for Nijkerk. Data comes from our own serverless function (/api/weather),
// which proxies MET Norway (Locationforecast 2.0) with caching. See api/weather.js.
export default function Weather() {
  const w = copy.routes.weather;
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(site.weatherEndpoint)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("weather " + r.status))))
        .then((d) => alive && setState({ status: "ok", d }))
        .catch(() => alive && setState({ status: "error" }));
    load();
    const t = setInterval(load, 15 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const label = (sym) => w.labels[symbolKey(sym)] || "";
  const compass = (deg) => w.compass[Math.round(((deg % 360) / 45)) % 8];

  return (
    <div className="weather" aria-live="polite">
      <h3 className="weather__title">{w.title}</h3>
      {state.status === "loading" && <p className="weather__msg">{w.loading}</p>}
      {state.status === "error" && <p className="weather__msg">{w.error}</p>}
      {state.status === "ok" && (
        <>
          <div className="weather__now">
            <WeatherIcon symbol={state.d.now.symbol} size={54} />
            <div>
              <strong className="weather__temp">{Math.round(state.d.now.temp)}°</strong>
              <span className="weather__cond">{label(state.d.now.symbol)}</span>
            </div>
            <div className="weather__range">
              {w.today}: {Math.round(state.d.today.min)}° {w.min} / {Math.round(state.d.today.max)}° {w.max}
            </div>
          </div>
          <dl className="weather__stats">
            <div>
              <dt><Icon name="wind" size={16} /> {w.wind}</dt>
              <dd>
                {Math.round(state.d.now.windKmh)} {w.kmh}
                <span className="weather__arrow" style={{ transform: `rotate(${(state.d.now.windFrom + 180) % 360}deg)` }} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                </span>
                <small> {w.from} {compass(state.d.now.windFrom)}</small>
              </dd>
            </div>
            <div>
              <dt><Icon name="droplet" size={16} /> {w.rain}</dt>
              <dd>{state.d.now.precip1h.toFixed(1)} {w.mm}</dd>
            </div>
            <div>
              <dt>{w.humidity}</dt>
              <dd>{Math.round(state.d.now.humidity)}%</dd>
            </div>
          </dl>
          <div className="weather__next" aria-label={w.next}>
            {state.d.next.map((n) => (
              <div key={n.time}>
                <span>{n.hour}</span>
                <WeatherIcon symbol={n.symbol} size={26} />
                <strong>{Math.round(n.temp)}°</strong>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="weather__src">
        {w.source}: <a href={w.sourceUrl} target="_blank" rel="noopener noreferrer">{w.sourceName}</a> ({w.license})
      </p>
    </div>
  );
}

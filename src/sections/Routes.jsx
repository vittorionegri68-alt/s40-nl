import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import Button from "../components/Button.jsx";
import RouteMap from "../components/RouteMap.jsx";
import ElevationProfile from "../components/ElevationProfile.jsx";
import Weather from "../components/Weather.jsx";
import { copy } from "../config/copy.js";
import { site } from "../config/site_config.js";
import { routesMeta } from "../data/routes.meta.js";
import generated from "../data/routes.generated.json";

const routes = generated.map((r) => ({ ...r, ...(routesMeta[r.n] || { name: `Route ${r.n}`, text: "" }) }));
const nf = (n, d = 0) => n.toLocaleString(site.locale, { minimumFractionDigits: d, maximumFractionDigits: d });

export default function Routes() {
  const c = copy.routes;
  const [idx, setIdx] = useState(0);
  const r = routes[idx];
  return (
    <section id={c.id} data-block data-theme="dark" className="block block--dark" aria-labelledby="routes-h2">
      <div className="container">
        <header className="sechead reveal">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="routes-h2" className="h2">{c.title}</h2>
          <p className="lead">{c.intro}</p>
        </header>

        <div className="routes reveal">
          <div className="routes__main">
            <div className="routes__tabs" role="tablist" aria-label={c.select}>
              {routes.map((x, i) => (
                <button key={x.id} role="tab" type="button" aria-selected={i === idx} className={i === idx ? "is-active" : ""} onClick={() => setIdx(i)}>
                  <strong>{nf(x.distanceKm)}</strong> {c.unitKm}
                </button>
              ))}
            </div>
            <div className="routes__map" role="tabpanel">
              <RouteMap route={r} label={`${c.mapLabel}: ${r.name}`} startLabel="Nijkerk" />
            </div>
            <div className="routes__profile">
              <h3 className="routes__small">{c.profile}</h3>
              <ElevationProfile route={r} label={`${c.profile}: ${r.name}`} unitKm={c.unitKm} unitM={c.unitM} />
            </div>
          </div>

          <aside className="routes__side">
            <div className="routeinfo">
              <h3 className="routeinfo__name">{r.name}</h3>
              <p>{r.text}</p>
              <dl className="routeinfo__stats">
                <div><dt><Icon name="route" size={16} /> {c.distance}</dt><dd>{nf(r.distanceKm, 1)} {c.unitKm}</dd></div>
                <div><dt><Icon name="mountain" size={16} /> {c.ascent}</dt><dd>{nf(r.ascentM)} {c.unitM}</dd></div>
              </dl>
              <p className="routeinfo__start"><Icon name="map-pin" size={16} /> {c.start}</p>
              <Button href={r.file} download icon="download" size="md">{c.download}</Button>
              <p className="routeinfo__note">{c.note}</p>
            </div>
            <Weather />
          </aside>
        </div>
      </div>
    </section>
  );
}

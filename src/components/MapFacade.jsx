import React, { useState } from "react";
import Icon from "./Icon.jsx";
import { copy } from "../config/copy.js";
import { contact } from "../config/contact_info.js";

// Click-to-load Google Maps: nothing from Google is requested before the click.
export default function MapFacade() {
  const c = copy.contact.map;
  const [on, setOn] = useState(false);
  const q = encodeURIComponent(contact.mapQuery);
  return (
    <div className="mapbox">
      {on ? (
        <iframe title={c.iframeTitle} src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <button type="button" className="mapbox__facade" onClick={() => setOn(true)}>
          <Icon name="map-pin" size={34} strokeWidth={2} />
          <strong>{c.cta}</strong>
          <small>{c.note}</small>
        </button>
      )}
      <a className="mapbox__open" href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer">
        {c.open} <Icon name="arrow-up-right" size={16} strokeWidth={2.6} />
      </a>
    </div>
  );
}

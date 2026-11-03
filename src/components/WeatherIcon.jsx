import React from "react";

// Small inline weather glyphs (stroke style, matches the icon set).
const G = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  partly: '<path d="M12 3v1.5M4.2 6.2l1 1M2 13h1.5M20 13h1.5M18.8 6.2l-1 1"/><path d="M7.5 13a4.5 4.5 0 0 1 8.4-2.2"/><path d="M7 21h9.500a3.500 3.500 0 0 0 .5-6.960A5 5 0 0 0 7.300 15 3 3 0 0 0 7 21z"/>',
  cloud: '<path d="M7 20h10.500a4 4 0 0 0 .5-7.970A6 6 0 0 0 6.300 13.500 3.300 3.300 0 0 0 7 20z"/>',
  rain: '<path d="M7 16h10.500a4 4 0 0 0 .5-7.970A6 6 0 0 0 6.300 9.500 3.300 3.300 0 0 0 7 16z"/><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2"/>',
  snow: '<path d="M7 15h10.500a4 4 0 0 0 .5-7.970A6 6 0 0 0 6.300 8.500 3.300 3.300 0 0 0 7 15z"/><path d="M8 18h.01M12 20h.01M16 18h.01M10 21h.01M14 21h.01"/>',
  sleet: '<path d="M7 15h10.500a4 4 0 0 0 .5-7.970A6 6 0 0 0 6.300 8.500 3.300 3.300 0 0 0 7 15z"/><path d="M8 18l-1 2M12 18h.01M16 18l-1 2M12 21h.01"/>',
  fog: '<path d="M7 13h10.500a4 4 0 0 0 .5-7.970A6 6 0 0 0 6.300 6.500 3.300 3.300 0 0 0 7 13z"/><path d="M4 17h16M7 21h10"/>',
  thunder: '<path d="M7 14h10.500a4 4 0 0 0 .5-7.970A6 6 0 0 0 6.300 7.500 3.300 3.300 0 0 0 7 14z"/><path d="m12 14-2 4h3l-2 4"/>',
};

// Maps a MET Norway symbol_code (e.g. "partlycloudy_day", "lightrain") to one of our glyph keys.
export function symbolKey(code = "") {
  const c = String(code);
  if (c.includes("thunder")) return "thunder";
  if (c.includes("sleet")) return "sleet";
  if (c.includes("snow")) return "snow";
  if (c.includes("rain") || c.includes("shower")) return "rain";
  if (c.includes("fog")) return "fog";
  if (c.startsWith("clearsky") || c.startsWith("fair")) return c.endsWith("night") ? "moon" : c.startsWith("fair") ? "partly" : "sun";
  if (c.startsWith("partlycloudy")) return "partly";
  if (c.startsWith("cloudy")) return "cloud";
  return "cloud";
}

export default function WeatherIcon({ symbol, size = 40 }) {
  const key = symbolKey(symbol);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: G[key] }} />
  );
}

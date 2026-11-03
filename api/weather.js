// Vercel serverless function: GET /api/weather
// Proxies the MET Norway Locationforecast 2.0 API (free, CC BY 4.0) for Nijkerk and returns a
// small JSON object for the weather card. Why a function: MET Norway requires an identifying
// User-Agent and asks high-traffic sites not to call the API directly from browsers. The
// response is cached at the Vercel edge (15 minutes), so the upstream API is called rarely.
//
// Terms: https://developer.yr.no/doc/TermsOfService/  (attribution "MET Norway", licence CC BY 4.0)
// Optional env var: WEATHER_USER_AGENT (default below). Use an app name + contact URL or email.

const LAT = 52.2236;
const LON = 5.4875;
const TZ = "Europe/Amsterdam";
const UA = process.env.WEATHER_USER_AGENT || "s40.nl-website/1.0 https://s40.nl";

const hourLabel = (iso) =>
  new Date(iso).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

export default async function handler(req, res) {
  try {
    const r = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LAT}&lon=${LON}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!r.ok) throw new Error("upstream " + r.status);
    const j = await r.json();
    const ts = j.properties.timeseries;
    const first = ts[0];
    const d = first.data.instant.details;
    const n1 = first.data.next_1_hours || first.data.next_6_hours || {};
    const t0 = new Date(first.time).getTime();

    const within24 = ts.filter((x) => new Date(x.time).getTime() - t0 <= 24 * 3600 * 1000);
    const temps = within24.map((x) => x.data.instant.details.air_temperature);

    const symbolOf = (x) => {
      const dd = x.data;
      return (dd.next_1_hours || dd.next_6_hours || dd.next_12_hours || { summary: {} }).summary.symbol_code || "cloudy";
    };
    const next = [3, 6, 9, 12]
      .map((h) => ts.find((x) => new Date(x.time).getTime() - t0 >= h * 3600 * 1000))
      .filter(Boolean)
      .map((x) => ({ time: x.time, hour: hourLabel(x.time), temp: x.data.instant.details.air_temperature, symbol: symbolOf(x) }));

    const body = {
      updated: j.properties.meta.updated_at,
      now: {
        temp: d.air_temperature,
        windKmh: d.wind_speed * 3.6,
        windFrom: d.wind_from_direction,
        humidity: d.relative_humidity,
        precip1h: (n1.details && n1.details.precipitation_amount) || 0,
        symbol: (n1.summary && n1.summary.symbol_code) || symbolOf(first),
      },
      today: { min: Math.min(...temps), max: Math.max(...temps) },
      next,
    };
    res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
    res.status(200).json(body);
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=60");
    res.status(502).json({ error: "weather unavailable" });
  }
}

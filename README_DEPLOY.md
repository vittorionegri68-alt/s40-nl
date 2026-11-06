# S40 Fietsservice website, Dutch (main language)

Version 1.0 | 3 November 2026 | Built by AI'm by VNS (Vittorio Negri Services)

This repository is the **Dutch (main language)** version of the S40 Fietsservice website (Singel 40, 3861 AE Nijkerk).
The sister repository is `s40-en` (https://en.s40.nl). Both repositories share the same structure, so anything you learn here applies to the other one.

- Design: style #16 Cinetico with the S40 design system (anthracite, green, Saira Condensed and Saira, 14 degree slant)
- Stack: React 18, Vite 5, hosted on Vercel
- Final domain: https://s40.nl (staging: https://s40-nl.vercel.app)
- Build result at delivery: compiles with no errors; 4 blog posts, 10 FAQ answers, 4 routes

## Quick start

```bash
npm install
npm run dev        # development server (also serves /api/weather)
npm run build      # full production build into dist/
npm run preview    # serve the production build locally
```

Requires Node 18 or newer. `npm run build` does more than `vite build`. In order it:

1. `scripts/generate-routes.mjs`: reads `public/routes/*.gpx`, writes `src/data/routes.generated.json` (distance, elevation gain, SVG path, elevation profile).
2. `generate-geo-static.mjs`: writes the FAQPage JSON-LD and the static `<noscript>` content into `index.html`, and builds `public/sitemap.xml`. All from `src/data/qanda.jsx` and `src/config/copy.js`.
3. `generate-blog-noscript.mjs`: writes the blog posts into the static `<noscript>` block of `index.html`.
4. `generate-blog-pages.mjs`: writes one static HTML page per post into `public/post/`.
5. `vite build`.

**Never edit the content between the `GEO-FAQ`, `GEO-STATIC` and `BLOG-STATIC` markers in `index.html` by hand.** It is regenerated on every build.

## What is in the repository

| Path | Purpose |
|---|---|
| `index.html` | Head metadata, JSON-LD (WebSite, Person x2, BreadcrumbList, BicycleStore), GA4, generated static content |
| `site.config.json` | Single source of truth for the build scripts: language, domain, GA4 id, hreflang partner, blog UI strings |
| `src/config/copy.js` | **All visible interface text.** Edit wording here |
| `src/config/contact_info.js` | Phone, email, opening hours, KvK, VAT, social links, team members |
| `src/config/site_config.js` | Language switcher targets (staging and final URLs) |
| `src/data/qanda.jsx` | The 10 validated questions and answers |
| `src/data/posts.jsx` | Blog and news posts (newest first) |
| `src/data/routes.meta.js` | Names and short texts of the routes |
| `public/` | robots.txt, llms.txt, ai.txt, sitemap.xml (generated), privacy.html, 404.html, images, fonts, GPX files |
| `api/weather.js` | Vercel serverless function: proxy for MET Norway weather data |
| `vercel.json` | Security and cache headers. Root domain: this is the only repo that may use a `redirects` block in vercel.json (for example www to non-www), and only if really needed. Currently there are no redirects. |
| `docs/` | Content guide and handover notes |

## Deploying on Vercel

1. Push the repository to GitHub.
2. In Vercel, import the repository. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`. (Already set in `vercel.json`.)
3. Optional environment variable `WEATHER_USER_AGENT`, for example `s40.nl-website/1.0 https://s40.nl service@s40.nl`. MET Norway requires an identifying User-Agent with contact details. A default is used if it is not set.
4. Staging URL for this repo: https://s40-nl.vercel.app.

## Go-live checklist (switching from staging to the final domain)

- [x] Done (2026-11-06): the real GA4 Measurement ID is set in **two** places, shared by the NL and EN sites. If it ever changes, update both: `index.html` (the gtag script and the config call) and `site.config.json` (`gaId`, used for the generated blog pages).
- [ ] Paste the validated "ai-referral" GA4 snippet into `index.html` where the placeholder comment is (directly after the gtag block). It was not available when the site was generated and was deliberately not reconstructed.
- [ ] Add the domain in Vercel (Settings, Domains) and point DNS: https://s40.nl.
- [ ] Confirm the domain values everywhere: `siteUrl` and `altSiteUrl` in `site.config.json`, canonical and hreflang links in `index.html`, `public/robots.txt` (Sitemap line), `public/llms.txt`, `public/ai.txt`, `public/privacy.html` (canonical). Then run `npm run build`.
- [ ] Language switcher: `src/config/site_config.js` already uses the staging URL on `*.vercel.app` and the final URL elsewhere. Check both directions after both sites are live.
- [ ] Verify the Google Business Profile link in `src/config/contact_info.js` (`gbp`) by opening it. It was derived from the CID and could not be checked automatically.
- [ ] Confirm the WhatsApp number (`whatsappHref`) is really on WhatsApp, or remove it.
- [ ] Submit `https://s40.nl/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Review `public/privacy.html` with the owner (it is a simple text and should be checked).

## Technical notes

- **No third-party requests before consent or click:** fonts are self-hosted, Google Maps loads only after a click, route maps are drawn from GPX files, weather goes through our own `/api/weather`. GA4 runs cookieless (`anonymize_ip: true`, `client_storage: 'none'`), so no cookie banner is needed.
- **Weather:** MET Norway Locationforecast 2.0 (licence CC BY 4.0, attribution shown on the page). Cached for 15 minutes (`s-maxage=900`). In development the same endpoint is served by a small plugin in `vite.config.js`. The free Open-Meteo API was deliberately not used because it is for non-commercial use only.
- **Appointment form:** it is a `mailto:` link that opens the visitor's email app with a prepared message. No data is stored or sent by the site. This deviates on purpose from the usual `/api/lead` pattern; a server-side form can be added later.
- **Scroll behaviour:** on desktop with a mouse (fine pointer, width 960px or more, no reduced-motion preference) the page moves block by block, one wheel click per block. Tall blocks scroll normally until their edge. On touch devices and for reduced-motion users the page scrolls normally. Logic is in `src/lib/scrollfx.js`.
- **Hosting plan:** the Vercel Hobby plan is meant for non-commercial use. The owner accepted this risk for staging. Move to a Vercel Pro plan or another host for the production site.
- **Language pair:** the Dutch site is `x-default` in all hreflang links.

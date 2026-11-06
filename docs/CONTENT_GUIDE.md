# Content management guide

How to change the content of this site without touching the layout. All paths are relative to the repository root. After any change run `npm run build` (Vercel does this automatically on every push).

## 1. Change wording on the page

Open `src/config/copy.js`. Every visible text of the interface is there, grouped by section (nav, hero, services, about, workshop, qa, routes, news, contact, footer). Change the string, save, build.

Rules to keep: no em dash; the brand in running text is always "S40 Fietsservice" (the bare "S40" appears only as the graphic mark and in "S40 stands for Singel 40"); never mention e-bikes.

## 2. Contact details and opening hours

`src/config/contact_info.js` holds phone, email, address, KvK, VAT, Instagram, LinkedIn, the Google Business Profile link and the opening hours (`hours`, days numbered 0 = Sunday to 6 = Saturday). The visible hours table is `contact.hoursRows` in `copy.js`: change **both** when the hours change, and update the hours in `index.html` (BicycleStore JSON-LD, `openingHoursSpecification`) and in `public/llms.txt`. The "open now" badge reads `contact_info.js`.

## 3. Add a blog or news post

Open `src/data/posts.jsx`. **Add the new post at the start of the array (position 0).** Newest first.

```js
{
  id: "my-new-post",            // unaccented, lowercase, hyphens. Becomes /post/my-new-post.html
  titolo: "Title of the post",
  data: "2026-12-01",           // YYYY-MM-DD
  categoria: "Blog",            // "Blog" or "News"
  sommario: "Two or three sentences, used as the meta description.",
  contenuto: [
    { tipo: "paragrafo", testo: "A paragraph. Link to another post like this: [[link label|other-post-id]]." },
    { tipo: "titoletto", testo: "A sub heading" },
    { tipo: "immagine", testo: "/assets/images/photo.webp", etichetta: "Alt text and caption" },
    { tipo: "emblema", testo: "/assets/images/crest.png", etichetta: "Alt text" },   // transparent PNG emblem, shown at 260 px high
    { tipo: "logo", testo: "/assets/images/brand-logo.png", etichetta: "Brand name" },   // small logo on a light chip, no caption
    { tipo: "link", testo: "https://example.com", etichetta: "Button label" },
  ],
  attivo: true,                 // false hides it
},
```

- Internal links use `[[label|post-id]]`. The build **fails** if an id does not exist, so a typo cannot go live.
- The "Read also" block (the two most recent other posts) is added automatically.
- Every post should follow the same structure as the existing ones: the need of the reader, the motivation, then the answer and the practical next step (opening hours, how to book).
- Put images in `public/assets/images/` as WebP (about 1600px wide, under 250 KB).
- Write the same article in the other language repository and add the pair to `postAlternates` in `site.config.json` of **both** repositories, so the hreflang links connect them. In this repository the existing example is `racefietsenmaker-nijkerk` and `road-bike-specialist-nijkerk`.
- Posts are published as part of the build: the page `public/post/<id>.html`, the entry in `sitemap.xml`, the static block in `index.html` and the share button are all generated.

## 4. Change the 10 FAQ questions and answers

Edit `src/data/qanda.jsx` only. The same questions and answers feed the FAQ block on the page, the FAQPage structured data, the static `<noscript>` content and the blog. Keep the 10 questions identical in the Dutch and English versions (they are translations of each other) and keep every answer between about 80 and 110 words, starting with the answer.

## 5. Routes

- Add a `.gpx` file to `public/routes/` named `route-<n>-<km>km.gpx`.
- Add its name and one-sentence text under the same number `<n>` in `src/data/routes.meta.js`.
- Run `npm run build`: distance, elevation gain, the map drawing and the elevation profile are generated from the file. Elevation gain is an estimate from the GPX data. Export GPX from Garmin Connect.
- To add gravel routes later, add them the same way (a category label in `routes.meta.js` and a heading in `copy.js` can be added when there are enough of them).
- Remove a route by deleting its GPX file and its entry in `routes.meta.js`.

## 6. Photos

Photos are in `public/assets/images/` and are referenced in `copy.js` (workshop gallery) and `posts.jsx`. Use WebP. Always write a descriptive alt text. Do not publish photos of identifiable people without their consent.

## 7. Team members

`src/config/contact_info.js` (`people`) and `copy.js` (`about.team`). The structured data for the two owners is in `index.html`. Names in structured data use the unaccented spelling (for example "Wojciech Krenski"); visible text may use accents.

## 8. Favicon, social image, colours

- Colours and type tokens: `src/styles/tokens.css`. Do not use green as text colour on light backgrounds (use the darker green token).
- Social preview image: `public/og-image.jpg` (1200 x 630).
- Favicon: `public/favicon.svg`.

## 9. Things to avoid

- Do not edit generated areas of `index.html` (between the GEO and BLOG markers).
- Do not add a `redirects` block to `vercel.json` on a subdomain site.
- Do not add third-party scripts, trackers or embeds without discussing the privacy statement first.

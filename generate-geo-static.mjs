// -----------------------------------------------------------------------------
// generate-geo-static.mjs
//
// Keeps the crawler-readable (no JavaScript) parts of index.html in sync with the
// single source of truth, so the 10 validated questions stay IDENTICAL everywhere:
//   1. FAQPage node inside the single JSON-LD @graph in <head>  (markers GEO-SCHEMA-START / GEO-SCHEMA-END)
//   2. the static <noscript> page content (markers GEO-STATIC-START / GEO-STATIC-END)
//      built from src/config/copy.js, src/config/contact_info.js, src/data/qanda.jsx,
//      src/data/routes.meta.js and src/data/routes.generated.json.
// The blog articles are added by generate-blog-noscript.mjs (separate markers).
// Runs on every build (see package.json). Idempotent. Works unchanged in NL and EN repos.
// -----------------------------------------------------------------------------

import { readFileSync, writeFileSync, copyFileSync, unlinkSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const CFG = JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));
const INDEX_PATH = join(ROOT, "index.html");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

async function importJsx(rel) {
  const src = join(ROOT, rel);
  const tmp = join(ROOT, "src", `_geo-tmp-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`);
  copyFileSync(src, tmp);
  try {
    return await import(pathToFileURL(tmp).href);
  } finally {
    unlinkSync(tmp);
  }
}

function replaceBetween(html, startMarker, endMarker, content) {
  const a = html.indexOf(startMarker);
  const b = html.indexOf(endMarker);
  if (a === -1 || b === -1) throw new Error(`generate-geo-static: markers ${startMarker.slice(0, 24)}... not found in index.html`);
  const startEnd = html.indexOf("-->", a) + 3;
  const lineStart = html.lastIndexOf("\n", b) + 1;
  const indent = html.slice(lineStart, b);
  return html.slice(0, startEnd) + "\n" + content + "\n" + indent + html.slice(b);
}

// Replaces (or adds) the FAQPage node inside the single JSON-LD @graph between the GEO-SCHEMA markers.
function upsertFaqInGraph(html, faqNode) {
  const a = html.indexOf("<!-- GEO-SCHEMA-START");
  const b = html.indexOf("<!-- GEO-SCHEMA-END");
  if (a === -1 || b === -1) throw new Error("generate-geo-static: GEO-SCHEMA markers not found in index.html");
  const open = '<script type="application/ld+json">';
  const s0 = html.indexOf(open, a);
  const s1 = html.indexOf("</script>", s0);
  if (s0 === -1 || s1 === -1 || s0 > b) throw new Error("generate-geo-static: JSON-LD script not found between GEO-SCHEMA markers");
  const doc = JSON.parse(html.slice(s0 + open.length, s1));
  if (!Array.isArray(doc["@graph"])) throw new Error("generate-geo-static: expected a single @graph in the JSON-LD block");
  doc["@graph"] = doc["@graph"].filter((n) => n["@type"] !== "FAQPage").concat([faqNode]);
  const json = JSON.stringify(doc).replace(/</g, "\\u003c");
  return html.slice(0, s0 + open.length) + json + html.slice(s1);
}

async function main() {
  const { copy } = await import(pathToFileURL(join(ROOT, "src", "config", "copy.js")).href);
  const { contact } = await import(pathToFileURL(join(ROOT, "src", "config", "contact_info.js")).href);
  const { routesMeta } = await import(pathToFileURL(join(ROOT, "src", "data", "routes.meta.js")).href);
  const { qanda } = await importJsx("src/data/qanda.jsx");
  const routes = JSON.parse(readFileSync(join(ROOT, "src", "data", "routes.generated.json"), "utf8"));

  // 1. FAQPage node of the unified @graph (the other entities are hand-written in index.html)
  const faqNode = {
    "@type": "FAQPage",
    "@id": `${CFG.siteUrl}/#faq`,
    inLanguage: CFG.lang,
    about: { "@id": `${CFG.siteUrl}/#business` },
    isPartOf: { "@id": `${CFG.siteUrl}/#webpage` },
    mainEntity: qanda.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };

  // 2. noscript static content
  const L = [];
  const nf = (n, d = 0) => n.toLocaleString(CFG.locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  L.push(`          <h1>${esc(copy.hero.h1)}</h1>`);
  L.push(`          <p>${esc(copy.hero.sr)}</p>`);

  L.push(`          <h2>${esc(copy.services.title)}</h2>`);
  L.push(`          <p>${esc(copy.services.intro)}</p>`);
  L.push(`          <ul>`);
  for (const c of copy.services.cards) L.push(`            <li><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></li>`);
  L.push(`          </ul>`);
  L.push(`          <p>${esc(copy.services.price.title)}. ${esc(copy.services.price.text)}</p>`);
  L.push(`          <ul>${copy.services.also.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`);
  L.push(`          <p>${esc(copy.services.brands)}</p>`);

  L.push(`          <h2>${esc(copy.about.title)}</h2>`);
  L.push(`          <p>${esc(copy.about.lead)}</p>`);
  for (const p of copy.about.paragraphs) L.push(`          <p>${esc(p)}</p>`);
  L.push(`          <ul>${copy.about.stats.map((s) => `<li>${esc(s.value)} ${esc(s.label)}</li>`).join("")}</ul>`);
  L.push(`          <h3>${esc(copy.about.whyTitle)}</h3>`);
  L.push(`          <ol>${copy.about.why.map((w) => `<li><strong>${esc(w.t)}</strong> ${esc(w.d)}</li>`).join("")}</ol>`);
  L.push(`          <h3>${esc(copy.about.teamTitle)}</h3>`);
  L.push(
    `          <ul>${copy.about.team
      .map((m) => {
        const p = contact.people[m.key];
        return `<li>${esc(p.name)}, ${esc(m.role)}${m.langs ? ` (${esc(copy.about.langsLabel)}: ${esc(m.langs)})` : ""}</li>`;
      })
      .join("")}</ul>`
  );

  L.push(`          <h2>${esc(copy.qa.title)}</h2>`);
  for (const x of qanda) {
    L.push(`          <h3>${esc(x.q)}</h3>`);
    L.push(`          <p>${esc(x.a)}</p>`);
  }

  L.push(`          <h2>${esc(copy.routes.title)}</h2>`);
  L.push(`          <p>${esc(copy.routes.intro)}</p>`);
  L.push(`          <ul>`);
  for (const r of routes) {
    const m = routesMeta[r.n] || { name: `Route ${r.n}`, text: "" };
    L.push(
      `            <li><h3>${esc(m.name)}</h3><p>${esc(m.text)} ${esc(nf(r.distanceKm, 1))} ${esc(copy.routes.unitKm)}, ${esc(copy.routes.ascent)}: ${esc(nf(r.ascentM))} ${esc(copy.routes.unitM)}. <a href="${esc(r.file)}">${esc(copy.routes.download)}</a></p></li>`
    );
  }
  L.push(`          </ul>`);

  L.push(`          <h2>${esc(copy.news.events.title)}</h2>`);
  L.push(`          <p>${esc(copy.news.events.text)}</p>`);
  L.push(`          <ul>${copy.news.events.items.map((e) => `<li>${esc(e.t)}: ${esc(e.d)}</li>`).join("")}</ul>`);
  L.push(`          <p>${esc(copy.news.events.note)} <a href="${esc(contact.instagram)}">${esc(contact.instagramHandle)}</a></p>`);

  L.push(`          <h2>${esc(copy.contact.title)}</h2>`);
  L.push(`          <p>${esc(copy.contact.intro)}</p>`);
  L.push(
    `          <address>${esc(contact.legalName)}, ${esc(contact.street)}, ${esc(contact.postalCode)} ${esc(contact.city)}, ${esc(CFG.ui.country || "")}. ` +
      `<a href="${esc(contact.phoneHref)}">${esc(contact.phone)}</a>, <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>, ` +
      `<a href="${esc(contact.instagram)}">Instagram ${esc(contact.instagramHandle)}</a>, <a href="${esc(contact.gbp)}">${esc(copy.footer.google)}</a></address>`
  );
  L.push(`          <h3>${esc(copy.contact.hoursTitle)}</h3>`);
  L.push(`          <ul>${copy.contact.hoursRows.map((h) => `<li>${esc(h.label)}: ${esc(h.value)}</li>`).join("")}</ul>`);
  L.push(`          <p>${esc(copy.contact.walkIn)} ${esc(copy.contact.good2know.text)}</p>`);
  L.push(`          <h3>${esc(copy.contact.reviewsTitle)} (${esc(copy.contact.reviewsSource)})</h3>`);
  for (const r of copy.contact.reviews) L.push(`          <blockquote><p>${esc(r.text)}</p><footer>${esc(r.name)}</footer></blockquote>`);
  L.push(`          <p>${esc(copy.footer.kvk)}: ${esc(contact.kvk)}. ${esc(copy.footer.btw)}: ${esc(contact.btw)}. <a href="/privacy.html">${esc(copy.footer.privacy)}</a></p>`);

  let html = readFileSync(INDEX_PATH, "utf8");
  html = upsertFaqInGraph(html, faqNode);
  html = replaceBetween(html, "<!-- GEO-STATIC-START", "<!-- GEO-STATIC-END", L.join("\n"));
  writeFileSync(INDEX_PATH, html, "utf8");
  console.log(`generate-geo-static: FAQPage node (${qanda.length} questions) and noscript content written to index.html`);

  // 3. sitemap.xml (no changefreq / priority, hreflang for every URL that has a translation)
  const { posts } = await importJsx("src/data/posts.jsx");
  const slugify = (id) => String(id).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const self = CFG.siteUrl;
  const alt = CFG.altSiteUrl;
  // x-default is always the Dutch site
  const nlUrl = CFG.lang === "nl" ? self : alt;
  const links = (selfHref, altHref) => {
    const mk = (l, h) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${h}" />`;
    const pair = CFG.lang === "nl" ? [["nl", selfHref], [CFG.altLang, altHref]] : [[CFG.altLang, altHref], [CFG.lang, selfHref]];
    const xdef = CFG.lang === "nl" ? selfHref : altHref;
    return [...pair.map(([l, h]) => mk(l, h)), mk("x-default", xdef)].join("\n");
  };
  const urls = [];
  const active = posts.filter((p) => p.attivo);
  const latest = active.map((p) => p.data).sort().pop() || CFG.contentUpdated;
  urls.push(`  <url>\n    <loc>${self}/</loc>\n    <lastmod>${CFG.contentUpdated > latest ? CFG.contentUpdated : latest}</lastmod>\n${links(self + "/", alt + "/")}\n  </url>`);
  for (const p of active) {
    const altId = CFG.postAlternates && CFG.postAlternates[p.id];
    const loc = `${self}/post/${slugify(p.id)}.html`;
    const hl = altId ? "\n" + links(loc, `${alt}/post/${slugify(altId)}.html`) : "";
    urls.push(`  <url>\n    <loc>${loc}</loc>\n    <lastmod>${p.data}</lastmod>${hl}\n  </url>`);
  }
  urls.push(`  <url>\n    <loc>${self}/privacy.html</loc>\n    <lastmod>${CFG.contentUpdated}</lastmod>\n  </url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
  writeFileSync(join(ROOT, "public", "sitemap.xml"), xml, "utf8");
  console.log(`generate-geo-static: sitemap.xml written (${urls.length} URLs)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// -----------------------------------------------------------------------------
// generate-blog-pages.mjs  (v2.9 standard, adapted for S40 Fietsservice)
//
// Generates one static HTML page per active blog post (read from
// src/data/posts.jsx) and writes it to public/post/{slug}.html. Every page is an
// individual, shareable, citable URL with a share button, inline internal links,
// an automatic "read also" block (the 2 most recent other active posts) and
// a CTA. It runs automatically on every build (see package.json "build").
//
// Rules kept from the validated Casa Cavour implementation:
//  - slugify() and INTERNAL_LINK_RE are IDENTICAL in src/lib/postLinks.jsx,
//    generate-blog-noscript.mjs and this file.
//  - Internal links use the syntax [[label|post-id]] inside paragraph text.
//    The build FAILS on purpose when the id does not exist or is not active,
//    when an id gives an empty slug, or when two ids give the same slug.
//  - posts.jsx contains plain JS objects only, so it is imported as an ES module.
//
// Adaptations for this site:
//  - Brand, language, locale, URLs and UI strings come from site.config.json,
//    so this file is identical in the NL and EN repositories.
//  - Internal links are root-relative (/post/slug.html) so they also work on
//    staging URLs. Canonical, Open Graph and JSON-LD use the absolute siteUrl.
//  - Page styling follows the S40 design system tokens (dark theme, Saira).
//  - Block types: paragrafo, titoletto, link, download, immagine, logo, emblema.
//  - No em dash anywhere in generated text.
// -----------------------------------------------------------------------------

import { readFileSync, writeFileSync, copyFileSync, unlinkSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const CFG = JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));
const POSTS_PATH = join(ROOT, "src", "data", "posts.jsx");
const OUT_DIR = join(ROOT, "public", "post");

const SITE_URL = CFG.siteUrl;
const BRAND = CFG.brand;
const UI = CFG.ui;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
const escapeAttr = escapeHtml;

function slugify(id) {
  return String(id)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const INTERNAL_LINK_RE = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;

function renderParagraphWithLinks(testo, idToSlug) {
  let result = "";
  let lastIndex = 0;
  let match;
  INTERNAL_LINK_RE.lastIndex = 0;
  while ((match = INTERNAL_LINK_RE.exec(testo)) !== null) {
    const [, label, targetId] = match;
    result += escapeHtml(testo.slice(lastIndex, match.index));
    const slug = idToSlug.get(targetId);
    if (!slug) {
      throw new Error(
        `generate-blog-pages: internal link to id "${targetId}" not found among active posts (label: "${label}"). Fix the id in src/data/posts.jsx.`
      );
    }
    const href = `/post/${slug}.html`;
    result += `<a class="inline-link" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    lastIndex = INTERNAL_LINK_RE.lastIndex;
  }
  result += escapeHtml(testo.slice(lastIndex));
  return result;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(CFG.locale, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

async function loadPosts() {
  const tmpPath = join(ROOT, "src", `_posts-tmp-pages-${Date.now()}.mjs`);
  copyFileSync(POSTS_PATH, tmpPath);
  try {
    const mod = await import(pathToFileURL(tmpPath).href);
    return mod.posts;
  } finally {
    unlinkSync(tmpPath);
  }
}

function renderContentBlock(b, idToSlug) {
  if (b.tipo === "paragrafo") return `      <p>${renderParagraphWithLinks(b.testo, idToSlug)}</p>`;
  if (b.tipo === "titoletto") return `      <h2>${escapeHtml(b.testo)}</h2>`;
  if (b.tipo === "immagine") {
    return `      <figure><img src="${escapeAttr(b.testo)}" alt="${escapeAttr(b.etichetta || "")}" loading="lazy" />${
      b.etichetta ? `<figcaption>${escapeHtml(b.etichetta)}</figcaption>` : ""
    }</figure>`;
  }
  if (b.tipo === "emblema") {
    return `      <figure class="fig-emblem"><img src="${escapeAttr(b.testo)}" alt="${escapeAttr(b.etichetta || "")}" width="345" height="533" loading="lazy" /></figure>`;
  }
  if (b.tipo === "logo") {
    return `      <figure class="fig-logo"><img src="${escapeAttr(b.testo)}" alt="${escapeAttr(b.etichetta || "")}" width="250" height="40" loading="lazy" /></figure>`;
  }
  if (b.tipo === "link") {
    const label = b.etichetta ? b.etichetta : b.testo;
    return `      <p><a class="btn-link" href="${escapeAttr(b.testo)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} &#8599;</a></p>`;
  }
  if (b.tipo === "download") {
    const parts = [];
    if (b.src1) parts.push(`<a class="btn-link" href="${escapeAttr(b.src1)}" download>&#8595; ${escapeHtml(b.label1 || "Download")}</a>`);
    if (b.src2) parts.push(`<a class="btn-link" href="${escapeAttr(b.src2)}" download>&#8595; ${escapeHtml(b.label2 || "Download")}</a>`);
    return `      <p>${parts.join(" ")}</p>`;
  }
  return null;
}

// Automatic "read also": the 2 most recent active posts different from the current one.
function renderReadAlso(post, ordered) {
  const others = ordered.filter((p) => p.id !== post.id).slice(0, 2);
  if (others.length === 0) return "";
  const items = others
    .map((p) => `        <li><a href="/post/${p.slug}.html">${escapeHtml(p.titolo)}</a></li>`)
    .join("\n");
  return `      <aside class="read-also">
        <h2>${escapeHtml(UI.readAlso)}</h2>
        <ul>
${items}
        </ul>
      </aside>`;
}

// hreflang links to the same article in the other language repo (see postAlternates in site.config.json)
function renderAlternates(post, url) {
  const altId = CFG.postAlternates && CFG.postAlternates[post.id];
  if (!altId) return "";
  const altUrl = `${CFG.altSiteUrl}/post/${slugify(altId)}.html`;
  const nlUrl = CFG.lang === "nl" ? url : altUrl;
  const pairs = CFG.lang === "nl" ? [["nl", url], [CFG.altLang, altUrl]] : [[CFG.altLang, altUrl], [CFG.lang, url]];
  return [...pairs, ["x-default", nlUrl]]
    .map(([l, h]) => `    <link rel="alternate" hreflang="${l}" href="${escapeAttr(h)}" />`)
    .join("\n");
}

// Author of every post: the person set in site.config.json ("author"). Falls back to the organisation.
// The @id matches the Person node of the homepage graph, so engines link both to one entity.
function authorNode() {
  const a = CFG.author;
  if (!a) return { "@type": "Organization", name: BRAND, url: SITE_URL };
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#wojtek`,
    name: a.name,
    alternateName: a.alternateName,
    jobTitle: a.jobTitle,
    worksFor: { "@type": "Organization", name: BRAND, url: SITE_URL },
    sameAs: a.sameAs,
  };
}

function renderPage(post, idToSlug, ordered) {
  const url = `${SITE_URL}/post/${post.slug}.html`;
  // Optional SEO fields: metaTitolo (full <title>, about 60 characters) and metaDescrizione (about 155 characters).
  // Fallbacks keep older posts working: title + brand, and the summary.
  const title = post.metaTitolo || `${post.titolo} | ${BRAND}`;
  const description = post.metaDescrizione || post.sommario;
  const dateIso = new Date(post.data).toISOString();

  const bodyBlocks = post.contenuto.map((b) => renderContentBlock(b, idToSlug)).filter(Boolean).join("\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titolo,
    description: post.sommario,
    inLanguage: CFG.lang,
    datePublished: post.data,
    dateModified: post.data,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: [`${SITE_URL}/og-image.jpg`],
    author: authorNode(),
    publisher: { "@type": "Organization", name: BRAND, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` } },
  };
  const jsonLdStr = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="${CFG.lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=3" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <link rel="canonical" href="${escapeAttr(url)}" />
${renderAlternates(post, url)}
    <link rel="preload" href="/fonts/SairaCondensed-ExtraBold.woff2" as="font" type="font/woff2" crossorigin />

    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeAttr(post.titolo)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:url" content="${escapeAttr(url)}" />
    <meta property="og:site_name" content="${escapeAttr(BRAND)}" />
    <meta property="og:image" content="${SITE_URL}/og-image.jpg" />
    <meta property="article:published_time" content="${dateIso}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(post.titolo)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/og-image.jpg" />

    <script type="application/ld+json">${jsonLdStr}</script>

    <script async src="https://www.googletagmanager.com/gtag/js?id=${CFG.gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${CFG.gaId}', { anonymize_ip: true, client_storage: 'none' });
    </script>
    <!-- AI referral tracking: registra le visite arrivate da assistenti AI come evento GA4 -->
    <script>
    (function () {
      var AI = [
        { s: "chatgpt",    d: ["chat.openai.com", "chatgpt.com"] },
        { s: "perplexity", d: ["perplexity.ai"] },
        { s: "claude",     d: ["claude.ai"] },
        { s: "gemini",     d: ["gemini.google.com", "bard.google.com"] },
        { s: "copilot",    d: ["copilot.microsoft.com"] },
        { s: "you",        d: ["you.com"] },
        { s: "phind",      d: ["phind.com"] },
        { s: "meta-ai",    d: ["meta.ai"] }
      ];
      function host(u) { try { return new URL(u).hostname.toLowerCase(); } catch (e) { return ""; } }
      function fromRef() {
        var h = host(document.referrer);
        if (!h) return null;
        for (var i = 0; i < AI.length; i++) {
          for (var j = 0; j < AI[i].d.length; j++) {
            var d = AI[i].d[j];
            if (h === d || h.endsWith("." + d)) return { source: AI[i].s, confidence: "high" };
          }
        }
        return null;
      }
      function fromParam() {
        var p = new URLSearchParams(location.search);
        var r = (p.get("ref") || p.get("via") || "").toLowerCase();
        if (!r) return null;
        for (var i = 0; i < AI.length; i++) {
          if (r.indexOf(AI[i].s) !== -1) return { source: AI[i].s, confidence: "low" };
        }
        return null;
      }
      var hit = fromRef() || fromParam();
      if (!hit) return;
      function send() {
        if (typeof window.gtag !== "function") return;
        window.gtag("event", "ai_referral", {
          ai_source: hit.source,
          confidence: hit.confidence,
          landing_page: location.pathname
        });
      }
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", send);
      else send();
    })();
    </script>

    <style>
      @font-face{font-family:"Saira Condensed";src:url("/fonts/SairaCondensed-ExtraBold.woff2") format("woff2");font-weight:800;font-display:swap}
      @font-face{font-family:"Saira Condensed";src:url("/fonts/SairaCondensed-Black.woff2") format("woff2");font-weight:900;font-display:swap}
      @font-face{font-family:"Saira";src:url("/fonts/Saira-Variable.woff2") format("woff2");font-weight:100 900;font-display:swap}
      :root{--green:#76A776;--green-400:#8FB78F;--green-300:#A7C7A7;--bg:#202225;--surface:#2A2D31;--line:#4C4F52;--text:#FFFFFF;--muted:#BBBCBD;--ink:#17191B;--ease:cubic-bezier(.2,.8,.2,1);}
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html{-webkit-text-size-adjust:100%;}
      body{background:var(--bg);color:var(--text);font-family:"Saira",system-ui,sans-serif;font-size:17px;line-height:1.7;-webkit-font-smoothing:antialiased;}
      a{color:var(--green-400);}
      a:focus-visible,button:focus-visible{outline:2px solid var(--green-400);outline-offset:3px;}
      .bar{border-bottom:1px solid var(--line);background:var(--surface);}
      .bar-in{max-width:1240px;margin:0 auto;padding:0 clamp(20px,4vw,48px);min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
      .bar img{height:34px;width:auto;display:block;}
      .wrap{max-width:760px;margin:0 auto;padding:clamp(32px,6vw,64px) clamp(20px,4vw,32px) 80px;}
      .top-nav{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:40px;font-family:"Saira Condensed",sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:15px;}
      .top-nav a{text-decoration:none;color:var(--green-400);}
      .top-nav a:hover{color:var(--green-300);}
      .share-btn{background:transparent;border:2px solid var(--green);color:var(--green-400);font:inherit;padding:8px 18px;cursor:pointer;border-radius:2px;min-height:44px;transition:background .12s var(--ease),color .12s var(--ease);}
      .share-btn:hover{background:var(--green);color:var(--ink);}
      .cat{display:inline-block;font-family:"Saira Condensed",sans-serif;font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--green-400);border:1px solid var(--green);padding:3px 10px;margin-right:12px;border-radius:2px;}
      time,.byline{font-size:14px;color:var(--muted);}
      .byline::before{content:"\\00b7";margin:0 8px;}
      h1{font-family:"Saira Condensed",sans-serif;font-weight:900;text-transform:uppercase;font-size:clamp(36px,6vw,60px);line-height:.98;letter-spacing:.005em;margin:18px 0 16px;}
      .sommario{font-size:19px;line-height:1.55;color:var(--green-300);padding-bottom:28px;margin-bottom:12px;border-bottom:1px solid var(--line);}
      h2{font-family:"Saira Condensed",sans-serif;font-weight:800;text-transform:uppercase;font-size:clamp(26px,3.4vw,32px);line-height:1.05;letter-spacing:.01em;margin:40px 0 12px;}
      p{color:#DDDDDE;margin-bottom:18px;}
      figure{margin:28px 0;}
      figure img{display:block;width:100%;height:auto;border-radius:2px;}
      figure.fig-logo{margin:20px 0 4px;}
      figure.fig-logo img{display:inline-block;width:150px;height:auto;background:#fff;padding:10px 16px;box-sizing:content-box;}
      figure.fig-emblem{margin:28px 0;}
      figure.fig-emblem img{display:block;width:auto;height:260px;}
      figcaption{font-size:14px;color:var(--muted);margin-top:8px;}
      .btn-link{display:inline-block;color:var(--ink);background:var(--green);padding:12px 22px;font-family:"Saira Condensed",sans-serif;font-weight:800;font-size:18px;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border-radius:2px;margin:4px 8px 4px 0;}
      .btn-link:hover{background:var(--green-400);}
      .inline-link{text-decoration:underline;text-decoration-color:rgba(143,183,143,.5);text-underline-offset:3px;}
      .inline-link:hover{text-decoration-color:var(--green-300);}
      .read-also ul{list-style:none;}
      .read-also li{border-top:1px solid var(--line);}
      .read-also li:last-child{border-bottom:1px solid var(--line);}
      .read-also a{display:block;padding:14px 0;text-decoration:none;color:var(--text);font-weight:600;}
      .read-also a:hover{color:var(--green-300);}
      .cta{margin-top:56px;padding:28px;background:var(--surface);border-left:6px solid var(--green);border-radius:2px;}
      .cta h2{margin:0 0 8px;}
      .cta p{margin-bottom:16px;}
      .follow{margin-top:28px;font-size:15px;color:var(--muted);}
      footer{margin-top:48px;padding-top:24px;border-top:1px solid var(--line);}
      footer a{font-family:"Saira Condensed",sans-serif;font-weight:800;font-size:15px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;}
      @media (prefers-reduced-motion:reduce){*{transition:none!important;}}
    </style>
  </head>
  <body>
    <header class="bar"><div class="bar-in"><a href="/" aria-label="${escapeAttr(BRAND)}"><img src="/assets/s40-lockup-horizontal-reversed.svg?v=3" alt="${escapeAttr(BRAND)}" width="140" height="34" /></a></div></header>
    <div class="wrap">
      <div class="top-nav">
        <a href="${escapeAttr(UI.backHref)}">&larr; ${escapeHtml(UI.back)}</a>
        <button type="button" class="share-btn" id="share-btn">${escapeHtml(UI.share)} &#8599;</button>
      </div>
      <article>
      <span class="cat">${escapeHtml(post.categoria)}</span>
      <time datetime="${escapeAttr(post.data)}">${escapeHtml(formatDate(post.data))}</time>${CFG.author && UI.byline ? `\n      <span class="byline">${escapeHtml(UI.byline)}</span>` : ""}
      <h1>${escapeHtml(post.titolo)}</h1>
      <p class="sommario">${escapeHtml(post.sommario)}</p>
${bodyBlocks}
      </article>
${renderReadAlso(post, ordered)}
      <div class="cta">
        <h2>${escapeHtml(UI.ctaTitle)}</h2>
        <p>${escapeHtml(UI.ctaText)}</p>
        <a class="btn-link" href="${escapeAttr(UI.ctaHref)}">${escapeHtml(UI.ctaLabel)}</a>
      </div>
      <p class="follow">${escapeHtml(UI.followText)} <a href="${escapeAttr(CFG.instagramUrl)}" target="_blank" rel="noopener noreferrer">@s40service</a></p>
      <footer><a href="/">${escapeHtml(UI.footerHome)}</a></footer>
    </div>
    <script>
      (function () {
        var btn = document.getElementById("share-btn");
        if (!btn) return;
        var url = ${JSON.stringify(url)};
        var title = ${JSON.stringify(post.titolo).replace(/</g, "\\u003c")};
        var text = ${JSON.stringify(post.sommario).replace(/</g, "\\u003c")};
        var defaultLabel = btn.textContent;
        btn.addEventListener("click", async function () {
          // url is also included in "text": some clients (e.g. mail apps) only read text.
          var shareData = { title: title, text: text + "\\n\\n" + url };
          if (navigator.share) {
            try { await navigator.share(shareData); } catch (e) {}
            return;
          }
          try {
            await navigator.clipboard.writeText(url);
            btn.textContent = ${JSON.stringify(UI.shareCopied)} + " \\u2713";
            setTimeout(function () { btn.textContent = defaultLabel; }, 2000);
          } catch (e) {
            window.prompt(${JSON.stringify(UI.sharePrompt)}, url);
          }
        });
      })();
    </script>
  </body>
</html>
`;
}

async function main() {
  const posts = await loadPosts();
  const visibili = posts.filter((p) => p.attivo);

  if (visibili.length === 0) {
    console.warn("generate-blog-pages: no active posts found, no pages generated.");
    return;
  }

  const seen = new Map();
  for (const p of visibili) {
    const slug = slugify(p.id);
    if (!slug) {
      throw new Error(`generate-blog-pages: id "${p.id}" gives an empty slug, fix the id in src/data/posts.jsx.`);
    }
    if (seen.has(slug)) {
      throw new Error(`generate-blog-pages: slug collision "${slug}" between ids "${seen.get(slug)}" and "${p.id}". Fix one of the ids in src/data/posts.jsx.`);
    }
    seen.set(slug, p.id);
    p.slug = slug;
  }

  const idToSlug = new Map(visibili.map((p) => [p.id, p.slug]));
  const ordered = [...visibili].sort((a, b) => new Date(b.data) - new Date(a.data));

  mkdirSync(OUT_DIR, { recursive: true });

  // Remove orphan pages (deactivated or renamed posts) so public/post mirrors the active posts.
  const attesi = new Set(visibili.map((p) => `${p.slug}.html`));
  for (const f of readdirSync(OUT_DIR)) {
    if (f.endsWith(".html") && !attesi.has(f)) unlinkSync(join(OUT_DIR, f));
  }

  for (const post of visibili) {
    writeFileSync(join(OUT_DIR, `${post.slug}.html`), renderPage(post, idToSlug, ordered), "utf8");
  }
  console.log(`generate-blog-pages: generated ${visibili.length} pages in public/post/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

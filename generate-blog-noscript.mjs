// -----------------------------------------------------------------------------
// generate-blog-noscript.mjs  (v2 standard, adapted for S40 Fietsservice)
//
// Writes the full text of every active blog post (from src/data/posts.jsx) into
// the static <noscript> block of index.html, between the markers
// BLOG-STATIC-START / BLOG-STATIC-END. Crawlers that do not execute JavaScript
// (many AI crawlers) then still read the articles.
//
// v2: internal links [[label|id]] are resolved to <a href="/post/{slug}.html">
// with the same regex and slugify as generate-blog-pages.mjs. An unknown or
// inactive id fails the build.
//
// Adaptations: brand, locale, UI strings and siteUrl come from site.config.json
// (identical script in the NL and EN repositories). Links are root-relative.
// -----------------------------------------------------------------------------

import { readFileSync, writeFileSync, copyFileSync, unlinkSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const CFG = JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));
const POSTS_PATH = join(ROOT, "src", "data", "posts.jsx");
const INDEX_PATH = join(ROOT, "index.html");

const START_MARKER = "<!-- BLOG-STATIC-START (generated automatically by generate-blog-noscript.mjs, do not edit by hand) -->";
const END_MARKER = "<!-- BLOG-STATIC-END -->";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
    const [full, label, targetId] = match;
    result += escapeHtml(testo.slice(lastIndex, match.index));
    const slug = idToSlug.get(targetId);
    if (!slug) {
      throw new Error(
        `generate-blog-noscript: internal link to id "${targetId}" not found among active posts (label: "${label}"). Fix the id in src/data/posts.jsx.`
      );
    }
    result += `<a href="${escapeHtml(`/post/${slug}.html`)}">${escapeHtml(label)}</a>`;
    lastIndex = match.index + full.length;
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
  const tmpPath = join(ROOT, "src", `_posts-tmp-${Date.now()}.mjs`);
  copyFileSync(POSTS_PATH, tmpPath);
  try {
    const mod = await import(pathToFileURL(tmpPath).href);
    return mod.posts;
  } finally {
    unlinkSync(tmpPath);
  }
}

function renderArticle(post, idToSlug) {
  const blocks = post.contenuto
    .map((b) => {
      if (b.tipo === "paragrafo") return `      <p>${renderParagraphWithLinks(b.testo, idToSlug)}</p>`;
      if (b.tipo === "titoletto") return `      <h4>${escapeHtml(b.testo)}</h4>`;
      // "link", "download" and "immagine" are navigation / visual elements, omitted on purpose.
      return null;
    })
    .filter(Boolean)
    .join("\n");

  return [
    `    <article>`,
    `      <h3><a href="/post/${slugify(post.id)}.html">${escapeHtml(post.titolo)}</a></h3>`,
    `      <time datetime="${escapeHtml(post.data)}">${escapeHtml(formatDate(post.data))}</time>`,
    `      <p><em>${escapeHtml(post.sommario)}</em></p>`,
    blocks,
    `    </article>`,
  ].join("\n");
}

async function main() {
  const posts = await loadPosts();
  const visibili = posts.filter((p) => p.attivo).sort((a, b) => new Date(b.data) - new Date(a.data));

  if (visibili.length === 0) {
    console.warn("generate-blog-noscript: no active posts found, block not generated.");
    return;
  }

  const idToSlug = new Map(visibili.map((p) => [p.id, slugify(p.id)]));
  const articlesHtml = visibili.map((p) => renderArticle(p, idToSlug)).join("\n\n");

  const generated = [START_MARKER, `    <h2>${escapeHtml(CFG.ui.noscriptBlogTitle)}</h2>`, articlesHtml, END_MARKER].join("\n");

  const html = readFileSync(INDEX_PATH, "utf8");
  const startIdx = html.indexOf(START_MARKER);
  const endIdx = html.indexOf(END_MARKER);

  let newHtml;
  if (startIdx !== -1 && endIdx !== -1) {
    newHtml = html.slice(0, startIdx) + generated + html.slice(endIdx + END_MARKER.length);
  } else {
    const closingRe = /(\s*)<\/article>(\s*)<\/main>(\s*)<\/noscript>/;
    const match = html.match(closingRe);
    if (!match) {
      throw new Error(
        "generate-blog-noscript: cannot find the expected insertion point in index.html (closing </article></main></noscript>). Check the file structure."
      );
    }
    const [full, ws1, ws2, ws3] = match;
    const replacement = `${ws1}</article>\n\n${generated}${ws2}</main>${ws3}</noscript>`;
    newHtml = html.slice(0, match.index) + replacement + html.slice(match.index + full.length);
  }

  writeFileSync(INDEX_PATH, newHtml, "utf8");
  console.log(`generate-blog-noscript: inserted ${visibili.length} posts in the static block of index.html`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

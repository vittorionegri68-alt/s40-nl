// Internal blog links and slugs.
// slugify() and INTERNAL_LINK_RE must stay IDENTICAL to generate-blog-pages.mjs and
// generate-blog-noscript.mjs, so link targets and static page file names stay in sync.
import React from "react";

export function slugify(id) {
  return String(id)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const INTERNAL_LINK_RE = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;

// Turns "text [[label|post-id]] text" into React nodes with real links to /post/<slug>.html
export function renderTestoConLink(testo) {
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  INTERNAL_LINK_RE.lastIndex = 0;
  while ((match = INTERNAL_LINK_RE.exec(testo)) !== null) {
    if (match.index > lastIndex) parts.push(testo.slice(lastIndex, match.index));
    const [, label, targetId] = match;
    parts.push(
      <a key={key++} className="inline-link" href={`/post/${slugify(targetId)}.html`} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
    lastIndex = INTERNAL_LINK_RE.lastIndex;
  }
  if (lastIndex < testo.length) parts.push(testo.slice(lastIndex));
  return parts;
}

// Web Share API with clipboard fallback. Returns "shared" | "copied" | "failed".
export async function sharePost(post, url, text) {
  const shareData = { title: post.titolo, text: `${post.sommario}\n\n${url}` };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (e) {
      /* user cancelled */
    }
    return "shared";
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch (e) {
    window.prompt(text, url);
    return "failed";
  }
}

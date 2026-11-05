import React, { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import Button from "../components/Button.jsx";
import { copy } from "../config/copy.js";
import { contact } from "../config/contact_info.js";
import { site } from "../config/site_config.js";
import { posts } from "../data/posts.jsx";
import { renderTestoConLink, slugify, sharePost } from "../lib/postLinks.jsx";

const active = posts.filter((p) => p.attivo).sort((a, b) => new Date(b.data) - new Date(a.data));
const fmt = (iso) => new Date(iso).toLocaleDateString(site.locale, { year: "numeric", month: "long", day: "numeric" });

function Article({ post, onClose, onOpenOther }) {
  const c = copy.news;
  const [msg, setMsg] = useState("");
  const closeRef = useRef(null);
  const url = `${site.siteUrl}/post/${slugify(post.id)}.html`;
  const others = active.filter((p) => p.id !== post.id).slice(0, 2);

  useEffect(() => {
    closeRef.current && closeRef.current.focus();
  }, [post.id]);

  const share = async () => {
    const res = await sharePost(post, url, c.sharePrompt);
    if (res === "copied") {
      setMsg(c.copied);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  return (
    <div className="reader" role="dialog" aria-modal="true" aria-labelledby="reader-title" data-native-scroll>
      <div className="reader__bar">
        <button ref={closeRef} type="button" className="reader__close" onClick={onClose}>
          <Icon name="x" size={20} strokeWidth={2.6} /> {c.close}
        </button>
        <div className="reader__tools">
          <a href={`/post/${slugify(post.id)}.html`} className="reader__link">{c.openPage}</a>
          <button type="button" className="reader__share" onClick={share}>
            <Icon name="share" size={18} strokeWidth={2.4} /> {msg || c.share}
          </button>
        </div>
      </div>
      <article className="reader__body">
        <p className="reader__meta">
          <span className="tag">{post.categoria}</span> <time dateTime={post.data}>{fmt(post.data)}</time>
        </p>
        <h2 id="reader-title" className="reader__title">{post.titolo}</h2>
        <p className="reader__sum">{post.sommario}</p>
        {post.contenuto.map((b, i) => {
          if (b.tipo === "paragrafo") return <p key={i}>{renderTestoConLink(b.testo)}</p>;
          if (b.tipo === "titoletto") return <h3 key={i}>{b.testo}</h3>;
          if (b.tipo === "immagine")
            return (
              <figure key={i}>
                <img src={b.testo} alt={b.etichetta || ""} loading="lazy" />
                {b.etichetta ? <figcaption>{b.etichetta}</figcaption> : null}
              </figure>
            );
          if (b.tipo === "logo")
            return (
              <figure key={i} className="fig-logo">
                <img src={b.testo} alt={b.etichetta || ""} width="250" height="40" loading="lazy" />
              </figure>
            );
          if (b.tipo === "link")
            return (
              <p key={i}>
                <Button href={b.testo} external variant="primary" icon="arrow-up-right" size="sm">{b.etichetta || b.testo}</Button>
              </p>
            );
          return null;
        })}
        {others.length > 0 && (
          <aside className="reader__also">
            <h3>{c.readAlso}</h3>
            <ul>
              {others.map((o) => (
                <li key={o.id}>
                  <a href={`/post/${slugify(o.id)}.html`} onClick={(e) => { e.preventDefault(); onOpenOther(o.id); }}>{o.titolo}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <div className="reader__cta">
          <h3>{c.ctaTitle}</h3>
          <p>{c.ctaText}</p>
          <Button href="#contact" onClick={onClose}>{c.ctaLabel}</Button>
        </div>
      </article>
    </div>
  );
}

export default function News() {
  const c = copy.news;
  const [openId, setOpenId] = useState(null);
  const lastFocus = useRef(null);
  const post = active.find((p) => p.id === openId);

  useEffect(() => {
    document.body.classList.toggle("reader-open", !!post);
    document.documentElement.style.overflow = post ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [post]);

  const open = (id, el) => {
    lastFocus.current = el;
    setOpenId(id);
  };
  const close = () => {
    setOpenId(null);
    setTimeout(() => lastFocus.current && lastFocus.current.focus && lastFocus.current.focus(), 0);
  };

  return (
    <section id={c.id} data-block data-theme="light" className="block block--light" aria-labelledby="news-h2">
      <div className="container">
        <header className="sechead reveal">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="news-h2" className="h2">{c.title}</h2>
          <p className="lead">{c.intro}</p>
        </header>

        <div className="news">
          <ul className="posts">
            {active.map((p, i) => (
              <li key={p.id} className="post reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                <button type="button" onClick={(e) => open(p.id, e.currentTarget)} aria-label={`${c.read}: ${p.titolo}`}>
                  <span className="post__meta"><span className="tag">{p.categoria}</span> <time dateTime={p.data}>{fmt(p.data)}</time></span>
                  <span className="post__title">{p.titolo}</span>
                  <span className="post__sum">{p.sommario}</span>
                  <span className="post__more">{c.read} <Icon name="arrow-right" size={18} strokeWidth={2.6} /></span>
                </button>
              </li>
            ))}
          </ul>

          <aside className="events reveal">
            <h3 className="events__title">{c.events.title}</h3>
            <p>{c.events.text}</p>
            <ul>
              {c.events.items.map((e) => (
                <li key={e.t}>
                  <Icon name={e.icon} size={22} />
                  <div><strong>{e.t}</strong><span>{e.d}</span></div>
                </li>
              ))}
            </ul>
            <p className="events__note">{c.events.note}</p>
            <div className="events__follow">
              <h4>{c.follow.title}</h4>
              <p>{c.follow.text}</p>
              <Button href={contact.instagram} external icon="instagram">{c.follow.cta}</Button>
            </div>
          </aside>
        </div>
      </div>
      {post && <Article post={post} onClose={close} onOpenOther={(id) => setOpenId(id)} />}
    </section>
  );
}

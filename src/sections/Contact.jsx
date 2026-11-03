import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import Button from "../components/Button.jsx";
import MapFacade from "../components/MapFacade.jsx";
import OpenNow from "../components/OpenNow.jsx";
import Footer from "../components/Footer.jsx";
import { copy } from "../config/copy.js";
import { contact, mailtoBase } from "../config/contact_info.js";

// Appointment form: no server. It builds a mailto: link to the shop email and opens the visitor's mail app.
export default function Contact() {
  const c = copy.contact;
  const f = c.form;
  const [v, setV] = useState({ name: "", phone: "", email: "", bike: "", service: f.serviceOptions[0], when: "", message: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!v.name.trim() || !v.message.trim()) {
      setErr(f.required);
      return;
    }
    setErr("");
    const L = f.lines;
    const rows = [
      [L.name, v.name],
      [L.phone, v.phone],
      [L.email, v.email],
      [L.bike, v.bike],
      [L.service, v.service],
      [L.when, v.when],
      [L.message, v.message],
    ].filter(([, val]) => String(val).trim());
    const body = rows.map(([k, val]) => `${k}: ${val}`).join("\r\n");
    const href = `${mailtoBase}?subject=${encodeURIComponent(`${f.subject} - ${v.name.trim()}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
  };

  return (
    <section id={c.id} data-block data-theme="dark" className="block block--dark block--contact" aria-labelledby="contact-h2">
      <div className="container contact">
        <div className="contact__form">
          <header className="sechead reveal">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="contact-h2" className="h2">{c.title}</h2>
            <p className="lead">{c.intro}</p>
          </header>
          <form className="form reveal" onSubmit={submit} noValidate>
            <div className="form__row">
              <label>{f.name}<input type="text" name="name" autoComplete="name" required value={v.name} onChange={set("name")} /></label>
              <label>{f.phone}<input type="tel" name="phone" autoComplete="tel" value={v.phone} onChange={set("phone")} /></label>
            </div>
            <div className="form__row">
              <label>{f.email}<input type="email" name="email" autoComplete="email" value={v.email} onChange={set("email")} /></label>
              <label>{f.bike}<input type="text" name="bike" placeholder={f.bikePlaceholder} value={v.bike} onChange={set("bike")} /></label>
            </div>
            <div className="form__row">
              <label>{f.service}
                <select name="service" value={v.service} onChange={set("service")}>
                  {f.serviceOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
              <label>{f.when}<input type="text" name="when" value={v.when} onChange={set("when")} /></label>
            </div>
            <label>{f.message}<textarea name="message" rows="4" required value={v.message} onChange={set("message")} /></label>
            {err && <p className="form__err" role="alert">{err}</p>}
            <div className="form__foot">
              <Button type="submit" icon="mail">{f.submit}</Button>
              <p className="form__hint">{f.hint} <a href={mailtoBase}>{contact.email}</a></p>
            </div>
            {sent && <p className="form__sent" role="status"><Icon name="check" size={18} strokeWidth={3} /> {c.sentNote}</p>}
          </form>
        </div>

        <div className="contact__info">
          <div className="infocard reveal">
            <h3 className="h4">{c.sideTitle}</h3>
            <p>{c.sideText}</p>
            <ul className="infolist">
              <li><Icon name="phone" size={20} /><a href={contact.phoneHref}>{contact.phone}</a></li>
              <li><Icon name="mail" size={20} /><a href={mailtoBase}>{contact.email}</a></li>
              <li><Icon name="instagram" size={20} /><a href={contact.instagram} target="_blank" rel="noopener noreferrer">{contact.instagramHandle}</a></li>
              <li><Icon name="map-pin" size={20} /><address>{contact.brand}<br />{contact.street}<br />{contact.postalCode} {contact.city}</address></li>
            </ul>
          </div>

          <div className="infocard reveal">
            <h3 className="h4">{c.hoursTitle} <OpenNow /></h3>
            <table className="hours">
              <tbody>
                {c.hoursRows.map((r) => (
                  <tr key={r.label}><th scope="row">{r.label}</th><td>{r.value}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="hours__walk">{c.walkIn}</p>
            <p className="hours__know"><strong>{c.good2know.title}.</strong> {c.good2know.text}</p>
          </div>

          <MapFacade />
        </div>

        <div className="reviews reveal">
          <h3 className="h4">{c.reviewsTitle} <small>{c.reviewsSource}</small></h3>
          <ul>
            {c.reviews.map((r) => (
              <li key={r.name}>
                <blockquote>
                  <p>&ldquo;{r.text}&rdquo;</p>
                  <footer>{r.name}{r.note ? <span> &middot; {r.note}</span> : null}</footer>
                </blockquote>
              </li>
            ))}
          </ul>
          <a className="reviews__more" href={contact.gbp} target="_blank" rel="noopener noreferrer">{copy.footer.google} <Icon name="arrow-up-right" size={16} strokeWidth={2.6} /></a>
        </div>
      </div>
      <Footer />
    </section>
  );
}

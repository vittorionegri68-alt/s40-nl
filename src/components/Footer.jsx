import React from "react";
import Icon from "./Icon.jsx";
import { copy } from "../config/copy.js";
import { contact, mailtoBase } from "../config/contact_info.js";
import { site } from "../config/site_config.js";

export default function Footer() {
  const c = copy.footer;
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__in">
        <div className="footer__brand">
          <img src="/assets/s40-lockup-horizontal-reversed.svg?v=3" alt={contact.brand} width="170" height="45" loading="lazy" />
          <p>{c.tagline}</p>
        </div>
        <div>
          <h4>{contact.brand}</h4>
          <address>
            {contact.street}<br />{contact.postalCode} {contact.city}<br />
            <a href={contact.phoneHref}>{contact.phone}</a><br />
            <a href={mailtoBase}>{contact.email}</a>
          </address>
        </div>
        <div>
          <h4>{c.legal}</h4>
          <p>{contact.legalName}<br />{c.kvk}: {contact.kvk}<br />{c.btw}: {contact.btw}</p>
        </div>
        <div>
          <h4>{c.links}</h4>
          <ul>
            <li><a href={contact.gbp} target="_blank" rel="noopener noreferrer">{c.google}</a></li>
            <li><a href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={contact.linkedinCompany} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="/privacy.html">{c.privacy}</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer__base">
        <span>&copy; {year} {contact.legalName}. {c.rights}</span>
        <a href={site.authorCredit.href} target="_blank" rel="noopener noreferrer">{site.authorCredit.label}</a>
        <a href="#home" className="footer__top">{c.top} <Icon name="arrow-up-right" size={14} strokeWidth={2.6} /></a>
      </div>
    </footer>
  );
}

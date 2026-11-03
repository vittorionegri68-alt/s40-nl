# Handover notes

Written for the S40 Fietsservice team. Version 1.0, 3 November 2026.

## What you receive

Two repositories, one per language: `s40-nl` (Dutch, https://s40.nl) and `s40-en` (English, https://en.s40.nl). They are independent projects with the same structure. Each has `README_DEPLOY.md` (technical) and `docs/CONTENT_GUIDE.md` (how to change content).

Accounts for Claude, GitHub and Vercel will be created for S40 at the end of the project. Until then the sites run on the builder's staging accounts.

## What was built

One-page site with eight blocks (hero, services, about us, workshop, questions, routes, news and blog, contact), four static blog pages per language, privacy page, 404 page, sitemap, robots.txt, llms.txt and ai.txt, structured data, cookieless analytics, weather block, four downloadable road routes, and an appointment form that opens the visitor's email app.

## Open items to confirm with the client (nothing here blocks staging)

1. **Texts:** the Q&A answers, the four blog posts, the hero slogans, the route names and the heading "Every bike. Every discipline." are proposals. Wojtek should read and approve them.
2. **Facts to verify:** only these titles of Suéla Schouten are verified: 2025 World Champion Women 30-39, 2024 European Champion Cruiser Women 30-39, 2022 Dutch title Uithoorn. The text says she won "several Dutch titles". Consent for the news item is confirmed.
3. **Photo:** the crankset installation photo shows recognisable hands; Wojtek must agree to publish it.
4. **Reviews:** Google reviews are shown with initials (Manuel S., J. Volkers). Confirm that the reviewers' names may be shown. In the English site the Dutch review is a translation and says so.
5. **Team:** Michiel Frederiks is listed as shop assistant without a LinkedIn link or schedule. Confirm.
6. **Links:** the Google Business Profile link and the WhatsApp number must be verified (see go-live checklist).
7. **Elevation gain** values of the routes are estimates (73, 64, 314 and 322 m) and may differ per device. Confirm the route names.
8. **GA4:** real Measurement ID and the ai-referral snippet still to be added.
9. **Privacy statement:** simple text, to be reviewed.
10. **Hosting:** staging runs on a Vercel Hobby plan (non-commercial use). Production needs an appropriate plan.
11. **Competitor and tone sections** of the content corpus (voice, forbidden words, real tone samples, competitors) are still open.

## Phase 2 (agreed, not built)

- Newsletter with a 10 percent discount offer.
- Gravel routes.
- A server-side appointment form (replacing the mailto link).

## Principles to keep when you maintain the site

- Questions and answers stay identical everywhere they appear (they are generated from one file).
- Posts are added at the start of the list. Internal links use `[[label|id]]`.
- Write for the cyclist: say "found by ChatGPT" and similar plain words, never marketing jargon.
- Special openings are announced on Instagram (@s40service); the site only states the normal opening hours. Big races are watched on the big screen during normal opening hours.
- Do not mention e-bikes. The brand is spelled "YOONIT".

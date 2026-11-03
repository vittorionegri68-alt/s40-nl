// Site-level settings for this language version (Dutch).
export const site = {
  lang: "nl",
  locale: "nl-NL",
  brand: "S40 Fietsservice",
  siteUrl: "https://s40.nl",
  // Language switcher targets. On *.vercel.app the staging URLs are used, otherwise the final domains.
  switcher: {
    current: "NL",
    other: "EN",
    otherLabel: "English",
    otherHrefFinal: "https://en.s40.nl",
    otherHrefStaging: "https://s40-en.vercel.app",
  },
  weatherEndpoint: "/api/weather",
  authorCredit: { label: "Website door AI'm by VNS", href: "https://www.aim-vns.com" },
};

export function otherLanguageHref() {
  const s = site.switcher;
  if (typeof window !== "undefined" && /vercel\.app$/.test(window.location.hostname)) return s.otherHrefStaging;
  return s.otherHrefFinal;
}

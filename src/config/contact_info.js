// Contact and company details. Single place to update phone, email, hours, registrations.
// Opening hours: days use 0=Sunday ... 6=Saturday (JavaScript Date.getDay()).
export const contact = {
  brand: "S40 Fietsservice",
  legalName: "S40 Fietsservice B.V.",
  street: "Singel 40",
  postalCode: "3861 AE",
  city: "Nijkerk",
  country: "NL",
  phone: "+31 6 26980438",
  phoneHref: "tel:+31626980438",
  // WhatsApp link: confirm with the client that this number is on WhatsApp.
  whatsappHref: "https://wa.me/31626980438",
  email: "service@s40.nl",
  instagram: "https://www.instagram.com/s40service/",
  instagramHandle: "@s40service",
  linkedinCompany: "https://www.linkedin.com/company/s40-fietsservice/",
  // Google Business Profile link derived from the CID. VERIFY by opening it before go-live.
  gbp: "https://maps.google.com/?cid=13330340953958264063",
  kvk: "42080401",
  btw: "NL869616250B01",
  // Timezone used for the "open now" indicator
  timezone: "Europe/Amsterdam",
  hours: [
    { days: [2, 3, 4, 5], opens: "10:00", closes: "18:00" },
    { days: [6], opens: "10:00", closes: "16:00" },
  ],
  // Map: opens only after a click (no Google request before that)
  mapQuery: "S40 Fietsservice, Singel 40, 3861 AE Nijkerk",
  // Weather location (Nijkerk town centre, used only for the forecast)
  weather: { lat: 52.2236, lon: 5.4875 },
  people: {
    wojtek: { name: "Wojciech Kreński", short: "Wojtek", url: "https://www.linkedin.com/in/wojciech-kre%C5%84ski-94354910b/" },
    jaroslaw: { name: "Jaroslaw Oworuszko", short: "Jaroslaw", url: "https://www.linkedin.com/in/jaroslawoworuszko/" },
    michiel: { name: "Michiel Frederiks", short: "Michiel" },
  },
};

export const mailtoBase = `mailto:${contact.email}`;

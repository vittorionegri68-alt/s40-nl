import React, { useEffect, useState } from "react";
import { contact } from "../config/contact_info.js";
import { copy } from "../config/copy.js";

// "Open now / closed now" badge based on opening hours in the shop's timezone.
function isOpen(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: contact.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const wd = parts.find((p) => p.type === "weekday").value;
  const hh = parseInt(parts.find((p) => p.type === "hour").value, 10) % 24;
  const mm = parseInt(parts.find((p) => p.type === "minute").value, 10);
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
  const t = hh * 60 + mm;
  const toMin = (s) => parseInt(s.slice(0, 2), 10) * 60 + parseInt(s.slice(3), 10);
  return contact.hours.some((h) => h.days.includes(day) && t >= toMin(h.opens) && t < toMin(h.closes));
}

export default function OpenNow() {
  const [open, setOpen] = useState(null);
  useEffect(() => {
    setOpen(isOpen());
    const t = setInterval(() => setOpen(isOpen()), 60000);
    return () => clearInterval(t);
  }, []);
  if (open === null) return null;
  return <span className={`openbadge ${open ? "is-open" : ""}`}>{open ? copy.contact.openNow : copy.contact.closedNow}</span>;
}

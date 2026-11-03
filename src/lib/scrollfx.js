// Block pager + parallax + reveal helpers (no dependencies).
//
// PAGER: on desktop with a mouse (fine pointer, width >= 960px, no reduced motion)
// one wheel click moves exactly one block. Blocks taller than the screen scroll
// natively until their edge is reached, then the pager takes over. On touch
// devices, narrow screens and with prefers-reduced-motion the page scrolls normally
// (reveal animations still run, unless reduced motion is on).

const EASE = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createPager({ onActive }) {
  const mqDesk = window.matchMedia("(pointer: fine) and (min-width: 960px)");
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animId = 0;
  let animating = false;
  let quietUntil = 0;
  let activeIdx = -1;
  let ticking = false;

  const isOn = () => mqDesk.matches && !mqReduce.matches;
  const blocks = () => Array.from(document.querySelectorAll("[data-block]"));
  const rects = () =>
    blocks().map((el) => {
      const r = el.getBoundingClientRect();
      return { el, id: el.id, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
    });
  const blocked = () => document.body.classList.contains("reader-open") || document.body.classList.contains("menu-open");

  function current(rs) {
    const y = window.scrollY;
    const h = window.innerHeight;
    let best = 0;
    let bestOverlap = -1;
    rs.forEach((r, i) => {
      const o = Math.min(r.bottom, y + h) - Math.max(r.top, y);
      if (o > bestOverlap) {
        bestOverlap = o;
        best = i;
      }
    });
    return best;
  }

  function animateTo(target, duration = 700) {
    const start = window.scrollY;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const to = Math.max(0, Math.min(target, maxY));
    const dist = to - start;
    if (Math.abs(dist) < 2) {
      window.scrollTo(0, to);
      return;
    }
    const id = ++animId;
    animating = true;
    const t0 = performance.now();
    const dur = mqReduce.matches ? 0 : duration;
    const frame = (now) => {
      if (id !== animId) return;
      const t = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
      window.scrollTo(0, start + dist * EASE(t));
      if (t < 1) requestAnimationFrame(frame);
      else {
        animating = false;
        quietUntil = performance.now() + 130;
      }
    };
    requestAnimationFrame(frame);
  }

  // Shared decision for wheel and keyboard. dir: 1 down, -1 up; amount in px (for edge clamping).
  // Returns true when the event was handled (caller should preventDefault).
  function step(dir, amount) {
    const rs = rects();
    const i = current(rs);
    const y = window.scrollY;
    const h = window.innerHeight;
    const now = performance.now();
    if (animating || now < quietUntil) {
      quietUntil = now + 130;
      return true;
    }
    if (dir > 0) {
      const rem = rs[i].bottom - (y + h);
      if (rem > 2) {
        // inside a tall block: native scroll, but never cross the block edge in one tick
        if (rem < amount) {
          animateTo(y + rem, 220);
          return true;
        }
        return false;
      }
      if (i >= rs.length - 1) return false;
      quietUntil = now + 130;
      animateTo(rs[i + 1].top);
      return true;
    }
    const rem = y - rs[i].top;
    if (rem > 2) {
      if (rem < amount) {
        animateTo(y - rem, 220);
        return true;
      }
      return false;
    }
    if (i === 0) return false;
    const p = rs[i - 1];
    quietUntil = now + 130;
    animateTo(p.bottom - p.top <= h + 2 ? p.top : p.bottom - h);
    return true;
  }

  function onWheel(e) {
    if (!isOn() || blocked() || e.ctrlKey) return;
    if (e.target.closest && e.target.closest("[data-native-scroll]")) return;
    const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
    if (Math.abs(dy) < 2) return;
    if (step(dy > 0 ? 1 : -1, Math.abs(dy))) e.preventDefault();
  }

  function onKey(e) {
    if (!isOn() || blocked() || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && t.closest && t.closest("input, textarea, select, button, a, summary, [contenteditable='true']")) return;
    const k = e.key;
    let dir = 0;
    if (k === "ArrowDown" || k === "PageDown" || (k === " " && !e.shiftKey)) dir = 1;
    else if (k === "ArrowUp" || k === "PageUp" || (k === " " && e.shiftKey)) dir = -1;
    else if (k === "Home") {
      e.preventDefault();
      goTo(0);
      return;
    } else if (k === "End") {
      e.preventDefault();
      goTo(blocks().length - 1);
      return;
    }
    if (!dir) return;
    if (step(dir, window.innerHeight * 0.9)) e.preventDefault();
  }

  function goTo(indexOrId, instant = false) {
    const rs = rects();
    let i = typeof indexOrId === "number" ? indexOrId : rs.findIndex((r) => r.id === indexOrId);
    if (i < 0) return false;
    const t = rs[i].top;
    if (instant || !isOn()) {
      if (mqReduce.matches || instant) window.scrollTo(0, t);
      else window.scrollTo({ top: t, behavior: "smooth" });
    } else {
      animateTo(t, 900);
    }
    return true;
  }

  function reportActive() {
    ticking = false;
    const rs = rects();
    const i = current(rs);
    if (i !== activeIdx) {
      activeIdx = i;
      onActive && onActive(i, rs[i] && rs[i].id);
    }
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(reportActive);
    }
  }

  function onClick(e) {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (blocks().some((b) => b.id === id)) {
      e.preventDefault();
      document.body.classList.remove("menu-open");
      goTo(id);
      history.replaceState(null, "", "#" + id);
    }
  }

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  document.addEventListener("click", onClick);
  document.documentElement.classList.toggle("pager-on", isOn());
  const onMq = () => document.documentElement.classList.toggle("pager-on", isOn());
  mqDesk.addEventListener("change", onMq);
  mqReduce.addEventListener("change", onMq);
  reportActive();

  return {
    goTo,
    destroy() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick);
      mqDesk.removeEventListener("change", onMq);
      mqReduce.removeEventListener("change", onMq);
    },
  };
}

// PARALLAX: elements with data-parallax="0.15" move by (distance of their parent
// from the viewport centre) * speed. data-pointer="14" adds a small pointer-driven offset.
export function createParallax() {
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let els = [];
  let raf = 0;
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;

  function collect() {
    els = Array.from(document.querySelectorAll("[data-parallax], [data-pointer]"));
  }
  function frame() {
    raf = 0;
    if (mqReduce.matches) return;
    const vh = window.innerHeight;
    px += (tx - px) * 0.08;
    py += (ty - py) * 0.08;
    for (const el of els) {
      const parent = el.parentElement;
      if (!parent) continue;
      const r = parent.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const speed = parseFloat(el.dataset.parallax || "0");
      const ptr = parseFloat(el.dataset.pointer || "0");
      const d = r.top + r.height / 2 - vh / 2;
      el.style.setProperty("--py", (-d * speed).toFixed(1) + "px");
      if (ptr) {
        el.style.setProperty("--mx", (px * ptr).toFixed(1) + "px");
        el.style.setProperty("--my", (py * ptr).toFixed(1) + "px");
      }
    }
    if (Math.abs(tx - px) > 0.002 || Math.abs(ty - py) > 0.002) request();
  }
  function request() {
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function onMove(e) {
    tx = e.clientX / window.innerWidth - 0.5;
    ty = e.clientY / window.innerHeight - 0.5;
    request();
  }
  collect();
  request();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  window.addEventListener("pointermove", onMove, { passive: true });
  return {
    refresh() {
      collect();
      request();
    },
    destroy() {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    },
  };
}

// REVEAL: adds .is-in to .reveal elements when they enter the viewport.
export function createReveal() {
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("is-in"));
    return { destroy() {} };
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((e) => io.observe(e));
  return { destroy: () => io.disconnect() };
}

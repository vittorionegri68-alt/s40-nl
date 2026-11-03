import React, { useEffect, useRef } from "react";

// Custom bicycle-sprocket cursor (32px, hotspot at its centre). It rotates with the
// pointer speed and direction. Only active for fine pointers; touch devices keep
// the normal behaviour. Rotation is skipped with prefers-reduced-motion.
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    document.documentElement.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let lx = null;
    let angle = 0;
    let scale = 1;
    let raf = 0;

    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0) rotate(${angle}deg) scale(${scale})`;
    };
    const onMove = (e) => {
      if (lx !== null && !reduce) {
        const dx = e.clientX - x;
        const dy = e.clientY - y;
        angle += Math.hypot(dx, dy) * 1.2 * (dx >= 0 ? 1 : -1);
      }
      lx = e.clientX;
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onOver = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      const light = !!t.closest('[data-theme="light"]');
      el.classList.toggle("cursor--dark", light);
      const interactive = !!t.closest("a, button, summary, [role='button'], label");
      scale = interactive ? 1.45 : 1;
      el.classList.toggle("cursor--hidden", !!t.closest("input, textarea, select"));
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}

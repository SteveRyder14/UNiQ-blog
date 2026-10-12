"use client";

import { useEffect, useState } from "react";

/**
 * Small ring progress + back-to-top button. Appears after ~300px of scroll,
 * fills clockwise as you progress through the page.
 */
export default function ScrollTop() {
  const [p, setP] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      setP(Math.max(0, Math.min(1, ratio)));
      setVisible(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dash = 2 * Math.PI * 18;
  const offset = dash * (1 - p);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`scroll-top-btn fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink-900/80 text-phos backdrop-blur transition-all duration-300 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="22" cy="22" r="18" stroke="#1d2733" strokeWidth="2" fill="none" />
        <circle
          cx="22"
          cy="22"
          r="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>
      <span
        aria-hidden
        className="font-mono text-[14px] leading-none text-phos"
        style={{ transform: "translateY(-1px)" }}
      >
        ↑
      </span>
    </button>
  );
}

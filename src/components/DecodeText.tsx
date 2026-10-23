"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "0123456789ABCDEF<>/[]{}#$%&*+=";

/**
 * Heading text that decodes from hex glyphs the first time it scrolls into
 * view. A hidden copy of the real text reserves the space, so decoding never
 * shifts the layout. Runs once; skipped entirely for reduced-motion users.
 */
export default function DecodeText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<{ settled: number; noise: string } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        let frame = 0;
        const total = Math.min(24, 10 + Math.ceil(text.length / 3));
        timer = window.setInterval(() => {
          frame += 1;
          const settled = Math.floor((frame / total) * text.length);
          setState({
            settled,
            noise: Array.from(text.slice(settled), (character) =>
              character === " "
                ? character
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            ).join(""),
          });
          if (frame >= total) {
            window.clearInterval(timer);
            timer = undefined;
            setState(null);
          }
        }, 36);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) window.clearInterval(timer);
    };
  }, [text]);

  return (
    <span ref={ref} className="decode">
      <span aria-hidden="true" className={state ? "decode-ghost" : undefined}>
        {text}
      </span>
      {state && (
        <span className="decode-layer" aria-hidden="true">
          {text.slice(0, state.settled)}
          <span className="decode-noise">{state.noise}</span>
        </span>
      )}
      <span className="sr-only">{text}</span>
    </span>
  );
}

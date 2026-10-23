"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "01<>/\\[]{}#$%&*+=ABCDEF";
const FRAMES = 9;
const FRAME_MS = 34;

/**
 * Decode-on-hover text. A hidden copy of the real label reserves the width,
 * so scrambling never shifts the layout around it.
 */
export default function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );

  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) window.clearInterval(timer.current);
    let frame = 0;
    timer.current = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / FRAMES) * text.length);
      setDisplay(
        Array.from(text, (ch, i) =>
          ch === " " || i < settled
            ? ch
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        ).join(""),
      );
      if (frame >= FRAMES) {
        if (timer.current) window.clearInterval(timer.current);
        timer.current = null;
        setDisplay(null);
      }
    }, FRAME_MS);
  };

  return (
    <span className="scramble" onMouseEnter={run} onFocus={run}>
      <span aria-hidden="true" className={display ? "invisible" : undefined}>
        {text}
      </span>
      {display && (
        <span className="scramble-layer" aria-hidden="true">
          {display}
        </span>
      )}
      <span className="sr-only">{text}</span>
    </span>
  );
}

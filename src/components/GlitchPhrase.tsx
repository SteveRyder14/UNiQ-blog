"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#01";
const FRAME_COUNT = 18;
const FRAME_MS = 58;

type Phase = "idle" | "scramble" | "settled";

/** One intentional signal-corruption intro; replay the tiny glitch on hover. */
export default function GlitchPhrase({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const [phase, setPhase] = useState<Phase>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setDisplay(text);
      setPhase("settled");
      return;
    }

    let cancelled = false;

    timeoutRef.current = setTimeout(() => {
      if (cancelled) return;
      setPhase("scramble");

      let frame = 0;
      intervalRef.current = setInterval(() => {
        if (cancelled) return;
        frame += 1;
        const resolvedFromEachEdge = Math.floor(
          (frame / FRAME_COUNT) * Math.ceil(text.length / 2),
        );

        const next = Array.from(text, (character, index) => {
          if (character === " ") return character;
          const resolved =
            index < resolvedFromEachEdge ||
            index >= text.length - resolvedFromEachEdge;
          return resolved
            ? character
            : CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("");

        setDisplay(next);
        if (frame >= FRAME_COUNT) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setDisplay(text);
          setPhase("settled");
        }
      }, FRAME_MS);
    }, 520);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span className="glitch-phrase" data-phase={phase}>
      <span className="glitch-base" aria-hidden="true">
        {display}
      </span>
      <span className="glitch-layer glitch-layer-r" aria-hidden="true">
        {text}
      </span>
      <span className="glitch-layer glitch-layer-b" aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

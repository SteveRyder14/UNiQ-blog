"use client";

import { useEffect, useRef } from "react";

/**
 * One shared pointer listener powering four premium effects:
 *  - ambient glow that trails the cursor (behind all content)
 *  - [data-spot]    soft light following the cursor across cards
 *  - [data-tilt]    gentle 3D tilt
 *  - [data-magnetic] buttons that lean toward the cursor
 * Work is rAF-throttled and skipped entirely on touch devices and for
 * reduced-motion users.
 */
export default function CursorEffects() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let event: PointerEvent | null = null;
    let lastTilt: HTMLElement | null = null;
    let lastMagnet: HTMLElement | null = null;

    const resetTilt = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    const resetMagnet = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    };

    const run = () => {
      frame = 0;
      if (!event) return;

      if (glow.current) {
        glow.current.style.setProperty("--gx", `${event.clientX}px`);
        glow.current.style.setProperty("--gy", `${event.clientY}px`);
        glow.current.dataset.on = "true";
      }

      const target = event.target as HTMLElement | null;
      if (!target || !target.closest) return;

      const spot = target.closest<HTMLElement>("[data-spot]");
      if (spot) {
        const rect = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        spot.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }

      const tilt = target.closest<HTMLElement>("[data-tilt]");
      if (lastTilt && lastTilt !== tilt) resetTilt(lastTilt);
      if (tilt) {
        const rect = tilt.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        tilt.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
      }
      lastTilt = tilt;

      const magnet = target.closest<HTMLElement>("[data-magnetic]");
      if (lastMagnet && lastMagnet !== magnet) resetMagnet(lastMagnet);
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
        magnet.style.setProperty("--tx", `${clamp(dx * 0.18, 7).toFixed(1)}px`);
        magnet.style.setProperty("--ty", `${clamp(dy * 0.28, 5).toFixed(1)}px`);
      }
      lastMagnet = magnet;
    };

    const onMove = (e: PointerEvent) => {
      event = e;
      if (!frame) frame = requestAnimationFrame(run);
    };
    const onLeave = () => {
      resetTilt(lastTilt);
      resetMagnet(lastMagnet);
      lastTilt = null;
      lastMagnet = null;
      if (glow.current) glow.current.dataset.on = "false";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glow} className="cursor-glow" data-on="false" aria-hidden="true" />;
}

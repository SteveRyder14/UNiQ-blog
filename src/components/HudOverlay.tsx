"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const pad = (value: number, width: number) =>
  String(Math.max(0, Math.round(value))).padStart(width, "0");

/**
 * Light-mode HUD: viewport corner brackets plus a live readout
 * (pointer coordinates, scroll depth, UTC clock).
 *
 * Shown only on desktop pointers in light mode (CSS). Values are written
 * straight into the DOM through refs, so the component never re-renders,
 * and every update is skipped while dark mode is active or the tab is hidden.
 */
export default function HudOverlay() {
  const pathname = usePathname();
  const xRef = useRef<HTMLElement>(null);
  const yRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const clockRef = useRef<HTMLElement>(null);

  // Keep the readout out of the way while someone is reading an article.
  const showReadout = !pathname.startsWith("/blog/");

  useEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    if (!desktop.matches) return;

    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const active = () =>
      root.dataset.theme !== "dark" && document.visibilityState === "visible";

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paint = () => {
      frame = 0;
      if (!active()) return;
      if (xRef.current) xRef.current.textContent = pad(pointerX, 4);
      if (yRef.current) yRef.current.textContent = pad(pointerY, 4);
      if (scrollRef.current) {
        const max = root.scrollHeight - window.innerHeight;
        scrollRef.current.textContent = pad(max > 0 ? (window.scrollY / max) * 100 : 0, 3);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      schedule();
    };
    const tick = () => {
      if (!active() || !clockRef.current) return;
      const now = new Date();
      clockRef.current.textContent = `${pad(now.getUTCHours(), 2)}:${pad(
        now.getUTCMinutes(),
        2,
      )}:${pad(now.getUTCSeconds(), 2)}`;
    };

    tick();
    paint();
    const clock = window.setInterval(tick, 1000);
    if (!reduced) document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      window.clearInterval(clock);
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hud" aria-hidden="true">
      <span className="hud-corner hud-tl" />
      <span className="hud-corner hud-tr" />
      <span className="hud-corner hud-bl" />
      <span className="hud-corner hud-br" />
      {showReadout && (
        <div className="hud-readout">
          <span className="hud-live">
            <i />
            sys.online
          </span>
          <span>
            x <b ref={xRef}>0000</b>
          </span>
          <span>
            y <b ref={yRef}>0000</b>
          </span>
          <span>
            scr <b ref={scrollRef}>000</b>%
          </span>
          <span>
            <b ref={clockRef}>--:--:--</b> utc
          </span>
        </div>
      )}
    </div>
  );
}

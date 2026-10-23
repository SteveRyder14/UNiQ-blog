"use client";

import { useEffect, useState } from "react";

const ROLES = [
  "Android internals",
  "Local AI agents",
  "Linux systems",
  "Privacy engineering",
  "Audio & self-hosting",
];

/** A slow crossfade, only running on desktop while the page is visible. */
export default function RoleRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 640px)");
    if (reduced.matches || !desktop.matches) return;

    let timer: number | undefined;
    const start = () => {
      if (document.visibilityState !== "visible" || timer) return;
      timer = window.setInterval(() => {
        setIndex((value) => (value + 1) % ROLES.length);
      }, 5200);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <span
      key={index}
      className="role-rotator-text inline-block min-w-[17ch] font-medium text-fog"
      aria-live="off"
    >
      {ROLES[index]}
    </span>
  );
}

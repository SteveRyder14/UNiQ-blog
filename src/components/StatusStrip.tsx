"use client";

import { useEffect, useState } from "react";

const FEED = [
  "journal index · ready",
  "reading from postgresql",
  "archive channel · open",
  "topic map · indexed",
];

export default function StatusStrip({ latest }: { latest: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    const start = () => {
      if (document.visibilityState !== "visible" || timer !== undefined) return;
      timer = window.setInterval(() => {
        setIndex((value) => (value + 1) % FEED.length);
      }, 7200);
    };
    const stop = () => {
      if (timer !== undefined) window.clearInterval(timer);
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
    <div className="status-strip border-b border-line">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2.5 sm:px-8">
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-phos">
          <span className="status-dot" aria-hidden="true" />
          live
        </span>
        <span className="hidden h-3 w-px bg-line-2 sm:block" aria-hidden="true" />
        <p
          className="status-rotator font-mono text-[10px] uppercase tracking-[0.16em] text-dim"
          key={index}
          aria-live="off"
        >
          <span className="text-phos" aria-hidden="true">&gt;</span>{" "}
          {FEED[index]}
        </p>
        <span className="ml-auto hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-dim md:flex">
          latest note
          <span className="max-w-[260px] truncate text-mist">{latest}</span>
        </span>
      </div>
    </div>
  );
}

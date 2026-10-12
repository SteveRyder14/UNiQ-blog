"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({
  to,
  duration = 1400,
  prefix = "",
  suffix = "",
  pad = 0,
  className,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  pad?: number;
  className?: string;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              // ease-out-expo
              const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
              setVal(Math.round(to * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  const formatted = pad > 0 ? String(val).padStart(pad, "0") : String(val);
  return (
    <span ref={ref} className={className} aria-live="polite">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

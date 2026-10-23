"use client";

import { useEffect, useState } from "react";

export default function TocScroll({
  toc,
}: {
  toc: Array<{ id: string; title: string }>;
}) {
  const [active, setActive] = useState<string | null>(toc[0]?.id ?? null);

  useEffect(() => {
    if (toc.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const headings = toc
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (headings.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the most visible heading closest to the top of the viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement);
        if (visible.length > 0) {
          visible.sort(
            (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
          );
          setActive(visible[0].id);
          return;
        }
        // if none visible, pick the last one above the viewport
        for (let i = headings.length - 1; i >= 0; i--) {
          if (headings[i].getBoundingClientRect().top < 120) {
            setActive(headings[i].id);
            return;
          }
        }
        setActive(toc[0].id);
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const h of headings) io.observe(h);
    return () => io.disconnect();
  }, [toc]);

  return (
    <ol className="space-y-1">
      {toc.map((h, i) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            data-active={active === h.id}
            className="toc-link flex gap-3 px-3 py-2.5 text-[13px] leading-snug text-mist hover:text-fog"
          >
            <span className="font-mono text-[10px] leading-5 text-dim">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{h.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

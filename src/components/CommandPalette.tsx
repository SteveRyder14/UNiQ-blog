"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Hit = {
  slug: string;
  title: string;
  topic: string;
  readMin: number;
  tags: string[];
};

const PAGES = [
  { label: "Blog — all field notes", href: "/", hint: "home" },
  { label: "Archive — by year", href: "/archive", hint: "archive" },
  { label: "Tags — browse topics", href: "/tags", hint: "tags" },
  { label: "About — whoami", href: "/about", hint: "about" },
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pages = PAGES.filter(
    (p) =>
      !q.trim() ||
      p.label.toLowerCase().includes(q.trim().toLowerCase()) ||
      p.hint.includes(q.trim().toLowerCase()),
  );
  const total = pages.length + hits.length;

  // global hotkey: cmd/ctrl + k, and "/" when not typing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const typing =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement;
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (k === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (k === "escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // lock scroll + focus input while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  // reset when closed
  useEffect(() => {
    if (!open) {
      setQ("");
      setActive(0);
    }
  }, [open]);

  // debounced fetch
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancelled) {
          setHits(data.results ?? []);
          setActive(0);
        }
      } catch {
        if (!cancelled) setHits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 140);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, open]);

  const go = useCallback(
    (i: number) => {
      const page = pages[i];
      if (page) {
        router.push(page.href);
        setOpen(false);
        return;
      }
      const hit = hits[i - pages.length];
      if (hit) {
        router.push(`/blog/${hit.slug}`);
        setOpen(false);
      }
    },
    [hits, pages, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (total ? (a + 1) % total : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (total ? (a - 1 + total) % total : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    }
  };

  return (
    <>
      {/* trigger pill — also communicates the shortcut */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-line bg-ink-900/80 text-dim shadow-sm transition-all hover:-translate-y-0.5 hover:border-line-2 hover:text-fog sm:w-auto sm:justify-start sm:px-3.5"
      >
        <span aria-hidden>⌕</span>
        <span className="hidden text-xs font-medium sm:inline">Search</span>
        <kbd className="ml-1 hidden rounded-full border border-line bg-ink-850 px-2 py-0.5 font-mono text-[9px] text-dim md:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <button
            aria-label="Close search"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="command-backdrop absolute inset-0 cursor-default bg-[#0d1710]/35 backdrop-blur-sm"
          />
          <div
            className="cmdk-panel relative w-full max-w-xl overflow-hidden rounded-[24px] border border-line-2 bg-ink-900 shadow-[0_35px_90px_-35px_rgba(23,25,20,0.65)]"
            style={{ animation: "page-in 220ms var(--ease-out-expo) both" }}
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="font-mono text-[13px] text-phos">⌕</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="grep posts, jump to a page…"
                className="w-full bg-transparent font-mono text-[13px] text-fog placeholder:text-dim focus:outline-none"
              />
              {loading && (
                <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-phos" />
              )}
              <kbd className="shrink-0 border border-line-2 px-1.5 py-0.5 font-mono text-[10px] text-dim">
                esc
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto py-2">
              {pages.length > 0 && (
                <Section title="pages">
                  {pages.map((p, i) => (
                    <Row
                      key={p.href}
                      active={active === i}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(i)}
                      left={<span className="text-sky">~/</span>}
                      title={p.label}
                      meta="page"
                    />
                  ))}
                </Section>
              )}

              {hits.length > 0 && (
                <Section title={q.trim() ? "matching notes" : "latest notes"}>
                  {hits.map((h, i) => {
                    const idx = pages.length + i;
                    return (
                      <Row
                        key={h.slug}
                        active={active === idx}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => go(idx)}
                        left={<span className="text-phos">▸</span>}
                        title={h.title}
                        meta={`${h.topic} · ${h.readMin} min`}
                      />
                    );
                  })}
                </Section>
              )}

              {!loading && total === 0 && (
                <p className="px-4 py-8 text-center font-mono text-[12px] text-dim">
                  no matches for &quot;{q}&quot;
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
              <span>↑↓ navigate · ⏎ open</span>
              <span className="text-phos/70">UNiQ</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      <p className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({
  active,
  title,
  meta,
  left,
  onClick,
  onMouseEnter,
}: {
  active: boolean;
  title: string;
  meta: string;
  left: React.ReactNode;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150",
        active ? "bg-phos/10" : "hover:bg-ink-800/60",
      )}
    >
      <span className="shrink-0 font-mono text-[12px]">{left}</span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[13px]",
          active ? "text-phos" : "text-fog",
        )}
      >
        {title}
      </span>
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        {meta}
      </span>
    </button>
  );
}

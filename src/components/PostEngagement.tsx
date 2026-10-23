"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Views + likes for a post.
 * - a view is recorded once per browser session (sessionStorage guard)
 * - a like is remembered locally so the button reflects your own state
 */
export default function PostEngagement({
  slug,
  initialViews,
  initialLikes,
}: {
  slug: string;
  initialViews: number;
  initialLikes: number;
}) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(false);

  // record a view once per session
  useEffect(() => {
    const key = `uniq:viewed:${slug}`;
    try {
      setLiked(localStorage.getItem(`uniq:liked:${slug}`) === "1");
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return;
    }
    let cancelled = false;
    fetch(`/api/stats/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view" }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && !cancelled) {
          setViews(d.views);
          setLikes(d.likes);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function toggleLike() {
    if (busy) return;
    setBusy(true);
    const next = !liked;
    // optimistic
    setLiked(next);
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    if (next) {
      setBurst(true);
      setTimeout(() => setBurst(false), 520);
    }
    try {
      localStorage.setItem(`uniq:liked:${slug}`, next ? "1" : "0");
      const res = await fetch(`/api/stats/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: next ? "like" : "unlike" }),
      });
      if (res.ok) {
        const d = await res.json();
        setLikes(d.likes);
        setViews(d.views);
      }
    } catch {
      // revert on failure
      setLiked(!next);
      setLikes((n) => Math.max(0, n + (next ? -1 : 1)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2 rounded-full border border-line bg-ink-900 px-4 py-2.5 text-xs font-medium text-mist">
        <span aria-hidden className="text-sky">
          ◉
        </span>
        {views.toLocaleString()} {views === 1 ? "view" : "views"}
      </span>
      <button
        onClick={toggleLike}
        disabled={busy}
        aria-pressed={liked}
        aria-label={liked ? "Remove like" : "Like this note"}
        className={cn(
          "relative flex items-center gap-2 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200",
          liked
            ? "border-phos/60 bg-phos/10 text-phos"
            : "border-line text-mist hover:border-phos/50 hover:text-phos",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block transition-transform duration-300",
            burst && "scale-150",
          )}
        >
          {liked ? "★" : "☆"}
        </span>
        {likes.toLocaleString()}
        {burst && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-phos/60"
            style={{ animation: "like-burst 520ms var(--ease-out-expo) both" }}
          />
        )}
      </button>
    </div>
  );
}

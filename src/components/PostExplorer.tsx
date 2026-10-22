"use client";

import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { IconSearch, IconClock, IconArrow } from "./icons";
import { cn, fmtDateShort, topicAccent } from "@/lib/utils";
import type { PostSummary } from "@/lib/posts";

const TOPICS = ["All", "Android", "Local AI", "Linux", "Audio", "Programming"];

export default function PostExplorer({ posts }: { posts: PostSummary[] }) {
  const [topic, setTopic] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return posts.filter((p) => {
      const okTopic = topic === "All" || p.topic === topic;
      const okQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query));
      return okTopic && okQuery;
    });
  }, [posts, topic, q]);

  const clear = () => {
    setTopic("All");
    setQ("");
  };

  return (
    <div>
      {/* control bar */}
        <div className="mb-8 flex flex-col gap-4 border border-line bg-ink-900/70 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={cn(
                "chip border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em]",
                topic === t
                  ? "border-phos bg-phos/10 text-phos"
                  : "border-line text-dim hover:border-line-2 hover:text-mist",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="relative block w-full md:w-64">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim">
            <IconSearch className="h-4 w-4" />
          </span>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-dim">
            ⏎
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="grep the archive…"
            className="w-full border border-line bg-ink-950 py-2 pl-9 pr-9 font-mono text-[12.5px] text-fog placeholder:text-dim transition-colors duration-200 focus:border-phos/60 focus:bg-ink-900 focus:outline-none"
          />
        </label>
      </div>

      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
        <span className="text-phos">$</span> ls ./notes
        <span className="mx-2 text-line-2">|</span>
        {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
        {topic !== "All" && <span className="text-ember"> · topic: {topic.toLowerCase()}</span>}
        {q.trim() && <span className="text-ember"> · grep: &quot;{q.trim()}&quot;</span>}
      </p>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-line-2 px-6 py-20 text-center">
          <p className="font-mono text-sm text-dim">
            0 results for this filter.
          </p>
          <button
            onClick={clear}
            className="mt-4 border border-phos/50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-phos transition-colors hover:bg-phos hover:text-ink-950"
          >
            clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} big={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({
  post,
  index,
  big,
}: {
  post: PostSummary;
  index: number;
  big: boolean;
}) {
  const onMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${mx}%`);
    el.style.setProperty("--my", `${my}%`);
    el.style.setProperty("--mxn", `${mx}`);
    el.style.setProperty("--myn", `${my}`);
  };
  return (
    <Reveal
      delay={(index % 2) * 80}
      className={`tilt-wrap ${big ? "md:col-span-2" : ""}`}
    >
      <article
        className="post-card lift tilt group relative h-full overflow-hidden border border-line bg-ink-900"
        onMouseMove={onMouseMove}
      >
        <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
          <div className={cn("relative overflow-hidden border-b border-line", big ? "aspect-[21/9]" : "aspect-[16/8]")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover || "/images/cover-checkers.jpg"}
              alt={post.title}
              loading="lazy"
              className="photo h-full w-full object-cover opacity-85 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.2em] text-phos/90">
              {post.featured && index === 0
                ? "● featured"
                : String(index + 1).padStart(2, "0")}
            </span>
            {big && (
              <span className="absolute bottom-4 left-4 border border-phos/60 bg-ink-950/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-phos">
                latest experiment
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
              <span className={cn("border px-2 py-0.5", topicAccent(post.topic))}>
                {post.topic}
              </span>
              <span className="text-dim">{fmtDateShort(post.dateIso)}</span>
            </div>
            <h3
              className={cn(
                "mt-3.5 font-display font-semibold leading-snug text-fog transition-colors group-hover:text-phos",
                big ? "text-2xl sm:text-[1.75rem]" : "text-xl",
              )}
            >
              {post.title}
            </h3>
            <p className={cn("mt-3 text-[0.95rem] leading-relaxed text-mist", big ? "line-clamp-3" : "line-clamp-2")}>
              {post.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between pt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              <span className="flex items-center gap-2">
                <IconClock className="h-3.5 w-3.5" />
                {post.readMin} min read
              </span>
              <span className="flex items-center gap-2 text-phos opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:-translate-x-2">
                read it <IconArrow className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { IconArrow, IconClock, IconSearch } from "./icons";
import { cn, fmtDate } from "@/lib/utils";
import type { PostSummary } from "@/lib/posts";

export type ExplorerPost = PostSummary & { views?: number; likes?: number };

export default function PostExplorer({ posts }: { posts: ExplorerPost[] }) {
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const topics = ["All", ...new Set(posts.map((post) => post.topic))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTopic = topic === "All" || post.topic === topic;
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.topic.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesTopic && matchesQuery;
    });
  }, [posts, query, topic]);

  const [featured, ...remaining] = filtered;

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
          {topics.map((item) => (
            <button
              key={item}
              onClick={() => setTopic(item)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all",
                topic === item
                  ? "border-fog bg-fog text-ink-950"
                  : "border-line bg-ink-900/50 text-mist hover:border-line-2 hover:text-fog",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="relative block shrink-0 lg:w-72">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes…"
            className="w-full rounded-full border border-line bg-ink-900/70 py-3 pl-11 pr-4 text-sm text-fog placeholder:text-dim focus:border-phos focus:outline-none"
          />
        </label>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          <span className="text-phos" aria-hidden="true">
            $
          </span>{" "}
          ls ./journal
          <span className="mx-2 text-line-2">|</span>
          {filtered.length} {filtered.length === 1 ? "note" : "notes"}
          {topic !== "All" && ` · ${topic}`}
          {query.trim() && ` · grep "${query.trim()}"`}
        </p>
        {(topic !== "All" || query) && (
          <button
            onClick={() => {
              setTopic("All");
              setQuery("");
            }}
            className="text-xs font-semibold text-phos hover:text-fog"
          >
            Clear filters
          </button>
        )}
      </div>

      {!featured ? (
        <div className="rounded-[24px] border border-dashed border-line-2 bg-ink-900/50 px-6 py-20 text-center">
          <p className="font-display text-2xl font-semibold text-fog">Nothing found</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-mist">
            Try a different keyword or topic. The notebook is small, but it is
            growing.
          </p>
          <button
            onClick={() => {
              setTopic("All");
              setQuery("");
            }}
            className="mt-6 rounded-full bg-fog px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-phos"
          >
            Show all notes
          </button>
        </div>
      ) : (
        <>
          <Reveal>
            <FeaturedCard post={featured} />
          </Reveal>

          {remaining.length > 0 && (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {remaining.map((post, index) => (
                <Reveal key={post.slug} delay={(index % 3) * 70}>
                  <StoryCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FeaturedCard({ post }: { post: ExplorerPost }) {
  return (
    <article data-spot className="featured-card story-card spot group overflow-hidden rounded-[28px] border border-line bg-ink-900 shadow-[0_24px_55px_-38px_rgba(8,22,14,0.5)]">
      <Link href={`/blog/${post.slug}`} className="grid lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative min-h-[300px] overflow-hidden lg:min-h-[430px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <span className="absolute left-5 top-5 rounded-full bg-ink-950/90 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-fog shadow-sm backdrop-blur">
            Latest featured note
          </span>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <Meta post={post} />
          <h3 className="mt-5 font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-fog transition-colors group-hover:text-phos sm:text-4xl">
            {post.title}
          </h3>
          <p className="mt-5 line-clamp-4 text-[15px] leading-7 text-mist">
            {post.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="inline-flex items-center gap-3 text-sm font-semibold text-fog">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-phos text-ink-950 transition-transform duration-300 group-hover:translate-x-1">
                <IconArrow className="h-4 w-4" />
              </span>
              Read the full note
            </span>
            <span className="flex items-center gap-3 text-[11px] font-medium text-dim">
              {typeof post.likes === "number" && post.likes > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-phos" aria-hidden="true">★</span>
                  {post.likes.toLocaleString()} likes
                </span>
              )}
              <span className="h-1 w-1 rounded-full bg-line-2" aria-hidden="true" />
              <span>{post.readMin} min read</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function StoryCard({ post }: { post: ExplorerPost }) {
  return (
    <article data-spot className="story-card spot group h-full overflow-hidden rounded-[24px] border border-line bg-ink-900">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="aspect-[16/10] overflow-hidden bg-ink-850">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <Meta post={post} />
          <h3 className="mt-4 font-display text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.02em] text-fog transition-colors group-hover:text-phos">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-mist">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between pt-7 text-xs text-dim">
            <span className="inline-flex items-center gap-1.5">
              <IconClock className="h-3.5 w-3.5" />
              {post.readMin} min read
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-phos">
              Read
              <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Meta({ post }: { post: ExplorerPost }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
      <span className="text-phos">{post.topic}</span>
      <span className="h-1 w-1 rounded-full bg-line-2" />
      <span className="font-medium normal-case tracking-normal text-dim">{fmtDate(post.dateIso)}</span>
    </div>
  );
}

import Link from "next/link";
import { IconClock, IconArrow } from "./icons";
import { cn, fmtDateShort, topicAccent } from "@/lib/utils";
import type { PostSummary } from "@/lib/posts";

/** Compact list row used on the archive and tag pages. */
export default function PostRow({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="lift group flex flex-col gap-2 border border-line bg-ink-900/60 px-4 py-4 transition-colors duration-300 hover:border-phos/45 sm:flex-row sm:items-center sm:gap-5 sm:px-5"
    >
      <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-dim sm:w-20">
        {fmtDateShort(post.dateIso)}
      </span>
      <span
        className={cn(
          "shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]",
          topicAccent(post.topic),
        )}
      >
        {post.topic}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[1.02rem] font-medium text-fog transition-colors duration-300 group-hover:text-phos">
          {post.title}
        </span>
        <span className="mt-0.5 block truncate text-[0.85rem] text-mist">
          {post.excerpt}
        </span>
      </span>
      <span className="nudge flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
        <span className="flex items-center gap-1.5">
          <IconClock className="h-3.5 w-3.5" />
          {post.readMin}m
        </span>
        <IconArrow className="h-3.5 w-3.5 text-phos" />
      </span>
    </Link>
  );
}

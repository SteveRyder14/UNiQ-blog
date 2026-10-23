import Link from "next/link";
import { IconArrow, IconClock } from "./icons";
import { fmtDate } from "@/lib/utils";
import type { PostSummary } from "@/lib/posts";

export default function PostRow({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-spot className="spot group grid gap-4 rounded-[22px] border border-line bg-ink-900 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-[0_20px_45px_-34px_rgba(8,22,14,0.5)] sm:grid-cols-[92px_1fr_auto] sm:items-center sm:p-6"
    >
      <span className="text-xs font-medium text-dim">{fmtDate(post.dateIso)}</span>

      <span className="min-w-0">
        <span className="mb-2 inline-flex rounded-full bg-phos/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-phos">
          {post.topic}
        </span>
        <span className="block font-display text-[1.35rem] font-semibold leading-tight text-fog transition-colors group-hover:text-phos">
          {post.title}
        </span>
        <span className="mt-1.5 line-clamp-2 block text-sm leading-6 text-mist">
          {post.excerpt}
        </span>
      </span>

      <span className="flex items-center gap-4 text-xs text-dim">
        <span className="inline-flex items-center gap-1.5">
          <IconClock className="h-3.5 w-3.5" />
          {post.readMin} min
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-phos transition-all group-hover:border-phos group-hover:bg-phos group-hover:text-ink-950">
          <IconArrow className="h-4 w-4" />
        </span>
      </span>
    </Link>
  );
}

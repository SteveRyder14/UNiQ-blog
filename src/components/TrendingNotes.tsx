import Link from "next/link";
import Reveal from "./Reveal";
import DecodeText from "./DecodeText";
import { IconArrow } from "./icons";
import type { PostWithEngagement } from "@/lib/posts";

function compact(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export default function TrendingNotes({ posts }: { posts: PostWithEngagement[] }) {
  if (posts.length === 0) return null;

  const max = Math.max(...posts.map((post) => post.views), 1);

  return (
    <section className="border-b border-line bg-ink-900/45">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="cmd-type font-mono text-[10px] uppercase tracking-[0.26em] text-phos">
                <span aria-hidden="true">$</span> sort --by views --desc
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em] text-fog sm:text-5xl">
                <DecodeText text="What readers opened first" />
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-mist">
              Ranked by real reads on this journal, not by date.
            </p>
          </div>
        </Reveal>

        <div className="mt-9 grid gap-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 70}>
              <Link
                href={`/blog/${post.slug}`}
                data-spot className="rank-row spot group grid gap-4 rounded-[22px] border border-line bg-ink-900 p-5 sm:grid-cols-[56px_1fr_150px] sm:items-center sm:p-6"
              >
                <span className="rank-index font-display text-3xl font-semibold text-line-2 transition-colors group-hover:text-phos">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-phos">
                    {post.topic}
                    <span className="font-medium normal-case tracking-normal text-dim">
                      {post.readMin} min read
                    </span>
                  </span>
                  <span className="mt-1.5 block font-display text-xl font-semibold leading-tight text-fog transition-colors group-hover:text-phos sm:text-2xl">
                    {post.title}
                  </span>
                </span>

                <span className="flex items-center gap-3 sm:justify-end">
                  <span className="min-w-0 flex-1 sm:w-24 sm:flex-none">
                    <span className="rank-track block h-1.5 overflow-hidden rounded-full bg-ink-800">
                      <span
                        className="rank-bar block h-full rounded-full bg-phos"
                        style={{ width: `${Math.max(8, Math.round((post.views / max) * 100))}%` }}
                      />
                    </span>
                    <span className="mt-2 block text-right font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                      {compact(post.views)} reads
                    </span>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-phos transition-all group-hover:border-phos group-hover:bg-phos group-hover:text-ink-950">
                    <IconArrow className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

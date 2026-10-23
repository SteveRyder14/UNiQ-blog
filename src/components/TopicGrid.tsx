import Link from "next/link";
import Reveal from "./Reveal";
import DecodeText from "./DecodeText";

type Topic = { tag: string; count: number };

export default function TopicGrid({ tags }: { tags: Topic[] }) {
  const top = tags.slice(0, 6);
  if (top.length === 0) return null;
  const max = Math.max(...top.map((tag) => tag.count), 1);

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="cmd-type font-mono text-[10px] uppercase tracking-[0.26em] text-phos">
                Topics
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em] text-fog sm:text-5xl">
                <DecodeText text="Follow a thread" />
              </h2>
            </div>
            <Link
              href="/tags"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-phos transition-colors hover:text-fog"
            >
              All topics
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal stagger className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((topic) => (
            <Link
              key={topic.tag}
              href={`/tags/${encodeURIComponent(topic.tag)}`}
              data-spot className="topic-card spot group relative overflow-hidden rounded-[22px] border border-line bg-ink-900 p-6"
            >
              <span className="relative flex items-start justify-between gap-4">
                <span className="font-mono text-lg text-phos" aria-hidden="true">
                  #
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                  {topic.count} {topic.count === 1 ? "note" : "notes"}
                </span>
              </span>
              <span className="relative mt-4 block font-display text-2xl font-semibold tracking-tight text-fog transition-colors group-hover:text-phos">
                {topic.tag.replace(/-/g, " ")}
              </span>
              <span className="relative mt-5 block h-1 overflow-hidden rounded-full bg-ink-800">
                <span
                  className="rank-bar block h-full rounded-full bg-phos/70"
                  style={{ width: `${Math.round((topic.count / max) * 100)}%` }}
                />
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

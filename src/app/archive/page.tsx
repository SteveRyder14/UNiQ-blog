import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PostRow from "@/components/PostRow";
import SubscribeBand from "@/components/SubscribeBand";
import { getArchive, getPosts, getTopicCounts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "archive",
  description: "Every field note, grouped by year.",
};

export default async function ArchivePage() {
  const [groups, all, topics] = await Promise.all([
    getArchive(),
    getPosts(),
    getTopicCounts(),
  ]);

  return (
    <main className="pt-14">
      <section className="grid-bg border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6">
          <Reveal variant="uncover">
            <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
              <span className="text-phos">//</span> ~/archive
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fog sm:text-5xl">
              The whole log
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-mist">
              Everything I&rsquo;ve built, broken and written down — newest
              first, grouped by year.
            </p>
          </Reveal>

          <Reveal stagger className="mt-9 flex flex-wrap gap-2">
            <span className="border border-phos/40 bg-phos/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-phos">
              {all.length} total
            </span>
            {topics.map((t) => (
              <span
                key={t.topic}
                className="border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-dim"
              >
                {t.topic} · {t.count}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {groups.map((g, gi) => (
          <section key={g.year} className={gi > 0 ? "mt-14" : ""}>
            <Reveal>
              <div className="mb-5 flex items-baseline gap-4">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-fog">
                  {g.year}
                </h2>
                <span className="hairline flex-1" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
                  {g.posts.length} {g.posts.length === 1 ? "note" : "notes"}
                </span>
              </div>
            </Reveal>
            <Reveal stagger className="grid gap-3">
              {g.posts.map((p) => (
                <PostRow key={p.slug} post={p} />
              ))}
            </Reveal>
          </section>
        ))}
      </div>

      <SubscribeBand />
    </main>
  );
}

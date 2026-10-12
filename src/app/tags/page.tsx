import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SubscribeBand from "@/components/SubscribeBand";
import { getTagCounts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "tags",
  description: "Browse every topic tag across the field notes.",
};

/** Scale tag size by how often it is used — a tidy weighted cloud. */
function sizeFor(count: number, max: number): string {
  const r = max <= 1 ? 1 : count / max;
  if (r > 0.75) return "text-2xl sm:text-3xl";
  if (r > 0.5) return "text-xl sm:text-2xl";
  if (r > 0.25) return "text-lg sm:text-xl";
  return "text-base";
}

export default async function TagsPage() {
  const tags = await getTagCounts();
  const max = tags[0]?.count ?? 1;

  return (
    <main className="pt-14">
      <section className="grid-bg border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6">
          <Reveal variant="uncover">
            <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
              <span className="text-phos">//</span> ~/tags
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fog sm:text-5xl">
              Browse by tag
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-mist">
              {tags.length} tags across the archive. Bigger means I kept coming
              back to it.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal stagger className="flex flex-wrap items-baseline gap-x-4 gap-y-4">
          {tags.map((t) => (
            <Link
              key={t.tag}
              href={`/tags/${encodeURIComponent(t.tag)}`}
              className={`lift group inline-flex items-baseline gap-2 border border-line bg-ink-900/60 px-4 py-2.5 font-display font-medium text-fog transition-colors duration-300 hover:border-phos/50 hover:text-phos ${sizeFor(
                t.count,
                max,
              )}`}
            >
              <span className="font-mono text-[0.6em] text-dim group-hover:text-phos/70">
                #
              </span>
              {t.tag}
              <span className="font-mono text-[0.55em] text-dim">{t.count}</span>
            </Link>
          ))}
        </Reveal>
      </div>

      <SubscribeBand />
    </main>
  );
}

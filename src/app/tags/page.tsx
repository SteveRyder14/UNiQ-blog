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

export default async function TagsPage() {
  const tags = await getTagCounts();

  return (
    <main className="pt-[72px]">
      <section className="mx-auto max-w-[1280px] px-5 pb-14 pt-16 sm:px-8 lg:pt-24">
        <Reveal>
          <p className="cmd-type font-mono text-[10px] uppercase tracking-[0.26em] text-phos">
            <span aria-hidden="true">$</span> find ./journal -type tag
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-fog">
            Browse by interest.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-mist">
            {tags.length} tags connect the journal. Start with a system, a tool
            or a recurring curiosity.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8">
        <Reveal stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <Link
              key={tag.tag}
              href={`/tags/${encodeURIComponent(tag.tag)}`}
              className="group flex items-center justify-between gap-5 rounded-[24px] border border-line bg-ink-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_22px_45px_-34px_rgba(8,22,14,0.5)]"
            >
              <span>
                <span className="font-mono text-xs text-phos">#</span>
                <span className="ml-1 font-display text-2xl font-semibold tracking-tight text-fog group-hover:text-phos">
                  {tag.tag}
                </span>
                <span className="mt-1 block text-sm text-mist">
                  {tag.count} {tag.count === 1 ? "note" : "notes"}
                </span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-phos transition-all group-hover:border-phos group-hover:bg-phos group-hover:text-ink-950">
                →
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      <SubscribeBand />
    </main>
  );
}

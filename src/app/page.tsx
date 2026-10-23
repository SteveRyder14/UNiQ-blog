import Link from "next/link";
import Hero from "@/components/Hero";
import StatusStrip from "@/components/StatusStrip";
import Marquee from "@/components/Marquee";
import PostExplorer from "@/components/PostExplorer";
import TrendingNotes from "@/components/TrendingNotes";
import TopicGrid from "@/components/TopicGrid";
import SubscribeBand from "@/components/SubscribeBand";
import Reveal from "@/components/Reveal";
import DecodeText from "@/components/DecodeText";
import { getCuratedFeed, getTagCounts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const FOCUS = [
  {
    id: "01",
    title: "Android",
    text: "ROMs, root, Magisk and the boot chain beneath the interface.",
  },
  {
    id: "02",
    title: "Local AI",
    text: "Useful assistants and agents that stay on hardware I control.",
  },
  {
    id: "03",
    title: "Linux",
    text: "Systems, services, networking and knowing what the machine is doing.",
  },
  {
    id: "04",
    title: "Audio",
    text: "Self-hosted music, practical gear and repair over replacement.",
  },
];

export default async function Home() {
  const [curated, tags] = await Promise.all([getCuratedFeed(), getTagCounts()]);
  const latest = curated.feed[0];

  return (
    <main>
      <Hero postCount={curated.total} />
      <StatusStrip latest={latest ? latest.title : "in progress"} />
      <Marquee />

      <section
        id="latest"
        className="mx-auto max-w-[1280px] scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24"
      >
        <Reveal>
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="cmd-type font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-phos">
                The journal
              </p>
              <h2 className="mt-4 font-display text-5xl font-semibold tracking-[-0.04em] text-fog sm:text-6xl">
                <DecodeText text="Recent field notes" />
              </h2>
            </div>
            <div className="max-w-sm md:text-right">
              <p className="text-[15px] leading-7 text-mist">
                Selected notes, experiments and the useful lessons that appear
                when something stops working.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-ink-900 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
                <span className="status-dot" aria-hidden="true" />
                {curated.feed.length} curated
                {curated.hidden > 0 && (
                  <span className="text-mist">· {curated.hidden} in archive</span>
                )}
              </p>
            </div>
          </div>
        </Reveal>

        <PostExplorer posts={curated.feed} />

        <Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-line bg-ink-900/60 px-5 py-4">
            <p className="text-sm text-mist">
              The latest notes lead here, and older posts remain easy to find
              in the complete archive.
            </p>
            <Link
              href="/archive"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-phos transition-colors hover:text-fog"
            >
              Open the full archive
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      <TrendingNotes posts={curated.trending} />
      <TopicGrid tags={tags} />

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-24">
          <Reveal>
            <div className="relative mx-auto max-w-[520px]">
              <div className="overflow-hidden rounded-[32px] border border-line-2 bg-ink-900 p-2 shadow-[0_28px_60px_-38px_rgba(8,22,14,0.55)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/avatar.jpg"
                  alt="A developer at a computer with green terminal screens"
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-[25px] object-cover"
                />
              </div>
              <div className="mx-5 -mt-12 rounded-3xl border border-line bg-ink-900/95 p-5 shadow-[0_22px_45px_-32px_rgba(8,22,14,0.55)] backdrop-blur sm:mx-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-phos">
                  Working principle
                </p>
                <p className="mt-2 font-display text-[1.35rem] font-semibold leading-snug text-fog">
                  Understand the layer beneath the layer.
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="cmd-type font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-phos">
                What I explore
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-fog">
                <DecodeText text="Curiosity is useful when it leaves notes behind." />
              </h2>
              <p className="mt-6 max-w-2xl text-[15px] leading-8 text-mist">
                This is a working record—not a highlight reel. It keeps the
                reasoning, trade-offs and fixes close to the things being built,
                so future-me can understand past-me.
              </p>
            </Reveal>

            <Reveal stagger className="mt-10 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2">
              {FOCUS.map((item) => (
                <article
                  key={item.id}
                  className="group bg-ink-900 p-6 transition-colors duration-300 hover:bg-ink-850"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-dim">
                      {item.id}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-phos/30 transition-colors group-hover:bg-phos" />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold text-fog">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-mist">{item.text}</p>
                </article>
              ))}
            </Reveal>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-fog"
            >
              More about UNiQ
              <span className="grid h-8 w-8 place-items-center rounded-full bg-fog text-ink-950 transition-all group-hover:translate-x-1 group-hover:bg-phos">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SubscribeBand />
    </main>
  );
}

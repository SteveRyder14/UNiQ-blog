import Link from "next/link";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import PostExplorer from "@/components/PostExplorer";
import SubscribeBand from "@/components/SubscribeBand";
import Reveal from "@/components/Reveal";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const TINKERING = [
  "android — custom ROMs, root, Magisk, system-level tweaks",
  "local AI — Salvy, a desktop assistant on Ollama",
  "linux — the terminal as a front door, not a fallback",
  "audio — the rest of the life, outside the terminal",
];

export default async function Home() {
  const posts = await getPosts();

  return (
    <main>
      <Hero postCount={posts.length} />
      <Ticker />

      {/* latest */}
      <section id="latest" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20">
        <Reveal variant="uncover">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
                <span className="text-phos">//</span> the archive
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl">
                Field notes &amp; experiments
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[11.5px] leading-relaxed text-dim">
              every entry: a thing I built, broke, opened up, and fixed —
              written down before I forget why.
            </p>
          </div>
        </Reveal>
        <PostExplorer posts={posts} />
      </section>

      {/* whoami teaser */}
      <section className="border-t border-line bg-ink-900/40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          <Reveal className="lg:col-span-5">
            <div className="group relative mx-auto max-w-sm">
              <div className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-phos" />
              <div className="absolute -right-2 -top-2 h-6 w-6 border-r-2 border-t-2 border-phos" />
              <div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-phos" />
              <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-phos" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/avatar.jpg"
                  alt="UNiQ at the desk, late-night build in progress"
                  className="photo w-full border border-line object-cover opacity-95 transition-all duration-700 group-hover:opacity-100"
                  loading="lazy"
                />
              <div className="absolute bottom-3 left-3 bg-ink-950/85 px-2.5 py-1.5 font-mono text-[10.5px] tracking-wider text-phos">
                $ uptime: always curious
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} variant="uncover" className="lg:col-span-7">
            <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
              <span className="text-phos">//</span> whoami
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-fog sm:text-4xl">
              A developer who likes understanding things{" "}
              <span className="text-phos">deeply</span>.
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-mist">
              I don&rsquo;t follow tutorials to finish projects — I follow them
              until they break, then I open the hood. If a custom ROM, a kernel
              flag, or a 7-billion-parameter model doesn&rsquo;t explain itself,
              it hasn&rsquo;t taught me anything yet.
            </p>
            <Reveal stagger variant="fade" className="mt-7 grid gap-3 sm:grid-cols-2" as="ul">
              {TINKERING.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border border-line bg-ink-950/60 px-4 py-3 font-mono text-[12px] leading-relaxed text-mist transition-colors duration-300 ease-out hover:border-phos/40"
                >
                  <span className="text-ember transition-transform duration-200 ease-out group-hover:translate-x-0.5">▸</span>
                  <span>{t}</span>
                </li>
              ))}
            </Reveal>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-phos"
            >
              <span className="border-b border-phos/50 pb-0.5 transition-colors group-hover:border-phos">
                cat ./about.md
              </span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <SubscribeBand />
    </main>
  );
}

import type { Metadata } from "next";
import SubscribeBand from "@/components/SubscribeBand";
import Reveal from "@/components/Reveal";
import {
  IconPhone,
  IconTerminal,
  IconBrain,
  IconNetwork,
  IconWave,
  IconWrench,
  IconGitHub,
} from "@/components/icons";

export const metadata: Metadata = { title: "about" };

const TOPICS = [
  {
    icon: IconPhone,
    title: "Android internals",
    body: "Custom ROMs, root, Magisk, and system-level tweaks. I want to know what the boot process is doing, not just what the settings screen says.",
    accent: "text-ember",
  },
  {
    icon: IconTerminal,
    title: "Linux & systems",
    body: "The terminal as a front door, not a fallback. init systems, DNS disasters, systemd units — the unglamorous parts are where the learning is.",
    accent: "text-sky",
  },
  {
    icon: IconBrain,
    title: "Local AI agents",
    body: "Salvy is the flagship: a desktop assistant on Ollama that opens apps, reads the screen, and runs gated shell commands — with zero data leaving the house.",
    accent: "text-phos",
  },
  {
    icon: IconNetwork,
    title: "Networking & privacy",
    body: "What leaves my machine, and why. Open source, self-hosting, and knowing the path a packet takes from keyboard to nowhere-in-particular.",
    accent: "text-sky",
  },
  {
    icon: IconWave,
    title: "Music & audio",
    body: "Outside the terminal. FLACs over a home network, gear that was fixed instead of replaced, and sound that isn't someone's listening data.",
    accent: "text-ember",
  },
  {
    icon: IconWrench,
    title: "Budget builds & repair",
    body: "Practical, cheap ways to build and improve things. A $200 laptop, an old mini PC, a soldering iron — constraints make the projects honest.",
    accent: "text-phos",
  },
];

const APPROACH = [
  {
    n: "01",
    t: "BUILD IT",
    d: "Make the thing exist. Ugly is fine. A running sketch beats a perfect plan.",
  },
  {
    n: "02",
    t: "BREAK IT",
    d: "Push it until it fails. The failure is the most useful output of the whole project.",
  },
  {
    n: "03",
    t: "UNDERSTAND IT",
    d: "Open the hood. Read the logs, the source, the boot sequence — until the failure has a name.",
  },
  {
    n: "04",
    t: "MAKE IT BETTER",
    d: "Ship the fix, write the note, and start again. That loop is the whole identity.",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-14">
        {/* identity */}
        <section className="grid-bg border-b border-line">
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
                  alt="UNiQ at the desk"
                  className="photo w-full border border-line object-cover opacity-95 transition-all duration-700 group-hover:opacity-100"
                />
                <div className="absolute bottom-3 left-3 bg-ink-950/85 px-2.5 py-1.5 font-mono text-[10.5px] tracking-wider text-phos">
                  $ process: always running
                </div>
              </div>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-7">
              <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
                <span className="text-phos">~/</span>UNiQ — profile
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fog sm:text-5xl">
                UNiQ
              </h1>
              <p className="mt-2 font-mono text-[13px] text-mist">
                developer in progress <span className="text-dim">|</span> android
                modding <span className="text-dim">·</span> linux{" "}
                <span className="text-dim">·</span> local ai
              </p>
              <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-mist">
                I&rsquo;m a developer who likes understanding things{" "}
                <strong className="font-medium text-fog">deeply</strong>. Not just
                making something work, but figuring out{" "}
                <em>why</em> it works. I learn by building, debugging,
                experimenting, and fixing things myself — and I prefer the
                internals over blindly following a tutorial, every time.
              </p>
              <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-mist">
                I&rsquo;m into programming, Android modding, Linux, local AI, and
                practical experiments that turn curiosity into something useful.
                Outside the terminal: music, audio, and finding cheap ways to do
                expensive things.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://github.com/SteveRyder14"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 border border-phos bg-phos px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-ink-950 transition-all hover:bg-transparent hover:text-phos"
                >
                  <IconGitHub className="h-4 w-4" /> github/UNiQ
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 border border-line-2 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.2em] text-mist transition-colors hover:border-phos/60 hover:text-phos"
                >
                  read the notes →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* what I dig into */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <Reveal variant="uncover">
              <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
                <span className="text-phos">//</span> what I dig into
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl">
                The open-hood list
              </h2>
            </Reveal>
          <Reveal
            stagger
            variant="up"
            className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {TOPICS.map((t) => (
              <div
                key={t.title}
                className="lift group relative h-full overflow-hidden border border-line bg-ink-900/70 p-6 transition-[border-color,transform,box-shadow] duration-300 ease-out hover:border-phos/40"
              >
                <t.icon className={`icon-wiggle h-7 w-7 ${t.accent}`} />
                <h3 className="mt-4 font-display text-lg font-semibold text-fog transition-colors duration-300 group-hover:text-phos">
                  {t.title}
                </h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-mist">
                  {t.body}
                </p>
              </div>
            ))}
          </Reveal>
        </section>

        {/* projects */}
        <section className="border-y border-line bg-ink-900/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <Reveal variant="uncover">
              <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
                <span className="text-phos">//</span> things I&rsquo;ve built
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl">
                Running processes
              </h2>
            </Reveal>
            <div className="mt-9 grid gap-5 lg:grid-cols-2">
              <Reveal>
                <div className="lift glow group relative h-full overflow-hidden border border-line bg-ink-950 transition-[border-color,box-shadow] duration-300 ease-out hover:border-phos/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/cover-salvy.jpg"
                    alt="Salvy workspace"
                    className="photo aspect-[16/7] w-full object-cover opacity-90 group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                  <span className="sweep-line" aria-hidden="true" />
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold text-fog">
                        Salvy
                      </h3>
                      <span className="border border-phos/40 bg-phos/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-phos">
                        flagship
                      </span>
                    </div>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-mist">
                      A local desktop AI assistant built around Ollama models.
                      OCR, app launching, system controls, automation — a
                      personal agent that stays on my hardware.
                    </p>
                    <a
                      href="/blog/building-salvy"
                      className="mt-4 inline-block font-mono text-[11.5px] uppercase tracking-[0.2em] text-phos transition-colors hover:text-fog"
                    >
                      read the build notes →
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="lift glow group relative h-full overflow-hidden border border-line bg-ink-950 transition-[border-color,box-shadow] duration-300 ease-out hover:border-phos/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/cover-tictactoe.jpg"
                    alt="Tic-tac-toe on a notepad"
                    className="photo aspect-[16/7] w-full object-cover opacity-90 group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                  <span className="sweep-line" aria-hidden="true" />
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold text-fog">
                        Tic-Tac-Toe
                      </h3>
                      <span className="border border-ember/40 bg-ember/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
                        learning vehicle
                      </span>
                    </div>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-mist">
                      A small game I built myself and published on my website.
                      Built five times across five stacks — one of my projects
                      for learning by actually making things.
                    </p>
                    <a
                      href="/blog/tic-tac-toe-five-times"
                      className="mt-4 inline-block font-mono text-[11.5px] uppercase tracking-[0.2em] text-phos transition-colors hover:text-fog"
                    >
                      read the method →
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* approach */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal variant="uncover" className="lg:col-span-4">
              <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
                <span className="text-phos">//</span> my approach
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-fog sm:text-4xl">
                I don&rsquo;t need to know everything already.
              </h2>
              <p className="mt-5 leading-relaxed text-mist">
                I want to stay curious, understand the problem, test ideas,
                learn from what breaks, and keep improving. It&rsquo;s a four-step
                loop, and it has never once needed an update.
              </p>
            </Reveal>
            <div className="lg:col-span-8">
              <div className="hairline mb-2" aria-hidden="true" />
              {APPROACH.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="lift approach-row group flex gap-6 border-b border-line py-7 first:border-t sm:gap-10">
                    <span className="w-10 shrink-0 font-mono text-sm text-ember">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-wide text-fog transition-colors duration-300 ease-out group-hover:text-phos">
                        {s.t}
                      </h3>
                      <p className="mt-2 max-w-xl leading-relaxed text-mist transition-colors duration-300 ease-out">
                        {s.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal>
            <blockquote className="mt-14 border-l-2 border-phos bg-gradient-to-r from-phos/8 to-transparent px-8 py-8">
              <p className="font-display text-2xl font-semibold leading-snug tracking-tight text-fog sm:text-3xl">
                &ldquo;Build it. Break it. Understand it. Make it
                better.&rdquo;
              </p>
              <footer className="mt-3 font-mono text-[12px] text-dim">
                — always learning, always experimenting
              </footer>
            </blockquote>
          </Reveal>
        </section>

        <SubscribeBand />
    </main>
  );
}

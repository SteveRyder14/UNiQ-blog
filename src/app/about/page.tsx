import type { Metadata } from "next";
import Link from "next/link";
import SubscribeBand from "@/components/SubscribeBand";
import Reveal from "@/components/Reveal";
import {
  IconBrain,
  IconGitHub,
  IconNetwork,
  IconPhone,
  IconTerminal,
  IconWave,
  IconWrench,
} from "@/components/icons";

export const metadata: Metadata = { title: "about" };

const TOPICS = [
  {
    icon: IconPhone,
    title: "Android internals",
    body: "Custom ROMs, root, Magisk and system-level tweaks. I want to know what the boot process is doing—not just what the settings screen says.",
    accent: "text-ember bg-ember/10",
  },
  {
    icon: IconTerminal,
    title: "Linux & systems",
    body: "The terminal as a front door, not a fallback. Services, DNS, logs and the unglamorous parts where the real learning happens.",
    accent: "text-sky bg-sky/10",
  },
  {
    icon: IconBrain,
    title: "Local AI agents",
    body: "Salvy is the flagship: an Ollama-powered desktop assistant that opens apps, reads the screen and runs gated commands locally.",
    accent: "text-phos bg-phos/10",
  },
  {
    icon: IconNetwork,
    title: "Networking & privacy",
    body: "What leaves my machine, and why. Open source, self-hosting and understanding the path data takes.",
    accent: "text-sky bg-sky/10",
  },
  {
    icon: IconWave,
    title: "Music & audio",
    body: "Outside the terminal: self-hosted FLACs, practical gear, and sound that does not become someone else's listening data.",
    accent: "text-ember bg-ember/10",
  },
  {
    icon: IconWrench,
    title: "Budget builds & repair",
    body: "Practical, inexpensive ways to build and improve things. Constraints make projects more honest.",
    accent: "text-phos bg-phos/10",
  },
];

const APPROACH = [
  {
    n: "01",
    title: "Build it",
    text: "Make the thing exist. Ugly is fine; a running sketch beats a perfect plan.",
  },
  {
    n: "02",
    title: "Break it",
    text: "Push until it fails. The failure is often the most useful output.",
  },
  {
    n: "03",
    title: "Understand it",
    text: "Open the hood. Read the logs, source and boot sequence until the failure has a name.",
  },
  {
    n: "04",
    title: "Make it better",
    text: "Ship the fix, write the note and start the loop again.",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-[72px]">
      <section className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <Reveal>
          <p className="cmd-type font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-phos">
            About UNiQ
          </p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-fog">
            I learn by opening the hood.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-mist">
            I&rsquo;m UNiQ—a developer who likes understanding things deeply.
            Not just making something work, but figuring out <em>why</em> it
            works.
          </p>
          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-mist">
            I build, debug, experiment and fix things myself. Tutorials are a
            starting point, not a substitute for understanding. Most of my
            projects live somewhere between Android, Linux, local AI, audio
            and practical repair.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://github.com/SteveRyder14"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-fog px-6 py-3.5 text-sm font-semibold text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-phos"
            >
              <IconGitHub className="h-4 w-4" />
              github.com/SteveRyder14
            </a>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-line-2 bg-ink-900/60 px-6 py-3.5 text-sm font-semibold text-fog transition-all hover:-translate-y-0.5 hover:border-fog"
            >
              Read the journal
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto max-w-[540px]">
            <div className="overflow-hidden rounded-[32px] border border-line-2 bg-ink-900 p-2 shadow-[0_28px_60px_-38px_rgba(8,22,14,0.55)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about-bench.jpg"
                alt="A phone opened up on the repair bench"
                className="aspect-[4/5] w-full rounded-[25px] object-cover sm:aspect-[5/5]"
              />
            </div>
            <div className="mx-5 -mt-12 rounded-3xl border border-line bg-ink-900/95 p-5 shadow-[0_22px_45px_-32px_rgba(8,22,14,0.55)] backdrop-blur sm:mx-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-phos">
                Current focus
              </p>
              <p className="mt-2 font-display text-xl font-semibold leading-snug text-fog">
                Android · Linux · Local AI · Audio
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-ink-900/45">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:py-24">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="cmd-type font-mono text-[10px] uppercase tracking-[0.26em] text-phos">
                  Areas of curiosity
                </p>
                <h2 className="mt-4 font-display text-5xl font-semibold tracking-[-0.04em] text-fog">
                  The open-hood list
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-mist md:text-right">
                Different systems, same habit: follow the signal until the
                mechanism makes sense.
              </p>
            </div>
          </Reveal>

          <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic) => (
              <article
                key={topic.title}
                className="group rounded-[24px] border border-line bg-ink-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_22px_45px_-34px_rgba(8,22,14,0.5)]"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${topic.accent}`}>
                  <topic.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-fog">
                  {topic.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-mist">{topic.body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:py-24">
        <Reveal>
          <p className="cmd-type font-mono text-[10px] uppercase tracking-[0.26em] text-phos">
            Selected projects
          </p>
          <h2 className="mt-4 font-display text-5xl font-semibold tracking-[-0.04em] text-fog">
            Things I&rsquo;m building
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ProjectCard
            image="/images/cover-salvy.jpg"
            eyebrow="Flagship project"
            title="Salvy"
            body="A local desktop AI assistant built around Ollama. OCR, app launching, system controls and automation—without sending personal data to a cloud service."
            href="/blog/building-salvy"
            link="Read the build notes"
          />
          <ProjectCard
            image="/images/cover-tictactoe.jpg"
            eyebrow="Learning project"
            title="Tic-Tac-Toe, five times"
            body="The same small game rebuilt across five approaches. A compact way to understand state, rendering and what frameworks actually do."
            href="/blog/tic-tac-toe-five-times"
            link="Read the method"
          />
        </div>
      </section>

      <section className="border-t border-line bg-ink-900/45">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
          <Reveal>
            <p className="cmd-type font-mono text-[10px] uppercase tracking-[0.26em] text-phos">
              My approach
            </p>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-fog">
              I don&rsquo;t need to know everything already.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-8 text-mist">
              I need to stay curious, understand the problem, test ideas, learn
              from what breaks and keep improving.
            </p>
          </Reveal>

          <div className="divide-y divide-line border-y border-line">
            {APPROACH.map((step, index) => (
              <Reveal key={step.n} delay={index * 60}>
                <div className="group grid gap-3 py-7 sm:grid-cols-[64px_180px_1fr] sm:items-baseline">
                  <span className="font-mono text-xs text-ember">{step.n}</span>
                  <h3 className="font-display text-2xl font-semibold text-fog transition-colors group-hover:text-phos">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-mist">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[980px] px-5 py-20 text-center sm:px-8 lg:py-24">
        <Reveal>
          <p className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-fog">
            “Build it. Break it. Understand it. Make it better.”
          </p>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
            Always learning · Always experimenting
          </p>
        </Reveal>
      </section>

      <SubscribeBand />
    </main>
  );
}

function ProjectCard({
  image,
  eyebrow,
  title,
  body,
  href,
  link,
}: {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  link: string;
}) {
  return (
    <Reveal>
      <article className="group h-full overflow-hidden rounded-[28px] border border-line bg-ink-900 transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_24px_50px_-36px_rgba(8,22,14,0.55)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          loading="lazy"
          className="aspect-[16/8] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
        />
        <div className="p-7 sm:p-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-phos">
            {eyebrow}
          </p>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog">
            {title}
          </h3>
          <p className="mt-3 text-[15px] leading-7 text-mist">{body}</p>
          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-phos transition-colors hover:text-fog"
          >
            {link}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import Word from "@/components/Word";
import Particles from "@/components/Particles";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

function useScramble(text: string, startDelay: number) {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    let interval: ReturnType<typeof setInterval> | null = null;
    let frame = 0;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame++;
        const reveal = Math.floor(frame / 2.4);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            s += " ";
            continue;
          }
          s +=
            i < reveal
              ? text[i]
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        setOut(s);
        if (reveal >= text.length && interval) {
          clearInterval(interval);
          setOut(text);
        }
      }, 34);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, startDelay, reduced]);
  return out;
}

type TermLine = { prompt?: string; cmd?: string; out?: string; dim?: boolean };

const TERM_LINES: TermLine[] = [
  { prompt: "uniq@salvy:~$", cmd: "whoami" },
  { out: "UNiQ — developer, tinkerer, lifelong learner" },
  { prompt: "uniq@salvy:~$", cmd: "cat /etc/approach" },
  { out: "build it. break it. understand it. make it better." },
  { prompt: "uniq@salvy:~$", cmd: "./salvy --status" },
  { out: "model 7b-q4 · tools: ocr, apps, shell(gated) · egress 0 B", dim: true },
];

function useTypewriter() {
  const reduced = usePrefersReducedMotion();
  const [line, setLine] = useState(0);
  const [ch, setCh] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setLine(TERM_LINES.length);
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      setLine(0);
    }, 500);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (done || line >= TERM_LINES.length) return;
    const current = TERM_LINES[line];
    const full = current.cmd ? current.cmd.length : (current.out ?? "").length;
    if (ch < full) {
      const speed = current.cmd ? 55 : 16;
      const t = setTimeout(() => setCh((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (line + 1 >= TERM_LINES.length) setDone(true);
      else {
        setLine((l) => l + 1);
        setCh(0);
      }
    }, current.cmd ? 260 : 420);
    return () => clearTimeout(t);
  }, [line, ch, done, reduced]);

  return { line, ch, done };
}

export default function Hero({ postCount }: { postCount: number }) {
  const scramble = useScramble("UNDERSTAND IT.", 900);
  const { line, ch, done } = useTypewriter();

  return (
    <section className="grid-bg relative overflow-hidden border-b border-line">
      <div className="breathe pointer-events-none absolute -top-28 left-1/2 h-80 w-[58rem] -translate-x-1/2 rounded-full bg-phos/7 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full bg-ember/8 blur-3xl" />
      <Particles />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-32">
        {/* left — the approach */}
        <div className="lg:col-span-7">
          <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
            <span className="text-phos">//</span> always learning, always
            experimenting
          </p>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.04] tracking-tight text-fog sm:text-6xl lg:text-[4.3rem]">
            <span className="block">
              <Word delay={0}>BUILD</Word>{" "}
              <Word delay={90}>IT.</Word>
            </span>
            <span className="block">
              <Word delay={180}>BREAK</Word>{" "}
              <Word delay={270}>IT.</Word>
            </span>
            <span className="block">
              <Word delay={360} className="text-phos">
                {scramble}
              </Word>
            </span>
            <span className="block">
              <Word delay={450}>MAKE</Word>{" "}
              <Word delay={540}>IT</Word>{" "}
              <span className="relative inline-block">
                <Word delay={630} className="gradient-anim bg-gradient-to-r from-phos via-fog to-ember bg-clip-text text-transparent">
                  BETTER
                </Word>
                <svg
                  viewBox="0 0 120 14"
                  className="absolute -bottom-2 left-0 w-full text-ember"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9.5C25 4.5 60 3 117 8.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <Word delay={720}>.</Word>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-[1.02rem] leading-relaxed text-mist">
            I&rsquo;m <strong className="font-medium text-fog">UNiQ</strong>
            — a developer who likes understanding things deeply. Not just making
            something work, but figuring out <em>why</em> it works: Android
            internals, Linux systems, and local AI that actually does things on
            my own machine.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#latest"
              className="btn btn-primary group inline-flex items-center gap-3 border border-phos bg-phos px-6 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-ink-950"
            >
              read the field notes
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
            </a>
            <Link
              href="/about"
              className="btn inline-flex items-center gap-2 border border-line-2 px-6 py-3 font-mono text-[12px] uppercase tracking-[0.2em] text-mist"
            >
              whoami
            </Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-px border border-line bg-line">
            {[
              { n: postCount, pad: 2, v: "field notes" },
              { n: 5, pad: 2, v: "systems tracked" },
              { n: 0, pad: 1, suffix: " B", v: "sent to the cloud" },
            ].map((s) => (
              <div key={s.v} className="bg-ink-900 px-4 py-4">
                <dt className="sr-only">{s.v}</dt>
                <dd>
                  <span className="countup block font-display text-2xl font-semibold leading-none text-phos">
                    <CountUp to={s.n} pad={s.pad} suffix={s.suffix ?? ""} />
                  </span>
                  <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                    {s.v}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* right — live terminal */}
        <div className="lg:col-span-5">
          <div className="float-slow border-beam">
          <div className="scanlines boot-flash crt relative border border-line bg-[#070b10] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
            <span className="scan-beam" aria-hidden="true" />
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-[11px] tracking-wider text-dim">
                salvy@linux — bash
              </span>
            </div>
            <div className="min-h-[264px] px-4 py-4 font-mono text-[12.5px] leading-[1.9] sm:px-5">
                {TERM_LINES.slice(0, line).map((l, i) =>
                l.cmd ? (
                  <div key={i}>
                    <span className="text-phos">{l.prompt}</span>{" "}
                    <span className="text-fog">{l.cmd}</span>
                  </div>
                ) : (
                  <div key={i} className={l.dim ? "text-dim" : "text-mist"}>
                    {l.out}
                  </div>
                ),
              )}
              {!done && line < TERM_LINES.length && (
                <div>
                  {TERM_LINES[line].cmd ? (
                    <>
                      <span className="text-phos">{TERM_LINES[line].prompt}</span>{" "}
                      <span className="text-fog">
                        {TERM_LINES[line].cmd!.slice(0, ch)}
                      </span>
                    </>
                  ) : (
                    <span className="text-mist">
                      {(TERM_LINES[line].out ?? "").slice(0, ch)}
                    </span>
                  )}
                  <span className="term-caret caret ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] bg-phos" />
                </div>
              )}
              {done && (
                <div>
                  <span className="text-phos">uniq@salvy:~$</span>{" "}
                  <span className="term-caret caret ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] bg-phos" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-line bg-ink-850/80 px-4 py-2">
              <span className="flex items-center gap-2 font-mono text-[10.5px] tracking-wider text-dim">
                <span className="ping-wrap">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-phos" />
                </span>
                local model loaded
              </span>
              <span className="font-mono text-[10.5px] tracking-wider text-dim">
                0 trackers · 0 cookies
              </span>
            </div>
          </div>
          </div>
          <p className="mt-4 text-right font-mono text-[11px] text-dim">
            <span className="text-ember">▲</span> everything above runs on my own
            hardware
          </p>
        </div>
      </div>
    </section>
  );
}

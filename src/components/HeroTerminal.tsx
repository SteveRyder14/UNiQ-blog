"use client";

import { useEffect, useRef, useState } from "react";

type Line = { cmd?: string; out?: string; ok?: string; dim?: boolean };

const SCRIPT: Line[] = [
  { cmd: "whoami" },
  { out: "uniq — developer, tinkerer, lifelong learner" },
  { cmd: "cat ./focus.txt" },
  { out: "android · linux · local-ai · privacy · audio" },
  { cmd: "ls ./journal | wc -l" },
  { out: "7 field notes" },
  { cmd: "sudo ./build --break --understand --improve" },
  { out: "loop running… no exit code needed", dim: true },
];

/**
 * A real terminal window that types itself.
 * Types once on entry, then sits idle with a blinking caret. Pauses when the
 * tab is hidden, and renders the full transcript for reduced-motion users.
 */
export default function HeroTerminal() {
  const [lineIndex, setLineIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLineIndex(SCRIPT.length);
      return;
    }
    if (document.visibilityState !== "visible") return;

    let li = 0;
    let c = 0;
    let timer: number | undefined;

    const step = () => {
      const line = SCRIPT[li];
      if (!line) return;
      const full = (line.cmd ?? line.out ?? "").length;

      if (c < full) {
        c += 1;
        setChars(c);
        timer = window.setTimeout(step, line.cmd ? 42 : 12);
        return;
      }
      // pause at end of a line, then advance
      timer = window.setTimeout(() => {
        li += 1;
        c = 0;
        setLineIndex(li);
        setChars(0);
        if (li < SCRIPT.length) timer = window.setTimeout(step, 260);
      }, line.cmd ? 320 : 520);
    };

    timer = window.setTimeout(step, 700);

    const onVisibility = () => {
      if (document.visibilityState === "hidden" && timer) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (timer) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const done = lineIndex >= SCRIPT.length;

  return (
    <div className="term-frame" ref={ref}>
      <div className="term-bar" aria-hidden="true">
        <span className="term-dot term-dot-r" />
        <span className="term-dot term-dot-y" />
        <span className="term-dot term-dot-g" />
        <span className="term-title">uniq@salvy:~/journal</span>
        <span className="term-pid">bash · pid 1408</span>
      </div>

      <div className="term-body">
        {SCRIPT.slice(0, lineIndex).map((line, index) => (
          <div key={index} className="term-line">
            {line.cmd ? (
              <>
                <span className="term-prompt">uniq@salvy</span>
                <span className="term-sep">:</span>
                <span className="term-path">~/journal</span>
                <span className="term-sep">$ </span>
                <span className="term-cmd">{line.cmd}</span>
              </>
            ) : (
              <span className={line.dim ? "term-out term-out-dim" : "term-out"}>
                {line.out}
              </span>
            )}
          </div>
        ))}

        {!done && SCRIPT[lineIndex] && (
          <div className="term-line">
            {SCRIPT[lineIndex].cmd ? (
              <>
                <span className="term-prompt">uniq@salvy</span>
                <span className="term-sep">:</span>
                <span className="term-path">~/journal</span>
                <span className="term-sep">$ </span>
                <span className="term-cmd">
                  {SCRIPT[lineIndex].cmd!.slice(0, chars)}
                </span>
              </>
            ) : (
              <span className="term-out">
                {(SCRIPT[lineIndex].out ?? "").slice(0, chars)}
              </span>
            )}
            <span className="term-caret" aria-hidden="true" />
          </div>
        )}

        {done && (
          <div className="term-line">
            <span className="term-prompt">uniq@salvy</span>
            <span className="term-sep">:</span>
            <span className="term-path">~/journal</span>
            <span className="term-sep">$ </span>
            <span className="term-caret" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="term-status">
        <span>
          <span className="status-dot" aria-hidden="true" /> session active
        </span>
        <span>utf-8 · zsh</span>
      </div>

      <span className="sr-only">
        Terminal transcript: uniq is a developer working across Android, Linux,
        local AI, privacy and audio, with 7 field notes published.
      </span>
    </div>
  );
}

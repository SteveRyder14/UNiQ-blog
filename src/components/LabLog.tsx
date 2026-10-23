import Reveal from "./Reveal";
import DecodeText from "./DecodeText";

const ENTRIES = [
  {
    date: "This week",
    tag: "Local AI",
    text: "Caching OCR results in Salvy cut repeated screen reads from 1.2s to 90ms.",
    status: "shipped",
  },
  {
    date: "Last week",
    tag: "Linux",
    text: "Moved every personal service onto restart-on-failure systemd units. Nothing has needed a manual restart since.",
    status: "stable",
  },
  {
    date: "Ongoing",
    tag: "Android",
    text: "Documenting what Magisk actually patches at boot, with logs instead of folklore.",
    status: "in progress",
  },
  {
    date: "Queued",
    tag: "Audio",
    text: "Testing gapless playback timings for the self-hosted FLAC player on the living-room setup.",
    status: "experiment",
  },
];

export default function LabLog() {
  return (
    <section className="border-b border-line bg-ink-900/45">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
        <Reveal>
          <p className="cmd-type font-mono text-[10px] uppercase tracking-[0.26em] text-phos">
            <span aria-hidden="true">$</span> tail -f lab.log
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-fog sm:text-5xl">
            <DecodeText text="Small notes from the workbench." />
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-mist">
            Quick fixes and loose threads that are useful before they become
            full posts. Updated as the experiments move.
          </p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-line bg-ink-900 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
            <span className="status-dot" aria-hidden="true" />
            {ENTRIES.length} entries live
          </div>
        </Reveal>

        <Reveal stagger className="relative">
          <span
            className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-line sm:block"
            aria-hidden="true"
          />
          {ENTRIES.map((entry) => (
            <article key={entry.text} className="log-entry group relative pb-7 pl-0 last:pb-0 sm:pl-9">
              <span
                className="absolute left-0 top-2 hidden h-3.5 w-3.5 rounded-full border border-line-2 bg-ink-950 transition-colors group-hover:border-phos group-hover:bg-phos sm:block"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em]">
                <span className="text-phos">{entry.tag}</span>
                <span className="h-1 w-1 rounded-full bg-line-2" aria-hidden="true" />
                <span className="font-medium normal-case tracking-normal text-dim">
                  {entry.date}
                </span>
                <span className="ml-auto rounded-full border border-line bg-ink-900 px-2.5 py-1 text-[9px] font-medium normal-case tracking-[0.08em] text-mist">
                  {entry.status}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-7 text-fog/90 transition-colors group-hover:text-fog">
                {entry.text}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

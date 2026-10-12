const ITEMS = [
  "android modding",
  "custom roms",
  "linux",
  "local ai",
  "ollama",
  "magisk",
  "privacy",
  "audio",
  "open source",
  "budget builds",
  "networking",
  "systems",
];

export default function Ticker() {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((it) => (
        <span
          key={it}
          className="flex items-center gap-5 pr-5 font-mono text-[11px] uppercase tracking-[0.28em] text-dim"
        >
          {it}
          <span className="text-phos/70">◆</span>
        </span>
      ))}
    </div>
  );
  return (
    <div
      className="marquee overflow-hidden border-y border-line bg-ink-900/60 py-3"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max ticker-fade">
        {row}
        {row}
      </div>
    </div>
  );
}

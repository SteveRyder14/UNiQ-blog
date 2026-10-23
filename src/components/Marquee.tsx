import Link from "next/link";

const ITEMS = [
  ["Android internals", "android"],
  ["Custom ROMs", "android"],
  ["Magisk modules", "magisk"],
  ["Linux systems", "linux"],
  ["Local AI", "local-ai"],
  ["Ollama", "ollama"],
  ["Privacy", "privacy"],
  ["Self-hosting", "self-hosting"],
  ["Audio", "audio"],
  ["Open source", "open-source"],
  ["Networking", "networking"],
  ["Repair", "hardware"],
] as const;

export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-2 pr-2"
      aria-hidden={hidden ? "true" : undefined}
    >
      {ITEMS.map(([label, tag]) => (
        <li key={`${label}-${hidden}`}>
          <Link
            href={`/tags/${encodeURIComponent(tag)}`}
            className="marquee-chip inline-flex items-center gap-2 rounded-full border border-line bg-ink-900/60 px-3.5 py-1.5 text-[11px] font-medium text-mist transition-colors hover:border-phos hover:text-phos"
          >
            <span className="h-1 w-1 rounded-full bg-phos/60" aria-hidden="true" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee border-b border-line bg-ink-900/40 py-3" aria-label="Topics">
      <div className="marquee-track flex w-max items-center">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

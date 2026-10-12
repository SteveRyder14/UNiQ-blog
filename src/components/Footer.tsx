import Link from "next/link";
import { IconGitHub } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-mono text-[13px] text-mist">
            <span className="text-phos">UNiQ</span>
            <span className="text-dim">@</span>
            <span className="text-fog">blog</span>
            <span className="text-dim">:~$</span>
          </p>
          <p className="mt-4 max-w-xs font-display text-sm font-medium uppercase leading-relaxed tracking-[0.14em] text-mist">
            Build it. Break it.
            <br />
            <span className="text-phos">Understand it.</span>
            <br />
            Make it better.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-dim">
            ./map
          </p>
          <ul className="mt-4 space-y-2.5 font-mono text-[12.5px]">
            <li>
              <Link href="/" className="text-mist transition-colors hover:text-phos">
                <span className="text-dim">~/</span>blog
              </Link>
            </li>
            <li>
              <Link href="/archive" className="text-mist transition-colors hover:text-phos">
                <span className="text-dim">~/</span>archive
              </Link>
            </li>
            <li>
              <Link href="/tags" className="text-mist transition-colors hover:text-phos">
                <span className="text-dim">~/</span>tags
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-mist transition-colors hover:text-phos">
                <span className="text-dim">~/</span>about
              </Link>
            </li>
            <li>
              <a href="/rss.xml" className="text-mist transition-colors hover:text-phos">
                <span className="text-dim">~/</span>rss
              </a>
            </li>
            <li>
                <a
                  href="https://github.com/SteveRyder14"
                  target="_blank"
                  rel="noreferrer"
                  className="nudge inline-flex items-center gap-2 text-mist transition-colors hover:text-phos"
                >
                  <span className="text-dim">~/</span>github
                  <IconGitHub className="h-3.5 w-3.5" />
                </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-dim">
            ./system
          </p>
          <ul className="mt-4 space-y-2.5 font-mono text-[12px] leading-relaxed text-dim">
            <li>
              stack: <span className="text-mist">next.js 16 · postgres · drizzle</span>
            </li>
            <li>
              privacy: <span className="text-phos">no trackers, no cookies</span>
            </li>
            <li>
              status:{" "}
              <span className="ping-wrap align-middle">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-phos" />
              </span>{" "}
              <span className="text-mist">always learning</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 font-mono text-[11px] text-dim sm:px-6">
          <span>© 2026 UNiQ — notes from the terminal</span>
          <span>
            <span className="text-phos">$</span> logout
            <span className="ml-2 text-dim">— nah. it&rsquo;s a blog.</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

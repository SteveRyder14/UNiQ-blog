import Link from "next/link";
import Logo from "./Logo";
import { IconGitHub } from "./icons";

const NAV = [
  ["Journal", "/"],
  ["Archive", "/archive"],
  ["Topics", "/tags"],
  ["About", "/about"],
] as const;

export default function Footer() {
  return (
    <footer className="theme-footer bg-[#0d1710] text-[#f4f8f3]">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.7fr_0.7fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="footer-badge grid h-12 w-12 place-items-center rounded-2xl">
                <Logo animated className="h-9 w-9" />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold">UNiQ</span>
                <span className="mt-0.5 block font-mono text-[8.5px] uppercase tracking-[0.22em] text-[#a7aa9d]">
                  Notes from under the hood
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#b9bcb0]">
              A personal technical journal about Android, Linux, local AI,
              audio, repair, and understanding systems instead of merely using
              them.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8f937f]">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[#d8dacd] transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8f937f]">
              Connect
            </p>
            <div className="mt-5 flex flex-col items-start gap-3 text-sm">
              <a
                href="https://github.com/SteveRyder14"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#d8dacd] transition-colors hover:text-white"
              >
                <IconGitHub className="h-4 w-4" />
                SteveRyder14 on GitHub
              </a>
              <a href="/rss.xml" className="text-[#d8dacd] transition-colors hover:text-white">
                RSS feed
              </a>
              <span className="inline-flex items-center gap-2 text-[#a7aa9d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a9d95d]" />
                Always learning
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8f937f]">
          <span>© 2026 UNiQ</span>
          <span>Build · Break · Understand · Improve</span>
        </div>
      </div>
    </footer>
  );
}

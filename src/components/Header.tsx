"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconGitHub } from "./icons";
import CommandPalette from "./CommandPalette";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "blog" },
  { href: "/archive", label: "archive" },
  { href: "/tags", label: "tags" },
  { href: "/about", label: "about" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink-950/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="glitch-hover group shrink-0 font-mono text-[13px] tracking-tight text-mist transition-colors hover:text-fog"
        >
          <span className="text-phos">UNiQ</span>
          <span className="text-dim">@</span>
          <span className="text-fog">blog</span>
          <span className="text-dim">:~$</span>
          <span className="term-caret caret ml-1 inline-block h-[13px] w-[7px] translate-y-[2px] bg-phos" />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5">
          {NAV.map((n) => {
            const active =
              n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "navlink hidden font-mono text-[12px] uppercase tracking-[0.18em] transition-colors sm:inline",
                  active ? "active text-phos" : "text-mist hover:text-fog",
                )}
              >
                {n.label}
              </Link>
            );
          })}
          <CommandPalette />
          <a
            href="https://github.com/SteveRyder14"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-mist transition-all hover:-translate-y-0.5 hover:text-phos"
          >
            <IconGitHub className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CommandPalette from "./CommandPalette";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import ScrambleText from "./ScrambleText";
import { IconGitHub } from "./icons";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Journal" },
  { href: "/archive", label: "Archive" },
  { href: "/tags", label: "Topics" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header data-scrolled={scrolled} className="site-header fixed inset-x-0 top-0 z-50">
      <span className="scroll-progress" aria-hidden="true" />
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="UNiQ home">
          <span className="brand-badge relative grid h-11 w-11 place-items-center rounded-2xl">
            <Logo animated className="h-8 w-8" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[19px] font-semibold tracking-tight text-fog">
              UNiQ
            </span>
            <span className="mt-1 block font-mono text-[8.5px] uppercase tracking-[0.24em] text-dim">
              Notes from under the hood
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="mr-1 hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-fog text-ink-950"
                      : "text-mist hover:bg-fog/[0.06] hover:text-fog",
                  )}
                >
                  <ScrambleText text={item.label} />
                </Link>
              );
            })}
          </nav>

          <CommandPalette />
          <ThemeToggle />
          <a
            href="https://github.com/SteveRyder14"
            target="_blank"
            rel="noreferrer"
            aria-label="SteveRyder14 on GitHub"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-ink-900/70 text-mist transition-all hover:-translate-y-0.5 hover:border-line-2 hover:text-fog"
          >
            <IconGitHub className="h-[18px] w-[18px]" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-ink-900/70 text-fog lg:hidden"
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300",
                  menuOpen && "translate-y-[5.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300",
                  menuOpen && "-translate-y-[5.5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-line bg-ink-950/95 px-5 py-3 backdrop-blur lg:hidden"
        >
          <div className="mx-auto grid max-w-[1280px] gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium",
                    active ? "bg-fog text-ink-950" : "text-mist hover:bg-fog/[0.06] hover:text-fog",
                  )}
                >
                  {item.label}
                  <span aria-hidden="true">→</span>
                </Link>
              );
            })}
            <a
              href="https://github.com/SteveRyder14"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-mist hover:bg-fog/[0.06] hover:text-fog"
            >
              GitHub
              <IconGitHub className="h-4 w-4" />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

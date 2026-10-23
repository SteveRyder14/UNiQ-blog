"use client";

import { useCallback, useEffect, useState } from "react";
import { IconMoon, IconSun } from "./icons";

type Theme = "light" | "dark";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

const STORAGE_KEY = "uniq-theme";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setReady(true);
  }, []);

  const toggleTheme = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const next: Theme = theme === "dark" ? "light" : "dark";
      const root = document.documentElement;
      const applyTheme = () => {
        root.dataset.theme = next;
        root.style.colorScheme = next;
      };

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // The theme still changes for this session if storage is unavailable.
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const viewDocument = document as ViewTransitionDocument;

      if (!reduceMotion && viewDocument.startViewTransition) {
        const rect = event.currentTarget.getBoundingClientRect();
        root.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
        root.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
        viewDocument.startViewTransition(applyTheme);
        setTheme(next);
        return;
      }

      root.classList.add("theme-changing");
      applyTheme();
      setTheme(next);
      window.setTimeout(() => root.classList.remove("theme-changing"), 700);
    },
    [theme],
  );

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={theme === "dark"}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      data-ready={ready}
      className="theme-toggle group"
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">
          <IconSun className="theme-icon theme-icon-sun" />
          <IconMoon className="theme-icon theme-icon-moon" />
        </span>
      </span>
      <span className="theme-toggle-label" aria-hidden="true">
        <span className="theme-label-light">Light</span>
        <span className="theme-label-dark">Dark</span>
      </span>
    </button>
  );
}

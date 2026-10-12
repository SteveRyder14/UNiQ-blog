"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "left" | "right" | "fade" | "uncover";

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  stagger = false,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  variant?: Variant;
  /** When true, adds staggered entrance to direct children (see rv.stagger in globals.css). */
  stagger?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // rAF so we don't measure/layout in the same frame as observer fire.
            requestAnimationFrame(() => setOn(true));
            io.disconnect();
          }
        }
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -48px 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass =
    variant === "left"
      ? "rv-left"
      : variant === "right"
        ? "rv-right"
        : variant === "fade"
          ? "rv-fade"
          : variant === "uncover"
            ? "rv-uncover"
            : "";

  return createElement(
    Tag as string,
    {
      ref: ref as Ref<unknown>,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
      className: cn("rv", variantClass, stagger && "stagger", on && "on", className),
    },
    children,
  );
}

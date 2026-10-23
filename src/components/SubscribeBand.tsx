"use client";

import { useState } from "react";
import { IconMail } from "./icons";
import { cn } from "@/lib/utils";

export default function SubscribeBand() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setState("err");
      setMessage("Please enter a valid email address.");
      return;
    }

    setState("busy");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setState("err");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setState("ok");
      setMessage(data.already ? "You are already subscribed." : "Welcome aboard. You are subscribed.");
      setEmail("");
    } catch {
      setState("err");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section className="px-5 py-20 sm:px-8 lg:py-24">
      <div className="theme-panel mx-auto max-w-[1280px] overflow-hidden rounded-[32px] border border-transparent bg-[#0d1710] px-6 py-10 text-[#f4f8f3] shadow-[0_30px_70px_-38px_rgba(23,25,20,0.8)] sm:px-10 lg:px-14 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_460px]">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07] text-[#c8e39a]">
              <IconMail className="h-5 w-5" />
            </div>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Useful notes, occasionally.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-[#b9bcb0]">
              New experiments, honest failures and practical fixes—sent only
              when there is something worth sharing.
            </p>
          </div>

          <form onSubmit={submit}>
            <div
              className={cn(
                "flex rounded-full border bg-white/[0.06] p-1.5 transition-colors",
                state === "ok"
                  ? "border-[#a9d95d]"
                  : state === "err"
                    ? "border-[#d68a4a]"
                    : "border-white/15 focus-within:border-white/40",
              )}
            >
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (state !== "idle") setState("idle");
                }}
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-[#8f937f] focus:shadow-none focus:outline-none"
              />
              <button
                type="submit"
                disabled={state === "busy"}
                className="shrink-0 rounded-full bg-[#f4f8f3] px-5 py-3 text-[13px] font-semibold text-[#0d1710] transition-colors hover:bg-[#d3ecd9] disabled:opacity-50"
              >
                {state === "busy" ? "Joining…" : "Subscribe"}
              </button>
            </div>
            <p
              role="status"
              className={cn(
                "mt-3 min-h-5 px-3 text-xs",
                state === "ok" ? "text-[#c8e39a]" : state === "err" ? "text-[#eda970]" : "text-[#8f937f]",
              )}
            >
              {state === "idle" ? "No spam. No tracking. Unsubscribe anytime." : message}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

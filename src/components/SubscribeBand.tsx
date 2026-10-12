"use client";

import { useState } from "react";
import { IconMail } from "./icons";
import { cn } from "@/lib/utils";

export default function SubscribeBand() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("err");
      setMsg("that doesn't parse as an email address");
      return;
    }
    setState("busy");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("err");
        setMsg(data.error ?? "something broke on my end — try again");
        return;
      }
      setState("ok");
      setMsg(data.already ? "you're already on the list" : "subscribed — notes will find you");
      setEmail("");
    } catch {
      setState("err");
      setMsg("network hiccup — try again");
    }
  }

  return (
    <section className="border-t border-line bg-ink-900/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
            <span className="text-phos">~/</span> newsletter
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl">
            Stay on the <span className="text-phos">wire</span>.
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-mist">
            New experiments, things I broke, and the fixes that followed. No
            noise, no tracking — just plain notes from the terminal, a few times
            a month.
          </p>
        </div>
        <form onSubmit={submit} className="lg:justify-self-end lg:w-full lg:max-w-md">
          <div
            className={cn(
              "flex border bg-ink-950 transition-colors",
              state === "ok"
                ? "border-phos/70"
                : state === "err"
                  ? "border-ember/70"
                  : "border-line-2 focus-within:border-phos/60",
            )}
          >
            <span className="hidden items-center pl-4 text-dim sm:flex">
              <IconMail className="h-4 w-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state !== "idle") setState("idle");
              }}
              placeholder="you@localhost"
              className="w-full bg-transparent px-4 py-3.5 font-mono text-[13px] text-fog placeholder:text-dim focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === "busy"}
              className="btn btn-primary shrink-0 bg-phos px-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-950 disabled:opacity-60 sm:px-6"
            >
              {state === "busy" ? "···" : "subscribe"}
            </button>
          </div>
          <p
            className={cn(
              "mt-3 min-h-5 font-mono text-[11.5px] tracking-wide",
              state === "ok" ? "text-phos" : state === "err" ? "text-ember" : "text-dim",
            )}
            role="status"
          >
            {state === "ok" && `ok: ${msg}`}
            {state === "err" && `err: ${msg}`}
            {state === "idle" && "no spam. no analytics. unsubscribe = one reply."}
          </p>
        </form>
      </div>
    </section>
  );
}

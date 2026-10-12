"use client";

import { useState } from "react";
import { cn, fmtDate } from "@/lib/utils";


export type CommentItem = {
  id: number;
  name: string;
  body: string;
  createdAt: string;
  _new?: boolean;
};

export default function CommentSection({
  postId,
  initial,
}: {
  postId: number;
  initial: CommentItem[];
}) {
  const [comments, setComments] = useState<CommentItem[]>(initial);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (name.trim().length < 2 || body.trim().length < 2) {
      setErr("both handle and message need a few characters");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, name: name.trim(), body: body.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error ?? "could not post — try again");
        return;
      }
            setComments((c) => [...c, { ...data.comment, _new: true }]);
            setName("");
            setBody("");
    } catch {
      setErr("network hiccup — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-fog">
        <span className="font-mono text-sm text-phos">//</span> transmission log
        <span className="font-mono text-[12px] font-normal tracking-[0.2em] text-dim">
          [{comments.length}]
        </span>
      </h2>

      <div className="mt-7 space-y-5">
        {comments.length === 0 && (
          <div className="border border-dashed border-line-2 px-5 py-8 text-center font-mono text-[12.5px] text-dim">
            no transmissions yet — be the first to reply to this one.
          </div>
        )}
        {comments.map((c) => (
          <article key={c.id} className={cn("border border-line bg-ink-900/70 p-4 sm:p-5", c._new && "comment-new")}>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11.5px]">
              <span className="text-phos">{c.name}</span>
              <span className="text-dim">@</span>
              <span className="text-dim">{fmtDate(c.createdAt)}</span>
              <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-dim">
                inbound
              </span>
            </div>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-mist">{c.body}</p>
          </article>
        ))}
      </div>

      <form onSubmit={submit} className="mt-8 border border-line bg-ink-950 p-4 sm:p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim">
          <span className="text-phos">$</span> reply to this note
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="handle"
            maxLength={40}
            className="border border-line bg-ink-900 px-3.5 py-2.5 font-mono text-[13px] text-fog placeholder:text-dim focus:border-phos/60 focus:outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="your transmission… (plain text only)"
            rows={3}
            maxLength={1200}
            className="resize-y border border-line bg-ink-900 px-3.5 py-2.5 text-[0.95rem] leading-relaxed text-fog placeholder:text-dim focus:border-phos/60 focus:outline-none"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className={cn("font-mono text-[11.5px]", err ? "text-ember" : "text-dim")}>
            {err ? `err: ${err}` : "kept local. no accounts, no tracking."}
          </p>
          <button
            type="submit"
            disabled={busy}
            className="btn border border-phos bg-phos/10 px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-phos hover:bg-phos hover:text-ink-950 disabled:opacity-50"
          >
            {busy ? "transmitting…" : "transmit →"}
          </button>
        </div>
      </form>
    </section>
  );
}

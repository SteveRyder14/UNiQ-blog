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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setErr("");

    if (name.trim().length < 2 || body.trim().length < 2) {
      setErr("Please add your name and a comment.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          name: name.trim(),
          body: body.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErr(data.error ?? "Could not post your comment. Please try again.");
        return;
      }
      setComments((current) => [...current, { ...data.comment, _new: true }]);
      setName("");
      setBody("");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-16 border-t border-line pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-phos">
            Discussion
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fog">
            Comments
          </h2>
        </div>
        <span className="rounded-full border border-line bg-ink-900 px-3 py-1.5 text-xs font-medium text-dim">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div className="mt-7 space-y-4">
        {comments.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line-2 bg-ink-900/50 px-6 py-10 text-center">
            <p className="font-display text-xl font-semibold text-fog">No comments yet</p>
            <p className="mt-1 text-sm text-mist">Start the conversation below.</p>
          </div>
        )}

        {comments.map((comment) => (
          <article
            key={comment.id}
            className={cn(
              "rounded-3xl border border-line bg-ink-900 p-5 sm:p-6",
              comment._new && "comment-new",
            )}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-phos/10 font-display text-sm font-bold text-phos">
                {comment.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-fog">{comment.name}</p>
                <p className="text-xs text-dim">{fmtDate(comment.createdAt)}</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-mist">
              {comment.body}
            </p>
          </article>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="mt-8 rounded-[28px] border border-line bg-ink-900 p-5 sm:p-7"
      >
        <h3 className="font-display text-2xl font-semibold text-fog">Leave a comment</h3>
        <p className="mt-1 text-sm text-mist">
          Plain text only. No account and no tracking.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-dim">
              Name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              maxLength={40}
              className="w-full rounded-2xl border border-line bg-ink-950 px-4 py-3 text-sm text-fog placeholder:text-dim focus:border-phos focus:outline-none sm:max-w-xs"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-dim">
              Comment
            </span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Share a thought, correction or question…"
              rows={4}
              maxLength={1200}
              className="w-full resize-y rounded-2xl border border-line bg-ink-950 px-4 py-3 text-[15px] leading-6 text-fog placeholder:text-dim focus:border-phos focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className={cn("text-xs", err ? "text-ember" : "text-dim")} role="status">
            {err || "Comments are stored locally in this site's database."}
          </p>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-fog px-5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-phos disabled:opacity-50"
          >
            {busy ? "Posting…" : "Post comment"}
          </button>
        </div>
      </form>
    </section>
  );
}

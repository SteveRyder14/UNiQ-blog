"use client";

import { useState } from "react";

export default function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const target =
      typeof window !== "undefined" ? window.location.href : url;
    try {
      await navigator.clipboard.writeText(target);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = target;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 rounded-full border border-line bg-ink-900 px-4 py-2.5 text-xs font-semibold text-mist transition-colors hover:border-phos/60 hover:text-phos"
    >
      {copied ? (
        <>
          <span className="text-phos">✓</span> copied
        </>
      ) : (
        <>
          <span aria-hidden="true">⎘</span> copy link
        </>
      )}
    </button>
  );
}

import React from "react";

/**
 * A small, safe markdown renderer for blog content.
 * Supports: ## / ### headings, paragraphs, **bold**, *italic*, `code`,
 * [links](url), - / * lists, 1. lists, > blockquotes, ``` fences, --- rules.
 * Renders React elements directly — no innerHTML anywhere.
 */

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const INLINE_RE =
  /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let j = 0;
  let m: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) {
      parts.push(
        <strong key={j++} className="font-medium text-fog">
          {t.slice(2, -2)}
        </strong>,
      );
    } else if (t.startsWith("`")) {
      parts.push(
        <code key={j++} className="inline-code">
          {t.slice(1, -1)}
        </code>,
      );
    } else if (t.startsWith("[")) {
      const mm = t.match(/\[([^\]]+)\]\(([^)\s]+)\)/)!;
      parts.push(
        <a key={j++} href={mm[2]} target="_blank" rel="noreferrer">
          {mm[1]}
        </a>,
      );
    } else {
      parts.push(<em key={j++}>{t.slice(1, -1)}</em>);
    }
    last = m.index + t.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/**
 * Deterministic, collision-safe heading id for a given title, given how many
 * times that title has already appeared. Must be called in document order —
 * both renderMarkdown and extractToc do.
 */
function nextId(title: string, seen: Map<string, number>): string {
  const base = slugify(title) || "section";
  const n = seen.get(base) ?? 0;
  seen.set(base, n + 1);
  return n === 0 ? base : `${base}-${n}`;
}

export function renderMarkdown(md: string): React.ReactNode {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  const k = () => `m${key++}`;
  const seenHeadingIds = new Map<string, number>();

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // fenced code
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        <div key={k()} className="code-block">
          <div className="code-head">
            <span>{lang || "txt"}</span>
            <span>▚ read-only</span>
          </div>
          <pre>
            <code>{buf.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    // headings
    if (line.startsWith("### ")) {
      const t = line.slice(4);
      out.push(
        <h3 key={k()} id={nextId(t, seenHeadingIds)}>
          {inline(t)}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const t = line.slice(3);
      out.push(
        <h2 key={k()} id={nextId(t, seenHeadingIds)}>
          {inline(t)}
        </h2>,
      );
      i++;
      continue;
    }

    // blockquote
    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(
        <blockquote key={k()}>
          {buf.map((b, j) => (
            <p key={j}>{inline(b)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      out.push(
        <ul key={k()}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      out.push(
        <ol key={k()}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // rule
    if (/^---+$/.test(line.trim())) {
      out.push(<hr key={k()} />);
      i++;
      continue;
    }

    // paragraph
    const buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("```") &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(<p key={k()}>{inline(buf.join(" "))}</p>);
  }

  return out;
}

/**
 * Extract h2 ids + titles for a table of contents.
 * Fence-aware (ignores ``` blocks) and uses the same collision-safe id logic
 * as the renderer, so anchors always line up.
 */
export function extractToc(md: string): Array<{ id: string; title: string }> {
  const toc: Array<{ id: string; title: string }> = [];
  const seen = new Map<string, number>();
  let inFence = false;
  for (const raw of md.split("\n")) {
    if (raw.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (raw.startsWith("## ")) {
      const display = raw.slice(3).replace(/\*\*/g, "");
      toc.push({ id: nextId(raw.slice(3), seen), title: display });
    }
  }
  return toc;
}

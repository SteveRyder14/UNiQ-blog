export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function readTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 210));
}

export function fmtDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateShort(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function topicAccent(topic: string): string {
  switch (topic) {
    case "Android":
      return "text-ember border-ember/40 bg-ember/10";
    case "Local AI":
      return "text-phos border-phos/40 bg-phos/10";
    case "Linux":
      return "text-sky border-sky/40 bg-sky/10";
    case "Audio":
      return "text-ember border-ember/40 bg-ember/10";
    case "Programming":
      return "text-phos border-phos/40 bg-phos/10";
    default:
      return "text-mist border-line-2 bg-ink-800";
  }
}

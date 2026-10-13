import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "content");

const manifest = [
  {
    file: "building-salvy.md",
    slug: "building-salvy",
    title: "Building Salvy: a local AI assistant that actually does things",
    excerpt:
      "Cloud assistants send your data out and send an answer back. Salvy runs the other direction — on my hardware, reading my screen, touching my files, and never phoning home. The architecture, the tools, and the latency lessons.",
    topic: "Local AI",
    tags: ["local-ai", "ollama", "automation", "privacy"],
    cover: "/images/cover-salvy.jpg",
    featured: true,
    position: 10,
    publishedAt: "2026-01-18T09:30:00+00:00",
  },
  {
    file: "ollama-on-a-200-laptop.md",
    slug: "ollama-on-a-200-laptop",
    title: "Running local LLMs on a $200 laptop — what's actually usable",
    excerpt:
      "8GB of RAM, integrated graphics, one stubborn dream: a useful assistant that never phones home. Three weeks of benchmarks and the honest envelope of what a budget machine can do.",
    topic: "Local AI",
    tags: ["local-ai", "budget", "hardware", "ollama"],
    cover: "/images/cover-ollama.jpg",
    featured: false,
    position: 9,
    publishedAt: "2026-01-05T18:00:00+00:00",
  },
  {
    file: "why-i-rooted-my-pixel.md",
    slug: "why-i-rooted-my-pixel",
    title: "Why I rooted my daily driver (and what the boot chain taught me)",
    excerpt:
      "Rooting isn't about unlocking a feature — it's about finally being allowed to read the boot sequence line by line. What changed, what it costs, and who should bother.",
    topic: "Android",
    tags: ["android", "root", "internals"],
    cover: "/images/cover-android.jpg",
    featured: false,
    position: 8,
    publishedAt: "2025-12-14T10:00:00+00:00",
  },
  {
    file: "magisk-modules-without-folklore.md",
    slug: "magisk-modules-without-folklore",
    title: "How Magisk modules hook into Android, minus the folklore",
    excerpt:
      "A module is just a zip that gets merged into the runtime system image at boot. Here's what actually happens, stage by stage — and the ten-second checklist before you enable anything.",
    topic: "Android",
    tags: ["android", "magisk", "internals"],
    cover: "/images/cover-magisk.jpg",
    featured: false,
    position: 7,
    publishedAt: "2025-11-28T21:15:00+00:00",
  },
  {
    file: "thirty-days-terminal.md",
    slug: "thirty-days-terminal",
    title: "30 days without a GUI: field notes from the terminal",
    excerpt:
      "I deleted my desktop and lived in tmux for a month. The DNS day that defined the experiment, the systemd units that stuck, and the surprisingly short list of what left my machine.",
    topic: "Linux",
    tags: ["linux", "systems", "privacy"],
    cover: "/images/cover-linux.jpg",
    featured: false,
    position: 6,
    publishedAt: "2025-11-02T08:45:00+00:00",
  },
  {
    file: "self-hosted-music.md",
    slug: "self-hosted-music",
    title: "Self-hosting my music: streaming FLACs around the apartment",
    excerpt:
      "I don't want my listening habits to be a data point. A $25 box, a 300-line server, and the 150-millisecond handshake that turns out to be the whole thing called 'streaming'.",
    topic: "Audio",
    tags: ["audio", "self-hosting", "linux"],
    cover: "/images/cover-music.jpg",
    featured: false,
    position: 5,
    publishedAt: "2025-10-12T20:30:00+00:00",
  },
  {
    file: "tic-tac-toe-five-times.md",
    slug: "tic-tac-toe-five-times",
    title: "I built tic-tac-toe five times. That's how I learn frameworks.",
    excerpt:
      "Same tiny game, five different stacks. By the end I could explain what the framework was actually doing — because I'd done it by hand first, nine cells at a time.",
    topic: "Programming",
    tags: ["programming", "learning", "frameworks"],
    cover: "/images/cover-tictactoe.jpg",
    featured: false,
    position: 4,
    publishedAt: "2025-09-21T16:00:00+00:00",
  },
];


if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required. Set it in your local .env file before restoring posts.");
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const tableCheck = await client.query("SELECT to_regclass('public.posts') AS tbl");
  if (!tableCheck.rows[0]?.tbl) {
    throw new Error("posts table not found — run `npm run db:push` first");
  }

  await client.query("BEGIN");
  await client.query("CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts (published_at DESC)");

  let added = 0;
  let kept = 0;
  for (const m of manifest) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, m.file), "utf8").trim();
    const result = await client.query(
      `INSERT INTO posts (slug, title, excerpt, content, cover, topic, tags, featured, published_at, updated_at, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (slug) DO NOTHING`,
      [m.slug, m.title, m.excerpt, content, m.cover, m.topic, m.tags, m.featured, m.publishedAt, m.publishedAt, m.position],
    );
    if (result.rowCount === 1) {
      added++;
      console.log(`+ restored ${m.slug}`);
    } else {
      kept++;
      console.log(`= kept existing post ${m.slug}`);
    }
  }

  await client.query("COMMIT");
  const count = await client.query("SELECT count(*)::int AS n FROM posts");
  console.log(`Done. Added ${added} posts; left ${kept} existing posts unchanged. Total posts in database: ${count.rows[0].n}.`);
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Post restore failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

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

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
});

if (!process.env.DATABASE_URL) {
  console.warn("warn: DATABASE_URL not set — using local default");
}

await client.connect();
try {
  const tableCheck = await client.query(
    "SELECT to_regclass('public.posts') AS tbl",
  );
  if (!tableCheck.rows[0]?.tbl) {
    throw new Error(
      "posts table not found — run `npx drizzle-kit push` before seeding",
    );
  }
  await client.query("BEGIN");
  await client.query("CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts (published_at DESC)");
  await client.query("CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments (post_id)");
  await client.query("DELETE FROM post_stats");
  await client.query("DELETE FROM comments");
  await client.query("DELETE FROM subscribers");
  await client.query("DELETE FROM posts");

  for (const m of manifest) {
    const content = fs
      .readFileSync(path.join(CONTENT_DIR, m.file), "utf8")
      .trim();
    await client.query(
      `INSERT INTO posts (slug, title, excerpt, content, cover, topic, tags, featured, published_at, updated_at, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        m.slug,
        m.title,
        m.excerpt,
        content,
        m.cover,
        m.topic,
        m.tags,
        m.featured,
        m.publishedAt,
        m.publishedAt,
        m.position,
      ],
    );
    console.log(`  + ${m.slug}`);
  }

  // a few seeded replies so the transmission log isn't empty
  const slugs = await client.query(`SELECT id, slug FROM posts`);
  const id = (slug) =>
    slugs.rows.find((r) => r.slug === slug)?.id;

  const seedComments = [
    {
      postId: id("building-salvy"),
      name: "kernel_kate",
      body: "The 'reason' field on every gated shell call is the detail most agent write-ups skip. It turns a log line into an audit trail. Salvy looks genuinely useful — not a demo.",
      createdAt: "2026-01-19T11:12:00+00:00",
    },
    {
      name: "dev_ken",
      postId: id("building-salvy"),
      body: "24 tok/s with streaming really is the sweet spot. I ran the same 7B setup and the 'I can't read this' fallback you mention is the exact feature I'm missing in mine. Looking forward to the OCR deep-dive.",
      createdAt: "2026-01-20T15:40:00+00:00",
    },
    {
      postId: id("why-i-rooted-my-pixel"),
      name: "rom_rom",
      body: "A product is a promise someone else keeps. A system is a promise I keep. Stole that line for my own ROM build thread.",
      createdAt: "2025-12-15T09:05:00+00:00",
    },
    {
      postId: id("ollama-on-a-200-laptop"),
      name: "budgetbytes",
      body: "The context-window/latency table (list) saved me from a 7B misconfiguration on my own old ThinkPad. Small context, 3B model, happy machine. Thanks for the numbers-vibes split.",
      createdAt: "2026-01-06T19:22:00+00:00",
    },
    {
      postId: id("thirty-days-terminal"),
      name: "wayland_wal",
      body: "journalctl -f as a habit is the tip I needed two years ago. Also: 'the terminal doesn't remove the problem, it removes the black box' — accurate.",
      createdAt: "2025-11-03T07:58:00+00:00",
    },
    {
      postId: id("tic-tac-toe-five-times"),
      name: "nine_cells",
      body: "Pass 3 is the whole trick and almost nobody names it: state in, tree out. Reading your side-by-side diff against a real framework would be the ideal follow-up.",
      createdAt: "2025-09-22T13:31:00+00:00",
    },
  ];

  for (const c of seedComments) {
    await client.query(
      `INSERT INTO comments (post_id, name, body, created_at) VALUES ($1, $2, $3, $4)`,
      [c.postId, c.name, c.body, c.createdAt],
    );
  }
  console.log(`  + ${seedComments.length} comments`);

  // plausible starting engagement so the counters read as a live blog
  const seedStats = {
    "building-salvy": [2841, 134],
    "ollama-on-a-200-laptop": [1967, 88],
    "why-i-rooted-my-pixel": [1534, 71],
    "magisk-modules-without-folklore": [1120, 54],
    "thirty-days-terminal": [1388, 63],
    "self-hosted-music": [874, 41],
    "tic-tac-toe-five-times": [1045, 49],
  };
  for (const [slug, [views, likes]] of Object.entries(seedStats)) {
    const pid = id(slug);
    if (!pid) continue;
    await client.query(
      `INSERT INTO post_stats (post_id, views, likes) VALUES ($1, $2, $3)
       ON CONFLICT (post_id) DO UPDATE SET views = $2, likes = $3`,
      [pid, views, likes],
    );
  }
  console.log(`  + stats for ${Object.keys(seedStats).length} posts`);

  await client.query("COMMIT");
  const count = await client.query("SELECT count(*)::int AS n FROM posts");
  console.log(`Seeded ${count.rows[0].n} posts. Done.`);
} catch (e) {
  await client.query("ROLLBACK");
  console.error("Seed failed:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

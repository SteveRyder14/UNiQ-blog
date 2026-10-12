import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().toLowerCase();
  const all = await getPosts();

  const results = (
    q
      ? all
          .map((p) => {
            const title = p.title.toLowerCase();
            const excerpt = p.excerpt.toLowerCase();
            const tags = p.tags.join(" ").toLowerCase();
            const topic = p.topic.toLowerCase();
            let score = 0;
            if (title.startsWith(q)) score += 100;
            if (title.includes(q)) score += 50;
            if (tags.includes(q)) score += 25;
            if (topic.includes(q)) score += 20;
            if (excerpt.includes(q)) score += 10;
            return { p, score };
          })
          .filter((r) => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((r) => r.p)
      : all
  ).slice(0, 8);

  return Response.json({
    results: results.map((p) => ({
      slug: p.slug,
      title: p.title,
      topic: p.topic,
      readMin: p.readMin,
      tags: p.tags.slice(0, 3),
    })),
  });
}

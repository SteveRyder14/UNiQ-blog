import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { comments, posts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const { postId, name, body: text } = (body ?? {}) as {
    postId?: number;
    name?: string;
    body?: string;
  };

  if (
    typeof postId !== "number" ||
    !Number.isInteger(postId) ||
    postId <= 0
  ) {
    return Response.json({ error: "postId is required" }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 40) {
    return Response.json(
      { error: "handle must be 2–40 characters" },
      { status: 400 },
    );
  }
  if (typeof text !== "string" || text.trim().length < 2 || text.trim().length > 1200) {
    return Response.json(
      { error: "message must be 2–1200 characters" },
      { status: 400 },
    );
  }

  const cleanName = name.trim().replace(/[<>]/g, "").trim();
  const cleanText = text.trim();
  if (cleanName.length < 2) {
    return Response.json(
      { error: "handle too short after cleanup" },
      { status: 400 },
    );
  }

  const existing = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);
  if (!existing.length) {
    return Response.json({ error: "post not found" }, { status: 404 });
  }

  const [created] = await db
    .insert(comments)
    .values({ postId, name: cleanName, body: cleanText })
    .returning();

  const row = await db
    .select()
    .from(comments)
    .where(eq(comments.id, created.id))
    .limit(1);

  return Response.json(
    {
      comment: {
        id: row[0].id,
        name: row[0].name,
        body: row[0].body,
        createdAt: row[0].createdAt.toISOString(),
      },
    },
    { status: 201 },
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = Number(url.searchParams.get("postId"));
  if (!Number.isInteger(postId)) {
    return Response.json({ error: "postId query param required" }, { status: 400 });
  }
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
  return Response.json({
    comments: rows.map((c) => ({
      id: c.id,
      name: c.name,
      body: c.body,
      createdAt: c.createdAt.toISOString(),
    })),
  });
}

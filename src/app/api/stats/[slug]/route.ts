import { getPostBySlug } from "@/lib/posts";
import { getStats, addView, addLike } from "@/lib/stats";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return Response.json({ error: "post not found" }, { status: 404 });
  return Response.json(await getStats(post.id));
}

export async function POST(req: Request, { params }: Ctx) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return Response.json({ error: "post not found" }, { status: 404 });

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine */
  }
  const action = (body as { action?: string }).action;

  if (action === "view") return Response.json(await addView(post.id));
  if (action === "like") return Response.json(await addLike(post.id, 1));
  if (action === "unlike") return Response.json(await addLike(post.id, -1));

  return Response.json({ error: "unknown action" }, { status: 400 });
}

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

/** Walk a (possibly drizzle-wrapped) error chain for a pg error code. */
function pgErrorCode(e: unknown): string | undefined {
  let cur: unknown = e;
  for (let i = 0; i < 4 && cur; i++) {
    const c = (cur as { code?: unknown }).code;
    if (typeof c === "string") return c;
    cur = (cur as { cause?: unknown }).cause;
  }
  return undefined;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const { email } = (body ?? {}) as { email?: string };
  if (typeof email !== "string") {
    return Response.json({ error: "a valid email is required" }, { status: 400 });
  }
  const clean = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return Response.json({ error: "a valid email is required" }, { status: 400 });
  }
  if (clean.length > 120) {
    return Response.json({ error: "email too long" }, { status: 400 });
  }

  // deterministic duplicate check first
  const existing = await db
    .select({ id: subscribers.id })
    .from(subscribers)
    .where(eq(subscribers.email, clean))
    .limit(1);
  if (existing.length > 0) {
    return Response.json({ ok: true, already: true }, { status: 200 });
  }

  try {
    await db.insert(subscribers).values({ email: clean });
    return Response.json({ ok: true, already: false }, { status: 201 });
  } catch (e) {
    // race: inserted between the check and the insert
    if (pgErrorCode(e) === "23505" || String(e).includes("duplicate key")) {
      return Response.json({ ok: true, already: true }, { status: 200 });
    }
    throw e;
  }
}

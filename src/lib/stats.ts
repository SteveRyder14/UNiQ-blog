import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { postStats } from "@/db/schema";

export type Stats = { views: number; likes: number };

export async function getStats(postId: number): Promise<Stats> {
  const rows = await db
    .select({ views: postStats.views, likes: postStats.likes })
    .from(postStats)
    .where(eq(postStats.postId, postId))
    .limit(1);
  return rows[0] ?? { views: 0, likes: 0 };
}

/** Atomic upsert-and-increment. Safe under concurrency. */
async function bump(
  postId: number,
  field: "views" | "likes",
  by: number,
): Promise<Stats> {
  const column = field === "views" ? postStats.views : postStats.likes;
  const rows = await db
    .insert(postStats)
    .values({
      postId,
      views: field === "views" ? by : 0,
      likes: field === "likes" ? by : 0,
    })
    .onConflictDoUpdate({
      target: postStats.postId,
      set: {
        [field]: sql`${column} + ${by}`,
        updatedAt: new Date(),
      },
    })
    .returning({ views: postStats.views, likes: postStats.likes });
  return rows[0] ?? { views: 0, likes: 0 };
}

export const addView = (postId: number) => bump(postId, "views", 1);
export const addLike = (postId: number, delta: 1 | -1) =>
  bump(postId, "likes", delta);

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { readTime } from "./utils";

export type PostSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  topic: string;
  tags: string[];
  featured: boolean;
  dateIso: string;
  readMin: number;
};

export type PostFull = PostSummary & {
  content: string;
};

function toSummary(row: typeof posts.$inferSelect): PostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    cover: row.cover,
    topic: row.topic,
    tags: row.tags ?? [],
    featured: row.featured,
    dateIso: row.publishedAt.toISOString(),
    readMin: readTime(row.content),
  };
}

export async function getPosts(): Promise<PostSummary[]> {
  const rows = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.publishedAt), desc(posts.position));
  return rows.map(toSummary);
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  if (!rows.length) return null;
  return { ...toSummary(rows[0]), content: rows[0].content };
}

export async function getRelated(
  excludeSlug: string,
  topic: string,
): Promise<PostSummary[]> {
  const all = await getPosts();
  const sameTopic = all.filter(
    (p) => p.slug !== excludeSlug && p.topic === topic,
  );
  const others = all.filter(
    (p) => p.slug !== excludeSlug && p.topic !== topic,
  );
  return [...sameTopic, ...others].slice(0, 3);
}

export async function getAllTags(): Promise<string[]> {
  const rows = await db
    .select({ tags: posts.tags })
    .from(posts)
    .execute();
  const set = new Set<string>();
  for (const r of rows) for (const t of r.tags ?? []) set.add(t);
  return [...set].sort();
}

/** Tags with how many posts carry each, most used first. */
export async function getTagCounts(): Promise<
  Array<{ tag: string; count: number }>
> {
  const all = await getPosts();
  const map = new Map<string, number>();
  for (const p of all) {
    for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string): Promise<PostSummary[]> {
  const all = await getPosts();
  const needle = tag.toLowerCase();
  return all.filter((p) => p.tags.some((t) => t.toLowerCase() === needle));
}

/** Posts grouped by publication year, newest year first. */
export async function getArchive(): Promise<
  Array<{ year: number; posts: PostSummary[] }>
> {
  const all = await getPosts();
  const map = new Map<number, PostSummary[]>();
  for (const p of all) {
    const y = new Date(p.dateIso).getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(p);
  }
  return [...map.entries()]
    .map(([year, items]) => ({ year, posts: items }))
    .sort((a, b) => b.year - a.year);
}

export type TopicCount = { topic: string; count: number };

export async function getTopicCounts(): Promise<TopicCount[]> {
  const all = await getPosts();
  const map = new Map<string, number>();
  for (const p of all) map.set(p.topic, (map.get(p.topic) ?? 0) + 1);
  return [...map.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

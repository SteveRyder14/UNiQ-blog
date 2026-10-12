import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { getPostBySlug, getRelated } from "@/lib/posts";
import { renderMarkdown, extractToc } from "@/lib/markdown";
import Reveal from "@/components/Reveal";
import ReadingProgress from "@/components/ReadingProgress";
import CopyLink from "@/components/CopyLink";
import CommentSection from "@/components/CommentSection";
import SubscribeBand from "@/components/SubscribeBand";
import TocScroll from "@/components/TocScroll";
import PostEngagement from "@/components/PostEngagement";
import { getStats } from "@/lib/stats";
import { IconGitHub, IconClock, IconArrow } from "@/components/icons";
import { cn, fmtDate, topicAccent } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "404 — not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelated(post.slug, post.topic);
  const toc = extractToc(post.content);
  const [dbComments, stats] = await Promise.all([
    db
      .select()
      .from(comments)
      .where(eq(comments.postId, post.id))
      .orderBy(desc(comments.createdAt)),
    getStats(post.id),
  ]);

  return (
    <main className="pt-14">
      {/* header */}
      <section className="grid-bg border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
          <Reveal variant="uncover">
            <nav className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] tracking-wider text-dim">
              <Link href="/" className="transition-colors hover:text-phos">
                ~/blog
              </Link>
              <span>/</span>
              <span className="text-mist">{post.topic.toLowerCase()}</span>
              <span>/</span>
              <span className="truncate text-dim">{post.slug}</span>
            </nav>
            <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span className={cn("border px-2.5 py-1", topicAccent(post.topic))}>
                {post.topic}
              </span>
              {post.featured && (
                <span className="border border-line-2 px-2.5 py-1 text-mist">
                  ★ featured
                </span>
              )}
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-3xl font-semibold leading-[1.12] tracking-tight text-fog sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] text-dim">
              <span>
                by <span className="text-phos">UNiQ</span>
              </span>
              <span>{fmtDate(post.dateIso)}</span>
              <span className="flex items-center gap-1.5">
                <IconClock className="h-3.5 w-3.5" /> {post.readMin} min read
              </span>
              <span className="hidden sm:inline">
                {post.tags.map((t) => `#${t}`).join("  ")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* article */}
        <article className="min-w-0">
          <Reveal variant="uncover">
            <figure className="relative mb-10 overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover}
                alt={post.title}
                className="photo kenburns aspect-[16/8] w-full object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
              <span className="sweep-line" aria-hidden="true" />
              <figcaption className="absolute bottom-3 left-3 bg-ink-950/80 px-2.5 py-1 font-mono text-[10.5px] tracking-wider text-mist">
                fig. 01 — {post.topic.toLowerCase()}/{post.slug}
              </figcaption>
            </figure>
          </Reveal>
          <Reveal>
            <div className="md">{renderMarkdown(post.content)}</div>
          </Reveal>

          <Reveal>
            <div className="mt-14 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-dim">
              <span className="hairline flex-1" aria-hidden="true" />
              end of transmission
              <span className="hairline flex-1" aria-hidden="true" />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t)}`}
                  className="border border-line px-3 py-1.5 font-mono text-[11px] tracking-wider text-mist transition-colors duration-200 hover:border-phos/50 hover:text-phos"
                >
                  #{t}
                </Link>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <PostEngagement
                slug={post.slug}
                initialViews={stats.views}
                initialLikes={stats.likes}
              />
              <span className="ml-auto flex gap-2">
                <a
                  href="https://github.com/SteveRyder14"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mist transition-colors hover:border-phos/60 hover:text-phos"
                >
                  <IconGitHub className="h-4 w-4" /> github
                </a>
                <CopyLink url={`/blog/${post.slug}`} />
              </span>
            </div>
          </Reveal>

          <Reveal>
            <CommentSection
              postId={post.id}
              initial={dbComments.map((c) => ({
                id: c.id,
                name: c.name,
                body: c.body,
                createdAt: c.createdAt.toISOString(),
              }))}
            />
          </Reveal>
        </article>

        {/* sticky sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Reveal delay={100}>
            <div className="border border-line bg-ink-900/70">
              <div className="border-b border-line px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.24em] text-dim">
                ./on-this-page
              </div>
              {toc.length > 0 ? (
                <TocScroll toc={toc} />
              ) : (
                <p className="p-4 font-mono text-[12px] text-dim">one long rant, no headings.</p>
              )}
            </div>
            <div className="mt-5 border border-line bg-ink-900/70 p-4">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-dim">
                ./meta
              </p>
              <dl className="mt-3 space-y-2.5 font-mono text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-dim">topic</dt>
                  <dd className="text-mist">{post.topic}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-dim">published</dt>
                  <dd className="text-mist">{fmtDate(post.dateIso)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-dim">read time</dt>
                  <dd className="text-mist">{post.readMin} min</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-dim">local?</dt>
                  <dd className="text-phos">yes ✓</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <Reveal>
              <p className="shimmer font-mono text-[12px] uppercase tracking-[0.3em]">
                <span className="text-phos">//</span> keep reading
              </p>
            </Reveal>
            <Reveal
              stagger
              variant="up"
              className="mt-6 grid gap-5 md:grid-cols-3"
            >
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="lift group relative flex h-full flex-col overflow-hidden border border-line bg-ink-900 p-5 transition-[border-color,transform,box-shadow] duration-300 ease-out hover:border-phos/50"
                >
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim">
                      {r.topic} · {r.readMin} min
                    </span>
                    <h3 className="mt-3 font-display text-[1.05rem] font-semibold leading-snug text-fog transition-colors group-hover:text-phos">
                      {r.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[0.88rem] leading-relaxed text-mist">
                      {r.excerpt}
                    </p>
                    <span className="nudge mt-auto flex items-center gap-2 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-phos">
                      open
                      <IconArrow className="h-3.5 w-3.5" />
                    </span>
                  </Link>
              ))}
            </Reveal>
          </div>
        </section>
      )}
      <SubscribeBand />
    </main>
  );
}

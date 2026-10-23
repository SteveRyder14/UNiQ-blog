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
import Logo from "@/components/Logo";
import { getStats } from "@/lib/stats";
import { IconArrow, IconClock, IconGitHub } from "@/components/icons";
import { fmtDate } from "@/lib/utils";

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
    <main className="pt-[72px]">
      <ReadingProgress />

      <header className="mx-auto max-w-[980px] px-5 pb-12 pt-14 sm:px-8 lg:pt-20">
        <Reveal>
            <nav className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-dim">
            <Link href="/" className="transition-colors hover:text-fog">
              ~/journal
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/archive" className="transition-colors hover:text-fog">
              archive
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-phos">{post.topic.toLowerCase()}</span>
          </nav>

          <div className="mt-9 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-phos/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-phos">
              {post.topic}
            </span>
            {post.featured && (
              <span className="rounded-full border border-line bg-ink-900 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.7rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-fog">
            {post.title}
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-mist">{post.excerpt}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-line py-5">
            <div className="flex items-center gap-3">
              <Logo className="h-11 w-11" />
              <div>
                <p className="text-sm font-semibold text-fog">UNiQ</p>
                <p className="text-xs text-dim">Author</p>
              </div>
            </div>
            <span className="hidden h-8 w-px bg-line sm:block" />
            <div>
              <p className="text-sm font-medium text-fog">{fmtDate(post.dateIso)}</p>
              <p className="text-xs text-dim">Published</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-fog">
                <IconClock className="h-4 w-4" />
                {post.readMin} minutes
              </p>
              <p className="text-xs text-dim">Reading time</p>
            </div>
          </div>
        </Reveal>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <Reveal>
          <figure className="overflow-hidden rounded-[28px] border border-line-2 bg-ink-900 p-2 shadow-[0_28px_60px_-38px_rgba(8,22,14,0.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover}
              alt={post.title}
              className="aspect-[16/8] w-full rounded-[21px] object-cover"
            />
          </figure>
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-[1180px] gap-14 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,760px)_290px] lg:justify-between lg:py-20">
        <article className="min-w-0">
          <Reveal>
            <div className="md">{renderMarkdown(post.content)}</div>
          </Reveal>

          <Reveal>
            <div className="mt-16 border-t border-line pt-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-dim">
                Filed under
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-full border border-line bg-ink-900 px-3.5 py-2 text-xs font-medium text-mist transition-colors hover:border-phos hover:text-phos"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-ink-900/70 p-4 sm:p-5">
                <PostEngagement
                  slug={post.slug}
                  initialViews={stats.views}
                  initialLikes={stats.likes}
                />
                <div className="ml-auto flex flex-wrap gap-2">
                  <a
                    href="https://github.com/SteveRyder14"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-900 px-4 py-2.5 text-xs font-semibold text-mist transition-colors hover:border-line-2 hover:text-fog"
                  >
                    <IconGitHub className="h-4 w-4" />
                    GitHub
                  </a>
                  <CopyLink url={`/blog/${post.slug}`} />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <CommentSection
              postId={post.id}
              initial={dbComments.map((comment) => ({
                id: comment.id,
                name: comment.name,
                body: comment.body,
                createdAt: comment.createdAt.toISOString(),
              }))}
            />
          </Reveal>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Reveal delay={100}>
            <div className="rounded-3xl border border-line bg-ink-900/80 p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-dim">
                On this page
              </p>
              <div className="mt-4">
                {toc.length > 0 ? (
                  <TocScroll toc={toc} />
                ) : (
                  <p className="text-sm leading-6 text-mist">
                    This note flows as one continuous piece.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-fog p-6 text-ink-950">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-950/60">
                About the author
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
                UNiQ opens the hood.
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-950/70">
                Notes on Android, Linux, local AI, audio and learning by
                building, breaking and understanding.
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
              >
                More about UNiQ
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-ink-900/45">
          <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-phos">
                    Keep exploring
                  </p>
                  <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-fog">
                    Related notes
                  </h2>
                </div>
                <Link href="/archive" className="text-sm font-semibold text-phos hover:text-fog">
                  Browse the archive →
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 70}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="story-card group block h-full overflow-hidden rounded-[24px] border border-line bg-ink-900"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="p-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-phos">
                        {item.topic}
                        <span className="ml-2 font-medium normal-case tracking-normal text-dim">
                          {item.readMin} min
                        </span>
                      </p>
                      <h3 className="mt-3 font-display text-[1.4rem] font-semibold leading-tight text-fog group-hover:text-phos">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-mist">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <SubscribeBand />
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import PostRow from "@/components/PostRow";
import SubscribeBand from "@/components/SubscribeBand";
import { getPostsByTag, getTagCounts } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `Field notes tagged #${decoded}.`,
  };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const [posts, allTags] = await Promise.all([
    getPostsByTag(decoded),
    getTagCounts(),
  ]);

  if (posts.length === 0) notFound();

  const related = allTags.filter(
    (t) => t.tag.toLowerCase() !== decoded.toLowerCase(),
  );

  return (
    <main className="pt-14">
      <section className="grid-bg border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6">
          <Reveal variant="uncover">
            <nav className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] tracking-wider text-dim">
              <Link href="/" className="transition-colors hover:text-phos">
                ~/blog
              </Link>
              <span>/</span>
              <Link href="/tags" className="transition-colors hover:text-phos">
                tags
              </Link>
              <span>/</span>
              <span className="text-mist">{decoded}</span>
            </nav>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-fog sm:text-5xl">
              <span className="text-phos">#</span>
              {decoded}
            </h1>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em] text-dim">
              {posts.length} {posts.length === 1 ? "note" : "notes"} tagged
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal stagger className="grid gap-3">
          {posts.map((p) => (
            <PostRow key={p.slug} post={p} />
          ))}
        </Reveal>

        {related.length > 0 && (
          <Reveal className="mt-14">
            <div className="hairline mb-6" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim">
              other tags
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {related.map((t) => (
                <Link
                  key={t.tag}
                  href={`/tags/${encodeURIComponent(t.tag)}`}
                  className="border border-line px-3 py-1.5 font-mono text-[11px] tracking-wider text-mist transition-colors duration-200 hover:border-phos/50 hover:text-phos"
                >
                  #{t.tag}
                  <span className="ml-1.5 text-dim">{t.count}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <SubscribeBand />
    </main>
  );
}

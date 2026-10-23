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
    (item) => item.tag.toLowerCase() !== decoded.toLowerCase(),
  );

  return (
    <main className="pt-[72px]">
      <section className="mx-auto max-w-[1280px] px-5 pb-14 pt-16 sm:px-8 lg:pt-24">
        <Reveal>
          <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-dim">
            <Link href="/" className="transition-colors hover:text-fog">
              Journal
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/tags" className="transition-colors hover:text-fog">
              Topics
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-mist">#{decoded}</span>
          </nav>

          <h1 className="mt-8 font-display text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-fog">
            <span className="text-phos">#</span>
            {decoded}
          </h1>
          <p className="mt-6 text-lg text-mist">
            {posts.length} {posts.length === 1 ? "note" : "notes"} with this tag.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1080px] px-5 pb-20 sm:px-8">
        <Reveal stagger className="grid gap-4">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </Reveal>

        {related.length > 0 && (
          <Reveal className="mt-16">
            <div className="border-t border-line pt-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-dim">
                More topics
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {related.map((item) => (
                  <Link
                    key={item.tag}
                    href={`/tags/${encodeURIComponent(item.tag)}`}
                    className="rounded-full border border-line bg-ink-900 px-3.5 py-2 text-xs font-medium text-mist transition-colors hover:border-phos hover:text-phos"
                  >
                    #{item.tag}
                    <span className="ml-1.5 text-dim">{item.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </section>

      <SubscribeBand />
    </main>
  );
}

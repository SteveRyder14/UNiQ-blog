import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PostRow from "@/components/PostRow";
import SubscribeBand from "@/components/SubscribeBand";
import { getArchive, getPosts, getTopicCounts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "archive",
  description: "Every field note, grouped by year.",
};

export default async function ArchivePage() {
  const [groups, all, topics] = await Promise.all([
    getArchive(),
    getPosts(),
    getTopicCounts(),
  ]);

  return (
    <main className="pt-[72px]">
      <section className="mx-auto max-w-[1280px] px-5 pb-14 pt-16 sm:px-8 lg:pt-24">
        <Reveal>
          <p className="cmd-type font-mono text-[10px] uppercase tracking-[0.26em] text-phos">
            <span aria-hidden="true">$</span> ls -la ./journal --group-by year
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-fog">
            Every note, in order.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-mist">
            The complete journal—projects, experiments and fixes, grouped by
            year and newest first.
          </p>
        </Reveal>

        <Reveal stagger className="mt-10 flex flex-wrap gap-2">
          <span className="rounded-full bg-fog px-4 py-2 text-xs font-semibold text-ink-950">
            {all.length} notes total
          </span>
          {topics.map((topic) => (
            <span
              key={topic.topic}
              className="rounded-full border border-line bg-ink-900 px-4 py-2 text-xs font-medium text-mist"
            >
              {topic.topic} · {topic.count}
            </span>
          ))}
        </Reveal>
      </section>

      <div className="mx-auto max-w-[1080px] px-5 pb-20 sm:px-8">
        {groups.map((group, groupIndex) => (
          <section key={group.year} className={groupIndex > 0 ? "mt-16" : ""}>
            <Reveal>
              <div className="mb-6 flex items-center gap-5">
                <h2 className="font-display text-4xl font-semibold tracking-tight text-fog">
                  {group.year}
                </h2>
                <span className="hairline flex-1" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-dim">
                  {group.posts.length} {group.posts.length === 1 ? "note" : "notes"}
                </span>
              </div>
            </Reveal>

            <Reveal stagger className="grid gap-4">
              {group.posts.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </Reveal>
          </section>
        ))}
      </div>

      <SubscribeBand />
    </main>
  );
}

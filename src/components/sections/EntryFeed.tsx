"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useDiaryHelpers } from "@/components/providers/DiaryProvider";
import { EntryReactions } from "@/components/ui/entry-reactions";
import { PhotoLayoutView } from "@/components/ui/photo-layout";
import { formatDisplayDate } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

export function EntryFeed() {
  const { memories } = useDiaryHelpers();
  const newestFirst = [...memories].reverse();

  if (memories.length === 0) {
    return (
      <section className="border border-[var(--line)] px-6 py-12 text-center md:px-12 md:py-16">
        <p className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
          Memories
        </p>
        <h2 className="font-display mt-4 text-3xl text-[var(--ink)] md:text-4xl">
          Nothing here yet — and that is fine
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
          Come back when a moment feels worth keeping. One page is enough.
        </p>
        <Link href="/write" className="btn-solid mt-10 inline-flex">
          Add a page
        </Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="entries-heading">
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <div>
          <p className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
            Kept
          </p>
          <h2
            id="entries-heading"
            className="font-display mt-2 text-3xl text-[var(--ink)] md:text-4xl lg:text-5xl"
          >
            Memories
          </h2>
        </div>
        <Link
          href="/#book"
          className="reveal-link text-[11px] tracking-[0.14em] uppercase"
        >
          Full index
        </Link>
      </div>

      <div className="space-y-16 md:space-y-24 lg:space-y-28">
        {newestFirst.map((memory, i) => {
          const weekday = new Date(
            `${memory.date}T12:00:00`,
          ).toLocaleDateString("en-US", { weekday: "long" });
          const hasMedia = memory.media.length > 0;

          return (
            <motion.article
              key={memory.id}
              id={memory.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: 0.9,
                delay: Math.min(i, 3) * 0.05,
                ease: easeOut,
              }}
            >
              <div
                className={
                  hasMedia
                    ? "grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16"
                    : "mx-auto max-w-2xl"
                }
              >
                {hasMedia && (
                  <div className="overflow-hidden lg:sticky lg:top-24">
                    <PhotoLayoutView
                      media={memory.media}
                      layout={memory.layout}
                    />
                  </div>
                )}

                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[var(--ink-faint)] uppercase">
                    {formatDisplayDate(memory.date)}
                    <span className="mx-2 text-[var(--line-strong)]">/</span>
                    {weekday}
                  </p>

                  <h3 className="font-display mt-3 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink)]">
                    {memory.title}
                  </h3>

                  {memory.tagline && (
                    <p className="mt-2 text-sm italic text-[var(--amber)]">
                      {memory.tagline}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {memory.mood && <span className="pill">{memory.mood}</span>}
                    {memory.location && (
                      <span className="pill">{memory.location}</span>
                    )}
                    {(memory.tags ?? []).map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="font-serif mt-7 text-[1.1rem] leading-[1.75] text-[var(--ink-soft)] md:mt-8 md:text-[1.2rem]">
                    {memory.story}
                  </p>

                  <EntryReactions
                    entryId={memory.id}
                    initial={memory.reactions}
                  />
                </div>
              </div>

              <div className="editorial-rule mt-14 md:mt-20" />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

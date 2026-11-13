"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useDiaryHelpers } from "@/components/providers/DiaryProvider";
import { formatDisplayDate } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

export function BookSection() {
  const { memories, site } = useDiaryHelpers();

  const byMonth = useMemo(() => {
    const map = new Map<string, typeof memories>();
    for (const m of memories) {
      const d = new Date(`${m.date}T12:00:00`);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries()).map(([key, items]) => ({
      key,
      label: new Date(`${items[0].date}T12:00:00`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      items,
    }));
  }, [memories]);

  return (
    <section
      id="book"
      className="mt-20 pt-4 md:mt-28 lg:mt-32"
      aria-labelledby="book-heading"
    >
      <motion.div
        className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div>
          <p className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
            Index
          </p>
          <h2
            id="book-heading"
            className="font-display mt-3 text-3xl text-[var(--ink)] md:text-5xl"
          >
            {site.coupleName}
          </h2>
          <p className="mt-3 max-w-md text-sm text-[var(--ink-soft)]">
            Everything you have kept so far — oldest to newest. Come back anytime.
          </p>
        </div>
        <p className="hidden text-[10px] tracking-[0.22em] text-[var(--ink-faint)] uppercase lg:block">
          {memories.length} pages
        </p>
      </motion.div>

      {byMonth.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--ink-faint)]">
          Chapters appear as you write.
        </p>
      ) : (
        <div className="mt-12 space-y-12">
          {byMonth.map((month) => (
            <div key={month.key}>
              <h3 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
                {month.label}
              </h3>
              <ul className="mt-6">
                {month.items.map((item) => (
                  <li
                    key={item.id}
                    className="border-t border-[var(--line)] first:border-t-0"
                  >
                    <a
                      href={`#${item.id}`}
                      className="group flex flex-col gap-1 py-5 transition-colors md:flex-row md:items-baseline md:gap-8"
                    >
                      <span className="shrink-0 text-[11px] tracking-[0.14em] text-[var(--ink-faint)] uppercase">
                        {formatDisplayDate(item.date)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="inline border-b border-transparent text-sm text-[var(--ink)] transition-colors group-hover:border-[var(--amber)] group-hover:text-[var(--amber)] md:text-base">
                          {item.title}
                        </span>
                        {item.tagline && (
                          <span className="mt-0.5 block text-xs text-[var(--ink-faint)]">
                            {item.tagline}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 text-[10px] tracking-[0.14em] text-[var(--amber)] uppercase opacity-0 transition-opacity group-hover:opacity-100 md:mt-0">
                        Open
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

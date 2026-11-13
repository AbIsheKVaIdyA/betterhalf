"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDiaryHelpers } from "@/components/providers/DiaryProvider";
import { easeOut } from "@/lib/motion";

function daysTogether(startIso: string) {
  const start = new Date(`${startIso}T12:00:00`);
  const now = new Date();
  return Math.max(
    0,
    Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export function SiteHero() {
  const { site, memories } = useDiaryHelpers();
  const [days, setDays] = useState(0);

  useEffect(() => {
    setDays(daysTogether(site.startDate));
  }, [site.startDate]);

  return (
    <section className="pt-4 md:pt-6 lg:pt-2" aria-labelledby="brand-heading">
      <motion.p
        className="text-[11px] tracking-[0.35em] text-[var(--ink-faint)] uppercase"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        Ours · whenever
      </motion.p>

      <motion.h1
        id="brand-heading"
        className="font-display mt-5 max-w-2xl text-[clamp(2.8rem,8vw,5.75rem)] leading-[0.92] tracking-[-0.03em] text-[var(--ink)] lg:mt-7"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.08, ease: easeOut }}
      >
        {site.coupleName}
      </motion.h1>

      <motion.p
        className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--ink-soft)] md:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.25 }}
      >
        {site.heroSubline}
      </motion.p>

      <motion.div
        className="mt-9 flex flex-wrap items-end gap-8 md:mt-11 md:gap-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.35 }}
      >
        <div>
          <p className="font-display text-4xl text-[var(--ink)] md:text-5xl">
            {days}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.22em] text-[var(--ink-faint)] uppercase">
            Days together
          </p>
        </div>
        <div>
          <p className="font-display text-4xl text-[var(--ink)] md:text-5xl">
            {memories.length}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.22em] text-[var(--ink-faint)] uppercase">
            Memories kept
          </p>
        </div>
        <Link href="/write" className="btn-solid self-center sm:ml-auto lg:ml-0">
          Add a page
        </Link>
      </motion.div>
    </section>
  );
}

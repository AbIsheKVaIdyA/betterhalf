"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { easeOut } from "@/lib/motion";

const sparks = [
  "A moment that still sits with you",
  "Something small you do not want to lose",
  "A place that felt like yours",
  "How the day felt, not what you did",
  "A photo with a story behind it",
  "A quiet ordinary that mattered",
];

export function PromptCard() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const spark = sparks[index % sparks.length];

  return (
    <motion.section
      aria-labelledby="invite-heading"
      className="lg:border-l lg:border-[var(--line)] lg:pl-12 xl:pl-16"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: easeOut }}
    >
      <p className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
        No rush
      </p>
      <h2
        id="invite-heading"
        className="font-display mt-3 text-2xl leading-tight text-[var(--ink)] md:text-3xl lg:text-[2rem]"
      >
        Write when it feels right
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
        Not every day. Not on a schedule. Just whenever you have time — or when
        a memory asks to be kept.
      </p>

      <div className="mt-8 border border-[var(--line)] bg-[var(--bg-elevated)]/60 p-5 md:p-6 lg:mt-10">
        <p className="text-[10px] tracking-[0.22em] text-[var(--ink-faint)] uppercase">
          Starting point
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={spark}
            className="font-display mt-3 text-lg text-[var(--ink)] md:text-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            {spark}
          </motion.p>
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/write?${new URLSearchParams({ prompt: spark }).toString()}`,
              )
            }
            className="btn-solid !px-4 !py-3"
          >
            Write from this
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="btn-ghost !px-4 !py-3"
          >
            Another spark
          </button>
          <Link
            href="/write"
            className="reveal-link w-full text-[11px] tracking-[0.14em] uppercase sm:ml-auto sm:w-auto"
          >
            Blank page
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

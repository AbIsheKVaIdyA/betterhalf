"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDiaryHelpers } from "@/components/providers/DiaryProvider";
import { Lightbox } from "@/components/ui/lightbox";
import { blurDataURL } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

export function MomentsStrip() {
  const { gallery } = useDiaryHelpers();
  const [active, setActive] = useState<number | null>(null);
  const items = [...gallery].reverse().slice(0, 14);

  if (items.length === 0) return null;

  return (
    <motion.section
      id="gallery"
      aria-labelledby="moments-heading"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: easeOut }}
    >
      <div className="mb-6 flex items-end justify-between md:mb-8">
        <div>
          <p className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
            Film
          </p>
          <h2
            id="moments-heading"
            className="font-display mt-2 text-2xl text-[var(--ink)] md:text-3xl lg:text-4xl"
          >
            Moments
          </h2>
        </div>
      </div>

      {/* Mobile: horizontal filmstrip */}
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            className="relative h-44 w-32 shrink-0 overflow-hidden bg-[var(--bg-elevated)] transition-opacity duration-300 hover:opacity-80"
          >
            <Image
              src={item.type === "video" ? item.poster || item.src : item.src}
              alt={item.alt}
              fill
              sizes="128px"
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Laptop+: roomy grid */}
      <div className="hidden grid-cols-4 gap-3 lg:grid xl:grid-cols-5 xl:gap-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-elevated)] transition-opacity duration-300 hover:opacity-80"
          >
            <Image
              src={item.type === "video" ? item.poster || item.src : item.src}
              alt={item.alt}
              fill
              sizes="(min-width:1280px) 20vw, 22vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <Lightbox
        items={items}
        index={active}
        onClose={() => setActive(null)}
        onChange={setActive}
      />
    </motion.section>
  );
}

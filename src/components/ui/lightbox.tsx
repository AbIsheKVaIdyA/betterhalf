"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem } from "@/lib/diary/types";
import { blurDataURL, formatDisplayDate } from "@/lib/utils";

type Props = {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function Lightbox({ items, index, onClose, onChange }: Props) {
  const open = index !== null;
  const item = index !== null ? items[index] : null;
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (index === null || items.length === 0) return;
      onChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, go]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-5 right-5 text-sm text-white/70"
            data-cursor="heart"
          >
            Close
          </button>
          <motion.div
            key={item.id}
            className="w-full max-w-3xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => setTouchStart(e.changedTouches[0]?.clientX ?? null)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStart;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              setTouchStart(null);
            }}
          >
            <div className="overflow-hidden rounded-3xl bg-[var(--card)]">
              <div className="relative max-h-[65vh] bg-black">
                {item.type === "video" ? (
                  <video
                    key={item.src}
                    className="mx-auto max-h-[65vh] w-auto"
                    controls
                    playsInline
                    poster={item.poster}
                    preload="metadata"
                  >
                    <source src={item.src} />
                  </video>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width ?? 1600}
                    height={item.height ?? 1200}
                    className="mx-auto max-h-[65vh] w-auto object-contain"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    sizes="(max-width: 768px) 100vw, 900px"
                    priority
                  />
                )}
              </div>
              <div className="p-5 text-center">
                <p className="font-semibold">{item.memoryTitle}</p>
                <p className="mt-1 text-xs text-[var(--ink-faint)]">
                  {formatDisplayDate(item.date)} · {item.location}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm text-white/70 md:hidden">
              <button type="button" onClick={() => go(-1)}>
                Prev
              </button>
              <button type="button" onClick={() => go(1)}>
                Next
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

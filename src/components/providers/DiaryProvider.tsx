"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { DiaryData } from "@/lib/diary/types";
import {
  allGalleryMedia,
  getChapter,
  getMemory,
  memoriesByChapter,
  sortedEntries,
} from "@/lib/diary/helpers";

type DiaryContextValue = DiaryData & {
  memories: DiaryData["entries"];
};

const DiaryContext = createContext<DiaryContextValue | null>(null);

export function DiaryProvider({
  diary,
  children,
}: {
  diary: DiaryData;
  children: ReactNode;
}) {
  const value: DiaryContextValue = {
    ...diary,
    entries: sortedEntries(diary.entries),
    memories: sortedEntries(diary.entries),
  };

  return (
    <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>
  );
}

export function useDiary() {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error("useDiary must be used within DiaryProvider");
  return ctx;
}

export function useDiaryHelpers() {
  const diary = useDiary();
  return {
    diary,
    site: diary.site,
    chapters: diary.chapters,
    memories: diary.memories,
    getChapter: (id: Parameters<typeof getChapter>[1]) =>
      getChapter(diary.chapters, id),
    getMemory: (id: string) => getMemory(diary.memories, id),
    memoriesByChapter: (id: Parameters<typeof memoriesByChapter>[1]) =>
      memoriesByChapter(diary.memories, id),
    gallery: allGalleryMedia(diary.memories),
  };
}

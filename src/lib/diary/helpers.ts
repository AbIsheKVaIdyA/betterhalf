import type {
  Chapter,
  ChapterId,
  GalleryItem,
  Memory,
} from "./types";

export function sortedEntries(entries: Memory[]) {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function getChapter(chapters: Chapter[], id: ChapterId) {
  return chapters.find((c) => c.id === id) ?? chapters[0];
}

export function getMemory(entries: Memory[], id: string) {
  return entries.find((m) => m.id === id);
}

export function memoriesByChapter(entries: Memory[], id: ChapterId) {
  return sortedEntries(entries).filter((m) => m.chapter === id);
}

export function allGalleryMedia(entries: Memory[]): GalleryItem[] {
  return sortedEntries(entries).flatMap((memory) =>
    memory.media.map((media, index) => ({
      ...media,
      id: `${memory.id}-${index}`,
      memoryId: memory.id,
      memoryTitle: memory.title,
      date: memory.date,
      chapter: memory.chapter,
      location: memory.location,
    })),
  );
}

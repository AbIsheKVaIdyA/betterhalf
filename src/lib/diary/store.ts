import { asc, eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { getDb } from "@/lib/db";
import { chapters, entries, siteSettings } from "@/lib/db/schema";
import type {
  DiaryData,
  Memory,
  NewEntryInput,
  PhotoLayout,
  ReactionId,
} from "./types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function rowToMemory(row: typeof entries.$inferSelect): Memory {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    location: row.location,
    story: row.story,
    chapter: row.chapter as Memory["chapter"],
    media: row.media ?? [],
    layout: (row.layout as PhotoLayout) || "single",
    tagline: row.tagline ?? undefined,
    mood: row.mood ?? undefined,
    tags: row.tags ?? [],
    reactions: row.reactions ?? {},
    song: row.song ?? undefined,
    quote: row.quote ?? undefined,
    createdAt: row.createdAt?.toISOString(),
  };
}

export async function readDiary(): Promise<DiaryData> {
  const db = getDb();

  const [siteRow] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, "default"))
    .limit(1);

  if (!siteRow) {
    throw new Error("Diary is not seeded yet. Run: npm run db:seed");
  }

  const [chapterRows, entryRows] = await Promise.all([
    db.select().from(chapters).orderBy(asc(chapters.sortOrder)),
    db.select().from(entries).orderBy(asc(entries.date), asc(entries.createdAt)),
  ]);

  return {
    site: siteRow.data,
    chapters: chapterRows.map((c) => ({
      id: c.id as DiaryData["chapters"][number]["id"],
      title: c.title,
      subtitle: c.subtitle,
    })),
    entries: entryRows.map(rowToMemory),
  };
}

export async function assertWritePassword(password: string) {
  const diary = await readDiary();
  const expected = diary.site.gate.password.toLowerCase().trim();
  if (!password || password.toLowerCase().trim() !== expected) {
    throw new Error("Wrong diary password.");
  }
  return diary;
}

export async function addEntry(input: NewEntryInput) {
  const diary = await assertWritePassword(input.password);
  const db = getDb();

  if (!input.title.trim() || !input.story.trim()) {
    throw new Error("Title and story are required.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    throw new Error("Date must be YYYY-MM-DD.");
  }

  const base = slugify(input.title) || "memory";
  const id = `${input.date}-${base}`;
  const uniqueId = diary.entries.some((e) => e.id === id)
    ? `${id}-${Date.now().toString(36)}`
    : id;

  const createdAt = new Date();
  const entry: Memory = {
    id: uniqueId,
    date: input.date,
    title: input.title.trim(),
    location: input.location.trim() || "Somewhere with you",
    story: input.story.trim(),
    chapter: input.chapter,
    media: input.media ?? [],
    layout: input.layout || "single",
    tagline: input.tagline?.trim() || undefined,
    mood: input.mood?.trim() || undefined,
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
    reactions: {},
    song: input.song?.trim() || undefined,
    quote: input.quote?.trim() || undefined,
    createdAt: createdAt.toISOString(),
  };

  await db.insert(entries).values({
    id: entry.id,
    date: entry.date,
    title: entry.title,
    location: entry.location,
    story: entry.story,
    chapter: entry.chapter,
    media: entry.media,
    layout: entry.layout,
    tagline: entry.tagline,
    mood: entry.mood,
    tags: entry.tags ?? [],
    reactions: {},
    song: entry.song,
    quote: entry.quote,
    createdAt,
  });

  return entry;
}

const VALID_REACTIONS: ReactionId[] = [
  "soft",
  "warm",
  "again",
  "favorite",
  "laugh",
];

export async function toggleReaction(entryId: string, reaction: ReactionId) {
  if (!VALID_REACTIONS.includes(reaction)) {
    throw new Error("Unknown reaction.");
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(entries)
    .where(eq(entries.id, entryId))
    .limit(1);

  if (!row) throw new Error("Entry not found.");

  const counts = { ...(row.reactions ?? {}) };
  counts[reaction] = (counts[reaction] ?? 0) + 1;

  await db
    .update(entries)
    .set({ reactions: counts })
    .where(eq(entries.id, entryId));

  return rowToMemory({ ...row, reactions: counts });
}

export async function clearAllEntries() {
  const db = getDb();
  await db.delete(entries);
}

export async function saveUploadedFile(
  file: File,
  chapter: string,
): Promise<{ src: string; alt: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing. Add it to .env.local");
  }

  const safeChapter = slugify(chapter) || "memories";
  const ext = file.name.includes(".")
    ? `.${file.name.split(".").pop()?.toLowerCase()}`
    : file.type.includes("png")
      ? ".png"
      : file.type.includes("webp")
        ? ".webp"
        : file.type.includes("mp4")
          ? ".mp4"
          : ".jpg";

  const filename = `${Date.now()}-${slugify(file.name.replace(ext, "")) || "photo"}${ext}`;
  const pathname = `diary/${safeChapter}/${filename}`;

  const blob = await put(pathname, file, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.type || undefined,
  });

  return {
    src: `/api/media/${blob.pathname}`,
    alt: file.name.replace(ext, "") || "Diary photo",
  };
}

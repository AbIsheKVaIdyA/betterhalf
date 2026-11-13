import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addEntry, readDiary, toggleReaction } from "@/lib/diary/store";
import type {
  ChapterId,
  MediaItem,
  PhotoLayout,
  ReactionId,
} from "@/lib/diary/types";

export const runtime = "nodejs";

export async function GET() {
  const diary = await readDiary();
  return NextResponse.json(diary);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry = await addEntry({
      date: String(body.date ?? ""),
      title: String(body.title ?? ""),
      location: String(body.location ?? ""),
      story: String(body.story ?? ""),
      chapter: body.chapter as ChapterId,
      layout: (body.layout as PhotoLayout) || "single",
      tagline: body.tagline ? String(body.tagline) : undefined,
      mood: body.mood ? String(body.mood) : undefined,
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t))
        : undefined,
      song: body.song ? String(body.song) : undefined,
      quote: body.quote ? String(body.quote) : undefined,
      media: (body.media ?? []) as MediaItem[],
      password: String(body.password ?? ""),
    });

    revalidatePath("/");
    revalidatePath("/write");

    return NextResponse.json({ ok: true, entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const entry = await toggleReaction(
      String(body.id ?? ""),
      body.reaction as ReactionId,
    );
    revalidatePath("/");
    return NextResponse.json({ ok: true, entry });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not react.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

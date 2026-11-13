import { NextResponse } from "next/server";
import { assertWritePassword, saveUploadedFile } from "@/lib/diary/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const password = String(form.get("password") ?? "");
    const chapter = String(form.get("chapter") ?? "memories");
    const caption = String(form.get("caption") ?? "");
    const file = form.get("file");

    await assertWritePassword(password);

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Please choose a photo." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { ok: false, error: "Only images or videos are allowed." },
        { status: 400 },
      );
    }

    // Keep uploads reasonable for a personal diary (~12MB)
    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "File is too large (max 12MB)." },
        { status: 400 },
      );
    }

    const saved = await saveUploadedFile(file, chapter);
    const isVideo = file.type.startsWith("video/");

    return NextResponse.json({
      ok: true,
      media: {
        type: isVideo ? "video" : "image",
        src: saved.src,
        alt: saved.alt,
        caption: caption || undefined,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

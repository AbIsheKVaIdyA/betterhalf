import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

export const runtime = "nodejs";

type Params = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { path } = await params;
    const pathname = path.map(decodeURIComponent).join("/");

    if (!pathname || pathname.includes("..")) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    const result = await get(pathname, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const headers = new Headers();
    if (result.blob.contentType) {
      headers.set("Content-Type", result.blob.contentType);
    }
    headers.set("Cache-Control", "private, max-age=31536000, immutable");

    return new NextResponse(result.stream, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

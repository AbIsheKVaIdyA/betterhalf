import { config } from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { count, eq } from "drizzle-orm";
import type { DiaryData, SiteConfig } from "../src/lib/diary/types";
import { chapters, siteSettings } from "../src/lib/db/schema";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing in .env.local");

  const db = drizzle(neon(url), { schema: { siteSettings, chapters } });

  const raw = readFileSync(
    path.join(process.cwd(), "content", "diary.json"),
    "utf8",
  );
  const data = JSON.parse(raw) as {
    site: SiteConfig;
    chapters: DiaryData["chapters"];
  };

  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, "default"))
    .limit(1);

  if (!existing) {
    await db.insert(siteSettings).values({ id: "default", data: data.site });
    console.log("Seeded site settings");
  } else {
    await db
      .update(siteSettings)
      .set({ data: data.site, updatedAt: new Date() })
      .where(eq(siteSettings.id, "default"));
    console.log("Updated site settings");
  }

  const [{ value: chapterCount }] = await db
    .select({ value: count() })
    .from(chapters);

  if (chapterCount === 0) {
    await db.insert(chapters).values(
      data.chapters.map((c, i) => ({
        id: c.id,
        title: c.title,
        subtitle: c.subtitle,
        sortOrder: i,
      })),
    );
    console.log(`Seeded ${data.chapters.length} chapters`);
  } else {
    console.log("Chapters already present — skipped");
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { entries } from "../src/lib/db/schema";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing in .env.local");

  const db = drizzle(neon(url));
  await db.delete(entries);
  console.log("Cleared all diary entries.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

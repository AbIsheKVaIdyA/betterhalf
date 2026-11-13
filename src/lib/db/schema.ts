import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type {
  MediaItem,
  PhotoLayout,
  ReactionCounts,
  SiteConfig,
} from "@/lib/diary/types";

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("default"),
  data: jsonb("data").$type<SiteConfig>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const chapters = pgTable("chapters", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const entries = pgTable("entries", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  story: text("story").notNull(),
  chapter: text("chapter").notNull(),
  media: jsonb("media").$type<MediaItem[]>().notNull().default([]),
  layout: text("layout").$type<PhotoLayout>().default("single"),
  tagline: text("tagline"),
  mood: text("mood"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  reactions: jsonb("reactions").$type<ReactionCounts>().notNull().default({}),
  song: text("song"),
  quote: text("quote"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

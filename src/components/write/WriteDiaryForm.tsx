"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { Chapter, ChapterId, MediaItem, PhotoLayout } from "@/lib/diary/types";
import { LAYOUT_OPTIONS, PhotoLayoutView } from "@/components/ui/photo-layout";
import { blurDataURL, cn } from "@/lib/utils";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const moods = ["Happy", "Calm", "Grateful", "Excited", "Soft", "Wild"];
const tagSuggestions = ["us", "home", "trip", "night", "food", "firsts", "ordinary"];

type Props = {
  chapters: Chapter[];
  gatePasswordHint: string;
  entryCount: number;
};

export function WriteDiaryForm({
  chapters,
  gatePasswordHint,
  entryCount,
}: Props) {
  const router = useRouter();
  const search = useSearchParams();
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(todayISO);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [location, setLocation] = useState("");
  const [story, setStory] = useState("");
  const [mood, setMood] = useState(moods[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [layout, setLayout] = useState<PhotoLayout>("single");
  const [chapter, setChapter] = useState<ChapterId>(
    chapters[0]?.id ?? "how-we-met",
  );
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const pageNumber = useMemo(() => entryCount + 1, [entryCount]);

  useEffect(() => {
    const draft = search.get("draft");
    const prompt = search.get("prompt");
    if (draft) setStory(draft);
    if (prompt) setTitle(prompt);
  }, [search]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 6),
    );
  };

  const addCustomTag = () => {
    const t = tagDraft.trim().toLowerCase();
    if (!t) return;
    setTags((prev) => (prev.includes(t) ? prev : [...prev, t].slice(0, 6)));
    setTagDraft("");
  };

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    if (!password) {
      setError("Enter the diary password before uploading.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const uploaded: MediaItem[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("file", file);
        form.set("password", password);
        form.set("chapter", chapter);
        form.set("caption", caption);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Upload failed");
        uploaded.push(data.media as MediaItem);
      }
      setMedia((prev) => [...prev, ...uploaded]);
      if (uploaded.length > 1 && layout === "single") setLayout("collage");
      setCaption("");
      setMessage(
        uploaded.length === 1
          ? "Photo added."
          : `${uploaded.length} photos added.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          date,
          title: title || "Untitled day",
          tagline,
          location,
          story,
          chapter,
          layout,
          mood,
          tags,
          media,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not save");
      setMessage("Saved.");
      router.refresh();
      window.setTimeout(() => router.push(`/#${data.entry.id}`), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-12 space-y-16">
      <section>
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
            Page {String(pageNumber).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={() => setDate(todayISO())}
            className="reveal-link text-[10px] tracking-[0.18em] text-[var(--ink-faint)] uppercase"
          >
            Set to today
          </button>
        </div>

        <div className="mt-10 space-y-8">
          <Field label="Password" hint={gatePasswordHint}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="field-input"
              placeholder="Same as welcome gate"
            />
          </Field>

          <div className="grid gap-8 sm:grid-cols-2">
          <Field label="When it happened" hint="Any day — not only today">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="field-input"
            />
          </Field>
            <Field label="Chapter">
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value as ChapterId)}
                className="field-input appearance-none"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[var(--bg)]">
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field-input font-display text-2xl md:text-3xl"
              placeholder="Name this day"
            />
          </Field>

          <Field label="Tagline" hint="One short line under the title">
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="field-input italic"
              placeholder="Soft light, long walk, quiet night"
            />
          </Field>

          <Field label="Location">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="field-input"
              placeholder="City, café, home…"
            />
          </Field>
        </div>
      </section>

      <div className="editorial-rule" />

      <section>
        <p className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
          Photos
        </p>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          Add images, then choose how they sit on the page.
        </p>

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="field-input mt-8"
          placeholder="Caption for next photo (optional)"
        />

        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center border border-dashed border-[var(--line-strong)] px-4 py-14 text-center transition-colors hover:border-[var(--amber)]">
          <span className="text-[11px] tracking-[0.22em] text-[var(--amber)] uppercase">
            {uploading ? "Uploading…" : "Add photos"}
          </span>
          <span className="mt-2 text-xs text-[var(--ink-faint)]">
            One or many · max 12MB each
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              void onUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

        {media.length > 0 && (
          <div className="mt-8 space-y-8">
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {media.map((item) => (
                <li
                  key={item.src}
                  className="relative aspect-square overflow-hidden bg-[var(--bg-elevated)]"
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="120px"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[var(--ink-faint)]">
                      Video
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-[10px] tracking-[0.14em] text-white/80 uppercase"
                    onClick={() =>
                      setMedia((prev) => prev.filter((m) => m.src !== item.src))
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div>
              <p className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
                Layout
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {LAYOUT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLayout(opt.id)}
                    className={cn(
                      "border px-3 py-4 text-left transition-colors duration-400",
                      layout === opt.id
                        ? "border-[var(--amber)] bg-[var(--amber-dim)]"
                        : "border-[var(--line)] hover:border-[var(--line-strong)]",
                    )}
                  >
                    <span className="block text-sm text-[var(--ink)]">
                      {opt.label}
                    </span>
                    <span className="mt-1 block text-[11px] text-[var(--ink-faint)]">
                      {opt.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="reveal-link text-[11px] tracking-[0.18em] text-[var(--ink-soft)] uppercase"
            >
              {showPreview ? "Hide preview" : "Preview layout"}
            </button>
            {showPreview && (
              <div className="overflow-hidden border border-[var(--line)]">
                <PhotoLayoutView media={media} layout={layout} />
              </div>
            )}
          </div>
        )}
      </section>

      <div className="editorial-rule" />

      <section className="space-y-8">
        <Field label="Story" hint="Written below the photos">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            required
            rows={9}
            className="field-input font-serif text-lg leading-relaxed"
            placeholder="What happened. How it felt."
          />
        </Field>

        <Field label="Mood">
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={cn(
                  "pill !normal-case !tracking-[0.08em]",
                  mood === m && "!border-[var(--amber)] !text-[var(--amber)]",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Tags">
          <div className="flex flex-wrap gap-2">
            {tagSuggestions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={cn(
                  "pill",
                  tags.includes(t) && "!border-[var(--amber)] !text-[var(--amber)]",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-4">
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              className="field-input"
              placeholder="Custom tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="shrink-0 self-end pb-3 text-[11px] tracking-[0.18em] text-[var(--ink-faint)] uppercase"
            >
              Add
            </button>
          </div>
        </Field>
      </section>

      {error && (
        <p className="text-sm tracking-[0.04em] text-[var(--amber)]">{error}</p>
      )}
      {message && !error && (
        <p className="text-sm text-[var(--ink-soft)]">{message}</p>
      )}

      <button type="submit" disabled={saving} className="btn-solid w-full disabled:opacity-50">
        {saving ? "Saving…" : "Keep this page"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
        {label}
      </span>
      {hint && (
        <span className="mt-1 block text-xs text-[var(--ink-faint)]">{hint}</span>
      )}
      <div className="mt-2">{children}</div>
    </label>
  );
}

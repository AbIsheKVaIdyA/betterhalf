"use client";

import { useEffect, useState, useTransition } from "react";
import type { ReactionCounts, ReactionId } from "@/lib/diary/types";
import { cn } from "@/lib/utils";

export const REACTION_OPTIONS: {
  id: ReactionId;
  label: string;
}[] = [
  { id: "soft", label: "Soft" },
  { id: "warm", label: "Warm" },
  { id: "again", label: "Again" },
  { id: "favorite", label: "Keep" },
  { id: "laugh", label: "Laugh" },
];

type Props = {
  entryId: string;
  initial?: ReactionCounts;
};

function storageKey(entryId: string) {
  return `lk-reactions:${entryId}`;
}

export function EntryReactions({ entryId, initial }: Props) {
  const [counts, setCounts] = useState<ReactionCounts>(initial ?? {});
  const [mine, setMine] = useState<ReactionId[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(entryId));
      if (raw) setMine(JSON.parse(raw) as ReactionId[]);
    } catch {
      /* ignore */
    }
  }, [entryId]);

  const react = (id: ReactionId) => {
    if (mine.includes(id) || pending) return;

    const nextMine = [...mine, id];
    setMine(nextMine);
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    try {
      localStorage.setItem(storageKey(entryId), JSON.stringify(nextMine));
    } catch {
      /* ignore */
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/entries", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: entryId, reaction: id }),
        });
        const data = await res.json();
        if (data.ok && data.entry?.reactions) {
          setCounts(data.entry.reactions as ReactionCounts);
        }
      } catch {
        /* keep optimistic count */
      }
    });
  };

  return (
    <div className="mt-10">
      <p className="text-[10px] tracking-[0.24em] text-[var(--ink-faint)] uppercase">
        Leave a mark
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {REACTION_OPTIONS.map((opt) => {
          const count = counts[opt.id] ?? 0;
          const active = mine.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              disabled={active || pending}
              onClick={() => react(opt.id)}
              className={cn(
                "inline-flex items-center gap-2 border px-3 py-2 text-[10px] tracking-[0.16em] uppercase transition-colors duration-200",
                active
                  ? "border-[var(--amber)] bg-[var(--amber-dim)] text-[var(--amber)]"
                  : "border-[var(--line-strong)] text-[var(--ink-soft)] hover:border-[var(--amber)] hover:text-[var(--amber)]",
              )}
            >
              <span>{opt.label}</span>
              {count > 0 && (
                <span className="tabular-nums text-[var(--ink-faint)]">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

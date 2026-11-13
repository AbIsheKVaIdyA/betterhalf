"use client";

import { useDiaryHelpers } from "@/components/providers/DiaryProvider";

export function SettingsStrip() {
  const { site } = useDiaryHelpers();

  return (
    <section id="settings" className="mt-24 border-t border-[var(--line)] pt-10 pb-8">
      <p className="text-[11px] tracking-[0.2em] text-[var(--ink-faint)] uppercase">
        {site.footerLine}
      </p>
    </section>
  );
}

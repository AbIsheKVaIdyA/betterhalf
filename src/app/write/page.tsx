import { Suspense } from "react";
import Link from "next/link";
import { readDiary } from "@/lib/diary/store";
import { WriteDiaryForm } from "@/components/write/WriteDiaryForm";
import { SiteNav } from "@/components/ui/app-nav";

export const dynamic = "force-dynamic";

export default async function WritePage() {
  const diary = await readDiary();

  return (
    <>
      <div className="film-grain" aria-hidden />
      <SiteNav />
      <main className="page-atmosphere px-5 py-8 sm:px-8 md:py-12 lg:px-10 lg:py-16">
        <div className="relative z-[2] mx-auto w-full max-w-3xl lg:max-w-4xl">
          <Link
            href="/"
            className="reveal-link text-[11px] tracking-[0.14em] uppercase"
          >
            ← Back to diary
          </Link>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <div>
              <h1 className="font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]">
                A new page
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
                No streak. No deadline. Date it for whenever this moment
                happened — today, last week, or months ago.
              </p>
            </div>
            <p className="hidden text-right text-[10px] tracking-[0.22em] text-[var(--ink-faint)] uppercase lg:block">
              Write together
            </p>
          </div>

          <Suspense
            fallback={
              <div className="mt-16 h-40 animate-pulse border-t border-[var(--line)]" />
            }
          >
            <WriteDiaryForm
              chapters={diary.chapters}
              gatePasswordHint={diary.site.gate.hint}
              entryCount={diary.entries.length}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}

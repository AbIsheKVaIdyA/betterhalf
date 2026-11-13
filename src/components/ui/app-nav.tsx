"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDiaryHelpers } from "@/components/providers/DiaryProvider";

export function SiteNav() {
  const pathname = usePathname();
  const { site } = useDiaryHelpers();
  const onWrite = pathname === "/write";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8 lg:h-[4.25rem] lg:px-10">
          <Link
            href="/"
            className="text-[11px] tracking-[0.28em] text-[var(--ink)] uppercase transition-colors hover:text-[var(--amber)]"
          >
            {site.yourName}
            <span className="text-[var(--ink-faint)]"> · </span>
            {site.herName}
          </Link>

          <nav className="flex items-center gap-5 md:gap-7">
            <Link
              href="/"
              data-active={!onWrite}
              className="nav-link hidden text-[11px] tracking-[0.2em] uppercase sm:inline"
            >
              Diary
            </Link>
            <Link
              href="/#book"
              className="nav-link hidden text-[11px] tracking-[0.2em] uppercase md:inline"
            >
              Index
            </Link>
            <Link
              href="/write"
              data-active={onWrite}
              className="nav-link-action text-[11px] tracking-[0.2em] uppercase"
            >
              Add page
            </Link>
          </nav>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-2xl lg:hidden"
        style={{ paddingBottom: "var(--safe-bottom)" }}
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-5 py-3">
          <Link
            href="/"
            className={cn(
              "nav-link text-[11px] tracking-[0.2em] uppercase",
              !onWrite && "text-[var(--ink)]",
            )}
          >
            Diary
          </Link>
          <Link href="/write" className="btn-solid !px-4 !py-2.5 text-[10px]">
            Add page
          </Link>
          <Link
            href="/#book"
            className="nav-link text-[11px] tracking-[0.2em] uppercase"
          >
            Index
          </Link>
        </div>
      </nav>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WelcomeGate } from "@/components/sections/WelcomeGate";
import { SiteHero } from "@/components/sections/SiteHero";
import { PromptCard } from "@/components/sections/PromptCard";
import { EntryFeed } from "@/components/sections/EntryFeed";
import { MomentsStrip } from "@/components/sections/MomentsStrip";
import { BookSection } from "@/components/sections/BookSection";
import { SettingsStrip } from "@/components/sections/SettingsStrip";
import { SiteNav } from "@/components/ui/app-nav";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { easeOut } from "@/lib/motion";

export function HomeExperience() {
  const [gated, setGated] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unlocked = window.sessionStorage.getItem("our-story-unlocked") === "1";
    if (unlocked) setGated(false);
    setReady(true);
  }, []);

  const onEnter = () => {
    window.sessionStorage.setItem("our-story-unlocked", "1");
    setGated(false);
  };

  if (!ready) {
    return <div className="min-h-screen bg-[var(--bg)]" aria-hidden />;
  }

  return (
    <>
      <div className="film-grain" aria-hidden />
      <CustomCursor />
      <WelcomeGate open={gated} onEnter={onEnter} />
      {!gated && (
        <SmoothScroll>
          <SiteNav />
          <main className="page-atmosphere">
            <motion.div
              className="relative z-[2] mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8 md:pt-10 lg:px-10 lg:pt-14"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOut }}
            >
              <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16 xl:gap-20">
                <SiteHero />
                <PromptCard />
              </div>

              <div className="editorial-rule my-14 md:my-20" />

              <MomentsStrip />

              <div className="mt-16 md:mt-24 lg:mt-28">
                <EntryFeed />
              </div>

              <BookSection />
              <SettingsStrip />
            </motion.div>
          </main>
        </SmoothScroll>
      )}
    </>
  );
}

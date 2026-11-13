"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDiaryHelpers } from "@/components/providers/DiaryProvider";
import { easeOut } from "@/lib/motion";

type Props = {
  open: boolean;
  onEnter: () => void;
};

export function WelcomeGate({ open, onEnter }: Props) {
  const { site } = useDiaryHelpers();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const needsAuth = site.gate.enabled;
  const useAnswer = Boolean(site.gate.answer);

  const handleEnter = () => {
    if (needsAuth) {
      const expected = useAnswer
        ? site.gate.answer.toLowerCase().trim()
        : site.gate.password.toLowerCase().trim();
      if (value.toLowerCase().trim() !== expected) {
        setError("Not that one.");
        return;
      }
    }
    onEnter();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-[var(--bg)] px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 1, ease: easeOut }}
          aria-label="Welcome"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,179,154,0.08), transparent 60%)",
            }}
          />
          <div className="film-grain" aria-hidden />

          <div className="relative w-full max-w-lg text-center">
            <motion.p
              className="text-[11px] tracking-[0.4em] text-[var(--ink-faint)] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOut }}
            >
              Whenever you are ready
            </motion.p>

            <motion.h1
              className="font-display mt-8 text-[clamp(3rem,11vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, delay: 0.12, ease: easeOut }}
            >
              {site.coupleName}
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 1 }}
            >
              {site.welcomeTagline}
            </motion.p>

            <motion.form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleEnter();
              }}
              className="mx-auto mt-14 max-w-xs space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {needsAuth && (
                <div>
                  <label className="mb-3 block text-[10px] tracking-[0.28em] text-[var(--ink-faint)] uppercase">
                    {useAnswer ? site.gate.question : "Passphrase"}
                  </label>
                  <input
                    type={useAnswer ? "text" : "password"}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setError("");
                    }}
                    placeholder={site.gate.hint}
                    className="field-input text-center text-sm tracking-[0.08em]"
                    autoComplete="off"
                  />
                  {error && (
                    <p
                      className="mt-3 text-xs tracking-[0.12em] text-[var(--amber)]"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </div>
              )}
              <button type="submit" className="btn-solid w-full">
                Open
              </button>
            </motion.form>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

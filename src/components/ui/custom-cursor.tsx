"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Near-instant follow — was lagging before
  const sx = useSpring(x, { stiffness: 1400, damping: 42, mass: 0.12 });
  const sy = useSpring(y, { stiffness: 1400, damping: 42, mass: 0.12 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      setActive(
        !!target?.closest(
          'a, button, [data-interactive], [role="button"], input, textarea, label, select',
        ),
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", () => setVisible(false));
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          width: active ? 28 : 6,
          height: active ? 28 : 6,
          backgroundColor: active ? "transparent" : "#ffffff",
          borderWidth: active ? 1.5 : 0,
        }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="rounded-full border-white"
      />
    </motion.div>
  );
}

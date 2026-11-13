export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOut },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: easeOut },
  },
};

export const stagger = {
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

export const slowTransition = {
  duration: 0.9,
  ease: easeOut,
};

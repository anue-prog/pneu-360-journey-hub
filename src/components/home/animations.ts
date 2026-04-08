// Editorial motion system — dramatic, cinematic timing

export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-8%" } as const;
export const GPU_STYLE = { willChange: "transform, opacity", transform: "translateZ(0)" } as const;

/** Fade-up for content blocks */
export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { duration: 1.0, ease: EASE, delay },
});

/** Heading reveal — slower, larger drift for emphasis */
export const headingReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { duration: 1.3, ease: EASE, delay },
});

/** @deprecated Use headingReveal instead */
export const clipReveal = headingReveal;

/** Staggered item fade-up for lists/grids */
export const staggerItem = (index: number, baseDelay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { duration: 0.9, ease: EASE, delay: baseDelay + index * 0.1 },
});

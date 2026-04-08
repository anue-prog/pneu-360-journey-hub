// Unified motion system — clean, consistent fade-ups with a single easing curve.

export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-8%" } as const;
export const GPU_STYLE = { willChange: "transform, opacity", transform: "translateZ(0)" } as const;

/** Fade-up for content blocks */
export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { duration: 0.8, ease: EASE, delay },
});

/** Heading reveal — slower, larger drift for emphasis */
export const headingReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { duration: 1.1, ease: EASE, delay },
});

/** @deprecated Use headingReveal instead */
export const clipReveal = headingReveal;

/** Staggered item fade-up for lists/grids */
export const staggerItem = (index: number, baseDelay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { duration: 0.8, ease: EASE, delay: baseDelay + index * 0.12 },
});

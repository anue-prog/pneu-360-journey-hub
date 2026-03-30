import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

export function useParallax(distance = 100) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return { ref, y, progress: scrollYProgress };
}

export function useImageScale(from = 0.85, to = 1) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [from, to]);
  return { ref, scale, progress: scrollYProgress };
}

export function useClipReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(15% 15% 15% 15% round 24px)", "inset(0% 0% 0% 0% round 0px)"]
  );
  return { ref, clipPath, progress: scrollYProgress };
}

export function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -4]);
  return { ref, rotateX, progress: scrollYProgress };
}

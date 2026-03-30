import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export function useCounter(end: number, duration = 1.8) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || end === 0) return;
    let current = 0;
    const step = end / (duration * 60);
    const id = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(id);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, end, duration]);

  return { count, ref, inView };
}

import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "./SmoothScroll";

const BackToTop = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;
    setProgress(scrolled);
    setVisible(scrollTop > 400);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const r = 18;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - progress * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Nach oben scrollen"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22" cy="22" r={r}
          fill="none"
          stroke="hsl(var(--foreground) / 0.08)"
          strokeWidth="2"
        />
        <circle
          cx="22" cy="22" r={r}
          fill="none"
          stroke="hsl(var(--brand-accent))"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-100"
        />
      </svg>
      <ArrowUp className="w-3.5 h-3.5 text-foreground/70" />
    </button>
  );
};

export default BackToTop;

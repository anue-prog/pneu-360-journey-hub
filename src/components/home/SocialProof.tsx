import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { Star } from "lucide-react";

const SocialProof = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const { data } = useGoogleReviews();

  return (
    <section ref={ref} className="bg-background border-t border-border/20">
      <motion.div
        style={{ opacity }}
        className="max-w-[1400px] mx-auto px-3 md:px-6 py-10 md:py-14"
      >
        {/* Rating row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-brand-accent fill-brand-accent" />
            ))}
          </div>
          <p className="text-base font-bold tracking-[-0.01em]">
            {data.rating.toFixed(1)}
            <span className="font-light text-muted-foreground"> / 5</span>
          </p>
        </div>

        {/* Facts grid – left-aligned, uniform size */}
        <div className="grid grid-cols-3 gap-px bg-border/20">
          {[
            { value: `${data.totalReviews}+`, label: "Google Bewertungen" },
            { value: "100+", label: "Jahre Erfahrung" },
            { value: "2", label: "Standorte" },
          ].map((fact) => (
            <div key={fact.label} className="bg-background py-5 md:py-6 pr-4">
              <p className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em] text-foreground leading-none mb-1">
                {fact.value}
              </p>
              <p className="text-[11px] md:text-xs font-medium tracking-[1px] uppercase text-muted-foreground">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SocialProof;

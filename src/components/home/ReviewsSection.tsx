import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { reviews, siteConfig } from "@/data/siteData";
import { headingReveal, EASE } from "./animations";

const ROTATE_INTERVAL = 7_000;
const TEXT_LIMIT = 180;

const ReviewsSection = () => {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const rating = parseFloat(siteConfig.reviewScore);

  useEffect(() => {
    setExpanded(false);
    setProgressKey((k) => k + 1);
  }, [current]);

  useEffect(() => {
    if (reviews.length <= 1 || expanded) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % reviews.length), ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [expanded]);

  const review = reviews[current];
  const isLong = review && review.text.length > TEXT_LIMIT;
  const displayText = review ? (isLong && !expanded ? review.text.slice(0, TEXT_LIMIT).trimEnd() + "…" : review.text) : "";

  return (
    <section className="bg-background py-32 md:py-44 lg:py-56 px-3 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="text-brand-label text-brand-accent mb-4">Kundenstimmen</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading mb-6"
            >
              Das sagen<br />unsere Kunden
            </motion.h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-brand-accent fill-brand-accent" />
                ))}
              </div>
              <span className="text-brand-body font-bold">{rating.toFixed(1)}</span>
              <span className="text-brand-body text-muted-foreground">/ 5 · Google</span>
            </div>
          </div>

          <div className="relative">
            {/* Oversized decorative quotation mark */}
            <span className="font-display text-[clamp(120px,20vw,240px)] leading-none text-foreground/[0.04] absolute -top-16 -left-4 pointer-events-none select-none" aria-hidden>
              &ldquo;
            </span>

            <div className="min-h-[160px] relative z-10">
              <AnimatePresence mode="wait">
                {review && (
                  <motion.div
                    key={expanded ? `${current}-exp` : current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <motion.p
                      layout
                      className="text-[clamp(20px,3vw,36px)] font-light leading-[1.4] text-foreground/90 mb-4"
                    >
                      {displayText}
                    </motion.p>
                    {isLong && !expanded && (
                      <button onClick={() => setExpanded(true)} className="text-brand-label text-brand-accent hover:text-foreground transition-colors duration-500 mb-4">
                        mehr lesen
                      </button>
                    )}
                    {expanded && isLong && (
                      <button onClick={() => setExpanded(false)} className="text-brand-label text-muted-foreground hover:text-foreground transition-colors duration-500 mb-4">
                        weniger
                      </button>
                    )}
                    <p className="mt-6 font-display text-xl uppercase text-foreground">{review.name}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {reviews.length > 1 && (
              <div className="mt-10">
                {!expanded && (
                  <div className="w-full h-[2px] bg-border mb-4 overflow-hidden">
                    <motion.div
                      key={progressKey}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: ROTATE_INTERVAL / 1000, ease: "linear" }}
                      className="h-full bg-brand-accent origin-left"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 transition-colors duration-500 ${i === current ? "bg-brand-accent" : "bg-border"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

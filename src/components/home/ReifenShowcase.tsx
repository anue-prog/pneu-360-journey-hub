import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import GrainOverlay from "@/components/shared/GrainOverlay";
import RevealImage from "@/components/shared/ImageReveal";
import reifenSommer from "@/assets/reifen-sommer.webp";
import reifenWinter from "@/assets/reifen-winter.webp";
import reifenGanzjahr from "@/assets/reifen-ganzjahr.webp";

const tires = [
  { image: reifenSommer, label: "Sommerreifen", tag: "Ab 7 °C" },
  { image: reifenWinter, label: "Winterreifen", tag: "Unter 7 °C" },
  { image: reifenGanzjahr, label: "Ganzjahresreifen", tag: "Ganzjährig" },
];

const ReifenShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.4], [80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} className="relative bg-background py-24 md:py-40 px-3 md:px-6 overflow-hidden">
      <GrainOverlay className="hidden md:block" />
      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Heading */}
        <motion.div
          style={{ y: headingY, opacity: headingOpacity }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-[11px] font-medium tracking-[4px] uppercase text-brand-accent mb-4">
            Direkt ab Lager
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-extrabold leading-[1.0] tracking-[-0.03em] uppercase mb-6">
            Hunderte Reifen sofort verfügbar
          </h2>
          <div className="w-12 h-[2px] bg-brand-accent mx-auto mb-8" />
          <p className="text-sm md:text-[15px] leading-[1.85] text-muted-foreground font-light max-w-[520px] mx-auto">
            Von Budget bis Premium – alle Top-Marken am Lager. Nicht vorrätig? Innerhalb 24 Stunden organisiert und montiert.
          </p>
        </motion.div>

        {/* Tire grid – no per-card whileInView, only ImageReveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {tires.map((tire) => (
            <div
              key={tire.label}
              className="group relative overflow-hidden bg-card border border-border/40 hover:border-brand-accent/30 transition-all duration-300"
            >
              <RevealImage className="aspect-[4/3] relative">
                <img
                  src={tire.image}
                  alt={tire.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </RevealImage>
              <div className="p-6 md:p-8 flex items-center justify-between">
                <h3 className="text-base md:text-lg font-bold tracking-[-0.01em]">{tire.label}</h3>
                <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-brand-accent">{tire.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="text-center mt-12 md:mt-16">
          <Link
            to="/reifen"
            className="text-[10px] font-bold tracking-[2.5px] uppercase text-brand-accent hover:text-foreground transition-colors duration-300 inline-flex items-center gap-3 group"
          >
            Ganzes Sortiment entdecken
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReifenShowcase;

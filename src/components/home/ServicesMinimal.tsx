import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { services } from "@/data/siteData";

const ServicesMinimal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0.05, 0.35], [40, 0]);

  return (
    <section ref={ref} className="bg-background py-24 md:py-40 px-3 md:px-6">
      <motion.div style={{ opacity, y }} className="max-w-[900px] mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-[11px] font-medium tracking-[4px] uppercase text-muted-foreground mb-4">
            Unsere Services
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-extrabold leading-[1.0] tracking-[-0.03em] uppercase mb-6">
            Alles rund ums Rad
          </h2>
          <div className="w-12 h-[2px] bg-brand-accent mx-auto" />
        </div>

        <div className="space-y-0">
          {services.map((s, i) => (
            <Link
              key={i}
              to={s.href}
              className="group flex items-center justify-between py-6 md:py-8 border-b border-border/20 hover:border-brand-accent/30 transition-colors duration-500"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-[10px] font-bold tracking-[2px] text-brand-accent/50 group-hover:text-brand-accent transition-colors duration-300">
                  {s.nr}
                </span>
                <div>
                  <span className="text-lg md:text-xl font-bold tracking-[-0.01em] group-hover:text-brand-accent transition-colors duration-300">
                    {s.titel}
                  </span>
                  <p className="text-base md:text-sm text-muted-foreground font-light mt-1 max-w-md">
                    {s.text}
                  </p>
                </div>
              </div>
              <span className="text-muted-foreground group-hover:text-brand-accent transition-all duration-300 group-hover:translate-x-1 text-sm flex-shrink-0 ml-4">
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/dienstleistungen"
            className="text-[11px] font-bold tracking-[2px] uppercase text-brand-accent hover:text-foreground transition-colors duration-300"
          >
            Alle Services anzeigen →
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesMinimal;

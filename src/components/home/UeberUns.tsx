import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { fadeIn, headingReveal, EASE, VIEWPORT } from "./animations";

const stats = [
  { end: 100, suffix: "+", label: "Jahre Erfahrung im Team", accent: true },
  { end: 2, suffix: "", label: "Standorte" },
  { end: 0, suffix: "", label: "Termin nötig", static: "0" },
  { end: 100, suffix: " %", label: "Fachwissen & Erfahrung" },
];

function AnimatedStat({ end, suffix, label, staticVal, delay, accent }: { end: number; suffix: string; label: string; staticVal?: string; delay: number; accent?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || end === 0) return;
    let current = 0;
    const duration = 2.2;
    const step = end / (duration * 60);
    const id = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(id); }
      else setCount(Math.floor(current));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className="text-center pt-6 border-t border-border"
    >
      <p className={`text-[clamp(48px,8vw,80px)] font-black tracking-[-0.04em] leading-none ${accent ? 'text-brand-accent' : 'text-foreground'}`}>
        {staticVal !== undefined ? staticVal : `${count}${suffix}`}
      </p>
      <p className="text-brand-label text-muted-foreground mt-3">{label}</p>
    </motion.div>
  );
}

const UeberUns = () => (
  <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
    <div className="max-w-[1400px] mx-auto">
      <p className="text-brand-label text-brand-accent mb-4">Über Pneu 360</p>

      <motion.h2
        {...headingReveal()}
        className="text-brand-heading leading-[1.0] tracking-[-0.03em] uppercase mb-10 md:mb-12"
      >
        <span className="font-light">Modern.</span><br />
        <span className="font-extrabold text-muted-foreground">Unkompliziert.</span>
      </motion.h2>

      <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-28 md:mb-36">
        Über 100 Jahre gebündelte Erfahrung – vom Reifenspezialisten bis zum Felgenprofi.
        <br /><br />
        Schnell. Fair. Persönlich.
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-20">
        {stats.map((stat, i) => (
          <AnimatedStat
            key={stat.label}
            end={stat.end}
            suffix={stat.suffix}
            label={stat.label}
            staticVal={stat.static}
            delay={i * 0.04}
            accent={stat.accent}
          />
        ))}
      </div>

      <motion.div {...fadeIn()}>
        <Link
          to="/standorte/oftringen"
          className="text-brand-label text-brand-accent hover:text-foreground transition-colors duration-500 inline-flex items-center gap-2 group"
        >
          Unsere Standorte <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default UeberUns;

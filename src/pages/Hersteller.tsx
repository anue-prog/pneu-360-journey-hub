import { useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform } from "framer-motion";
import { manufacturers } from "@/data/herstellerData";
import HerstellerTimelineItem from "@/components/hersteller/HerstellerTimelineItem";
import InlineCTA from "@/components/shared/InlineCTA";
import { fadeIn, headingReveal } from "@/components/home/animations";
import herstellerBg from "@/assets/hersteller-bg.png";

const sorted = [...manufacturers].sort((a, b) => a.founded - b.founded);

const Hersteller = () => {
  const [activeId, setActiveId] = useState<string | null>(sorted[0]?.id ?? null);
  const mainRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: mainRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  const handleToggle = useCallback((id: string) => {
    setActiveId(prev => prev === id ? null : id);
  }, []);

  return (
    <>
      <Helmet>
        <title>Reifenhersteller – Geschichte & Innovation | Pneu 360</title>
        <meta
          name="description"
          content="150 Jahre Reifengeschichte – von Continental bis Nexen. Entdecke die Geschichten, Innovationen und Fun Facts der grössten Reifenhersteller der Welt."
        />
      </Helmet>

      <main ref={mainRef} className="relative min-h-screen overflow-hidden">
        {/* ── Parallax background image with Ken-Burns entry ── */}
        <motion.div
          className="absolute inset-x-0 top-0 z-0 h-[130%]"
          style={{
            y: bgY,
            willChange: "transform",
          }}
        >
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
            style={{
              backgroundImage: `url(${herstellerBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
          <div className="absolute inset-0 bg-background/80" />
        </motion.div>

        {/* ── Dark reveal overlay ── */}
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-black z-[1] pointer-events-none"
        />

        {/* ── Content over background ── */}
        <div className="relative z-10">
          {/* ── HERO ── */}
          <section className="py-24 md:py-32 lg:py-40 px-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-brand-label text-muted-foreground mb-4">
                150+ Jahre · {sorted.length} Marken · 8 Länder
              </p>

              <motion.h1
                {...headingReveal()}
                className="text-brand-heading leading-[1.0] tracking-[-0.03em] uppercase mb-5"
              >
                <span className="font-light">Die Geschichte</span><br />
                <span className="font-extrabold text-muted-foreground">hinter deinen Reifen</span>
              </motion.h1>

              <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
                Von der ersten Gummifabrik 1871 bis zum Elektroauto-Reifen –
                scrolle durch 150 Jahre Innovation auf Asphalt.
              </motion.p>
            </div>
          </section>

          {/* ── TIMELINE ── */}
          <section className="px-6 py-24 md:py-32 lg:py-40">
            <div className="max-w-4xl mx-auto">
              {sorted.map((m, i) => (
                <HerstellerTimelineItem
                  key={m.id}
                  manufacturer={m}
                  isActive={activeId === m.id}
                  onToggle={() => handleToggle(m.id)}
                  index={i}
                  isLast={i === sorted.length - 1}
                />
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <InlineCTA
            title="Welche Marke passt zu dir?"
            text="Egal ob Continental, Michelin oder Nexen – wir beraten dich persönlich und finden den perfekten Reifen für dein Fahrzeug."
          />
        </div>
      </main>
    </>
  );
};

export default Hersteller;

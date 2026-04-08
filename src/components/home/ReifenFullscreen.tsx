import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnfrageKonfigurator, { AnfrageCompactButton } from "@/components/anfrage/AnfrageKonfigurator";
import RevealImage from "@/components/shared/ImageReveal";
import reifenSommer from "@/assets/hero-reifen-strasse.webp";
import { fadeIn, headingReveal, staggerItem } from "./animations";

const tires = [
  { name: "Sommerreifen", sub: "Optimaler Grip ab 7 °C", link: "/sommerreifen" },
  { name: "Winterreifen", sub: "Alpine-Symbol · Schnee & Eis", link: "/winterreifen" },
  { name: "Ganzjahresreifen", sub: "Der Allrounder für Stadtfahrer", link: "/ganzjahresreifen" },
  { name: "Offroadreifen", sub: "Robust für jedes Gelände", link: "/offroadreifen" },
];

const ReifenFullscreen = () => {
  const [anfrageOpen, setAnfrageOpen] = useState(false);

  return (
    <>
      <section className="bg-card py-32 md:py-44 lg:py-56 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Full-width editorial heading */}
          <div className="relative mb-20 md:mb-32">
            <span className="text-editorial-number absolute -top-8 md:-top-16 right-0 text-foreground/[0.04] pointer-events-none select-none" aria-hidden>
              02
            </span>
            <p className="text-brand-label text-brand-accent mb-4">Reifen</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading"
            >
              Dein<br />Reifen.
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start mb-20 md:mb-32">
            <RevealImage>
              <img src={reifenSommer} alt="Reifen Sortiment" className="w-full aspect-[3/4] object-cover" loading="lazy" />
            </RevealImage>

            <div className="flex flex-col justify-center">
              <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-8">
                Tausende Reifen an Lager – von Budget bis Premium. Nicht dabei? Innerhalb 24 Stunden organisiert.
              </motion.p>

              <motion.div {...fadeIn()}>
                <AnfrageCompactButton label="Reifen anfragen" onClick={() => setAnfrageOpen(true)} />
              </motion.div>
            </div>
          </div>

          <div className="space-y-0">
            {tires.map((t, i) => (
              <motion.div key={t.name} {...staggerItem(i)}>
                <Link
                  to={t.link}
                  className="group flex items-center gap-6 py-5 md:py-7 border-b border-border hover:border-brand-accent/60 hover:bg-foreground/[0.02] transition-all duration-500 px-2 -mx-2"
                >
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="font-display text-xl md:text-3xl tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                      {t.name}
                    </span>
                    <span className="text-sm text-muted-foreground hidden md:inline font-body">{t.sub}</span>
                  </div>
                  <span className="text-brand-accent group-hover:translate-x-1 transition-transform duration-500">→</span>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <AnfrageKonfigurator isOpen={anfrageOpen} onClose={() => setAnfrageOpen(false)} initialCategory="tires" />
    </>
  );
};

export default ReifenFullscreen;

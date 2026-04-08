import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnfrageKonfigurator, { AnfrageCompactButton } from "@/components/anfrage/AnfrageKonfigurator";
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
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Fullscreen background image */}
        <div className="absolute inset-0">
          <img src={reifenSommer} alt="Reifen Sortiment" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto py-24 md:py-32 lg:py-40">
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-end">
            {/* Left: Content */}
            <div>
              <p className="text-brand-label text-brand-accent mb-4">Reifen</p>

              <motion.h2
                {...headingReveal()}
                className="text-brand-heading leading-[1.0] tracking-[-0.03em] uppercase mb-6 md:mb-8"
              >
                <span className="font-extrabold">Dein</span><br />
                <span className="font-extrabold">Reifen.</span>
              </motion.h2>

              <motion.p {...fadeIn()} className="text-brand-body max-w-xl mb-8">
                Tausende Reifen an Lager – von Budget bis Premium. Nicht dabei? Innerhalb 24 Stunden organisiert.
              </motion.p>

              <motion.div {...fadeIn()}>
                <AnfrageCompactButton label="Reifen anfragen" onClick={() => setAnfrageOpen(true)} />
              </motion.div>
            </div>

            {/* Right spacer */}
            <div className="hidden md:block" />
          </div>

          <div className="space-y-0 mt-20 md:mt-28">
            {tires.map((t, i) => (
              <motion.div key={t.name} {...staggerItem(i)}>
                <Link
                  to={t.link}
                  className="group flex items-center gap-6 py-4 md:py-5 border-b border-white/20 hover:border-brand-accent/60 transition-all duration-500"
                >
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                      {t.name}
                    </span>
                    <span className="text-sm text-white/70 hidden md:inline">{t.sub}</span>
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

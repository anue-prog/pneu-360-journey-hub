import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnfrageKonfigurator, { AnfrageCompactButton } from "@/components/anfrage/AnfrageKonfigurator";
import RevealImage from "@/components/shared/ImageReveal";
import felgenAlu from "@/assets/hero-felge-premium.webp";
import { fadeIn, headingReveal, staggerItem } from "./animations";

const items = [
  { name: "Alufelgen", sub: "Grosse Auswahl · Viele ohne MFK", link: "/reifen" },
  { name: "Sommerkompletträder", sub: "Felge + Reifen – montiert und fahrbereit", link: "/reifen" },
  { name: "Winterkompletträder", sub: "Sofort fahrbereit · Viele ohne MFK", link: "/reifen" },
];

const FelgenFullscreen = () => {
  const [anfrageOpen, setAnfrageOpen] = useState(false);

  return (
    <>
      <section className="bg-background py-32 md:py-44 lg:py-56 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative mb-20 md:mb-32">
            <span className="text-editorial-number absolute -top-8 md:-top-16 right-0 text-foreground/[0.04] pointer-events-none select-none" aria-hidden>
              03
            </span>
            <p className="text-brand-label text-brand-accent mb-4">Felgen & Kompletträder</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading"
            >
              Die richtige<br />Felge
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start mb-20 md:mb-32">
            <div className="flex flex-col justify-center">
              <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-8">
                Grosse Auswahl an Alufelgen und Kompletträdern – viele Modelle ohne MFK-Eintragung. Komm vorbei oder schick uns deine Anfrage.
              </motion.p>

              <motion.div {...fadeIn()}>
                <AnfrageCompactButton label="Felgen anfragen" onClick={() => setAnfrageOpen(true)} />
              </motion.div>
            </div>

            <RevealImage>
              <img src={felgenAlu} alt="Premium Felgen" className="w-full aspect-[3/4] object-cover" loading="lazy" />
            </RevealImage>
          </div>

          <div className="space-y-0">
            {items.map((f, i) => (
              <motion.div key={f.name} {...staggerItem(i)}>
                <Link
                  to={f.link}
                  className="group flex items-center gap-6 py-5 md:py-7 border-b border-border hover:border-brand-accent/60 hover:bg-foreground/[0.02] transition-all duration-500 px-2 -mx-2"
                >
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="font-display text-xl md:text-3xl tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                      {f.name}
                    </span>
                    <span className="text-sm text-muted-foreground hidden md:inline font-body">{f.sub}</span>
                  </div>
                  <span className="text-brand-accent group-hover:translate-x-1 transition-transform duration-500">→</span>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <AnfrageKonfigurator isOpen={anfrageOpen} onClose={() => setAnfrageOpen(false)} filterCategories={["wheels", "rims"]} />
    </>
  );
};

export default FelgenFullscreen;

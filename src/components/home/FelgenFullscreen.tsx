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
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start mb-20 md:mb-32">
            <div>
              <p className="text-brand-label text-brand-accent mb-4">Felgen & Kompletträder</p>

              <motion.h2
                {...headingReveal()}
                className="text-brand-heading leading-[1.0] tracking-[-0.03em] uppercase mb-6 md:mb-8"
              >
                <span className="font-extrabold">Die richtige</span><br />
                <span className="font-extrabold text-muted-foreground">Felge</span>
              </motion.h2>

              <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-8">
                Grosse Auswahl an Alufelgen und Kompletträdern – viele Modelle ohne MFK-Eintragung. Komm vorbei oder schick uns deine Anfrage.
              </motion.p>

              <motion.div {...fadeIn()}>
                <AnfrageCompactButton label="Felgen anfragen" onClick={() => setAnfrageOpen(true)} />
              </motion.div>
            </div>

            <RevealImage>
              <img src={felgenAlu} alt="Premium Felgen" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            </RevealImage>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {items.map((f, i) => (
              <motion.div key={f.name} {...staggerItem(i)}>
                <Link
                  to={f.link}
                  className="group flex items-center gap-6 py-4 md:py-5 border-b border-border hover:border-brand-accent/60 transition-all duration-500"
                >
                  <div className="flex-1">
                    <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500 block">
                      {f.name}
                    </span>
                    <span className="text-sm text-muted-foreground block mt-1">{f.sub}</span>
                  </div>
                  <span className="text-brand-accent group-hover:translate-x-1 transition-transform duration-500 flex-shrink-0">→</span>
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

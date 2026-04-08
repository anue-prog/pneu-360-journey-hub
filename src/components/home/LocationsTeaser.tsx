import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import AnfrageKonfigurator, { AnfrageCompactButton } from "@/components/anfrage/AnfrageKonfigurator";
import standortOftringen from "@/assets/standort-oftringen.jpg";
import { fadeIn, headingReveal, staggerItem } from "./animations";

const locations = [
  { name: "Oftringen", sub: "Perry Center", hours: "Mo–Fr 08:30–19:00 · Sa 08:00–16:00" },
  { name: "Langenthal", sub: "Meilenstein", hours: "Mo–Fr 08:00–18:00 · Sa 08:00–12:00" },
];

const ImageParallax = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <div ref={ref} className="overflow-hidden aspect-[16/10]">
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover"
        style={{ y, scale, willChange: "transform", transform: "translateZ(0)" }}
        loading="lazy"
      />
    </div>
  );
};

const LocationsTeaser = () => {
  const [anfrageOpen, setAnfrageOpen] = useState(false);

  return (
    <>
      <section className="bg-background py-32 md:py-44 lg:py-56 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Full-width image strip */}
          <motion.div {...fadeIn()} className="mb-20 md:mb-32 -mx-3 md:-mx-6">
            <ImageParallax src={standortOftringen} alt="Standort Pneu 360 Oftringen" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start mb-20 md:mb-32">
            <div>
              <p className="text-brand-label text-brand-accent mb-4">2 × vor Ort</p>

              <motion.h2
                {...headingReveal()}
                className="text-brand-heading mb-6 md:mb-8"
              >
                Einfach<br />vorbeikommen
              </motion.h2>

              <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-8">
                Kein Termin, keine Warteliste. Komm einfach vorbei oder frag vorab online an. Auch samstags offen.
              </motion.p>

              <motion.div {...fadeIn()} className="flex flex-wrap items-center gap-6">
                <AnfrageCompactButton label="Anfrage starten" onClick={() => setAnfrageOpen(true)} />
                <Link
                  to="/standorte"
                  className="text-brand-label text-muted-foreground hover:text-foreground transition-colors duration-500 inline-flex items-center gap-2 group"
                >
                  Details & Anfahrt <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="space-y-0">
            {locations.map((loc, i) => (
              <motion.div key={loc.name} {...staggerItem(i)}>
                <Link
                  to={`/standorte/${loc.name.toLowerCase()}`}
                  className="group flex items-center gap-6 py-5 md:py-7 border-b border-border hover:border-brand-accent/60 hover:bg-foreground/[0.02] transition-all duration-500 px-2 -mx-2"
                >
                  <div className="flex-1 flex items-baseline justify-between">
                    <div>
                      <span className="font-display text-xl md:text-3xl tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                        {loc.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-4 hidden md:inline font-body">{loc.sub}</span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground hidden md:inline font-body">{loc.hours}</span>
                  </div>
                  <span className="text-brand-accent group-hover:translate-x-1 transition-transform duration-500">→</span>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <AnfrageKonfigurator isOpen={anfrageOpen} onClose={() => setAnfrageOpen(false)} />
    </>
  );
};

export default LocationsTeaser;

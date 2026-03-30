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
    <div ref={ref} className="overflow-hidden aspect-[4/3]">
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
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start mb-20 md:mb-32">
            <div>
              <p className="text-brand-label text-brand-accent mb-4">2 × vor Ort</p>

              <motion.h2
                {...headingReveal()}
                className="text-brand-heading leading-[1.0] tracking-[-0.03em] uppercase mb-6 md:mb-8"
              >
                <span className="font-light">Einfach</span><br />
                <span className="font-extrabold text-muted-foreground">vorbeikommen</span>
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

            <ImageParallax src={standortOftringen} alt="Standort Pneu 360 Oftringen" />
          </div>

          <div className="space-y-0">
            {locations.map((loc, i) => (
              <motion.div key={loc.name} {...staggerItem(i)}>
                <Link
                  to={`/standorte/${loc.name.toLowerCase()}`}
                  className="group flex items-center gap-6 py-4 md:py-5 border-b border-border hover:border-brand-accent/60 transition-all duration-500"
                >
                  <div className="flex-1 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                        {loc.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-4 hidden md:inline">{loc.sub}</span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground hidden md:inline">{loc.hours}</span>
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

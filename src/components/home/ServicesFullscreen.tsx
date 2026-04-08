import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PreisrechnerKonfigurator, { PreisrechnerStartButton } from "@/components/preisrechner/PreisrechnerKonfigurator";
import servicesHero from "@/assets/services-hero.png";
import { fadeIn, headingReveal, staggerItem } from "./animations";

const services = [
  { name: "Radwechsel", desc: "Räder tauschen in 5–10 Min. – inkl. Luftdruck-Reset und Auswuchten.", link: "/radwechsel" },
  { name: "Reifenwechsel", desc: "Reifen ab- und aufziehen, auswuchten, Ventile prüfen – neue oder deine bestehenden.", link: "/reifenwechsel" },
  { name: "Reifenhotel", desc: "Klimatisiert, versichert und gereinigt gelagert – du kommst, wann's dir passt.", link: "/reifenhotel" },
  { name: "Autoreinigung", desc: "Dein Auto – innen, aussen oder beides. Sauber und professionell.", link: "/autoreinigung" },
  { name: "Felgenreparatur", desc: "Bordsteinschäden, Kratzer oder Neulackierung – deine Felgen wie neu.", link: "/felgenreparatur" },
  { name: "Reifenreparatur", desc: "Nagel oder Schraube im Reifen? Minicombi-Reparatur – dauerhaft, kein Notbehelf.", link: "/reifenreparatur" },
];

const ServicesFullscreen = () => {
  const [preisrechnerOpen, setPreisrechnerOpen] = useState(false);

  return (
    <>
      {/* Fullscreen hero image with overlaid text */}
      <section className="relative min-h-[80vh] md:min-h-screen overflow-hidden flex items-end">
        {/* Background image */}
        <img
          src={servicesHero}
          alt="Team bei der Arbeit"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay — stronger on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 md:px-6 pb-12 md:pb-20">
          <p className="text-brand-label text-brand-accent mb-4">
            Unsere Dienstleistungen
          </p>

          <motion.h2
            {...headingReveal()}
            className="text-[clamp(40px,10vw,80px)] md:text-[clamp(56px,6vw,96px)] leading-[0.95] tracking-[-0.03em] uppercase text-white font-extrabold mb-6 md:mb-8"
          >
            Alles rund<br />ums Rad
          </motion.h2>

          <motion.p {...fadeIn()} className="text-base md:text-lg text-white/70 max-w-xl mb-8">
            Vom Radwechsel bis zur Autoreinigung – alles an einem Ort. Einfach vorbeikommen.
          </motion.p>

          <motion.div {...fadeIn()}>
            <PreisrechnerStartButton label="Jetzt Kosten berechnen" onClick={() => setPreisrechnerOpen(true)} />
          </motion.div>
        </div>
      </section>

      {/* Service list */}
      <section className="bg-background py-16 md:py-24 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
            {services.map((s, i) => (
              <motion.div key={s.name} {...staggerItem(i)}>
                <Link
                  to={s.link}
                  className="group flex items-center gap-6 py-4 md:py-5 border-b border-border hover:border-brand-accent/60 transition-all duration-500"
                >
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                      {s.name}
                    </span>
                    <span className="text-sm text-muted-foreground hidden md:inline">{s.desc}</span>
                  </div>
                  <span className="text-brand-accent group-hover:translate-x-1 transition-transform duration-500">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PreisrechnerKonfigurator isOpen={preisrechnerOpen} onClose={() => setPreisrechnerOpen(false)} />
    </>
  );
};

export default ServicesFullscreen;

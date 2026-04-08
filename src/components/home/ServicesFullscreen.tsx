import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PreisrechnerKonfigurator, { PreisrechnerStartButton } from "@/components/preisrechner/PreisrechnerKonfigurator";
import RevealImage from "@/components/shared/ImageReveal";
import homeService from "@/assets/hero-workshop.webp";
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
      <section className="bg-background py-32 md:py-44 lg:py-56 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Full-width editorial heading with bg number */}
          <div className="relative mb-20 md:mb-32">
            <span className="text-editorial-number absolute -top-8 md:-top-16 right-0 text-foreground/[0.04] pointer-events-none select-none" aria-hidden>
              01
            </span>
            <p className="text-brand-label text-brand-accent mb-4">
              Unsere Dienstleistungen
            </p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading"
            >
              Alles rund<br />ums Rad
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start mb-20 md:mb-32">
            <div>
              <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-8">
                Vom Radwechsel bis zur Autoreinigung – alles an einem Ort. Einfach vorbeikommen.
              </motion.p>

              <motion.div {...fadeIn()}>
                <PreisrechnerStartButton label="Jetzt Kosten berechnen" onClick={() => setPreisrechnerOpen(true)} />
              </motion.div>
            </div>

            <RevealImage>
              <img src={homeService} alt="Radwechsel Service" className="w-full aspect-[3/4] object-cover" loading="lazy" />
            </RevealImage>
          </div>

          <div className="space-y-0">
            {services.map((s, i) => (
              <motion.div key={s.name} {...staggerItem(i)}>
                <Link
                  to={s.link}
                  className="group flex items-center gap-6 py-5 md:py-7 border-b border-border hover:border-brand-accent/60 hover:bg-foreground/[0.02] transition-all duration-500 px-2 -mx-2"
                >
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="font-display text-xl md:text-3xl tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                      {s.name}
                    </span>
                    <span className="text-sm text-muted-foreground hidden md:inline font-body">{s.desc}</span>
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

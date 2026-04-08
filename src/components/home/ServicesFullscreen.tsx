import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PreisrechnerKonfigurator, { PreisrechnerStartButton } from "@/components/preisrechner/PreisrechnerKonfigurator";
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
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Fullscreen background image */}
        <div className="absolute inset-0">
          <img src={homeService} alt="Radwechsel Service" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto py-24 md:py-32 lg:py-40">
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-end">
            {/* Left spacer on desktop */}
            <div className="hidden md:block" />

            {/* Right: Content */}
            <div>
              <p className="text-brand-label text-brand-accent mb-4">
                Unsere Dienstleistungen
              </p>

              <motion.h2
                {...headingReveal()}
                className="text-brand-heading leading-[1.0] tracking-[-0.03em] uppercase mb-6 md:mb-8"
              >
                <span className="font-extrabold">Alles rund</span><br />
                <span className="font-extrabold">ums Rad</span>
              </motion.h2>

              <motion.p {...fadeIn()} className="text-brand-body max-w-xl mb-8">
                Vom Radwechsel bis zur Autoreinigung – alles an einem Ort. Einfach vorbeikommen.
              </motion.p>

              <motion.div {...fadeIn()}>
                <PreisrechnerStartButton label="Jetzt Kosten berechnen" onClick={() => setPreisrechnerOpen(true)} />
              </motion.div>
            </div>
          </div>

          <div className="space-y-0 mt-20 md:mt-28">
            {services.map((s, i) => (
              <motion.div key={s.name} {...staggerItem(i)}>
                <Link
                  to={s.link}
                  className="group flex items-center gap-6 py-4 md:py-5 border-b border-white/20 hover:border-brand-accent/60 transition-all duration-500"
                >
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                      {s.name}
                    </span>
                    <span className="text-sm text-white/70 hidden md:inline">{s.desc}</span>
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

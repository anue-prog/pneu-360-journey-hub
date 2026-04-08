import { motion } from "framer-motion";
import { fadeIn, headingReveal, staggerItem } from "./animations";

const steps = [
  { num: "01", title: "Vorbeikommen oder anfragen", desc: "Einfach vorbeikommen oder online anfragen – ganz wie's dir passt." },
  { num: "02", title: "Beratung & Service", desc: "Wir schauen uns alles an und beraten dich ehrlich." },
  { num: "03", title: "Fertig", desc: "Professionell erledigt, fair abgerechnet. Ohne Überraschungen." },
];

const ProcessSection = () => {
  return (
    <section className="bg-card py-32 md:py-44 lg:py-56 px-3 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative mb-20 md:mb-28">
          <p className="text-brand-label text-brand-accent mb-4">
            So einfach geht's
          </p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading"
          >
            In 3 Schritten<br />zum Service
          </motion.h2>
        </div>

        <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-20 md:mb-28">
          Kein Termin, kein Papierkram. So läuft's bei uns.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.title} {...staggerItem(i)} className="relative p-10 md:p-14">
              {/* Giant background number */}
              <span className="text-editorial-number absolute top-0 left-4 text-foreground/[0.04] pointer-events-none select-none leading-none" aria-hidden>
                {step.num}
              </span>
              {/* Accent top line */}
              <div className="w-12 h-[2px] bg-brand-accent mb-8" />
              <p className="font-display text-2xl md:text-3xl uppercase tracking-[-0.02em] text-foreground mb-4">{step.title}</p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-body">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

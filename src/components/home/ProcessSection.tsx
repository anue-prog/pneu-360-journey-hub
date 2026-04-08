import { motion } from "framer-motion";
import { fadeIn, headingReveal, staggerItem } from "./animations";

const steps = [
  { num: "01", title: "Vorbeikommen oder anfragen", desc: "Einfach vorbeikommen oder online anfragen – ganz wie's dir passt." },
  { num: "02", title: "Beratung & Service", desc: "Wir schauen uns alles an und beraten dich ehrlich." },
  { num: "03", title: "Fertig", desc: "Professionell erledigt, fair abgerechnet. Ohne Überraschungen." },
];

const ProcessSection = () => {
  return (
    <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-brand-label text-brand-accent mb-4">
          So einfach geht's
        </p>

        <motion.h2
          {...headingReveal()}
          className="text-brand-heading leading-[1.0] tracking-[-0.03em] uppercase mb-8 md:mb-10"
        >
          <span className="font-light">In 3 Schritten</span><br />
          <span className="font-extrabold text-muted-foreground">zum Service</span>
        </motion.h2>

        <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-20 md:mb-28">
          Kein Termin, kein Papierkram. So läuft's bei uns.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.title} {...staggerItem(i)} className="border border-border p-10 md:p-14">
              <p className="text-6xl font-black text-brand-accent/20 mb-6">{step.num}</p>
              <p className="text-xl md:text-2xl font-bold uppercase tracking-[-0.02em] text-foreground mb-4">{step.title}</p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

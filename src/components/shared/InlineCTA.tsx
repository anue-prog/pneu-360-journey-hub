import { motion } from "framer-motion";
import CTAButton from "@/components/shared/CTAButton";
import ContentBlock from "@/components/shared/ContentBlock";

interface InlineCTAProps {
  label?: string;
  title: string;
  text?: string;
  buttonText?: string;
  buttonTo?: string;
  number?: string;
  backgroundImage?: string;
}

const headingReveal = {
  initial: { clipPath: "inset(0 0 100% 0)", y: 12, opacity: 0 },
  whileInView: { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

const InlineCTA = ({
  label = "Bereit?",
  title,
  text,
  buttonText = "Anfrage starten",
  buttonTo = "/anfrage",
  number,
  backgroundImage,
}: InlineCTAProps) => (
  <section className="relative bg-background py-32 md:py-48 px-3 md:px-6 text-center overflow-hidden">
    {backgroundImage && (
      <>
        <img
          src={backgroundImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </>
    )}
    <ContentBlock className="relative z-10 max-w-xl mx-auto">
      {number && (
        <span className="text-section-number text-brand-accent opacity-30 leading-none block mb-6">{number}</span>
      )}
      <p className={`text-[10px] font-medium tracking-[4px] uppercase mb-5 ${backgroundImage ? "text-white/60" : "text-muted-foreground"}`}>
        {label}
      </p>
      <motion.h2 {...headingReveal} className={`text-[clamp(26px,4.5vw,48px)] font-extrabold tracking-[-0.03em] uppercase mb-4 leading-[1.1] ${backgroundImage ? "text-white" : ""}`}>
        {title}
      </motion.h2>
      <div className="w-12 h-[2px] bg-brand-accent mx-auto mb-8" />
      {text && (
        <p className={`text-base md:text-lg font-light mb-10 leading-[1.8] ${backgroundImage ? "text-white/70" : "text-muted-foreground"}`}>{text}</p>
      )}
      <CTAButton to={buttonTo}>{buttonText}</CTAButton>
    </ContentBlock>
  </section>
);

export default InlineCTA;

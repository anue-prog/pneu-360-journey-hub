import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  number?: string;
}

const SectionHeading = ({ label, title, number }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-14 md:mb-20 max-w-2xl relative"
    >
      {number && (
        <span className="text-editorial-number absolute -top-8 md:-top-16 right-0 text-foreground/[0.04] pointer-events-none select-none" aria-hidden>
          {number}
        </span>
      )}
      <div>
        {label && (
          <p className="text-brand-label text-muted-foreground mb-3">{label}</p>
        )}
        <h2 className="text-brand-heading">
          {title}
        </h2>
      </div>
    </motion.div>
  );
};

export default SectionHeading;

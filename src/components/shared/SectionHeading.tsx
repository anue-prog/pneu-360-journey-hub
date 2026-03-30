import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  number?: string;
}

const SectionHeading = ({ label, title, number }: SectionHeadingProps) => {
  const words = title.split(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-14 md:mb-20 max-w-2xl"
    >
      <div className="flex items-start gap-6">
        {number && (
          <span className="text-[clamp(48px,8vw,96px)] font-black text-brand-accent leading-none -mt-2 opacity-30">{number}</span>
        )}
        <div>
          {label && (
            <p className="text-brand-label text-muted-foreground mb-3">{label}</p>
          )}
          <h2 className="text-brand-heading font-extrabold leading-[0.95] tracking-[-0.03em] uppercase">
            {words.map((word, i) => (
              <span key={i} className="inline-block mr-[0.3em]">
                {word}
              </span>
            ))}
          </h2>
          
        </div>
      </div>
    </motion.div>
  );
};

export default SectionHeading;

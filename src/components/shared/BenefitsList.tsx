import { motion } from "framer-motion";

interface BenefitsListProps {
  items: string[];
  columns?: 1 | 2;
}

const BenefitsList = ({ items, columns = 2 }: BenefitsListProps) => (
  <div className={`grid grid-cols-1 ${columns === 2 ? "md:grid-cols-2" : ""} gap-3`}>
    {items.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -4 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-start gap-3"
      >
        <span className="text-muted-foreground/60 flex-shrink-0 mt-[2px] text-sm select-none">–</span>
        <span className="text-base text-foreground/90 font-light leading-[1.85]">{item}</span>
      </motion.div>
    ))}
  </div>
);

export default BenefitsList;

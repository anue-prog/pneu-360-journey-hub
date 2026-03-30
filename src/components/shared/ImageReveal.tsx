import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { EASE } from "@/components/home/animations";

/**
 * RevealImage – soft scale-settle on enter + gentle Y-parallax on scroll.
 */
const RevealImage = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-16%", "16%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.2, ease: EASE }}
      className={`overflow-hidden ${className}`}
    >
      <motion.div style={{ y, willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default RevealImage;

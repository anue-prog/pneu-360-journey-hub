import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContentBlockProps {
  children: ReactNode;
  className?: string;
}

const ContentBlock = ({ children, className = "" }: ContentBlockProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
    className={className}
    style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
  >
    {children}
  </motion.div>
);

export default ContentBlock;

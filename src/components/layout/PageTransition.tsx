import { motion } from "framer-motion";
import logoTransition from "@/assets/logo-transition.svg";

const ease = [0.76, 0, 0.24, 1] as const;

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {/* Slide 1: Black panel slides UP to cover */}
    <motion.div
      className="fixed inset-0 z-[60] bg-brand-accent pointer-events-none origin-bottom"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 1 }}
      transition={{ duration: 0.5, ease }}
      style={{ transformOrigin: "bottom", willChange: "transform" }}
    />
    {/* Brand text centered during black curtain */}
    <motion.div
      className="fixed inset-0 z-[61] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: [0, 0, 1, 1, 0] }}
      transition={{ duration: 0.8, ease: "easeInOut", times: [0, 0.35, 0.45, 0.75, 1] }}
    >
      <img
        src={logoTransition}
        alt="Pneu 360"
        className="w-[60vw] max-w-[500px] md:w-[40vw] md:max-w-[600px] h-auto"
      />
    </motion.div>
    {/* Slide 2: Black panel slides UP to reveal */}
    <motion.div
      className="fixed inset-0 z-[60] bg-brand-accent pointer-events-none origin-top"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.3 }}
      style={{ transformOrigin: "top", willChange: "transform" }}
    />
    {/* Page content */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.5 }}
    >
      {children}
    </motion.div>
  </div>
);

export default PageTransition;

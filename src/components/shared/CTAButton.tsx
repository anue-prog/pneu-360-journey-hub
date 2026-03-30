import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CTAButtonProps {
  href?: string;
  to?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

const CTAButton = ({ href, to, children, variant = "primary", className = "" }: CTAButtonProps) => {
  const base = "inline-flex items-center justify-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase px-10 py-5 transition-all duration-300";
  const styles = variant === "primary"
    ? `${base} bg-brand-accent text-black hover:brightness-110`
    : `${base} border border-white/15 text-white hover:border-white/50`;

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
  };

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={`${styles} ${className}`}>{children}</Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} {...motionProps} className={`${styles} ${className}`}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button {...motionProps} className={`${styles} ${className}`}>
      {children}
    </motion.button>
  );
};

export default CTAButton;

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import GrainOverlay from "@/components/shared/GrainOverlay";

interface ImageTextSectionProps {
  image: string;
  alt: string;
  label: string;
  title: string;
  text: string;
  linkTo: string;
  linkText: string;
  reverse?: boolean;
}

const ImageTextSection = ({ image, alt, label, title, text, linkTo, linkText, reverse = false }: ImageTextSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const blurReveal = useTransform(scrollYProgress, [0, 0.35], [100, 0]);
  const textY = useTransform(scrollYProgress, [0.1, 0.5], [60, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <section ref={ref} className="bg-background">
      <div className={`max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-[80vh] ${reverse ? "md:direction-rtl" : ""}`}>
        {/* Image */}
        <motion.div
          style={{ opacity: imgOpacity }}
          className={`relative overflow-hidden ${reverse ? "md:order-2" : ""}`}
        >
          <motion.img
            src={image}
            alt={alt}
            style={{ scale: imgScale }}
            className="w-full h-full object-cover min-h-[50vh] md:min-h-full"
          />
          {/* Blur reveal overlay – slides up as section enters */}
          <motion.div
            style={{ height: blurReveal }}
            className="absolute top-0 left-0 right-0 backdrop-blur-xl bg-background/60 pointer-events-none"
          />
          <GrainOverlay />
          {/* Subtle edge gradient into content */}
          <div className={`absolute inset-0 ${reverse ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-transparent via-transparent to-background/30 hidden md:block`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
        </motion.div>

        {/* Text */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className={`flex flex-col justify-center px-6 md:px-16 lg:px-24 py-16 md:py-24 ${reverse ? "md:order-1 md:text-right md:items-end" : ""}`}
        >
          <p className="text-[11px] font-medium tracking-[4px] uppercase text-brand-accent mb-4">
            {label}
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-extrabold leading-[1.0] tracking-[-0.03em] uppercase mb-6">
            {title}
          </h2>
          <div className={`w-12 h-[2px] bg-brand-accent mb-8 ${reverse ? "md:ml-auto" : ""}`} />
          <p className="text-sm md:text-[15px] leading-[1.85] text-muted-foreground font-light max-w-[440px] mb-10">
            {text}
          </p>
          <Link
            to={linkTo}
            className="text-[10px] font-bold tracking-[2.5px] uppercase text-brand-accent hover:text-foreground transition-colors duration-300 inline-flex items-center gap-3 group"
          >
            {linkText}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="h-px bg-border/30" />
      </div>
    </section>
  );
};

export default ImageTextSection;

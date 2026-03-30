import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";


interface FullScreenSectionProps {
  image: string;
  alt: string;
  children: ReactNode;
  className?: string;
}

const FullScreenSection = ({ image, alt, children, className = "" }: FullScreenSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1, 1.08]);

  const mobileBrightness = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [1, 0.3, 0.3, 1]);
  const mobileBlur = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 3, 3, 0]);
  const mobileFilter = useTransform(
    [mobileBrightness, mobileBlur],
    ([b, bl]) => `brightness(${b}) blur(${bl}px)`
  );

  return (
    <section
      ref={ref}
      className={`group/section relative min-h-screen flex items-end overflow-hidden ${className}`}
    >
      <motion.div className="absolute inset-0" style={{ y: bgY, scale, willChange: "transform", transform: "translateZ(0)" }}>
        {isMobile ? (
          <motion.img
            src={image}
            alt={alt}
            className="w-full h-full object-cover will-change-[filter] backface-hidden"
            style={{ filter: mobileFilter, transform: "translateZ(0)" }}
            loading="lazy"
          />
        ) : (
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover transition-[filter] duration-700 group-hover/section:brightness-[0.3] group-hover/section:blur-[3px]"
            loading="lazy"
          />
        )}
      </motion.div>

      {/* Lighter gradient – less muddy */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />


      

      <div className="relative z-10 w-full px-5 md:px-10 pb-12 md:pb-20 pt-32">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </div>
    </section>
  );
};

export default FullScreenSection;

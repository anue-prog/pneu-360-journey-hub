import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ImageDividerProps {
  src: string;
  alt: string;
}

const ImageDivider = ({ src, alt }: ImageDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-[130%] object-cover"
        style={{ y, willChange: "transform", transform: "translateZ(0)" }}
        loading="lazy"
      />
    </div>
  );
};

export default ImageDivider;

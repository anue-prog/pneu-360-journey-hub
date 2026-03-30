import { useRef, useState, ReactNode } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

interface ServicePageHeroProps {
  image: string;
  alt: string;
  label: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  videoUrl?: string;
  children?: ReactNode;
}

const ServicePageHero = ({ image, alt, label, title, titleAccent, subtitle, videoUrl, children }: ServicePageHeroProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, 50]);
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const bottomY = useTransform(scrollYProgress, [0, 0.3], [0, 30]);

  const isYouTube = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url;
  };

  return (
    <header ref={ref} className="relative min-h-screen overflow-hidden flex flex-col md:justify-end">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale, y: bgY, willChange: "transform", transform: "translateZ(0)" }}
      >
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease }}
          className="w-full h-full"
        >
          <AnimatePresence>
            {!showVideo && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <img src={image} alt={alt} className="w-full h-full object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dark reveal overlay */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-0 bg-black z-[1] pointer-events-none"
      />

      {/* Video overlay */}
      <AnimatePresence>
        {showVideo && videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-[2]"
          >
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(videoUrl)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Video"
              />
            ) : (
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                controls
                playsInline
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-[2]" />

      {/* Play button */}
      {videoUrl && !showVideo && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => setShowVideo(true)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 md:w-24 md:h-24 border border-white/20 flex items-center justify-center hover:border-brand-accent hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-black/10 group"
          aria-label="Video abspielen"
        >
          <Play className="w-7 h-7 md:w-8 md:h-8 text-white/80 group-hover:text-brand-accent transition-colors duration-300 ml-1" />
        </motion.button>
      )}

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 md:px-6 pb-10 md:pb-24 text-left flex flex-col flex-1 md:flex-none justify-end">
        {/* Text group — slower fade */}
        <motion.div style={{ opacity: textOpacity, y: textY }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="text-brand-label text-brand-accent mb-4"
          >
            {label}
          </motion.p>

          <div className="overflow-visible pb-2 md:pb-3">
            <motion.h1
              initial={{ clipPath: "inset(0 0 100% 0)", transform: "translateY(30%)" }}
              animate={{ clipPath: "inset(0 0 0% 0)", transform: "translateY(0%)" }}
              transition={{ duration: 1.1, ease, delay: 0.4 }}
              className="text-[clamp(36px,8vw,72px)] md:text-[clamp(48px,5.5vw,80px)] leading-[1] md:leading-[0.94] tracking-[-0.03em] text-white uppercase mb-6 pb-[0.08em]"
            >
              <span className="font-light">{title}</span>
              {titleAccent && (
                <>
                  <br />
                  <span className="font-extrabold text-brand-accent">{titleAccent}</span>
                </>
              )}
            </motion.h1>
          </div>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease, delay: 1.1 }}
              className="text-brand-body text-white max-w-[560px] mb-8"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        {/* Bottom elements — faster fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 1.4 }}
        >
          <motion.div style={{ opacity: bottomOpacity, y: bottomY }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease, delay: 1.6 }}
              className="w-16 h-[3px] bg-brand-accent origin-left"
            />
            {children && <div className="mt-8">{children}</div>}
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default ServicePageHero;

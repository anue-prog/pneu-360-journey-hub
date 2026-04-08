import { useRef, useState, ReactNode } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import PixelReveal from "@/components/shared/PixelReveal";

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
                <PixelReveal src={image} alt={alt} className="w-full h-full" duration={1600} initialPixelSize={48} />
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent z-[2]" />

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

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 md:px-0 pb-10 md:pb-24 text-left flex flex-col flex-1 md:flex-none justify-end">
        <motion.div style={{ opacity: textOpacity, y: textY }} className="w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
            {/* Left: Title */}
            <div className="overflow-visible pb-2 md:pb-3 md:flex-1">
              <motion.h1
                initial={{ clipPath: "inset(0 0 100% 0)", transform: "translateY(30%)" }}
                animate={{ clipPath: "inset(0 0 0% 0)", transform: "translateY(0%)" }}
                transition={{ duration: 1.1, ease, delay: 0.4 }}
                className="text-[clamp(36px,10vw,56px)] md:text-[clamp(64px,6.5vw,108px)] leading-[0.92] tracking-[-0.03em] text-white uppercase pb-[0.08em]"
              >
                <motion.span
                  className="font-extrabold inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 0.4 }}
                >
                  {title}
                </motion.span>
                {titleAccent && (
                  <>
                    <br />
                    <motion.span
                      className="font-extrabold text-brand-accent inline-block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, ease, delay: 0.48 }}
                    >
                      {titleAccent}
                    </motion.span>
                  </>
                )}
              </motion.h1>
            </div>

            {/* Right: Description */}
            {subtitle && (
              <div className="md:flex-shrink-0 md:max-w-[360px] md:pb-3">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 1.1 }}
                  className="text-brand-body text-white"
                >
                  {subtitle}
                </motion.p>
                {children && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease, delay: 1.4 }}
                    className="mt-6"
                  >
                    {children}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Accent line — full width */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease, delay: 1.6 }}
            className="w-full h-[2px] bg-white origin-left mt-6"
          />
        </motion.div>
      </div>
    </header>
  );
};

export default ServicePageHero;

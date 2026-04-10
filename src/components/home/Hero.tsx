import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroCar from "@/assets/hero-car-night.png";
import AnfrageKonfigurator, { AnfrageStartButton } from "@/components/anfrage/AnfrageKonfigurator";
import WaitTimeTicker from "@/components/home/WaitTimeTicker";

const ease = [0.16, 1, 0.3, 1] as const;

const Hero = () => {
  const [anfrageOpen, setAnfrageOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, 50]);

  return (
    <>
      <header ref={ref} className="relative min-h-screen overflow-hidden flex flex-col md:justify-end">
        {/* Parallax background with Ken-Burns reverse zoom entry */}
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
            <img src={heroCar} alt="Luxusfahrzeug mit Premium-Felgen" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Dark reveal overlay — fades from black to transparent */}
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-0 bg-black z-[1] pointer-events-none"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent z-[2]" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto pb-10 md:pb-24 text-left flex flex-col flex-1 md:flex-none justify-end">
          <motion.div style={{ opacity: textOpacity, y: textY }} className="w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
              {/* Left: Title */}
              <div className="overflow-visible pb-2 md:pb-3 md:flex-1">
                <motion.h1
                  initial={{ clipPath: "inset(0 0 100% 0)", transform: "translateY(30%)" }}
                  animate={{ clipPath: "inset(0 0 0% 0)", transform: "translateY(0%)" }}
                  transition={{ duration: 1.1, ease, delay: 0.4 }}
                  className="text-[clamp(52px,14vw,72px)] md:text-[clamp(64px,6.5vw,108px)] leading-[0.92] tracking-[-0.03em] text-white uppercase pb-[0.08em]"
                >
                  <motion.span
                    className="font-extrabold inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease, delay: 0.4 }}
                  >
                    Dein<br />Rundum-<br />Service
                  </motion.span>
                  <br />
                  <motion.span
                    className="font-extrabold text-brand-accent inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease, delay: 0.48 }}
                  >
                    ohne Termin
                  </motion.span>
                </motion.h1>
              </div>

              {/* Right: Description + Button */}
              <div className="md:flex-shrink-0 md:max-w-[360px] md:pb-3 flex flex-col gap-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 1.1 }}
                  className="text-brand-body text-white"
                >
                  Radwechsel, Reifen, Felgen, Einlagerung und Autoreinigung – alles an einem Ort.
                  Ohne Termin, einfach vorbeikommen. In Oftringen oder Langenthal.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 1.4 }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="[&_button]:border-2 [&_button]:border-white [&_button]:text-white [&_button_span]:text-white [&_button_span]:opacity-100 [&_button:hover]:border-brand-accent">
                      <AnfrageStartButton variant="outline" onClick={() => setAnfrageOpen(true)} />
                    </div>
                    <WaitTimeTicker />
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Accent line — full width, left to right */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease, delay: 1.6 }}
              className="w-full h-[2px] bg-white origin-left mt-6"
            />
          </motion.div>
        </div>
      </header>

      <AnfrageKonfigurator isOpen={anfrageOpen} onClose={() => setAnfrageOpen(false)} />
    </>
  );
};

export default Hero;

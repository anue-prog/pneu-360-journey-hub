import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import reifenSommer from "@/assets/reifen-sommer.webp";
import reifenWinter from "@/assets/reifen-winter.webp";
import reifenGanzjahr from "@/assets/reifen-ganzjahr.webp";
import reifenOffroad from "@/assets/reifen-offroad.jpg";
import GrainOverlay from "@/components/shared/GrainOverlay";
import RevealImage from "@/components/shared/ImageReveal";

const tires = [
  { image: reifenSommer, label: "Sommerreifen", sub: "Optimaler Grip ab 7 °C · Alle Marken", link: "/sommerreifen", objectPos: "center 55%" },
  { image: reifenWinter, label: "Winterreifen", sub: "Alpine-Symbol · Schnee & Eis", link: "/winterreifen", objectPos: "center 55%" },
  { image: reifenGanzjahr, label: "Ganzjahresreifen", sub: "Der Allrounder für Stadtfahrer", link: "/ganzjahresreifen", objectPos: "center 50%" },
  { image: reifenOffroad, label: "Offroadreifen", sub: "Robust für jedes Gelände", link: "/offroadreifen", objectPos: "center 50%" },
];

const ReifenStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={ref} className="relative bg-background overflow-hidden py-20 md:py-32">
      <motion.div style={{ opacity }} className="relative z-10 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <p className="text-brand-label text-brand-accent mb-3">Über 30 Marken</p>
              <h2 className="text-brand-heading font-extrabold leading-[1.0] tracking-[-0.03em] uppercase">
                Unsere Reifen
              </h2>
              <p className="text-brand-body text-foreground/85 mt-4 max-w-lg">
                Als unabhängiger Händler sind wir keiner Marke verpflichtet — nur Ihnen.
              </p>
            </div>
            <Link
              to="/reifen"
              className="hidden md:inline-flex text-brand-label text-brand-accent hover:text-foreground transition-colors items-center gap-2 group"
            >
              Mehr erfahren <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* No per-card whileInView animation – only ImageReveal handles the reveal */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {tires.map((tire) => (
              <div key={tire.label}>
                <Link to={tire.link} className="group block relative overflow-hidden">
                  <RevealImage className="aspect-square md:aspect-[3/4] relative overflow-hidden">
                    <img src={tire.image} alt={tire.label} style={{ objectPosition: tire.objectPos }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent hidden md:block" />
                    <GrainOverlay className="hidden md:block" />
                  </RevealImage>
                  {/* Mobile: Text below image */}
                  <div className="p-3 md:hidden">
                    <h3 className="text-sm font-bold tracking-[-0.01em]">{tire.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tire.sub}</p>
                  </div>
                  {/* Desktop: Overlay on image */}
                  <div className="hidden md:block absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-lg font-bold tracking-[-0.01em] mb-0">{tire.label}</h3>
                    <p className="text-brand-body text-foreground/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{tire.sub}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right md:hidden">
            <Link to="/reifen" className="text-brand-label text-brand-accent hover:text-foreground transition-colors">
              Mehr erfahren →
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ReifenStrip;

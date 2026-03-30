import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import GrainOverlay from "@/components/shared/GrainOverlay";
import RevealImage from "@/components/shared/ImageReveal";
import homeService from "@/assets/home-service.jpg";
import einlagerungReifen from "@/assets/einlagerung-reifen.webp";

const BentoServices = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section ref={ref} className="relative bg-background px-3 md:px-6 py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto">
        <motion.div style={{ y, opacity }}>
          {/* Header */}
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <p className="text-brand-label text-brand-accent mb-3">Was wir machen</p>
              <h2 className="text-brand-heading font-extrabold leading-[1.0] tracking-[-0.03em] uppercase">
                Alles rund ums Rad
              </h2>
            </div>
            <Link
              to="/dienstleistungen"
              className="hidden md:inline-flex text-brand-label text-brand-accent hover:text-foreground transition-colors items-center gap-2 group"
            >
              Alle Services <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Two large tiles – no container animation, only ImageReveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Radwechsel */}
            <div className="relative overflow-hidden group">
              <Link to="/dienstleistungen" className="block relative">
              <RevealImage className="aspect-[4/5] md:aspect-[3/4] relative">
                  <img src={homeService} alt="Radwechsel Service" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <GrainOverlay className="hidden md:block" />
                </RevealImage>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <p className="text-brand-label text-brand-accent mb-3">Ohne Termin</p>
                  <h3 className="text-brand-subheading font-bold tracking-[-0.02em] uppercase mb-3">Radwechsel & Montage</h3>
                  <p className="text-brand-body text-foreground/85 max-w-sm">
                    Saisonaler Wechsel oder neue Reifen – inkl. Auswuchten, RDKS-Check und Ventile.
                  </p>
                </div>
              </Link>
            </div>

            {/* Einlagerung */}
            <div className="relative overflow-hidden group">
              <Link to="/reifenhotel" className="block relative">
              <RevealImage className="aspect-[4/5] md:aspect-[3/4] relative">
                  <img src={einlagerungReifen} alt="Reifeneinlagerung" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <GrainOverlay className="hidden md:block" />
                </RevealImage>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <p className="text-brand-label text-brand-accent mb-3">Versichert</p>
                  <h3 className="text-brand-subheading font-bold tracking-[-0.02em] uppercase mb-3">Einlagerung</h3>
                  <p className="text-brand-body text-foreground/85 max-w-sm">
                    Klimatisiert, mit Reinigung & Erinnerung. Ab CHF 60.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Secondary services */}
          <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border/20 pt-8">
            <span className="text-brand-body text-muted-foreground">Weitere Services:</span>
            <Link to="/autoreinigung" className="text-brand-body text-foreground/90 hover:text-brand-accent transition-colors">
              Autoreinigung
            </Link>
            <Link to="/felgenreparatur" className="text-brand-body text-foreground/90 hover:text-brand-accent transition-colors">
              Felgenreparatur
            </Link>
            <Link to="/reifenreparatur" className="text-brand-body text-foreground/90 hover:text-brand-accent transition-colors">
              Reifenreparatur
            </Link>
          </div>

          {/* Mobile link */}
          <div className="mt-8 text-right md:hidden">
            <Link to="/dienstleistungen" className="text-brand-label text-brand-accent">
              Alle Services →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoServices;

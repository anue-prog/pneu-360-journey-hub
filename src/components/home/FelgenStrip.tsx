import { Link } from "react-router-dom";
import felgenAlu from "@/assets/felgen-alu.webp";
import felgenSommer from "@/assets/felgen-sommer.webp";
import felgenWinter from "@/assets/komplettraeder-winter.webp";
import GrainOverlay from "@/components/shared/GrainOverlay";
import RevealImage from "@/components/shared/ImageReveal";

const items = [
  { image: felgenAlu, label: "Felgen", sub: "Alle Marken · Persönliche Beratung" },
  { image: felgenSommer, label: "Sommerkompletträder", sub: "Felge + Reifen montiert" },
  { image: felgenWinter, label: "Winterkompletträder", sub: "Alpine-geprüft · Grosse Auswahl" },
];

const FelgenStrip = () => (
  <section className="bg-card overflow-hidden py-20 md:py-32">
    <div className="px-3 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p className="text-brand-label text-brand-accent mb-3">Felgen & Kompletträder</p>
            <h2 className="text-brand-heading font-extrabold leading-[1.0] tracking-[-0.03em] uppercase">
              Die richtige Felge
            </h2>
          </div>
          <Link
            to="/reifen"
            className="hidden md:inline-flex text-brand-label text-brand-accent hover:text-foreground transition-colors items-center gap-2 group"
          >
            Mehr erfahren <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {items.map((f) => (
            <div key={f.label}>
              <Link to="/reifen" className="group block relative overflow-hidden">
                <RevealImage className="aspect-[16/9] md:aspect-[3/4] relative overflow-hidden">
                  <img src={f.image} alt={f.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent hidden md:block" />
                  <GrainOverlay className="hidden md:block" />
                </RevealImage>
                {/* Mobile: Text below image */}
                <div className="p-3 md:hidden">
                  <h3 className="text-sm font-bold tracking-[-0.01em]">{f.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{f.sub}</p>
                </div>
                {/* Desktop: Overlay on image */}
                <div className="hidden md:block absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-bold tracking-[-0.01em] mb-0">{f.label}</h3>
                  <p className="text-brand-body text-foreground/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{f.sub}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right md:hidden">
          <Link to="/reifen" className="text-brand-label text-brand-accent">
            Mehr erfahren →
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default FelgenStrip;

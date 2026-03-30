import { Link } from "react-router-dom";
import felgenSommer from "@/assets/felgen-sommer.webp";
import felgenWinter from "@/assets/komplettraeder-winter.webp";
import GrainOverlay from "@/components/shared/GrainOverlay";
import RevealImage from "@/components/shared/ImageReveal";

const items = [
  { image: felgenSommer, label: "Sommerkompletträder", sub: "Felgen mit Sommerreifen – sofort fahrbereit montiert.", tag: "Ab Lager" },
  { image: felgenWinter, label: "Winterkompletträder", sub: "Sicher auf Schnee und Eis. Grosse Auswahl, viele MFK-frei.", tag: "MFK-frei" },
];

const KomplettraederStrip = () => (
  <section className="bg-background overflow-hidden py-14 md:py-24">
    <div className="px-3 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 md:mb-14">
          <p className="text-brand-label text-brand-accent mb-3">Sofort fahrbereit</p>
          <h2 className="text-brand-heading font-extrabold leading-[1.0] tracking-[-0.03em] uppercase">
            Kompletträder
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.label}>
              <Link to="/reifen" className="group block relative overflow-hidden">
                <RevealImage className="aspect-[16/9] md:aspect-[3/2] relative">
                  <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <GrainOverlay className="hidden md:block" />
                </RevealImage>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-brand-label text-brand-accent mb-3">{item.tag}</p>
                  <h3 className="text-brand-subheading font-bold tracking-[-0.02em] uppercase mb-2">{item.label}</h3>
                  <p className="text-brand-body text-foreground/70 max-w-md">{item.sub}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default KomplettraederStrip;

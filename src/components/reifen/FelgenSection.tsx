import { Link } from "react-router-dom";
import RevealImage from "@/components/shared/ImageReveal";
import { felgen, marken } from "@/data/siteData";
import felgenSommer from "@/assets/felgen-sommer.webp";
import felgenWinter from "@/assets/felgen-winter.jpg";
import felgenAlu from "@/assets/felgen-alu.webp";
import felgenMfk from "@/assets/felgen-mfk.jpg";

const felgenImages = [felgenSommer, felgenWinter, felgenAlu, felgenMfk];

const FelgenSection = () => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 md:mb-24">
      {felgen.map((f, i) => (
        <Link
          key={i}
          to={f.href}
          className="group bg-card border border-border/40 overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 hover:border-brand-accent/30"
        >
          <RevealImage className="aspect-square relative">
            <img
              src={felgenImages[i]}
              alt={f.titel}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </RevealImage>
          <div className="p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold mb-2">{f.titel}</h3>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-[1.7]">{f.text}</p>
          </div>
        </Link>
      ))}
    </div>

    <div>
      <p className="text-[11px] font-medium tracking-[4px] uppercase text-foreground/60 mb-8">Unsere Markenpartner</p>
      <div className="flex flex-wrap gap-4">
        {marken.map((m, i) => (
          <span
            key={i}
            className="text-sm font-light text-foreground/60 border border-border/40 px-5 py-3 hover:text-foreground/80 hover:border-border transition-all cursor-default"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default FelgenSection;

import { Link } from "react-router-dom";
import RevealImage from "@/components/shared/ImageReveal";
import { reifenSortiment } from "@/data/siteData";
import reifenSommer from "@/assets/reifen-sommer.webp";
import reifenWinter from "@/assets/reifen-winter.webp";
import reifenGanzjahr from "@/assets/reifen-ganzjahr.webp";
import reifenOffroad from "@/assets/reifen-offroad.jpg";

const reifenImages = [reifenSommer, reifenWinter, reifenGanzjahr, reifenOffroad];

const ReifenCard = ({ reifen, image, index }: { reifen: typeof reifenSortiment[0]; image: string; index: number }) => {
  return (
    <Link
      to={reifen.href}
      className="group bg-card border border-border/40 overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 hover:border-brand-accent/30"
    >
      <RevealImage className="aspect-[4/3] relative">
        <img
          src={image}
          alt={reifen.titel}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </RevealImage>
      <div className="p-6 md:p-8">
        <span className="text-xs font-bold tracking-[2px] text-brand-accent uppercase block mb-2">{reifen.saison}</span>
        <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-[-0.02em]">{reifen.titel}</h3>
        <p className="text-base md:text-lg leading-[1.75] text-muted-foreground font-light">{reifen.text}</p>
      </div>
    </Link>
  );
};

const ReifenSortiment = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    {reifenSortiment.map((r, i) => (
      <ReifenCard key={i} reifen={r} image={reifenImages[i]} index={i} />
    ))}
  </div>
);

export default ReifenSortiment;

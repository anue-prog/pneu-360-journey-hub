import continental from "@/assets/marken/continental.svg";
import barum from "@/assets/marken/barum.svg";
import hankook from "@/assets/marken/hankook.svg";
import bridgestone from "@/assets/marken/bridgestone.svg";
import pirelli from "@/assets/marken/pirelli.svg";
import goodyear from "@/assets/marken/goodyear.svg";
import nokian from "@/assets/marken/nokian.svg";
import michelin from "@/assets/marken/michelin.svg";
import vredestein from "@/assets/marken/vredestein.svg";
import falken from "@/assets/marken/falken.svg";
import yokohama from "@/assets/marken/yokohama.svg";

export const markenLogos: { name: string; src: string }[] = [
  { name: "Continental", src: continental },
  { name: "Michelin", src: michelin },
  { name: "Pirelli", src: pirelli },
  { name: "Bridgestone", src: bridgestone },
  { name: "Goodyear", src: goodyear },
  { name: "Hankook", src: hankook },
  { name: "Nokian Tyres", src: nokian },
  { name: "Barum", src: barum },
  { name: "Vredestein", src: vredestein },
  { name: "Falken", src: falken },
  { name: "Yokohama", src: yokohama },
];

const LogoSet = () => (
  <>
    {markenLogos.map((m, i) => (
      <img
        key={i}
        src={m.src}
        alt={m.name}
        className="h-7 md:h-9 max-w-[120px] md:max-w-[160px] w-auto object-contain shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 [filter:brightness(0)] dark:[filter:none]"
      />
    ))}
  </>
);

const Marquee = () => (
  <div className="relative overflow-hidden py-5 md:py-6">
    {/* Wide fade edges – no hard borders */}
    <div className="absolute left-0 top-0 bottom-0 w-40 md:w-64 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
    <div className="absolute right-0 top-0 bottom-0 w-40 md:w-64 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

    <div className="flex items-center gap-12 md:gap-20 animate-marquee w-max">
      <LogoSet />
      <LogoSet />
    </div>
  </div>
);

export default Marquee;

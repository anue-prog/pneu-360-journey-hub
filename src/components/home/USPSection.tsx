import { usps } from "@/data/siteData";
import SectionHeading from "@/components/shared/SectionHeading";
import { Clock, Zap, Monitor, Mail, Coffee, MapPin } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  clock: Clock,
  zap: Zap,
  monitor: Monitor,
  mail: Mail,
  coffee: Coffee,
  mapPin: MapPin,
};

const bentoSizes: Record<number, string> = {
  0: "md:col-span-1 md:row-span-1",
  1: "md:col-span-1 md:row-span-1",
  2: "md:col-span-1 md:row-span-2",
  3: "md:col-span-2 md:row-span-1",
  4: "md:col-span-1 md:row-span-1",
  5: "md:col-span-1 md:row-span-1",
};

const USPCard = ({ usp, index }: { usp: typeof usps[0]; index: number }) => {
  const Icon = iconMap[usp.icon] || Clock;
  const isTall = index === 2;
  const isWide = index === 3;

  return (
    <div
      className={`group relative bg-card border border-border/50 hover:border-brand-accent hover:scale-[1.02] hover:-translate-y-1 ${bentoSizes[index] || ""} p-6 md:p-8 cursor-default overflow-hidden transition-all duration-300 ease-out ${isTall ? "flex flex-col justify-between" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/15 via-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="w-10 h-10 flex items-center justify-center mb-5 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
          <Icon className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />
        </div>
        <h3 className={`font-bold mb-2 tracking-[-0.01em] group-hover:text-brand-accent transition-colors duration-200 ${isTall || isWide ? "text-lg md:text-xl" : "text-[15px] md:text-[17px]"}`}>
          {usp.titel}
        </h3>
        <p className={`leading-[1.75] text-muted-foreground font-light ${isTall || isWide ? "text-sm md:text-base" : "text-xs md:text-sm"}`}>
          {usp.text}
        </p>
      </div>

      {isTall && (
        <div className="relative z-10 mt-6">
          <div className="w-full h-px bg-gradient-to-r from-brand-accent/30 via-brand-accent/10 to-transparent" />
        </div>
      )}
    </div>
  );
};

const USPSection = () => (
  <section aria-labelledby="usp-h" className="py-16 md:py-24 px-3 md:px-6 bg-background">
    <div className="max-w-[1400px] mx-auto">
      <SectionHeading label="Warum Pneu 360" title="Was uns anders macht" />
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto] gap-4 md:gap-5">
        {usps.map((u, i) => (
          <USPCard key={i} usp={u} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default USPSection;

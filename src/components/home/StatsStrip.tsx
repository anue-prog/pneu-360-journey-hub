import { useCounter } from "@/hooks/useCounter";
import { trustNumbers } from "@/data/siteData";

const StatItem = ({ item }: { item: typeof trustNumbers[0] }) => {
  const { count, ref } = useCounter(item.end);

  return (
    <div ref={ref} className="text-center py-8 md:py-10">
      <span className="block text-[clamp(28px,5vw,44px)] font-extrabold tracking-[-0.03em] text-brand-accent leading-none mb-2">
        {item.display || count}{item.suffix}
      </span>
      <span className="text-[10px] font-medium tracking-[3px] uppercase text-muted-foreground">
        {item.label}
      </span>
    </div>
  );
};

const StatsStrip = () => (
  <section aria-label="Fakten" className="bg-background border-y border-border/30">
    <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border/20">
      {trustNumbers.map((item, i) => (
        <StatItem key={i} item={item} />
      ))}
    </div>
  </section>
);

export default StatsStrip;

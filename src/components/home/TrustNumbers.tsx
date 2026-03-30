import { useCounter } from "@/hooks/useCounter";
import { trustNumbers } from "@/data/siteData";

const TrustCard = ({ item }: { item: typeof trustNumbers[0] }) => {
  const { count, ref } = useCounter(item.end);

  return (
    <div ref={ref} className="bg-secondary/50 p-6 md:p-8 text-center">
      <span className="block text-[clamp(32px,6vw,56px)] font-extrabold tracking-[-0.03em] text-brand-accent leading-none mb-2">
        {item.display || count}
        {item.suffix}
      </span>
      <span className="text-[11px] font-medium tracking-[3px] uppercase text-foreground/60">{item.label}</span>
    </div>
  );
};

const TrustNumbers = () => (
  <section aria-label="Fakten" className="bg-background py-12 md:py-16 px-3 md:px-6">
    <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-border/30">
      {trustNumbers.map((item, i) => (
        <TrustCard key={i} item={item} />
      ))}
    </div>
  </section>
);

export default TrustNumbers;

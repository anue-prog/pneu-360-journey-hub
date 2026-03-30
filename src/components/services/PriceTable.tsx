import { preise } from "@/data/siteData";

const PriceTable = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
    {preise.map((p, i) => (
      <div key={i} className="py-8">
        <h3 className="text-base md:text-lg font-bold mb-8 tracking-[-0.01em]">{p.service}</h3>
        <div className="space-y-4">
          {p.items.map((item, j) => (
            <div key={j} className="flex justify-between items-baseline border-b border-border/15 pb-4">
              <span className="text-base text-muted-foreground font-light">{item.groesse}</span>
              <span className="text-xl font-bold text-foreground">{item.preis}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default PriceTable;

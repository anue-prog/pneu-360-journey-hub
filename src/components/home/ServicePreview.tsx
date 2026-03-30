import { Link } from "react-router-dom";
import { services } from "@/data/siteData";
import SectionHeading from "@/components/shared/SectionHeading";

const ServiceCard = ({ service }: { service: typeof services[0] }) => (
  <div className="group relative bg-card border border-border/50 hover:border-brand-accent hover:scale-[1.02] hover:-translate-y-1 p-6 md:p-8 overflow-hidden transition-all duration-300 ease-out">
    <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/15 via-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] font-bold tracking-[2px] text-brand-accent">{service.nr}</span>
        <span className="text-[9px] font-semibold tracking-[2px] uppercase text-foreground/70 border border-border px-3 py-1">
          {service.tag}
        </span>
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-[-0.02em] group-hover:text-brand-accent transition-colors duration-200">
        {service.titel}
      </h3>
      <p className="text-base md:text-lg leading-[1.75] text-muted-foreground font-light mb-6">{service.text}</p>
      <Link
        to={service.href}
        className="text-[10px] font-bold tracking-[2px] uppercase text-brand-accent hover:text-foreground transition-colors duration-200 inline-flex items-center gap-2"
      >
        Mehr erfahren →
      </Link>
    </div>
  </div>
);

const ServicePreview = () => (
  <section aria-labelledby="srv-h" className="py-16 md:py-24 px-3 md:px-6 bg-background">
    <div className="max-w-[1400px] mx-auto">
      <SectionHeading label="Unsere Services" title="Alles rund ums Rad" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {services.map((s, i) => (
          <ServiceCard key={i} service={s} />
        ))}
      </div>
      <div className="mt-10 text-right">
        <Link
          to="/dienstleistungen"
          className="text-[11px] font-bold tracking-[2px] uppercase text-brand-accent hover:text-foreground transition-colors duration-200"
        >
          Alle Services anzeigen →
        </Link>
      </div>
    </div>
  </section>
);

export default ServicePreview;

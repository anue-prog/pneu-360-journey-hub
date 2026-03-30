import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Building2, Sparkles, Lightbulb, ArrowRight } from "lucide-react";
import { Manufacturer } from "@/data/herstellerData";
import CTAButton from "@/components/shared/CTAButton";

interface Props {
  manufacturer: Manufacturer;
}

const HerstellerStory = ({ manufacturer: m }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header: Logo + Name + Signature */}
      <div className="flex items-center gap-6 md:gap-8 mb-10 md:mb-14">
        <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
          <img
            src={m.logo}
            alt={m.name}
            className="w-full h-full object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl md:text-4xl">{m.flag}</span>
            <h2 className="text-brand-subheading font-bold tracking-[-0.02em] uppercase text-foreground">
              {m.name}
            </h2>
          </div>
          <p className="text-brand-label text-muted-foreground">
            {m.hq} · {m.country} · Seit {m.founded}
          </p>
          <p className="text-sm md:text-base text-brand-accent font-medium mt-1">
            {m.signature}
          </p>
        </div>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        {/* Left: Story + Fun Fact */}
        <div className="space-y-8">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Die Geschichte</p>
            <p className="text-brand-body text-foreground/85 leading-[1.8]">
              {m.story}
            </p>
          </div>

          {/* Fun Fact */}
          <div className="border border-brand-accent/20 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-label text-brand-accent mb-1.5">Fun Fact</p>
                <p className="text-foreground/90 text-[15px] leading-relaxed">{m.funFact}</p>
              </div>
            </div>
          </div>

          {/* Sub-brands */}
          {m.subBrands.length > 0 && (
            <div>
              <p className="text-brand-label text-muted-foreground mb-3">Marken-Familie</p>
              <div className="flex flex-wrap gap-2">
                {m.subBrands.map((brand) => (
                  <span
                    key={brand}
                    className="text-foreground text-[13px] px-4 py-2 border border-border"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Innovations + Stats + CTA */}
        <div className="space-y-8">
          {/* Innovations */}
          <div>
            <p className="text-brand-label text-muted-foreground mb-4">Meilensteine</p>
            <div className="space-y-3">
              {m.innovations.map((innovation, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 border border-border p-4 transition-colors duration-300 hover:border-brand-accent/30"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-1" />
                  <p className="text-sm md:text-[15px] text-foreground/90 leading-relaxed">{innovation}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border p-4">
              <MapPin className="w-3.5 h-3.5 text-brand-accent mb-2" />
              <p className="text-brand-label text-muted-foreground mb-1">Hauptsitz</p>
              <p className="text-foreground font-semibold text-sm">{m.hq}</p>
            </div>
            <div className="border border-border p-4">
              <Calendar className="w-3.5 h-3.5 text-brand-accent mb-2" />
              <p className="text-brand-label text-muted-foreground mb-1">Gegründet</p>
              <p className="text-foreground font-semibold text-sm">{m.founded}</p>
            </div>
            {m.employees && (
              <div className="border border-border p-4">
                <Users className="w-3.5 h-3.5 text-brand-accent mb-2" />
                <p className="text-brand-label text-muted-foreground mb-1">Mitarbeiter</p>
                <p className="text-foreground font-semibold text-sm">{m.employees}</p>
              </div>
            )}
            {m.revenue && (
              <div className="border border-border p-4">
                <Building2 className="w-3.5 h-3.5 text-brand-accent mb-2" />
                <p className="text-brand-label text-muted-foreground mb-1">Umsatz</p>
                <p className="text-foreground font-semibold text-sm">{m.revenue}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <CTAButton to="/anfrage">
            {m.name} Reifen anfragen <ArrowRight className="w-4 h-4 inline ml-1" />
          </CTAButton>
        </div>
      </div>
    </motion.div>
  );
};

export default HerstellerStory;

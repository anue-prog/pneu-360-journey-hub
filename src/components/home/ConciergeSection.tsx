import { conciergeSteps, conciergeLocations } from "@/data/siteData";
import SectionHeading from "@/components/shared/SectionHeading";

const ConciergeSection = () => (
  <section aria-label="Wartezeit-Vorteile" className="bg-secondary py-16 md:py-24 px-3 md:px-6">
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
      <div>
        <SectionHeading label="Deine Zeit zählt" title="Schlüssel abgeben. Einkaufen. Fertig." />
        <p className="text-sm md:text-base leading-[1.85] font-light text-muted-foreground">
          Dein Auto wird bei der Ankunft digital erfasst. Du siehst den Status live auf dem Bildschirm.
          Oder geh einkaufen – wir schicken dir eine E-Mail, sobald alles fertig ist.
        </p>
      </div>

      <div>
        <div className="flex flex-col gap-3">
          {conciergeSteps.map((step, i) => (
            <div
              key={i}
              className="flex gap-5 p-4 md:p-5 bg-background/50 border-l-2 border-brand-accent/25"
            >
              <span className="text-[11px] font-bold tracking-[2px] text-brand-accent flex-shrink-0 min-w-[24px]">
                {step.nr}
              </span>
              <span className="text-sm font-light text-foreground/90 leading-[1.7]">{step.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {conciergeLocations.map((c, i) => (
            <div key={i}>
              <span className="text-[10px] font-bold tracking-[2px] text-brand-accent uppercase block mb-1">
                {c.ort}
              </span>
              <span className="text-xs font-light text-foreground/70 leading-[1.6]">{c.tipp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ConciergeSection;

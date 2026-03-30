import { useState, useEffect } from "react";
import SectionHeading from "@/components/shared/SectionHeading";
import ServiceCards from "@/components/services/ServiceCards";
import PriceTable from "@/components/services/PriceTable";
import CTAButton from "@/components/shared/CTAButton";
import PreisrechnerKonfigurator, { PreisrechnerStartButton } from "@/components/preisrechner/PreisrechnerKonfigurator";

const Dienstleistungen = () => {
  const [preisrechnerOpen, setPreisrechnerOpen] = useState(false);

  useEffect(() => {
    document.title = "Dienstleistungen – Pneu 360 | Radwechsel, Reifenmontage, Einlagerung";
  }, []);

  return (
    <>
      <div className="pt-36 md:pt-48 pb-24 md:pb-36 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading label="Unsere Dienstleistungen" title="Alles rund ums Rad – schnell und ohne Termin" number="01" />
          <ServiceCards />

          <div className="mt-32 md:mt-48">
            <SectionHeading label="Preise" title="Transparent und fair" number="02" />
            <PriceTable />
            <p className="text-xs text-muted-foreground mt-8">Alle Preise inkl. MwSt. Änderungen vorbehalten.</p>
          </div>

          <div className="mt-20 md:mt-28 flex flex-col sm:flex-row items-center gap-4">
            <PreisrechnerStartButton onClick={() => setPreisrechnerOpen(true)} label="Preis berechnen" />
            <CTAButton to="/anfrage" variant="outline">Anfrage starten</CTAButton>
          </div>
        </div>
      </div>
      <PreisrechnerKonfigurator isOpen={preisrechnerOpen} onClose={() => setPreisrechnerOpen(false)} />
    </>
  );
};

export default Dienstleistungen;

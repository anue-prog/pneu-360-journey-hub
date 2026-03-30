import { useEffect } from "react";
import SectionHeading from "@/components/shared/SectionHeading";
import ReifenSortiment from "@/components/reifen/ReifenSortiment";
import FelgenSection from "@/components/reifen/FelgenSection";
import CTAButton from "@/components/shared/CTAButton";

const Reifen = () => {
  useEffect(() => {
    document.title = "Reifen & Felgen – Pneu 360 | Sommer, Winter, Ganzjahr, Alufelgen";
  }, []);

  return (
    <>
      <div className="pt-36 md:pt-48 pb-24 md:pb-36 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading label="Reifen-Sortiment" title="Der richtige Reifen für jede Saison" number="01" />
          <ReifenSortiment />

          <div className="mt-32 md:mt-48">
            <SectionHeading label="Felgen & Kompletträder" title="Vom Klassiker bis zum Hingucker" number="02" />
            <FelgenSection />
          </div>

          <div className="mt-20 md:mt-32 text-center">
            <CTAButton to="/anfrage">Jetzt beraten lassen</CTAButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reifen;

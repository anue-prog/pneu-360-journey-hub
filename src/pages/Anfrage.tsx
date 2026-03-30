import { useEffect, useState } from "react";
import AnfrageKonfigurator from "@/components/anfrage/AnfrageKonfigurator";

const Anfrage = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    document.title = "Anfrage – Pneu 360 | Jetzt unverbindlich anfragen";
  }, []);

  return (
    <>
      <div className="pt-24 md:pt-32 pb-16 md:pb-24 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto min-h-[40vh] flex items-center justify-center">
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-accent text-black text-[11px] font-bold tracking-[2.5px] uppercase px-10 py-5"
            >
              ANFRAGE STARTEN →
            </button>
          )}
        </div>
      </div>
      <AnfrageKonfigurator isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Anfrage;

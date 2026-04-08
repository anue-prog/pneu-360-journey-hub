import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  FAHRZEUG_TYPEN,
  ZOLL_OPTIONEN,
  CYCLE_WORDS_PREIS,
  type FahrzeugTyp,
  getKomplettraederPreis,
  getReifenwechselPreis,
  getAufpreisEigeneReifen,
  getEinlagerungPreis,
  REPARATUR_PREIS,
  ENTSORGUNG_PREIS_PRO_STUECK,
  ENTSORGUNG_ANZAHL,
  WASCHEN_PREIS,
} from "@/data/preisrechnerData";

// ========================================
// CONSTANTS
// ========================================

const EASING = {
  signature: [0.19, 1, 0.22, 1] as [number, number, number, number],
  sharp: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

const DURATION = { instant: 0.15, fast: 0.3, normal: 0.5 };

const CONFIG = {
  accentColor: "#FFD600",
  textColor: "#ebebeb",
  backgroundColor: "#0d0d0d",
  secondaryTextColor: "#8c8c8c",
  borderLineColor: "#2e2e2e",
  borderLineWidth: 1,
};

// ========================================
// START BUTTON (exported)
// ========================================

export const PreisrechnerStartButton = ({ onClick, label }: { onClick: () => void; label?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="bg-brand-accent text-black px-5 py-3.5 sm:px-8 sm:py-4 cursor-pointer flex items-center gap-4 sm:gap-6 font-inherit transition-all duration-500 w-full sm:w-fit hover:bg-brand-accent-hover"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.3, ease: EASING.signature }}
    >
      <span className="flex items-center gap-3 text-[13px] sm:text-[15px] font-bold tracking-[2px] uppercase whitespace-nowrap">
        {label || "Jetzt Kosten berechnen"}
        <motion.span animate={{ x: isHovered ? 2 : 0 }} transition={{ duration: 0.25 }}>→</motion.span>
      </span>
    </motion.button>
  );
};

// ========================================
// TYPES & STATE
// ========================================

type MainService = "komplettraeder" | "reifenwechsel" | "reparatur";
type StorageChoice = "mit_felgen" | "ohne_felgen" | "nein";

interface PrState {
  typ: FahrzeugTyp | "";
  zoll: number | null;
  mainService: MainService | "";
  eigeneReifen: boolean;
  storage: StorageChoice | "";
  waschen: boolean;
  entsorgung: boolean;
}

const INITIAL: PrState = {
  typ: "",
  zoll: null,
  mainService: "",
  eigeneReifen: false,
  storage: "",
  waschen: false,
  entsorgung: false,
};

// Step IDs
type StepId = "TYP" | "ZOLL" | "SERVICE" | "EIGENE_REIFEN" | "EINLAGERUNG" | "WASCHEN" | "ENTSORGUNG" | "RESULT";

function getActiveSteps(state: PrState): StepId[] {
  const steps: StepId[] = ["TYP", "ZOLL", "SERVICE"];
  if (state.mainService === "reifenwechsel") steps.push("EIGENE_REIFEN");
  // Einlagerung nur bei Kompletträder oder Reifenwechsel (nicht bei Reparatur)
  if (state.mainService === "komplettraeder" || state.mainService === "reifenwechsel") {
    steps.push("EINLAGERUNG");
  }
  // Waschen nur bei Kompletträder-Einlagerung (mit Felgen)
  if (state.storage === "mit_felgen") steps.push("WASCHEN");
  // Entsorgung nur bei Reparatur oder wenn keine Einlagerung gewählt
  if (state.mainService === "reparatur" || state.storage === "nein") {
    steps.push("ENTSORGUNG");
  }
  steps.push("RESULT");
  return steps;
}

// ========================================
// MAIN COMPONENT
// ========================================

const PreisrechnerKonfigurator = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [state, setState] = useState<PrState>(INITIAL);
  const [currentStep, setCurrentStep] = useState<StepId>("TYP");
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  const activeSteps = useMemo(() => getActiveSteps(state), [state]);

  const progress = useMemo(() => {
    const idx = activeSteps.indexOf(currentStep);
    if (idx < 0) return 0;
    return ((idx + 1) / activeSteps.length) * 100;
  }, [activeSteps, currentStep]);

  const goNext = useCallback(() => {
    const steps = getActiveSteps(state);
    const idx = steps.indexOf(currentStep);
    if (idx < steps.length - 1) setCurrentStep(steps[idx + 1]);
  }, [state, currentStep]);

  const goBack = useCallback(() => {
    const steps = getActiveSteps(state);
    const idx = steps.indexOf(currentStep);
    if (idx <= 0) {
      reset();
      return;
    }
    setCurrentStep(steps[idx - 1]);
  }, [state, currentStep]);

  const reset = useCallback(() => {
    onClose();
    setTimeout(() => {
      setState(INITIAL);
      setCurrentStep("TYP");
    }, 400);
  }, [onClose]);

  // Pricing
  const lineItems = useMemo(() => {
    if (!state.typ || !state.zoll) return [];
    const items: { label: string; detail?: string; preis: number }[] = [];
    const typ = state.typ as FahrzeugTyp;
    const zoll = state.zoll;

    if (state.mainService === "komplettraeder") {
      items.push({ label: "Kompletträder wechseln", detail: "4 Räder inkl. RDKS-Check", preis: getKomplettraederPreis(typ) });
    } else if (state.mainService === "reifenwechsel") {
      items.push({ label: "Reifenwechsel inkl. Auswuchten", detail: "4 Reifen", preis: getReifenwechselPreis(zoll) });
      if (state.eigeneReifen) {
        const perTire = getAufpreisEigeneReifen(zoll);
        items.push({ label: "Aufpreis eigene neue Reifen", detail: `4 × CHF ${perTire}`, preis: perTire * 4 });
      }
    } else if (state.mainService === "reparatur") {
      items.push({ label: "Reifen reparieren", preis: REPARATUR_PREIS });
    }

    if (state.storage === "mit_felgen") {
      items.push({ label: "Einlagerung Räder (mit Felgen)", detail: "Pro Saison", preis: getEinlagerungPreis(zoll, true) });
    } else if (state.storage === "ohne_felgen") {
      items.push({ label: "Einlagerung Reifen (ohne Felgen)", detail: "Pro Saison", preis: getEinlagerungPreis(zoll, false) });
    }

    if (state.waschen && (state.storage === "mit_felgen" || state.storage === "ohne_felgen")) {
      items.push({ label: "Räder waschen", detail: "Alle 4 Räder", preis: WASCHEN_PREIS });
    }

    if (state.entsorgung) {
      items.push({ label: "Alte Reifen entsorgen", detail: `${ENTSORGUNG_ANZAHL} × CHF ${ENTSORGUNG_PREIS_PRO_STUECK}`, preis: ENTSORGUNG_PREIS_PRO_STUECK * ENTSORGUNG_ANZAHL });
    }

    return items;
  }, [state]);

  const total = useMemo(() => lineItems.reduce((s, i) => s + i.preis, 0), [lineItems]);

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <MotionConfig transition={{ duration: DURATION.normal, ease: EASING.signature }}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASING.sharp }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: CONFIG.backgroundColor,
            display: "flex",
            flexDirection: "column",
            color: CONFIG.textColor,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          <Header onClose={reset} isMobile={isMobile} />
          <ProgressBar progress={progress} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: EASING.signature }}
              style={{
                flex: 1,
                overflowY: "auto",
                overscrollBehavior: "contain",
                padding: isMobile ? "20px" : "60px",
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
                willChange: "transform, opacity",
              }}
            >
              {currentStep === "TYP" && (
                <StepTyp onSelect={(t) => { setState(s => ({ ...s, typ: t })); setCurrentStep("ZOLL"); }} isMobile={isMobile} />
              )}
              {currentStep === "ZOLL" && (
                <StepZoll typ={state.typ as FahrzeugTyp} onSelect={(z) => { setState(s => ({ ...s, zoll: z })); setCurrentStep("SERVICE"); }} isMobile={isMobile} />
              )}
              {currentStep === "SERVICE" && (
                <StepMainService
                  typ={state.typ as FahrzeugTyp}
                  zoll={state.zoll!}
                  onSelect={(svc) => {
                    setState(s => ({ ...s, mainService: svc, eigeneReifen: false, storage: "", waschen: false }));
                    if (svc === "reifenwechsel") setCurrentStep("EIGENE_REIFEN");
                    else if (svc === "komplettraeder") setCurrentStep("EINLAGERUNG");
                    else setCurrentStep("ENTSORGUNG"); // reparatur → skip einlagerung
                  }}
                  isMobile={isMobile}
                />
              )}
              {currentStep === "EIGENE_REIFEN" && (
                <StepEigeneReifen
                  zoll={state.zoll!}
                  onSelect={(ja) => { setState(s => ({ ...s, eigeneReifen: ja })); setCurrentStep("EINLAGERUNG"); }}
                  isMobile={isMobile}
                />
              )}
              {currentStep === "EINLAGERUNG" && (
                <StepEinlagerung
                  zoll={state.zoll!}
                  mainService={state.mainService as MainService}
                  onSelect={(choice) => {
                    setState(s => ({ ...s, storage: choice, waschen: false }));
                    // Mit Felgen -> optional waschen, ohne Felgen -> direkt Ergebnis, nein -> Entsorgung
                    if (choice === "mit_felgen") setCurrentStep("WASCHEN");
                    else if (choice === "ohne_felgen") setCurrentStep("RESULT");
                    else setCurrentStep("ENTSORGUNG");
                  }}
                  isMobile={isMobile}
                />
              )}
              {currentStep === "WASCHEN" && (
                <StepWaschen
                  onSelect={(ja) => { setState(s => ({ ...s, waschen: ja })); setCurrentStep("RESULT"); }}
                  isMobile={isMobile}
                />
              )}
              {currentStep === "ENTSORGUNG" && (
                <StepEntsorgung
                  onSelect={(ja) => { setState(s => ({ ...s, entsorgung: ja })); setCurrentStep("RESULT"); }}
                  isMobile={isMobile}
                />
              )}
              {currentStep === "RESULT" && (
                <StepResult
                  state={state}
                  lineItems={lineItems}
                  total={total}
                  isMobile={isMobile}
                  onClose={reset}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {currentStep !== "RESULT" && currentStep !== "TYP" && (
            <Footer onBack={goBack} isMobile={isMobile} />
          )}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>,
    document.body
  );
};

export default PreisrechnerKonfigurator;

// ========================================
// SHARED UI
// ========================================

const Header = ({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) => (
  <motion.div
    initial={{ y: -20 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.25, ease: EASING.signature }}
    style={{
      padding: isMobile ? "20px" : "32px 60px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: `${CONFIG.borderLineWidth}px solid ${CONFIG.borderLineColor}`,
      flexShrink: 0,
    }}
  >
    <motion.h1
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: DURATION.normal }}
      style={{ margin: 0, color: CONFIG.textColor, fontSize: isMobile ? "20px" : "28px", letterSpacing: "0.1em", fontWeight: 700 }}
    >
      <span style={{ color: CONFIG.accentColor }}>PREIS</span>RECHNER
    </motion.h1>
    <motion.button
      whileHover={{ rotate: 45, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClose}
      style={{ background: "transparent", border: "none", color: CONFIG.textColor, fontSize: "28px", cursor: "pointer", padding: "8px", lineHeight: 1 }}
    >
      ×
    </motion.button>
  </motion.div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", position: "relative", flexShrink: 0 }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      style={{ height: "100%", background: CONFIG.accentColor, position: "absolute", top: 0, left: 0 }}
    />
  </div>
);

const Footer = ({ onBack, isMobile }: { onBack: () => void; isMobile: boolean }) => (
  <motion.div
    initial={{ y: 20 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.25, ease: EASING.signature }}
    style={{
      padding: isMobile ? "16px 20px" : "32px 60px",
      borderTop: `${CONFIG.borderLineWidth}px solid ${CONFIG.borderLineColor}`,
      flexShrink: 0,
    }}
  >
    <motion.button
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onBack}
      style={{
        padding: isMobile ? "10px 18px" : "12px 24px",
        background: "transparent",
        border: "none",
        boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`,
        backfaceVisibility: "hidden" as const,
        color: CONFIG.textColor,
        cursor: "pointer",
        fontSize: isMobile ? "12px" : "14px",
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "inherit",
        fontWeight: 600,
      }}
    >
      ← ZURÜCK
    </motion.button>
  </motion.div>
);

// ========================================
// REUSABLE: Option Card
// ========================================

const OptionCard = ({
  title,
  sub,
  preis,
  onClick,
  isMobile,
  delay = 0,
  highlight = false,
}: {
  title: string;
  sub?: string;
  preis?: string;
  onClick: () => void;
  isMobile: boolean;
  delay?: number;
  highlight?: boolean;
}) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: DURATION.fast, ease: EASING.signature }}
    whileHover={{ y: -4, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{
      padding: isMobile ? "28px 24px" : "36px 40px",
      background: highlight ? "rgba(255, 200, 0, 0.06)" : "transparent",
      border: "none",
      boxShadow: highlight
        ? `inset 0 0 0 2px ${CONFIG.accentColor}`
        : `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`,
      color: CONFIG.textColor,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      textAlign: "left",
      fontFamily: "inherit",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      width: "100%",
    }}
  >
    <motion.div
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: DURATION.fast, ease: EASING.signature }}
      style={{ position: "absolute", inset: 0, background: CONFIG.accentColor, opacity: 0.12, transformOrigin: "left" }}
    />
    <span style={{ position: "relative", zIndex: 1 }}>
      <span style={{ display: "block", fontSize: isMobile ? "18px" : "22px", fontWeight: 700, letterSpacing: "0.04em", marginBottom: sub ? "6px" : 0 }}>
        {title}
      </span>
      {sub && (
        <span style={{ display: "block", fontSize: "13px", color: CONFIG.secondaryTextColor, fontWeight: 400 }}>
          {sub}
        </span>
      )}
    </span>
    {preis && (
      <span style={{ position: "relative", zIndex: 1, fontSize: isMobile ? "20px" : "24px", fontWeight: 700, color: CONFIG.accentColor, whiteSpace: "nowrap", flexShrink: 0 }}>
        {preis}
      </span>
    )}
  </motion.button>
);

// Reusable: Yes/No binary choice
const YesNoStep = ({
  title,
  description,
  yesLabel,
  yesDetail,
  yesPriceLabel,
  noLabel,
  noDetail,
  noPriceLabel,
  onYes,
  onNo,
  isMobile,
}: {
  title: string;
  description: string;
  yesLabel: string;
  yesDetail?: string;
  yesPriceLabel?: string;
  noLabel: string;
  noDetail?: string;
  noPriceLabel?: string;
  onYes: () => void;
  onNo: () => void;
  isMobile: boolean;
}) => (
  <div>
    <h2 style={{ color: CONFIG.textColor, marginBottom: "12px", fontSize: isMobile ? "24px" : "40px", letterSpacing: "0.05em", fontWeight: 700 }}>
      {title}
    </h2>
    <p style={{ color: CONFIG.secondaryTextColor, fontSize: "14px", marginBottom: isMobile ? "28px" : "44px", maxWidth: "600px", lineHeight: 1.6 }}>
      {description}
    </p>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "14px" : "20px", maxWidth: "800px" }}>
      <OptionCard title={yesLabel} sub={yesDetail} preis={yesPriceLabel} onClick={onYes} isMobile={isMobile} delay={0.05} />
      <OptionCard title={noLabel} sub={noDetail} preis={noPriceLabel} onClick={onNo} isMobile={isMobile} delay={0.1} />
    </div>
  </div>
);

// ========================================
// STEP 1 – FAHRZEUGTYP
// ========================================

const StepTyp = ({ onSelect, isMobile }: { onSelect: (t: FahrzeugTyp) => void; isMobile: boolean }) => (
  <div>
    <h2 style={{ color: CONFIG.textColor, marginBottom: "12px", fontSize: isMobile ? "28px" : "44px", letterSpacing: "0.05em", fontWeight: 700 }}>
      WAS FÄHRST DU?
    </h2>
    <p style={{ color: CONFIG.secondaryTextColor, fontSize: "14px", marginBottom: isMobile ? "32px" : "48px" }}>
      Wähle deinen Fahrzeugtyp – die Preise passen sich automatisch an.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? "14px" : "20px" }}>
      {FAHRZEUG_TYPEN.map((ft, i) => (
        <OptionCard
          key={ft.id}
          title={ft.label}
          sub={ft.sub}
          onClick={() => onSelect(ft.id)}
          isMobile={isMobile}
          delay={0.05 + i * 0.06}
        />
      ))}
    </div>
  </div>
);

// ========================================
// STEP 2 – ZOLLGRÖSSE
// ========================================

const StepZoll = ({ typ, onSelect, isMobile }: { typ: FahrzeugTyp; onSelect: (z: number) => void; isMobile: boolean }) => {
  const options = useMemo(() => {
    if (typ === "PW") return ZOLL_OPTIONEN.filter((z) => z <= 20);
    if (typ === "SUV") return ZOLL_OPTIONEN.filter((z) => z >= 17);
    return ZOLL_OPTIONEN;
  }, [typ]);

  return (
    <div>
      <h2 style={{ color: CONFIG.textColor, marginBottom: "12px", fontSize: isMobile ? "28px" : "44px", letterSpacing: "0.05em", fontWeight: 700 }}>
        ZOLLGRÖSSE WÄHLEN
      </h2>
      <p style={{ color: CONFIG.secondaryTextColor, fontSize: "14px", marginBottom: isMobile ? "32px" : "48px" }}>
        Die Zollgrösse findest du auf der Reifenflanke (z.B. 205/55 R<strong style={{ color: CONFIG.textColor }}>16</strong>).
      </p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)", gap: isMobile ? "12px" : "16px" }}>
        {options.map((z, i) => (
          <motion.button
            key={z}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 + i * 0.04, duration: DURATION.fast, ease: EASING.signature }}
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(z)}
            style={{
              padding: isMobile ? "20px 8px" : "28px 16px",
              background: "transparent",
              border: "none",
              boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`,
              backfaceVisibility: "hidden" as const,
              color: CONFIG.textColor,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              fontFamily: "inherit",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: DURATION.fast, ease: EASING.signature }}
              style={{ position: "absolute", inset: 0, background: CONFIG.accentColor, opacity: 0.15, transformOrigin: "left" }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: 700, letterSpacing: "0.02em" }}>{z}"</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ========================================
// STEP 3 – HAUPTSERVICE
// ========================================

const StepMainService = ({
  typ,
  zoll,
  onSelect,
  isMobile,
}: {
  typ: FahrzeugTyp;
  zoll: number;
  onSelect: (svc: MainService) => void;
  isMobile: boolean;
}) => {
  const services: { id: MainService; title: string; sub: string; preis: string }[] = [
    {
      id: "komplettraeder",
      title: "Kompletträder wechseln",
      sub: "Du hast bereits komplette Räder (Reifen + Felgen) und möchtest sie wechseln lassen.",
      preis: `CHF ${getKomplettraederPreis(typ)}`,
    },
    {
      id: "reifenwechsel",
      title: "Reifenwechsel inkl. Auswuchten",
      sub: "Reifen von der Felge runter, neue drauf montieren und auswuchten (4 Reifen).",
      preis: `CHF ${getReifenwechselPreis(zoll)}`,
    },
    {
      id: "reparatur",
      title: "Reifen reparieren",
      sub: "Pannenschaden oder Loch im Reifen? Wir reparieren ihn, wenn möglich.",
      preis: `CHF ${REPARATUR_PREIS}`,
    },
  ];

  return (
    <div>
      <h2 style={{ color: CONFIG.textColor, marginBottom: "12px", fontSize: isMobile ? "24px" : "40px", letterSpacing: "0.05em", fontWeight: 700 }}>
        WAS BRAUCHST DU?
      </h2>
      <p style={{ color: CONFIG.secondaryTextColor, fontSize: "14px", marginBottom: isMobile ? "28px" : "44px", maxWidth: "600px", lineHeight: 1.6 }}>
        Wähle den Service, den du benötigst. Im nächsten Schritt kannst du weitere Optionen hinzufügen.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: isMobile ? "14px" : "18px", maxWidth: "800px" }}>
        {services.map((svc, i) => (
          <OptionCard
            key={svc.id}
            title={svc.title}
            sub={svc.sub}
            preis={svc.preis}
            onClick={() => onSelect(svc.id)}
            isMobile={isMobile}
            delay={0.05 + i * 0.06}
          />
        ))}
      </div>
    </div>
  );
};

// ========================================
// STEP 4 – EIGENE REIFEN (conditional)
// ========================================

const StepEigeneReifen = ({
  zoll,
  onSelect,
  isMobile,
}: {
  zoll: number;
  onSelect: (ja: boolean) => void;
  isMobile: boolean;
}) => {
  const aufpreis = getAufpreisEigeneReifen(zoll);
  return (
    <YesNoStep
      title="WURDEN DEINE REIFEN SCHON EINMAL MONTIERT?"
      description="Fabrikneue Reifen haben eine steifere Wulst und erfordern bei der Erstmontage mehr Aufwand – daher ein geringer Mehrpreis."
      yesLabel="Ja, bereits montierte Reifen"
      yesDetail="Reifen, die schon auf einer Felge waren – der Normalfall."
      noLabel="Nein, fabrikneue Reifen"
      noDetail={`Erstmontage-Aufpreis: CHF ${aufpreis} pro Reifen`}
      noPriceLabel={`+ CHF ${aufpreis * 4}`}
      onYes={() => onSelect(false)}
      onNo={() => onSelect(true)}
      isMobile={isMobile}
    />
  );
};

// ========================================
// STEP 5 – EINLAGERUNG
// ========================================

const StepEinlagerung = ({
  zoll,
  mainService,
  onSelect,
  isMobile,
}: {
  zoll: number;
  mainService: MainService;
  onSelect: (choice: StorageChoice) => void;
  isMobile: boolean;
}) => {
  const isKomplett = mainService === "komplettraeder";
  const preis = getEinlagerungPreis(zoll, isKomplett);
  const storageChoice: StorageChoice = isKomplett ? "mit_felgen" : "ohne_felgen";

  return (
    <div>
      <h2 style={{ color: CONFIG.textColor, marginBottom: "12px", fontSize: isMobile ? "24px" : "40px", letterSpacing: "0.05em", fontWeight: 700 }}>
        {isKomplett ? "RÄDER EINLAGERN?" : "REIFEN EINLAGERN?"}
      </h2>
      <p style={{ color: CONFIG.secondaryTextColor, fontSize: "14px", marginBottom: isMobile ? "28px" : "44px", maxWidth: "600px", lineHeight: 1.6 }}>
        {isKomplett
          ? "Sollen wir deine alten Kompletträder (mit Felgen) bis zur nächsten Saison bei uns einlagern? Der Preis gilt pro Saison."
          : "Sollen wir deine alten Reifen (ohne Felgen) bis zur nächsten Saison bei uns einlagern? Der Preis gilt pro Saison."}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "14px" : "20px", maxWidth: "800px" }}>
        <OptionCard
          title={isKomplett ? "Ja, Räder einlagern" : "Ja, Reifen einlagern"}
          sub={isKomplett ? "Komplette Räder mit Felgen (pro Saison)" : "Nur Reifen ohne Felgen (pro Saison)"}
          preis={`CHF ${preis}`}
          onClick={() => onSelect(storageChoice)}
          isMobile={isMobile}
          delay={0.05}
        />
        <OptionCard title="Nein danke" sub="Ich nehme sie mit" onClick={() => onSelect("nein")} isMobile={isMobile} delay={0.1} />
      </div>
    </div>
  );
};

// ========================================
// STEP 6 – WASCHEN (conditional)
// ========================================

const StepWaschen = ({
  onSelect,
  isMobile,
}: {
  onSelect: (ja: boolean) => void;
  isMobile: boolean;
}) => (
  <YesNoStep
    title="RÄDER WASCHEN?"
    description="Sollen wir deine Räder vor der Einlagerung gründlich waschen? So sind sie nächste Saison direkt einsatzbereit."
    yesLabel="Ja, bitte waschen"
    yesDetail="Alle 4 Räder"
    yesPriceLabel={`+ CHF ${WASCHEN_PREIS}`}
    noLabel="Nein, nicht nötig"
    onYes={() => onSelect(true)}
    onNo={() => onSelect(false)}
    isMobile={isMobile}
  />
);

// ========================================
// STEP 7 – ENTSORGUNG
// ========================================

const StepEntsorgung = ({
  onSelect,
  isMobile,
}: {
  onSelect: (ja: boolean) => void;
  isMobile: boolean;
}) => (
  <YesNoStep
    title="ALTE REIFEN ENTSORGEN?"
    description="Hast du alte Reifen, die fachgerecht entsorgt werden sollen? Wir übernehmen das gerne."
    yesLabel="Ja, bitte entsorgen"
    yesDetail={`${ENTSORGUNG_ANZAHL} Reifen`}
    yesPriceLabel={`CHF ${ENTSORGUNG_PREIS_PRO_STUECK * ENTSORGUNG_ANZAHL}`}
    noLabel="Nein, nicht nötig"
    onYes={() => onSelect(true)}
    onNo={() => onSelect(false)}
    isMobile={isMobile}
  />
);

// ========================================
// STEP 8 – PREISÜBERSICHT
// ========================================

const StepResult = ({
  state,
  lineItems,
  total,
  isMobile,
  onClose,
}: {
  state: PrState;
  lineItems: { label: string; detail?: string; preis: number }[];
  total: number;
  isMobile: boolean;
  onClose: () => void;
}) => {
  const typLabel = FAHRZEUG_TYPEN.find((f) => f.id === state.typ)?.label || state.typ;

  const handleAnfrage = useCallback(() => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-anfrage"));
    }, 500);
  }, [onClose]);

  return (
    <div style={{ maxWidth: "680px" }}>
      <h2 style={{ color: CONFIG.textColor, marginBottom: "12px", fontSize: isMobile ? "26px" : "40px", letterSpacing: "0.05em", fontWeight: 700 }}>
        DEINE PREISÜBERSICHT
      </h2>
      <p style={{ color: CONFIG.secondaryTextColor, fontSize: "14px", marginBottom: isMobile ? "24px" : "36px" }}>
        {typLabel} · {state.zoll}" Zoll
      </p>

      <div style={{ marginBottom: "32px" }}>
        {lineItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: DURATION.fast, ease: EASING.signature }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "16px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <span style={{ fontSize: "15px", fontWeight: 500 }}>{item.label}</span>
              {item.detail && (
                <span style={{ display: "block", fontSize: "12px", color: CONFIG.secondaryTextColor, marginTop: "2px" }}>
                  {item.detail}
                </span>
              )}
            </div>
            <span style={{ fontSize: "17px", fontWeight: 700, whiteSpace: "nowrap" }}>CHF {item.preis}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "20px 0",
          borderTop: `2px solid ${CONFIG.accentColor}`,
        }}
      >
        <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Gesamttotal</span>
        <span style={{ fontSize: isMobile ? "28px" : "36px", fontWeight: 700, color: CONFIG.accentColor }}>CHF {total}</span>
      </motion.div>

      <p style={{ fontSize: "11px", color: CONFIG.secondaryTextColor, marginTop: "12px" }}>
        Alle Preise inkl. MwSt. · Änderungen vorbehalten
      </p>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "16px", marginTop: isMobile ? "32px" : "48px" }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnfrage}
          style={{
            flex: 1,
            padding: "16px 32px",
            background: CONFIG.accentColor,
            border: "none",
            color: CONFIG.backgroundColor,
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            fontFamily: "inherit",
            textAlign: "center",
          }}
        >
          JETZT ANFRAGEN →
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          style={{
            flex: isMobile ? 1 : "0 0 auto",
            padding: "16px 32px",
            background: "transparent",
            border: "none",
            boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`,
            color: CONFIG.textColor,
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            fontFamily: "inherit",
            textAlign: "center",
          }}
        >
          SCHLIESSEN
        </motion.button>
      </div>
    </div>
  );
};

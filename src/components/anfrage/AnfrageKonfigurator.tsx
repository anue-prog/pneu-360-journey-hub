import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import PhotoAssistant, { type PhotoAssistantResult } from "@/components/anfrage/PhotoAssistant";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Camera, PenLine } from "lucide-react";
import {
  ANFRAGE_CATEGORIES,
  BRANCHES,
  QUESTIONS,
  TIRE_WIDTHS,
  TIRE_HEIGHTS,
  TIRE_INCHES,
  TIRE_BRANDS_FAVORITES,
  TIRE_BRANDS_MORE,
  ALL_CAR_BRANDS,
  POPULAR_CAR_BRANDS,
  CAR_MODELS,
  BASE_YEARS,
  RIM_SIZES,
  RIM_COLORS,
  RIM_FINISHES,
  CAR_COLORS,
  CYCLE_WORDS,
  buildGermanPayload,
  fileToBase64,
} from "@/data/anfrageData";

// ========================================
// CONSTANTS
// ========================================

const EASING = {
  signature: [0.19, 1, 0.22, 1] as [number, number, number, number],
  sharp: [0.4, 0, 0.2, 1] as [number, number, number, number],
  expressive: [0.87, 0, 0.13, 1] as [number, number, number, number],
};

const DURATION = {
  instant: 0.15,
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
};

const CONFIG = {
  accentColor: "#FFD600",
  textColor: "#ebebeb",
  backgroundColor: "#0d0d0d",
  secondaryTextColor: "#8c8c8c",
  borderLineColor: "#2e2e2e",
  borderLineWidth: 1,
  accentOpacity: 1,
};

const MAX_BRANDS = 3;

// ========================================
// START BUTTON – full (with cycling words, for Hero)
// ========================================

export const AnfrageStartButton = ({ onClick, label, variant = "primary" }: { onClick: () => void; label?: string; variant?: "primary" | "outline" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPrimary = variant === "primary";

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden px-5 py-3.5 sm:px-8 sm:py-4 cursor-pointer flex items-center gap-4 sm:gap-6 font-inherit transition-all duration-300 w-full sm:w-fit ${
        isPrimary
          ? "bg-brand-accent text-black hover:bg-brand-accent-hover hover:shadow-[0_0_25px_-5px_hsl(var(--brand-accent)/0.4)]"
          : "border border-foreground/40 hover:border-brand-accent/60 hover:shadow-[0_0_25px_-5px_hsl(var(--brand-accent)/0.4)]"
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.3, ease: EASING.signature }}
    >
      {!isPrimary && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASING.signature }}
          className="absolute inset-0 bg-brand-accent-hover origin-left"
        />
      )}
      <span
        className="relative z-10 flex items-center gap-5 transition-colors duration-300 w-full sm:w-auto justify-center sm:justify-start"
        style={{ color: isPrimary ? "#000000" : isHovered ? "#000000" : undefined }}
      >
        <span className="text-[11px] font-medium tracking-[3px] uppercase opacity-50 hidden sm:block">
          {CYCLE_WORDS[0]}
        </span>
        <span className="w-px h-4 bg-current opacity-20 hidden sm:block" />
        <span className="flex items-center gap-3 text-[13px] sm:text-[15px] font-bold tracking-[2px] uppercase whitespace-nowrap">
          {label || "Jetzt anfragen"}
          <motion.span animate={{ x: isHovered ? 2 : 0 }} transition={{ duration: 0.25 }}>→</motion.span>
        </span>
      </span>
    </motion.button>
  );
};

// ========================================
// COMPACT BUTTON – no cycling words (for section CTAs)
// ========================================

export const AnfrageCompactButton = ({ onClick, label = "Jetzt anfragen" }: { onClick: () => void; label?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative overflow-hidden px-6 py-3 cursor-pointer bg-brand-accent text-black hover:bg-brand-accent-hover transition-all duration-500"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.3, ease: EASING.signature }}
    >
      <span className="relative z-10 flex items-center gap-2 text-[13px] font-bold tracking-[2px] uppercase whitespace-nowrap">
        {label}
        <motion.span animate={{ x: isHovered ? 2 : 0 }} transition={{ duration: 0.25 }}>→</motion.span>
      </span>
    </motion.button>
  );
};

// ========================================
// MAIN COMPONENT
// ========================================

interface Selection {
  branch: string;
  category: string;
  answers: Record<string, any>;
  contact: { salutation: string; fname: string; lname: string; email: string; tel: string; comment: string };
}

const AnfrageKonfigurator = ({ isOpen, onClose, initialCategory, filterCategories }: { isOpen: boolean; onClose: () => void; initialCategory?: string; filterCategories?: string[] }) => {
  const [view, setView] = useState(initialCategory ? "BRANCH" : "BRANCH");
  const [history, setHistory] = useState<any[]>([]);
  const [selection, setSelection] = useState<Selection>({
    branch: "",
    category: initialCategory || "",
    answers: {},
    contact: { salutation: "", fname: "", lname: "", email: "", tel: "", comment: "" },
  });
  const [qIndex, setQIndex] = useState(0);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [photoAnsweredIds, setPhotoAnsweredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const styleId = "pneu360-placeholder-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `.pneu360-input::placeholder { color: var(--pneu360-placeholder, #8c8c8c); opacity: 0.6; } .pneu360-input::-webkit-input-placeholder { color: var(--pneu360-placeholder, #8c8c8c); opacity: 0.6; }`;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  const currentQuestions = useMemo(() => (QUESTIONS as any)[selection.category] || [], [selection.category]);

  // Filter out questions already answered by the photo assistant (only photo-provided answers)
  // Also skip rimsize for rims category if we already have dims.inch
  const filteredQuestions = useMemo(() => {
    return currentQuestions.filter((q: any) => {
      // Always show docs if COC is needed (Typengenehmigung "X")
      if (q.id === "docs" && q.conditionalOnTypen) {
        const typenVal = selection.answers?.typen?.typen || "";
        if (/^X$/i.test(typenVal.trim())) return true;
      }
      // Skip if answered by photo assistant
      if (photoAnsweredIds.size > 0 && photoAnsweredIds.has(q.id)) return false;
      // For rims: skip rimsize if we already have inch from dims (photo or manual)
      if (q.id === "rimsize" && selection.category === "rims" && selection.answers?.dims?.inch) return false;
      return true;
    });
  }, [currentQuestions, photoAnsweredIds, selection.answers, selection.category]);

  const currentQ = filteredQuestions[qIndex];
  const progress = filteredQuestions.length ? ((qIndex + 1) / filteredQuestions.length) * 100 : 0;

  const resetFlow = useCallback(() => {
    onClose();
    setTimeout(() => {
      setView("BRANCH");
      setSelection({ branch: "", category: initialCategory || "", answers: {}, contact: { salutation: "", fname: "", lname: "", email: "", tel: "", comment: "" } });
      setQIndex(0);
      setHistory([]);
      setPhotoAnsweredIds(new Set());
    }, 400);
  }, [onClose]);

  const nextView = useCallback((v: string) => {
    setHistory((prev) => [...prev, { view, qIndex }]);
    setView(v);
    setQIndex(0);
  }, [view, qIndex]);

  const goBack = useCallback(() => {
    if (history.length === 0) return resetFlow();
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setView(last.view);
    setQIndex(last.qIndex || 0);
  }, [history, resetFlow]);

  const handleAnswer = useCallback((key: string, val: any) => {
    setSelection((s) => {
      const newAnswers = { ...s.answers, [key]: val };
      // For rims: auto-set rimsize from dims.inch when tire size is entered
      if (key === "dims" && s.category === "rims" && val?.inch) {
        const inchStr = `${val.inch}"`;
        newAnswers.rimsize = [inchStr];
      }
      return { ...s, answers: newAnswers };
    });
  }, []);

  const updateContact = useCallback((field: string, value: string) => {
    setSelection((s) => ({ ...s, contact: { ...s.contact, [field]: value } }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const rawDocs: File[] = (selection.answers as any)?.docs || [];
      const rawImages: File[] = (selection.answers as any)?.images || [];
      const allFiles: File[] = [...rawDocs, ...rawImages];
      const attachments: { name: string; content: string }[] = [];
      for (const file of allFiles) {
        try { attachments.push({ name: file.name, content: await fileToBase64(file) }); } catch {}
      }
      const payload: any = {
        Zeitstempel: new Date().toLocaleString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        ...buildGermanPayload(selection),
      };
      if (attachments.length > 0) payload["attachments"] = attachments;
      await fetch("https://wtaiqcpmoeqrfyehhruk.supabase.co/functions/v1/framer-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) { console.warn("Webhook error:", e); }
    setIsSubmitting(false);
    nextView("SUCCESS");
  }, [selection, nextView]);

  if (!isMounted || !isOpen) return null;

  // Compute footer action based on current view
  const footerAction = (() => {
    if (view === "BRANCH" || view === "CATEGORY") return null; // These views auto-advance on click

    if (view === "QUESTIONS" && currentQ) {
      const answer = (selection.answers as any)[currentQ.id];
      const typenAnswer = selection.answers?.typen;
      const typenUpper = ((typenAnswer as any)?.typen || "").toUpperCase().trim();
      const typenIsOnlyX = /^X$/.test(typenUpper);
      const typenIsIVI = typenUpper.startsWith("IVI");
      const typenIsNormal = typenUpper.length > 0 && !typenIsOnlyX && !typenIsIVI;
      const iviHasStamm = typenIsIVI && ((typenAnswer as any)?.stamm || "").trim().length > 0;
      const docsIsConditional = currentQ.conditionalOnTypen === true;
      const docsIsMandatory = docsIsConditional && typenIsOnlyX;
      const isOptional = docsIsConditional
        ? !docsIsMandatory
        : currentQ.sub?.toLowerCase().includes("optional") || (currentQ.type === "file" && !currentQ.sub?.includes("PFLICHT"));
      const hasValue = (() => {
        if (answer === undefined || answer === null || answer === "") return false;
        if (Array.isArray(answer)) return answer.length > 0;
        if (typeof answer === "object") return Object.values(answer).some(Boolean);
        return true;
      })();
      const canProceed = (() => {
        if (currentQ.type === "tire-size") return answer?.width && answer?.height && answer?.inch;
        if (currentQ.type === "vehicle-input") return answer?.brand && answer?.model;
        if (currentQ.type === "file") { if (docsIsMandatory) return hasValue; return true; }
        if (isOptional) return true;
        if (currentQ.type === "multi-tiles" || currentQ.type === "multi-tiles-with-images") return answer && answer.length > 0;
        if (currentQ.type === "tire-brand") return true;
        if (currentQ.type === "vehicle-color") return true;
        if (currentQ.type === "rim-size") return true;
        if (currentQ.type === "rim-color") return true;
        if (currentQ.type === "typen-genehmigung") {
          if (!answer?.typen) return true;
          const u = (answer.typen || "").toUpperCase().trim();
          if (/^X$/.test(u)) return true;
          if (u.startsWith("IVI")) return (answer.stamm || "").trim().length > 0;
          return true;
        }
        return hasValue;
      })();

      const label = (() => {
        if (docsIsMandatory) return hasValue ? "WEITER →" : "DOKUMENT HOCHLADEN →";
        if (currentQ.type === "typen-genehmigung" && answer?.typen) {
          const u = (answer.typen || "").toUpperCase().trim();
          if (u.startsWith("IVI") && !(answer.stamm || "").trim()) return "STAMMNUMMER EINGEBEN";
        }
        return isOptional && !hasValue ? "ÜBERSPRINGEN" : "WEITER →";
      })();

      return {
        label,
        disabled: !canProceed,
        isSubmitting: false,
        onClick: () => {
          if (qIndex < filteredQuestions.length - 1) setQIndex(qIndex + 1);
          else nextView("CONTACT");
        },
      };
    }

    if (view === "CONTACT") {
      const { contact } = selection;
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
      const canSubmit = contact.fname && contact.lname && isValidEmail && contact.tel && privacyChecked;
      return {
        label: isSubmitting ? "WIRD GESENDET..." : "ANFRAGE SENDEN ✓",
        disabled: !canSubmit,
        isSubmitting,
        onClick: handleSubmit,
      };
    }

    return null;
  })();

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
          {/* HEADER */}
          <Header mainTitle="PNEU 360" onClose={resetFlow} isMobile={isMobile} />

          {/* PROGRESS BAR */}
          {view === "QUESTIONS" && <ProgressBar progress={progress} />}

          {/* CONTENT */}
          <AnimatePresence mode="wait">
            <motion.div
              key={view + qIndex}
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
            {view === "BRANCH" && (
              <BranchSelection
                onSelect={(b: string) => {
                  setSelection((s) => ({ ...s, branch: b }));
                  if (initialCategory) {
                    setSelection((s) => ({ ...s, branch: b, category: initialCategory, answers: {} }));
                    if (["tires", "wheels", "rims"].includes(initialCategory)) {
                      nextView("MODE_SELECT");
                    } else {
                      nextView("QUESTIONS");
                    }
                  } else {
                    nextView("CATEGORY");
                  }
                }}
                isMobile={isMobile}
              />
            )}
            {view === "CATEGORY" && (
              <CategorySelection
                onSelect={(c: string) => {
                  setSelection((s) => ({ ...s, category: c, answers: {} }));
                  // For tires/wheels/rims show mode select, otherwise go to questions
                  if (["tires", "wheels", "rims"].includes(c)) {
                    nextView("MODE_SELECT");
                  } else {
                    nextView("QUESTIONS");
                  }
                }}
                isMobile={isMobile}
                filterCategories={filterCategories}
              />
            )}
            {view === "MODE_SELECT" && (
              <ModeSelection
                onSelectManual={() => nextView("QUESTIONS")}
                onSelectPhoto={() => nextView("PHOTO_FLOW")}
                isMobile={isMobile}
              />
            )}
            {view === "PHOTO_FLOW" && (
              <PhotoAssistant
                category={selection.category}
                isMobile={isMobile}
                onComplete={(result: PhotoAssistantResult) => {
                  // Map photo results into answers
                  const newAnswers: Record<string, any> = { ...selection.answers };
                  const hasDims = result.dims?.width && result.dims?.height && result.dims?.inch;
                  if (hasDims) newAnswers.dims = result.dims;
                  if (result.dims_rear) newAnswers.dims_rear = result.dims_rear;
                  if (result.brand?.length) newAnswers.brand = result.brand;
                  if (result.vehicle?.brand) newAnswers.vehicle = result.vehicle;
                  if (result.carcolor?.label) newAnswers.carcolor = result.carcolor;
                  if (result.typen?.typen) newAnswers.typen = result.typen;
                  // Track which IDs were answered by the photo assistant
                  const answeredIds = new Set<string>();
                  if (hasDims) answeredIds.add("dims");
                  if (result.dims_rear) answeredIds.add("dims_rear");
                  if (result.brand?.length) answeredIds.add("brand");
                  if (result.vehicle?.brand) answeredIds.add("vehicle");
                  if (result.carcolor?.label) answeredIds.add("carcolor");
                  if (result.typen?.typen) answeredIds.add("typen");
                  // Mark docs as answered (Fahrzeugausweis was uploaded in photo flow)
                  answeredIds.add("docs");
                  setPhotoAnsweredIds(answeredIds);
                  setSelection(s => ({ ...s, answers: newAnswers }));
                  nextView("QUESTIONS");
                  setQIndex(0);
                }}
                onCancel={() => goBack()}
              />
            )}
            {view === "QUESTIONS" && currentQ && (
              <QuestionView
                question={currentQ}
                answer={(selection.answers as any)[currentQ.id]}
                onAnswer={(val: any) => handleAnswer(currentQ.id, val)}
                isMobile={isMobile}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                dragActive={dragActive}
                setDragActive={setDragActive}
                allAnswers={selection.answers}
              />
            )}
            {view === "CONTACT" && (
              <>
                <SummaryView selection={selection} isMobile={isMobile} />
                <ContactForm
                  contact={selection.contact}
                  updateContact={updateContact}
                  isMobile={isMobile}
                  focusedInput={focusedInput}
                  setFocusedInput={setFocusedInput}
                  privacyChecked={privacyChecked}
                  setPrivacyChecked={setPrivacyChecked}
                />
              </>
            )}
            {view === "SUCCESS" && <SuccessView onReset={resetFlow} isMobile={isMobile} />}
            </motion.div>
          </AnimatePresence>

          {/* FOOTER */}
          {view !== "SUCCESS" && (
            <Footer
              onBack={goBack}
              showBack={history.length > 0 || view !== "BRANCH"}
              isMobile={isMobile}
              nextAction={footerAction}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>,
    document.body
  );
};

export default AnfrageKonfigurator;

// ========================================
// HEADER
// ========================================

const Header = ({ mainTitle, onClose, isMobile }: any) => (
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
      style={{ margin: 0, color: CONFIG.textColor, fontSize: isMobile ? "24px" : "32px", letterSpacing: "0.1em", fontWeight: 700 }}
    >
      {mainTitle}
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

// ========================================
// PROGRESS BAR
// ========================================

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

// ========================================
// FOOTER
// ========================================

const Footer = ({ onBack, showBack, isMobile, nextAction }: any) => (
  <motion.div
    initial={{ y: 20 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.25, ease: EASING.signature }}
    style={{
      padding: isMobile ? "16px 20px" : "32px 60px",
      borderTop: `${CONFIG.borderLineWidth}px solid ${CONFIG.borderLineColor}`,
      flexShrink: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
    }}
  >
    {showBack ? (
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
    ) : <div />}
    {nextAction && (
      <motion.button
        key="footer-action"
        whileHover={!nextAction.disabled ? { scale: 1.02 } : {}}
        whileTap={!nextAction.disabled ? { scale: 0.98 } : {}}
        onClick={!nextAction.disabled && !nextAction.isSubmitting ? nextAction.onClick : undefined}
        disabled={nextAction.disabled || nextAction.isSubmitting}
        style={{
          opacity: nextAction.disabled ? 0.35 : 1,
          transition: "opacity 0.2s ease",
          padding: isMobile ? "14px 24px" : "16px 40px",
          background: CONFIG.accentColor,
          border: "none",
          color: CONFIG.backgroundColor,
          cursor: nextAction.disabled || nextAction.isSubmitting ? "not-allowed" : "pointer",
          fontSize: isMobile ? "13px" : "15px",
          letterSpacing: "0.05em",
          fontFamily: "inherit",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          whiteSpace: "nowrap",
          
          flex: isMobile ? "1" : "0 0 auto",
          justifyContent: "center",
        } as any}
      >
        {nextAction.isSubmitting && (
          <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: "inline-block" }}>◌</motion.span>
        )}
        {nextAction.label}
      </motion.button>
    )}
  </motion.div>
);

// ========================================
// BRANCH SELECTION
// ========================================

const BranchSelection = ({ onSelect, isMobile }: any) => (
  <div>
    <h2
      style={{ color: CONFIG.textColor, marginBottom: isMobile ? "32px" : "60px", fontSize: isMobile ? "32px" : "48px", letterSpacing: "0.05em", fontWeight: 700 }}
    >
      STANDORT WÄHLEN
    </h2>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "16px" : "24px" }}>
      {BRANCHES.map((branch, i) => (
        <motion.button
          key={branch.name}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 + i * 0.08, duration: DURATION.fast, ease: EASING.signature }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(branch.name)}
          style={{
            padding: isMobile ? "32px" : "48px",
            background: "transparent",
            border: "none",
            boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`,
            backfaceVisibility: "hidden" as const,
            color: CONFIG.textColor,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            fontSize: isMobile ? "24px" : "32px",
            letterSpacing: "0.1em",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: DURATION.fast, ease: EASING.signature }}
            style={{ position: "absolute", inset: 0, background: CONFIG.accentColor, opacity: 0.15, transformOrigin: "left" }}
          />
          <span style={{ position: "relative", zIndex: 1 }}>{branch.name}</span>
        </motion.button>
      ))}
    </div>
  </div>
);

// ========================================
// CATEGORY SELECTION
// ========================================

const CategorySelection = ({ onSelect, isMobile, filterCategories }: any) => {
  const categories = filterCategories
    ? ANFRAGE_CATEGORIES.filter((c: any) => filterCategories.includes(c.id))
    : ANFRAGE_CATEGORIES;

  return (
  <div>
    <h2
      style={{ color: CONFIG.textColor, marginBottom: isMobile ? "32px" : "60px", fontSize: isMobile ? "32px" : "48px", letterSpacing: "0.05em", fontWeight: 700 }}
    >
      KATEGORIE WÄHLEN
    </h2>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: isMobile ? "16px" : "24px" }}>
      {categories.map((cat: any, i: number) => (
        <CategoryCard key={cat.id} category={cat} index={i} onClick={() => onSelect(cat.id)} isMobile={isMobile} />
      ))}
    </div>
  </div>
  );
};

const CategoryCard = ({ category, index, onClick, isMobile }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.06, duration: DURATION.fast, ease: EASING.signature }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ padding: isMobile ? "28px" : "40px", background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden", fontFamily: "inherit" }}
    >
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{ duration: DURATION.normal, ease: EASING.signature }}
        style={{ position: "absolute", inset: 0, background: CONFIG.accentColor, opacity: 0.1, transformOrigin: "bottom" }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: DURATION.fast }}
          style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "12px" : "14px", marginBottom: "12px", letterSpacing: "0.15em", fontWeight: 600 }}
        >
          {category.icon}
        </motion.div>
        <h3 style={{ color: CONFIG.textColor, fontSize: isMobile ? "20px" : "24px", margin: "0 0 8px 0", letterSpacing: "0.05em", fontWeight: 700 }}>
          {category.title}
        </h3>
        <p style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "12px" : "14px", margin: 0, letterSpacing: "0.03em" }}>
          {category.sub}
        </p>
      </div>
      <motion.div
        animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: DURATION.fast }}
        style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", fontSize: "24px", color: CONFIG.accentColor }}
      >
        →
      </motion.div>
    </motion.button>
  );
};

// ========================================
// MODE SELECTION (Manual vs Photo)
// ========================================

const ModeSelection = ({ onSelectManual, onSelectPhoto, isMobile }: { onSelectManual: () => void; onSelectPhoto: () => void; isMobile: boolean }) => (
  <div>
    <h2 style={{ color: CONFIG.textColor, marginBottom: isMobile ? "16px" : "24px", fontSize: isMobile ? "28px" : "42px", letterSpacing: "0.05em", fontWeight: 700 }}>
      WIE MÖCHTEST DU FORTFAHREN?
    </h2>
    <p style={{ color: CONFIG.secondaryTextColor, fontSize: 14, marginBottom: isMobile ? "32px" : "48px", lineHeight: 1.6 }}>
      Du kannst deine Daten bequem per Foto erfassen lassen oder manuell eingeben.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "16px" : "24px" }}>
      {[
        {
          icon: "camera",
          title: "FOTO-ASSISTENT",
          sub: "2–3 Fotos reichen — KI füllt alles aus",
          desc: "Reifen + Fahrzeugausweis fotografieren",
          onClick: onSelectPhoto,
          accent: true,
        },
        {
          icon: "pen",
          title: "MANUELL EINGEBEN",
          sub: "Schritt für Schritt ausfüllen",
          desc: "Alle Angaben selbst eingeben",
          onClick: onSelectManual,
          accent: false,
        },
      ].map((opt, i) => (
        <motion.button
          key={opt.title}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 + i * 0.08, duration: DURATION.fast, ease: EASING.signature }}
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={opt.onClick}
          style={{
            padding: isMobile ? "32px" : "48px",
            background: "transparent",
            border: "none",
            boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${opt.accent ? "rgba(255,200,0,0.3)" : CONFIG.borderLineColor}`,
            cursor: "pointer",
            textAlign: "left",
            position: "relative",
            overflow: "hidden",
            fontFamily: "inherit",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            {opt.icon === "camera" ? <Camera size={32} strokeWidth={1.5} color={CONFIG.secondaryTextColor} /> : <PenLine size={32} strokeWidth={1.5} color={CONFIG.secondaryTextColor} />}
          </div>
          <h3 style={{ color: CONFIG.textColor, fontSize: isMobile ? "20px" : "26px", margin: "0 0 8px 0", letterSpacing: "0.08em", fontWeight: 700 }}>
            {opt.title}
          </h3>
          <p style={{ color: opt.accent ? CONFIG.accentColor : CONFIG.secondaryTextColor, fontSize: 13, margin: "0 0 4px 0", letterSpacing: "0.05em", fontWeight: 600 }}>
            {opt.sub}
          </p>
          <p style={{ color: CONFIG.secondaryTextColor, fontSize: 12, margin: 0 }}>
            {opt.desc}
          </p>
        </motion.button>
      ))}
    </div>
  </div>
);

// ========================================
// QUESTION VIEW
// ========================================

const QuestionView = ({ question, answer, onAnswer, isMobile, focusedInput, setFocusedInput, dragActive, setDragActive, allAnswers }: any) => {
  const typenAnswer = allAnswers?.typen;
  const typenUpper = (typenAnswer?.typen || "").toUpperCase().trim();
  const typenIsOnlyX = /^X$/.test(typenUpper);
  const typenIsIVI = typenUpper.startsWith("IVI");
  const typenIsNormal = typenUpper.length > 0 && !typenIsOnlyX && !typenIsIVI;
  const iviHasStamm = typenIsIVI && (typenAnswer?.stamm || "").trim().length > 0;

  const docsIsConditional = question.conditionalOnTypen === true;
  const docsIsMandatory = docsIsConditional && typenIsOnlyX;

  return (
    <div>
      <div style={{ marginBottom: isMobile ? "32px" : "60px" }}>
        <h2 style={{ color: CONFIG.textColor, fontSize: isMobile ? "28px" : "40px", margin: "0 0 12px 0", letterSpacing: "0.05em", fontWeight: 700 }}>
          {question.q}
        </h2>
        {question.sub && (
          <p style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "14px" : "16px", margin: 0, letterSpacing: "0.03em" }}>
            {question.sub}
          </p>
        )}
      </div>

      {question.type === "tire-size" && <TireSizeInput value={answer} onChange={onAnswer} isMobile={isMobile} />}
      {question.type === "vehicle-input" && <VehicleInput value={answer} onChange={onAnswer} isMobile={isMobile} />}
      {question.type === "tiles" && <TilesInput options={question.options} value={answer} onChange={onAnswer} isMobile={isMobile} />}
      {question.type === "multi-tiles" && <MultiTilesInput options={question.options} value={answer} onChange={onAnswer} isMobile={isMobile} />}
      {question.type === "multi-tiles-with-images" && <MultiTilesWithImages options={question.options} value={answer} onChange={onAnswer} isMobile={isMobile} />}
      {question.type === "tire-brand" && <TireBrandInput value={answer} onChange={onAnswer} isMobile={isMobile} />}
      {question.type === "rim-size" && <RimSizeInput value={answer} onChange={onAnswer} isMobile={isMobile} />}
      {question.type === "rim-color" && <RimColorInput value={answer} onChange={onAnswer} isMobile={isMobile} focusedInput={focusedInput} setFocusedInput={setFocusedInput} />}
      {question.type === "vehicle-color" && <VehicleColorInput value={answer} onChange={onAnswer} isMobile={isMobile} focusedInput={focusedInput} setFocusedInput={setFocusedInput} />}
      {question.type === "textarea" && <TextareaInput value={answer} onChange={onAnswer} placeholder={question.placeholder} isMobile={isMobile} focusedInput={focusedInput} setFocusedInput={setFocusedInput} />}
      {question.type === "typen-genehmigung" && <TypenGenInput value={answer} onChange={onAnswer} isMobile={isMobile} />}
      {question.type === "file" && (
        <>
          {docsIsConditional && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{
              marginBottom: isMobile ? "24px" : "32px",
              padding: isMobile ? "16px 18px" : "20px 24px",
              border: "none",
              boxShadow: `inset 0 0 0 ${docsIsMandatory ? 2 : CONFIG.borderLineWidth}px ${docsIsMandatory ? CONFIG.accentColor : CONFIG.borderLineColor}`,
              backfaceVisibility: "hidden" as const,
              background: docsIsMandatory ? `${CONFIG.accentColor}10` : "transparent",
              display: "grid",
              gap: "8px",
            }}>
              {docsIsMandatory && (
                <>
                  <p style={{ color: CONFIG.accentColor, fontSize: "11px", letterSpacing: "0.12em", margin: 0, fontWeight: 700 }}>UPLOAD PFLICHT — COC-DOKUMENT ERFORDERLICH</p>
                  <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "15px", lineHeight: 1.6, margin: 0, opacity: 0.8 }}>
                    Da dein Fahrzeug ein «X» als Typengenehmigung hat, brauchen wir zwingend dein COC-Dokument zusammen mit dem Fahrzeugausweis.
                  </p>
                </>
              )}
              {(typenIsNormal || iviHasStamm) && (
                <>
                  <p style={{ color: CONFIG.secondaryTextColor, fontSize: "11px", letterSpacing: "0.12em", margin: 0, fontWeight: 700 }}>UPLOAD OPTIONAL</p>
                  <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "15px", lineHeight: 1.6, margin: 0, opacity: 0.8 }}>
                    Wir haben deine Angaben aus dem vorherigen Schritt. Falls du möchtest, kannst du trotzdem Fotos oder Scans des Fahrzeugausweises hochladen — du kannst diesen Schritt aber auch einfach überspringen.
                  </p>
                </>
              )}
              {docsIsConditional && !typenIsOnlyX && !typenIsNormal && !iviHasStamm && (
                <>
                  <p style={{ color: CONFIG.secondaryTextColor, fontSize: "11px", letterSpacing: "0.12em", margin: 0, fontWeight: 700 }}>UPLOAD EMPFOHLEN</p>
                  <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "15px", lineHeight: 1.6, margin: 0, opacity: 0.8 }}>
                    Du hast keine Typengenehmigung eingegeben. Bitte lade wenn möglich Fotos des Fahrzeugausweises hoch.
                  </p>
                </>
              )}
            </motion.div>
          )}
          <FileUpload value={answer} onChange={onAnswer} isMobile={isMobile} dragActive={dragActive} setDragActive={setDragActive} />
        </>
      )}
    </div>
  );
};

// ========================================
// TILES INPUT
// ========================================

const TilesInput = ({ options, value, onChange, isMobile }: any) => (
  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: isMobile ? "12px" : "16px" }}>
    {options.map((opt: string, i: number) => {
      const isSelected = value === opt;
      return (
        <motion.button
          key={opt}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: DURATION.fast, ease: EASING.signature }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(opt)}
          style={{
            padding: isMobile ? "20px" : "24px",
            background: isSelected ? CONFIG.accentColor : "transparent",
            border: "none",
            boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSelected ? CONFIG.accentColor : CONFIG.borderLineColor}`,
            backfaceVisibility: "hidden" as const,
            color: isSelected ? CONFIG.backgroundColor : CONFIG.textColor,
            cursor: "pointer",
            fontSize: isMobile ? "14px" : "16px",
            letterSpacing: "0.05em",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          {opt}
        </motion.button>
      );
    })}
  </div>
);

// ========================================
// MULTI TILES INPUT
// ========================================

const MultiTilesInput = ({ options, value, onChange, isMobile }: any) => {
  const selected: string[] = value || [];
  const toggle = (opt: string) => {
    const newVal = selected.includes(opt) ? selected.filter((v: string) => v !== opt) : [...selected, opt];
    onChange(newVal);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: isMobile ? "12px" : "16px" }}>
      {options.map((opt: string, i: number) => {
        const isSelected = selected.includes(opt);
        return (
          <motion.button
            key={opt}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: DURATION.fast, ease: EASING.signature }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggle(opt)}
            style={{
              padding: isMobile ? "20px" : "24px",
              background: isSelected ? CONFIG.accentColor : "transparent",
              border: "none",
              boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSelected ? CONFIG.accentColor : CONFIG.borderLineColor}`,
              backfaceVisibility: "hidden" as const,
              color: isSelected ? CONFIG.backgroundColor : CONFIG.textColor,
              cursor: "pointer",
              fontSize: isMobile ? "14px" : "16px",
              letterSpacing: "0.05em",
              position: "relative",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ position: "absolute", top: "8px", right: "8px", fontSize: "12px" }}
              >
                ✓
              </motion.span>
            )}
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
};

// ========================================
// MULTI TILES WITH IMAGES
// ========================================

const MultiTilesWithImages = ({ options, value, onChange, isMobile }: any) => {
  const selected = value || [];
  const toggle = (label: string) => {
    const newVal = selected.includes(label) ? selected.filter((v: string) => v !== label) : [...selected, label];
    onChange(newVal);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "16px" : "24px" }}>
      {options.map((opt: any, i: number) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const isSelected = selected.includes(label);
        return (
          <motion.button
            key={label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: DURATION.normal, ease: EASING.signature }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggle(label)}
            style={{
              padding: isMobile ? "24px" : "32px",
              background: isSelected ? CONFIG.accentColor : "transparent",
              border: "none",
              boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSelected ? CONFIG.accentColor : CONFIG.borderLineColor}`,
              backfaceVisibility: "hidden" as const,
              color: isSelected ? CONFIG.backgroundColor : CONFIG.textColor,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              fontSize: isMobile ? "16px" : "18px",
              letterSpacing: "0.05em",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px", borderRadius: "50%", background: CONFIG.accentColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: CONFIG.backgroundColor, fontWeight: "bold" }}
              >
                ✓
              </motion.div>
            )}
            {label}
          </motion.button>
        );
      })}
    </div>
  );
};

// ========================================
// TIRE SIZE INPUT
// ========================================

const TireSizeInput = ({ value, onChange, isMobile }: any) => {
  const val = value || { width: "", height: "", inch: "" };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? "24px" : "32px" }}>
        {[
          { label: "BREITE (MM)", key: "width", options: TIRE_WIDTHS, delay: 0 },
          { label: "HÖHE (%)", key: "height", options: TIRE_HEIGHTS, delay: 0.05 },
          { label: 'ZOLL (")', key: "inch", options: TIRE_INCHES, delay: 0.1 },
        ].map(({ label, key, options, delay }) => (
          <div key={key}>
            <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "14px", display: "block", marginBottom: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
              {label}
            </label>
            <motion.select
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
              value={val[key]}
              onChange={(e: any) => onChange({ ...val, [key]: e.target.value })}
              style={{
                width: "100%",
                padding: isMobile ? "16px 12px" : "20px 16px",
                border: "none",
                boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${val[key] ? CONFIG.accentColor : CONFIG.borderLineColor}`,
                backfaceVisibility: "hidden" as const,
                background: "transparent",
                color: CONFIG.textColor,
                fontSize: isMobile ? "16px" : "18px",
                appearance: "none" as any,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <option value="" style={{ background: CONFIG.backgroundColor }}>WÄHLEN</option>
              {options.map((o: string) => (
                <option key={o} value={o} style={{ background: CONFIG.backgroundColor }}>{o}</option>
              ))}
            </motion.select>
          </div>
        ))}
      </div>
      {val.width && val.height && val.inch && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginTop: isMobile ? "24px" : "40px", padding: isMobile ? "20px" : "28px", border: "none", boxShadow: `inset 0 0 0 2px ${CONFIG.accentColor}`, backfaceVisibility: "hidden" as const, background: `${CONFIG.accentColor}10`, textAlign: "center" }}
        >
          <p style={{ color: CONFIG.secondaryTextColor, fontSize: "12px", letterSpacing: "0.1em", margin: "0 0 8px", fontWeight: 600 }}>DEINE REIFENGRÖSSE</p>
          <p style={{ color: CONFIG.accentColor, fontSize: isMobile ? "28px" : "36px", margin: 0, letterSpacing: "0.08em", fontWeight: 800 }}>
            {val.width}/{val.height} R{val.inch}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// ========================================
// TIRE BRAND INPUT
// ========================================

const TireBrandInput = ({ value, onChange, isMobile }: any) => {
  const [showMore, setShowMore] = useState(false);
  const [textVal, setTextVal] = useState("");
  const [textFocused, setTextFocused] = useState(false);
  const selected: string[] = Array.isArray(value) ? value : value ? [value] : [];
  const isMaxReached = selected.length >= MAX_BRANDS;

  const toggleBrand = (brand: string) => {
    if (selected.includes(brand)) onChange(selected.filter((b) => b !== brand));
    else if (!isMaxReached) onChange([...selected, brand]);
  };

  const handleTextBlur = () => {
    setTextFocused(false);
    const trimmed = textVal.trim();
    if (trimmed && !selected.includes(trimmed.toUpperCase()) && !isMaxReached) {
      onChange([...selected, trimmed.toUpperCase()]);
      setTextVal("");
    }
  };

  return (
    <div style={{ display: "grid", gap: "28px" }}>
      <div>
        <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "14px", display: "block", marginBottom: "12px", letterSpacing: "0.08em", fontWeight: 600 }}>
          WUNSCHMARKE EINGEBEN
        </label>
        <input
          className="pneu360-input"
          type="text"
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
          onFocus={() => setTextFocused(true)}
          onBlur={handleTextBlur}
          placeholder={isMaxReached ? "MAX. 3 MARKEN ERREICHT" : "Z.B. NOKIAN ODER ANDERE MARKE"}
          disabled={isMaxReached}
          style={{
            width: "100%",
            padding: isMobile ? "16px 0" : "20px 0",
            border: "none",
            borderBottom: `${CONFIG.borderLineWidth}px solid ${textFocused ? CONFIG.accentColor : CONFIG.borderLineColor}`,
            outline: "none",
            background: "transparent",
            color: CONFIG.textColor,
            fontSize: isMobile ? "16px" : "18px",
            fontFamily: "inherit",
            transition: `border-color ${DURATION.fast}s ease`,
            "--pneu360-placeholder": CONFIG.secondaryTextColor,
            opacity: isMaxReached ? 0.4 : 1,
          } as any}
        />
      </div>
      {selected.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {selected.map((b) => (
            <motion.div key={b} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", background: CONFIG.accentColor, color: CONFIG.backgroundColor, fontSize: isMobile ? "12px" : "13px", letterSpacing: "0.04em", fontWeight: 600 }}>
              {b}
              <button onClick={() => onChange(selected.filter((x) => x !== b))} style={{ background: "none", border: "none", color: CONFIG.backgroundColor, cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: 0, opacity: 0.7 }}>×</button>
            </motion.div>
          ))}
        </motion.div>
      )}
      <div>
        <label style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "11px" : "12px", display: "block", marginBottom: "12px", letterSpacing: "0.1em", fontWeight: 600 }}>
          {isMaxReached ? "MAX. 3 MARKEN GEWÄHLT — × UM ZU ENTFERNEN" : `SCHNELLAUSWAHL — MAX. ${MAX_BRANDS} MARKEN WÄHLBAR`}
        </label>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: "10px" }}>
          {TIRE_BRANDS_FAVORITES.map((brand, i) => {
            const isSel = selected.includes(brand);
            const isDisabled = isMaxReached && !isSel;
            return (
              <motion.button key={brand} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, duration: DURATION.fast }}
                whileHover={{ scale: isDisabled ? 1 : 1.02, y: isDisabled ? 0 : -2 }}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                onClick={() => toggleBrand(brand)}
                style={{
                  padding: isMobile ? "16px 12px" : "20px 16px",
                  background: isSel ? CONFIG.accentColor : "transparent",
                  opacity: isSel ? 1 : isDisabled ? 0.3 : 1,
                  border: "none",
                  boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSel ? CONFIG.accentColor : CONFIG.borderLineColor}`,
                  backfaceVisibility: "hidden" as const,
                  color: isSel ? CONFIG.backgroundColor : CONFIG.textColor,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  fontSize: isMobile ? "12px" : "13px",
                  letterSpacing: "0.04em",
                  textAlign: "center",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  position: "relative",
                }}>
                {isSel && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ position: "absolute", top: "5px", right: "7px", fontSize: "10px" }}>✓</motion.span>}
                {brand}
              </motion.button>
            );
          })}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMore(!showMore)}
          style={{ marginTop: "14px", padding: "12px 24px", background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: CONFIG.secondaryTextColor, cursor: "pointer", fontSize: isMobile ? "12px" : "13px", letterSpacing: "0.05em", fontFamily: "inherit" }}
        >
          {showMore ? "WENIGER ANZEIGEN" : "WEITERE MARKEN"}
        </motion.button>
        <AnimatePresence>
          {showMore && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: DURATION.normal, ease: EASING.signature }} style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: "10px", marginTop: "14px" }}>
                {TIRE_BRANDS_MORE.map((brand, i) => {
                  const isSel = selected.includes(brand);
                  const isDisabled = isMaxReached && !isSel;
                  return (
                    <motion.button key={brand} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03, duration: DURATION.fast }}
                      whileHover={{ scale: isDisabled ? 1 : 1.02, y: isDisabled ? 0 : -2 }}
                      onClick={() => toggleBrand(brand)}
                      style={{
                        padding: isMobile ? "12px 8px" : "14px 12px",
                        background: isSel ? CONFIG.accentColor : "transparent",
                        opacity: isSel ? 1 : isDisabled ? 0.3 : 1,
                        border: "none",
                        boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSel ? CONFIG.accentColor : CONFIG.borderLineColor}`,
                        backfaceVisibility: "hidden" as const,
                        color: isSel ? CONFIG.backgroundColor : CONFIG.textColor,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        fontSize: isMobile ? "11px" : "12px",
                        letterSpacing: "0.04em",
                        textAlign: "center",
                        fontFamily: "inherit",
                        fontWeight: 600,
                        position: "relative",
                      }}>
                      {isSel && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: "absolute", top: "5px", right: "7px", fontSize: "10px" }}>✓</motion.span>}
                      {brand}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ========================================
// VEHICLE INPUT
// ========================================

const VehicleInput = ({ value, onChange, isMobile }: any) => {
  const val = value || { brand: "", model: "", year: "" };
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [customModel, setCustomModel] = useState("");
  const [showCustomModel, setShowCustomModel] = useState(false);
  const [manualBrand, setManualBrand] = useState("");
  const [showManualBrand, setShowManualBrand] = useState(false);

  const models = val.brand ? CAR_MODELS[val.brand] || [] : [];
  const hasModels = models.length > 0;
  const brands = showAllBrands ? ALL_CAR_BRANDS : POPULAR_CAR_BRANDS;

  const selectBrand = (brand: string) => { onChange({ brand, model: "", year: "" }); setShowCustomModel(false); setCustomModel(""); setShowManualBrand(false); };
  const selectModel = (model: string) => { if (model === "ANDERES") { setShowCustomModel(true); onChange({ ...val, model: "", year: "" }); } else { setShowCustomModel(false); onChange({ ...val, model, year: "" }); } };
  const selectYear = (year: string) => onChange({ ...val, year });

  const StepBadge = ({ num, done }: any) => (
    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: done ? CONFIG.accentColor : "transparent", border: `${CONFIG.borderLineWidth}px solid ${done ? CONFIG.accentColor : CONFIG.borderLineColor}`, display: "flex", alignItems: "center", justifyContent: "center", color: done ? CONFIG.backgroundColor : CONFIG.secondaryTextColor, fontSize: "12px", fontWeight: 600 }}>
      {done ? "✓" : num}
    </div>
  );

  return (
    <div style={{ display: "grid", gap: "40px" }}>
      {/* MARKE */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <StepBadge num="1" done={!!val.brand} />
          <label style={{ color: val.brand ? CONFIG.textColor : CONFIG.textColor, fontSize: isMobile ? "13px" : "15px", letterSpacing: "0.08em", fontWeight: 600 }}>
            MARKE{val.brand ? `: ${val.brand}` : ""}
          </label>
          {val.brand && (
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => onChange({ brand: "", model: "", year: "" })}
              style={{ background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: CONFIG.secondaryTextColor, cursor: "pointer", padding: "4px 10px", fontSize: "11px", letterSpacing: "0.05em", fontFamily: "inherit" }}>
              ÄNDERN
            </motion.button>
          )}
        </div>
        {!val.brand && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: isMobile ? "8px" : "10px", marginBottom: "16px" }}>
              {brands.map((brand, i) => {
                const displayName = brand === "MERCEDES-BENZ" ? "MERCEDES" : brand;
                return (
                  <motion.button
                    key={brand}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: DURATION.fast }}
                    whileHover={{ borderColor: CONFIG.accentColor }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => selectBrand(brand)}
                    style={{ padding: isMobile ? "14px 8px" : "18px 12px", background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, cursor: "pointer", fontSize: isMobile ? "10px" : "11px", letterSpacing: "0.04em", color: CONFIG.textColor, textAlign: "center", fontFamily: "inherit", fontWeight: 600 }}
                  >
                    {displayName}
                  </motion.button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowAllBrands(!showAllBrands)}
                style={{ padding: "10px 20px", background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: CONFIG.secondaryTextColor, cursor: "pointer", fontSize: isMobile ? "11px" : "12px", letterSpacing: "0.05em", fontFamily: "inherit" }}>
                {showAllBrands ? "WENIGER" : "ALLE MARKEN"}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowManualBrand(!showManualBrand)}
                style={{ padding: "10px 20px", background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: CONFIG.secondaryTextColor, cursor: "pointer", fontSize: isMobile ? "11px" : "12px", letterSpacing: "0.05em", fontFamily: "inherit" }}>
                MARKE EINGEBEN
              </motion.button>
            </div>
            {showManualBrand && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <input className="pneu360-input" type="text" value={manualBrand} onChange={(e) => setManualBrand(e.target.value)} placeholder="Z.B. ALFA ROMEO, LEXUS..."
                    autoFocus
                    style={{ width: "100%", padding: isMobile ? "14px 0" : "16px 0", border: "none", borderBottom: `2px solid ${CONFIG.accentColor}`, outline: "none", background: "transparent", color: CONFIG.textColor, fontSize: isMobile ? "17px" : "20px", fontFamily: "inherit", "--pneu360-placeholder": CONFIG.secondaryTextColor } as any} />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { if (manualBrand.trim()) selectBrand(manualBrand.trim().toUpperCase()); }}
                  style={{ padding: isMobile ? "12px 18px" : "14px 24px", background: CONFIG.accentColor, border: "none", color: CONFIG.backgroundColor, cursor: "pointer", fontSize: isMobile ? "13px" : "14px", letterSpacing: "0.05em", flexShrink: 0, fontFamily: "inherit", fontWeight: 700 }}>
                  OK →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* MODELL */}
      {val.brand && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.normal }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <StepBadge num="2" done={!!val.model} />
            <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "13px" : "15px", letterSpacing: "0.08em", fontWeight: 600 }}>
              MODELL{val.model ? `: ${val.model}` : ""}
            </label>
            {val.model && (
              <motion.button whileHover={{ scale: 1.02 }} onClick={() => onChange({ ...val, model: "", year: "" })}
                style={{ background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: CONFIG.secondaryTextColor, cursor: "pointer", padding: "4px 10px", fontSize: "11px", letterSpacing: "0.05em", fontFamily: "inherit" }}>
                ÄNDERN
              </motion.button>
            )}
          </div>
          {!val.model && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {hasModels ? (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "10px" }}>
                  {models.map((model: string, i: number) => (
                    <motion.button key={model} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02, duration: DURATION.fast }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectModel(model)}
                      style={{
                        padding: isMobile ? "14px 10px" : "18px 14px",
                        background: "transparent",
                        border: "none",
                        boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${model === "ANDERES" ? CONFIG.secondaryTextColor + "60" : CONFIG.borderLineColor}`,
                        backfaceVisibility: "hidden" as const,
                        color: model === "ANDERES" ? CONFIG.secondaryTextColor : CONFIG.textColor,
                        cursor: "pointer",
                        fontSize: isMobile ? "11px" : "13px",
                        letterSpacing: "0.03em",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}>
                      {model}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div>
                  <input className="pneu360-input" type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)} placeholder="MODELL EINGEBEN..."
                    style={{ width: "100%", padding: "20px 0", border: "none", borderBottom: `${CONFIG.borderLineWidth}px solid ${CONFIG.borderLineColor}`, outline: "none", background: "transparent", color: CONFIG.textColor, fontSize: "18px", fontFamily: "inherit", "--pneu360-placeholder": CONFIG.secondaryTextColor } as any}
                    onKeyDown={(e) => { if (e.key === "Enter" && customModel.trim()) onChange({ ...val, model: customModel.trim().toUpperCase(), year: "" }); }} />
                  {customModel.trim() && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} onClick={() => onChange({ ...val, model: customModel.trim().toUpperCase(), year: "" })}
                      style={{ marginTop: "12px", padding: "14px 32px", background: CONFIG.accentColor, border: "none", color: CONFIG.backgroundColor, cursor: "pointer", fontSize: "14px", letterSpacing: "0.05em", fontFamily: "inherit", fontWeight: 700 }}>
                      MODELL BESTÄTIGEN →
                    </motion.button>
                  )}
                </div>
              )}
              {showCustomModel && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "16px" }}>
                  <input className="pneu360-input" type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)} placeholder="MODELL EINGEBEN..."
                    style={{ width: "100%", padding: "20px 0", border: "none", borderBottom: `${CONFIG.borderLineWidth}px solid ${CONFIG.accentColor}`, outline: "none", background: "transparent", color: CONFIG.textColor, fontSize: "18px", fontFamily: "inherit", "--pneu360-placeholder": CONFIG.secondaryTextColor } as any} />
                  {customModel.trim() && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} onClick={() => onChange({ ...val, model: customModel.trim().toUpperCase(), year: "" })}
                      style={{ marginTop: "12px", padding: "14px 32px", background: CONFIG.accentColor, border: "none", color: CONFIG.backgroundColor, cursor: "pointer", fontSize: "14px", letterSpacing: "0.05em", fontFamily: "inherit", fontWeight: 700 }}>
                      BESTÄTIGEN →
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* JAHRGANG */}
      {val.brand && val.model && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.normal }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <StepBadge num="3" done={!!val.year} />
            <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "13px" : "15px", letterSpacing: "0.08em", fontWeight: 600 }}>
              JAHRGANG{val.year ? `: ${val.year}` : " (OPTIONAL)"}
            </label>
          </div>
          <YearPicker value={val.year} onSelect={selectYear} isMobile={isMobile} />
        </motion.div>
      )}
    </div>
  );
};

// ========================================
// YEAR PICKER
// ========================================

const YearPicker = ({ value, onSelect, isMobile }: any) => {
  const [showOlder, setShowOlder] = useState(false);
  const recentYears = BASE_YEARS.slice(0, 15);
  const olderYears = BASE_YEARS.slice(15);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(4, 1fr)" : "repeat(6, 1fr)", gap: "8px" }}>
        {recentYears.map((year, i) => {
          const isSel = value === year;
          return (
            <motion.button key={year} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02, duration: DURATION.fast }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(year)}
              style={{
                padding: isMobile ? "12px 8px" : "14px 12px",
                background: isSel ? CONFIG.accentColor : "transparent",
                border: "none",
                boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSel ? CONFIG.accentColor : CONFIG.borderLineColor}`,
                backfaceVisibility: "hidden" as const,
                color: isSel ? CONFIG.backgroundColor : CONFIG.textColor,
                cursor: "pointer",
                fontSize: isMobile ? "13px" : "14px",
                letterSpacing: "0.03em",
                fontFamily: "inherit",
                fontWeight: 600,
              }}>
              {year}
            </motion.button>
          );
        })}
      </div>
      <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowOlder(!showOlder)}
        style={{ marginTop: "12px", padding: "10px 20px", background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: CONFIG.secondaryTextColor, cursor: "pointer", fontSize: isMobile ? "11px" : "12px", letterSpacing: "0.05em", fontFamily: "inherit" }}>
        {showOlder ? "WENIGER" : "ÄLTERE JAHRGÄNGE"}
      </motion.button>
      <AnimatePresence>
        {showOlder && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(4, 1fr)" : "repeat(6, 1fr)", gap: "8px", marginTop: "12px" }}>
              {olderYears.map((year, i) => {
                const isSel = value === year;
                return (
                  <motion.button key={year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelect(year)}
                    style={{
                      padding: isMobile ? "12px 8px" : "14px 12px",
                      background: isSel ? CONFIG.accentColor : "transparent",
                      border: "none",
                      boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSel ? CONFIG.accentColor : CONFIG.borderLineColor}`,
                      backfaceVisibility: "hidden" as const,
                      color: isSel ? CONFIG.backgroundColor : CONFIG.textColor,
                      cursor: "pointer",
                      fontSize: isMobile ? "13px" : "14px",
                      fontFamily: "inherit",
                      fontWeight: 600,
                    }}>
                    {year}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ========================================
// RIM SIZE INPUT
// ========================================

const RimSizeInput = ({ value, onChange, isMobile }: any) => {
  const selected: string[] = Array.isArray(value) ? value : value ? [value] : [];
  const toggle = (size: string) => {
    if (selected.includes(size)) onChange(selected.filter((s) => s !== size));
    else if (selected.length < 2) onChange([...selected, size]);
    else onChange([selected[1], size]);
  };

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      {selected.length > 0 && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {selected.map((s) => (
            <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: CONFIG.accentColor, color: CONFIG.backgroundColor, fontSize: isMobile ? "14px" : "16px", letterSpacing: "0.05em", fontWeight: 600 }}>
              {s}
              <button onClick={() => onChange(selected.filter((x) => x !== s))} style={{ background: "none", border: "none", color: CONFIG.backgroundColor, cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: 0, opacity: 0.7 }}>×</button>
            </motion.div>
          ))}
        </div>
      )}
      <div>
        <label style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "11px" : "12px", display: "block", marginBottom: "12px", letterSpacing: "0.1em", fontWeight: 600 }}>
          {selected.length >= 2 ? "MAX. 2 GRÖSSEN GEWÄHLT" : `ZOLLGRÖSSE WÄHLEN${selected.length === 1 ? " — NOCH 1 WEITERE MÖGLICH" : ""}`}
        </label>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(4,1fr)" : "repeat(5,1fr)", gap: "10px" }}>
          {RIM_SIZES.map((size, i) => {
            const isSel = selected.includes(size);
            const isDisabled = selected.length >= 2 && !isSel;
            return (
              <motion.button key={size} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, duration: DURATION.fast }}
                whileHover={{ scale: isDisabled ? 1 : 1.02, y: isDisabled ? 0 : -2 }}
                onClick={() => toggle(size)}
                style={{
                  padding: isMobile ? "18px 8px" : "22px 12px",
                  background: isSel ? CONFIG.accentColor : "transparent",
                  opacity: isSel ? 1 : isDisabled ? 0.35 : 1,
                  border: "none",
                  boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSel ? CONFIG.accentColor : CONFIG.borderLineColor}`,
                  backfaceVisibility: "hidden" as const,
                  color: isSel ? CONFIG.backgroundColor : CONFIG.textColor,
                  cursor: isDisabled ? "default" : "pointer",
                  fontSize: isMobile ? "15px" : "17px",
                  letterSpacing: "0.03em",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  position: "relative",
                }}>
                {isSel && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ position: "absolute", top: "5px", right: "7px", fontSize: "10px" }}>✓</motion.span>}
                {size}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ========================================
// RIM COLOR INPUT
// ========================================

const RimColorInput = ({ value, onChange, isMobile, focusedInput, setFocusedInput }: any) => {
  const color: string = value?.color || "";
  const finish: string = value?.finish || "";
  const custom: string = value?.custom || "";
  const isOther = color === "ANDERE";
  const update = (patch: object) => onChange({ color, finish, custom, ...patch });

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div>
        <label style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "11px" : "12px", display: "block", marginBottom: "14px", letterSpacing: "0.1em", fontWeight: 600 }}>
          FELGENFARBE WÄHLEN
        </label>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(5,1fr)", gap: "10px" }}>
          {RIM_COLORS.map((rc, i) => {
            const isSel = color === rc.label;
            const canShowFinish = !["BICOLOR", "POLIERT", "ANDERE"].includes(rc.label);
            return (
              <motion.button key={rc.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03, duration: DURATION.fast }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => update({ color: rc.label, finish: canShowFinish ? finish || "GLANZ" : "", custom: "" })}
                style={{
                  padding: 0,
                  border: "none",
                  boxShadow: `inset 0 0 0 ${isSel ? 2 : CONFIG.borderLineWidth}px ${isSel ? CONFIG.accentColor : CONFIG.borderLineColor}`,
                  backfaceVisibility: "hidden" as const,
                  cursor: "pointer",
                  background: "transparent",
                  position: "relative",
                  overflow: "hidden",
                }}>
                <div style={{ height: isMobile ? "40px" : "48px", background: rc.finish === "bicolor" ? "linear-gradient(135deg, #181818 50%, #C0C0C0 50%)" : rc.hex || "linear-gradient(135deg, #ff0000, #0000ff)" }} />
                <div style={{
                  padding: isMobile ? "6px 3px" : "7px 5px",
                  background: isSel ? CONFIG.accentColor : CONFIG.backgroundColor,
                  color: isSel ? CONFIG.backgroundColor : CONFIG.textColor,
                  fontSize: isMobile ? "9px" : "10px",
                  letterSpacing: "0.03em",
                  textAlign: "center",
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}>
                  {rc.label}
                </div>
                {isSel && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    style={{ position: "absolute", top: "5px", right: "5px", width: "16px", height: "16px", borderRadius: "50%", background: CONFIG.accentColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: CONFIG.backgroundColor, fontWeight: "bold" }}>
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      {color && !["BICOLOR", "POLIERT", "ANDERE", ""].includes(color) && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ overflow: "hidden" }}>
          <label style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "11px" : "12px", display: "block", marginBottom: "12px", letterSpacing: "0.1em", fontWeight: 600 }}>OBERFLÄCHE</label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {RIM_FINISHES.map((f) => {
              const isSel = finish === f;
              return (
                <motion.button key={f} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => update({ finish: f })}
                  style={{ padding: isMobile ? "12px 20px" : "14px 28px", background: isSel ? CONFIG.accentColor : "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${isSel ? CONFIG.accentColor : CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: isSel ? CONFIG.backgroundColor : CONFIG.textColor, cursor: "pointer", fontSize: isMobile ? "12px" : "13px", letterSpacing: "0.05em", fontFamily: "inherit", fontWeight: 600 }}>
                  {f}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
      {isOther && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ overflow: "hidden" }}>
          <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "13px", display: "block", marginBottom: "10px", letterSpacing: "0.08em", fontWeight: 600 }}>FARBE BESCHREIBEN</label>
          <input className="pneu360-input" type="text" value={custom} onChange={(e) => update({ custom: e.target.value })}
            onFocus={() => setFocusedInput?.("rimcolor")}
            onBlur={() => setFocusedInput?.(null)}
            placeholder="Z.B. DUNKELBLAU MATT, ORANGE GLANZ..."
            style={{ width: "100%", padding: isMobile ? "14px 0" : "18px 0", border: "none", borderBottom: `${CONFIG.borderLineWidth}px solid ${focusedInput === "rimcolor" ? CONFIG.accentColor : CONFIG.borderLineColor}`, outline: "none", background: "transparent", color: CONFIG.textColor, fontSize: isMobile ? "16px" : "17px", fontFamily: "inherit", transition: "border-color 0.2s ease", "--pneu360-placeholder": CONFIG.secondaryTextColor } as any} />
        </motion.div>
      )}
    </div>
  );
};

// ========================================
// VEHICLE COLOR INPUT
// ========================================

const VehicleColorInput = ({ value, onChange, isMobile, focusedInput, setFocusedInput }: any) => {
  const [customColor, setCustomColor] = useState(value?.custom || "");
  const selectedLabel = value?.label || "";
  const isOther = selectedLabel === "ANDERE FARBE";

  const selectColor = (color: typeof CAR_COLORS[0]) => {
    if (color.label === "ANDERE FARBE") onChange({ label: "ANDERE FARBE", hex: null, custom: customColor });
    else { onChange({ label: color.label, hex: color.hex, custom: "" }); setCustomColor(""); }
  };

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {value?.label && !isOther && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: "flex", alignItems: "center", gap: "16px", padding: isMobile ? "16px" : "20px", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.accentColor}`, backfaceVisibility: "hidden" as const, background: `${CONFIG.accentColor}10` }}>
          <div style={{ width: isMobile ? "40px" : "52px", height: isMobile ? "40px" : "52px", borderRadius: "4px", background: value.hex, border: "2px solid rgba(0,0,0,0.12)", flexShrink: 0 }} />
          <div>
            <p style={{ color: CONFIG.secondaryTextColor, fontSize: "11px", letterSpacing: "0.1em", margin: "0 0 4px", fontWeight: 600 }}>GEWÄHLTE FAHRZEUGFARBE</p>
            <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "16px" : "18px", margin: 0, letterSpacing: "0.06em", fontWeight: 700 }}>{value.label}</p>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => onChange(null)}
            style={{ marginLeft: "auto", background: "transparent", border: "none", color: CONFIG.secondaryTextColor, cursor: "pointer", fontSize: "22px" }}>×</motion.button>
        </motion.div>
      )}
      <div>
        <label style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "11px" : "12px", display: "block", marginBottom: "14px", letterSpacing: "0.1em", fontWeight: 600 }}>
          FARBE WÄHLEN
        </label>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: "10px" }}>
          {CAR_COLORS.map((color, i) => {
            const isSelected = selectedLabel === color.label;
            return (
              <motion.button key={color.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03, duration: DURATION.fast }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectColor(color)}
                style={{ padding: 0, border: "none", boxShadow: `inset 0 0 0 ${isSelected ? 2 : CONFIG.borderLineWidth}px ${isSelected ? CONFIG.accentColor : CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, cursor: "pointer", background: "transparent", position: "relative", overflow: "hidden" }}>
                {color.hex ? (
                  <div style={{ height: isMobile ? "44px" : "52px", background: color.hex, borderBottom: `${CONFIG.borderLineWidth}px solid rgba(0,0,0,0.08)` }} />
                ) : (
                  <div style={{ height: isMobile ? "44px" : "52px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ff0000 0%, #ff9900 20%, #ffff00 40%, #00ff00 60%, #0000ff 80%, #9900ff 100%)", fontSize: "20px" }}>?</div>
                )}
                <div style={{
                  padding: isMobile ? "6px 3px" : "7px 5px",
                  background: isSelected ? CONFIG.accentColor : CONFIG.backgroundColor,
                  color: isSelected ? CONFIG.backgroundColor : CONFIG.textColor,
                  fontSize: isMobile ? "8px" : "9px",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}>
                  {color.label}
                </div>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    style={{ position: "absolute", top: "5px", right: "5px", width: "16px", height: "16px", borderRadius: "50%", background: CONFIG.accentColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: CONFIG.backgroundColor, fontWeight: "bold" }}>✓</motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      {isOther && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "13px", display: "block", marginBottom: "10px", letterSpacing: "0.08em", fontWeight: 600 }}>FARBE BESCHREIBEN</label>
          <input className="pneu360-input" type="text" value={customColor}
            onChange={(e) => { setCustomColor(e.target.value); onChange({ label: "ANDERE FARBE", hex: null, custom: e.target.value }); }}
            onFocus={() => setFocusedInput?.("carcolor")}
            onBlur={() => setFocusedInput?.(null)}
            placeholder="Z.B. METALLIC GRÜN, PERLWEISS..."
            style={{ width: "100%", padding: isMobile ? "14px 0" : "18px 0", border: "none", borderBottom: `${CONFIG.borderLineWidth}px solid ${focusedInput === "carcolor" ? CONFIG.accentColor : CONFIG.borderLineColor}`, outline: "none", background: "transparent", color: CONFIG.textColor, fontSize: isMobile ? "16px" : "17px", fontFamily: "inherit", transition: "border-color 0.2s ease", "--pneu360-placeholder": CONFIG.secondaryTextColor } as any} />
        </motion.div>
      )}
    </div>
  );
};

// ========================================
// TYPEN-GENEHMIGUNG INPUT
// ========================================

const TypenGenInput = ({ value, onChange, isMobile }: any) => {
  const typen: string = value?.typen || "";
  const stamm: string = value?.stamm || "";
  const upper = typen.toUpperCase().trim();
  const isOnlyX = /^X$/.test(upper);
  const isIVI = upper.startsWith("IVI");
  const isNormal = upper.length > 0 && !isOnlyX && !isIVI;
  const update = (field: "typen" | "stamm", v: string) => onChange({ ...(value || {}), typen: field === "typen" ? v : typen, stamm: field === "stamm" ? v : stamm });

  return (
    <div style={{ display: "grid", gap: isMobile ? "24px" : "32px" }}>
      <div style={{ display: "grid", gap: "12px" }}>
        <p style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "11px" : "12px", letterSpacing: "0.12em", margin: 0, fontWeight: 600 }}>
          SCHRITT 1 — FAHRZEUGAUSWEIS ZUR HAND NEHMEN
        </p>
        <div style={{ padding: isMobile ? "16px" : "20px 24px", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, display: "grid", gap: "10px" }}>
          <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "15px", lineHeight: 1.65, margin: 0 }}>
            Nimm deinen Schweizer Fahrzeugausweis zur Hand und suche das Feld <strong>«Typengenehmigung»</strong>. Dort steht z.B.:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "8px", marginTop: "4px" }}>
            {[{ ex: "1VD 123", desc: "Normaler Code" }, { ex: "X", desc: "Nur ein X" }, { ex: "IVI / IVIX", desc: "IVI-Fahrzeug" }].map((item) => (
              <div key={item.ex} style={{ padding: "10px 14px", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}` }}>
                <p style={{ color: CONFIG.accentColor, fontSize: isMobile ? "14px" : "15px", letterSpacing: "0.06em", margin: "0 0 4px", fontWeight: 700 }}>{item.ex}</p>
                <p style={{ color: CONFIG.secondaryTextColor, fontSize: "11px", margin: 0, letterSpacing: "0.04em" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <p style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "11px" : "12px", letterSpacing: "0.12em", margin: "0 0 12px", fontWeight: 600 }}>
          SCHRITT 2 — TYPENGENEHMIGUNG EINGEBEN
        </p>
        <input className="pneu360-input" type="text" value={typen} onChange={(e) => update("typen", e.target.value)} placeholder="Z.B. 1VD 123, X, IVI..."
          style={{ width: "100%", padding: isMobile ? "14px 0" : "18px 0", border: "none", borderBottom: `${CONFIG.borderLineWidth * (typen ? 2 : 1)}px solid ${typen ? CONFIG.accentColor : CONFIG.borderLineColor}`, outline: "none", background: "transparent", color: CONFIG.textColor, fontSize: isMobile ? "18px" : "21px", letterSpacing: "0.08em", fontFamily: "inherit", transition: "border-color 0.2s ease", "--pneu360-placeholder": CONFIG.secondaryTextColor } as any} />
      </div>
      <AnimatePresence mode="wait">
        {isNormal && (
          <motion.div key="normal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ padding: isMobile ? "18px" : "22px 26px", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.accentColor}`, backfaceVisibility: "hidden" as const, background: `${CONFIG.accentColor}08`, display: "grid", gap: "8px" }}>
            <p style={{ color: CONFIG.accentColor, fontSize: "11px", letterSpacing: "0.12em", margin: 0, fontWeight: 700 }}>✓ GÜLTIGE TYPENGENEHMIGUNG</p>
            <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "15px", lineHeight: 1.6, margin: 0, opacity: 0.8 }}>
              Du hast eine reguläre Typengenehmigung. Du kannst den Upload-Schritt danach überspringen.
            </p>
          </motion.div>
        )}
        {isOnlyX && (
          <motion.div key="x" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ padding: isMobile ? "18px" : "22px 26px", border: "none", boxShadow: `inset 0 0 0 2px ${CONFIG.accentColor}`, backfaceVisibility: "hidden" as const, background: `${CONFIG.accentColor}12`, display: "grid", gap: "12px" }}>
            <p style={{ color: CONFIG.accentColor, fontSize: isMobile ? "12px" : "13px", letterSpacing: "0.1em", margin: 0, fontWeight: 700 }}>SCHRITT 3 — COC-DOKUMENT ERFORDERLICH</p>
            <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "15px", lineHeight: 1.65, margin: 0 }}>
              Ein <strong>X</strong> bedeutet: Privatimport ohne Schweizer Typengenehmigung. Wir brauchen dein <strong>COC-Dokument</strong> im nächsten Schritt.
            </p>
          </motion.div>
        )}
        {isIVI && (
          <motion.div key="ivi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ display: "grid", gap: "16px" }}>
            <div style={{ padding: isMobile ? "18px" : "22px 26px", border: "none", boxShadow: `inset 0 0 0 2px ${CONFIG.accentColor}`, backfaceVisibility: "hidden" as const, background: `${CONFIG.accentColor}12`, display: "grid", gap: "12px" }}>
              <p style={{ color: CONFIG.accentColor, fontSize: isMobile ? "12px" : "13px", letterSpacing: "0.1em", margin: 0, fontWeight: 700 }}>SCHRITT 3 — STAMMNUMMER EINGEBEN</p>
              <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "15px", lineHeight: 1.65, margin: 0 }}>
                <strong>IVI</strong> = elektronisches Zulassungssystem. Gib unten deine <strong>Stammnummer</strong> ein (Feld 18, Format: XXX.XXX.XXX).
              </p>
            </div>
            <div>
              <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "13px", display: "block", marginBottom: "10px", letterSpacing: "0.08em", fontWeight: 600 }}>
                STAMMNUMMER (FELD 18 IM FAHRZEUGAUSWEIS)
              </label>
              <input className="pneu360-input" type="text" value={stamm} onChange={(e) => update("stamm", e.target.value)} placeholder="Z.B. 123.456.789"
                style={{ width: "100%", padding: isMobile ? "14px 0" : "18px 0", border: "none", borderBottom: `${CONFIG.borderLineWidth * (stamm ? 2 : 1)}px solid ${stamm ? CONFIG.accentColor : CONFIG.borderLineColor}`, outline: "none", background: "transparent", color: CONFIG.textColor, fontSize: isMobile ? "18px" : "21px", letterSpacing: "0.08em", fontFamily: "inherit", transition: "border-color 0.2s ease", "--pneu360-placeholder": CONFIG.secondaryTextColor } as any} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ========================================
// TEXTAREA INPUT
// ========================================

const TextareaInput = ({ value, onChange, placeholder, isMobile, focusedInput, setFocusedInput }: any) => {
  const isFocused = focusedInput === "textarea";
  return (
    <motion.textarea
      className="pneu360-input"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      value={value || ""}
      onChange={(e: any) => onChange(e.target.value)}
      onFocus={() => setFocusedInput("textarea")}
      onBlur={() => setFocusedInput(null)}
      placeholder={placeholder}
      rows={6}
      style={{
        width: "100%",
        padding: isMobile ? "16px 0" : "20px 0",
        border: "none",
        borderBottom: `${CONFIG.borderLineWidth}px solid ${isFocused ? CONFIG.accentColor : CONFIG.borderLineColor}`,
        outline: "none",
        background: "transparent",
        color: CONFIG.textColor,
        fontSize: isMobile ? "16px" : "18px",
        resize: "vertical" as any,
        fontFamily: "inherit",
        transition: `border-color ${DURATION.fast}s ease`,
        "--pneu360-placeholder": CONFIG.secondaryTextColor,
      } as any}
    />
  );
};

// ========================================
// FILE UPLOAD
// ========================================

const FileUpload = ({ value, onChange, isMobile, dragActive, setDragActive }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const files = value || [];

  const handleDrag = useCallback((e: any) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, [setDragActive]);

  const handleDrop = useCallback((e: any) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) onChange([...files, ...Array.from(e.dataTransfer.files)]);
  }, [files, onChange, setDragActive]);

  const handleChange = useCallback((e: any) => {
    e.preventDefault();
    if (e.target.files?.[0]) onChange([...files, ...Array.from(e.target.files)]);
  }, [files, onChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: isMobile ? "40px 20px" : "60px 40px",
          border: `${CONFIG.borderLineWidth * 2}px dashed ${dragActive ? CONFIG.accentColor : CONFIG.borderLineColor}`,
          background: dragActive ? `${CONFIG.accentColor}10` : "transparent",
          cursor: "pointer",
          textAlign: "center",
          transition: `all ${DURATION.fast}s ease`,
        }}
      >
        <motion.div animate={{ scale: dragActive ? 1.1 : 1 }} style={{ fontSize: isMobile ? "48px" : "64px", marginBottom: "20px", color: dragActive ? CONFIG.accentColor : CONFIG.secondaryTextColor }}>
          {files.length > 0 ? "✓" : "+"}
        </motion.div>
        <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "16px" : "18px", marginBottom: "8px", letterSpacing: "0.05em" }}>
          {dragActive ? "DATEI HIER ABLEGEN" : files.length > 0 ? "WEITERE DATEIEN HINZUFÜGEN" : "DATEI HOCHLADEN"}
        </p>
        <p style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "12px" : "14px", margin: 0, letterSpacing: "0.03em" }}>
          Klicken oder Dateien hierher ziehen
        </p>
      </motion.div>
      <input ref={fileInputRef} type="file" multiple onChange={handleChange} style={{ display: "none" }} />
      {files.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
          {files.map((file: File, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ padding: isMobile ? "12px" : "16px", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, display: "flex", justifyContent: "space-between", alignItems: "center", background: `${CONFIG.accentColor}05` }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "16px", margin: "0 0 4px 0", letterSpacing: "0.03em" }}>{file.name}</p>
                <p style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "11px" : "12px", margin: 0 }}>{formatFileSize(file.size)}</p>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={(e: any) => { e.stopPropagation(); onChange(files.filter((_: any, idx: number) => idx !== i)); }}
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, background: "transparent", color: CONFIG.secondaryTextColor, cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "12px" }}>
                ×
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// ========================================
// SUMMARY VIEW
// ========================================

const SummaryView = ({ selection, isMobile }: any) => {
  const CATEGORIES_MAP: any = { tires: "NEUE REIFEN", wheels: "KOMPLETTRAD", rims: "FELGEN", repair: "REPARATUR", other: "SONSTIGES" };
  const formatValue = (v: any): string => {
    if (typeof v === "object" && !Array.isArray(v)) return Object.values(v).filter(Boolean).join(" / ");
    if (Array.isArray(v)) return v.map((x: any) => typeof x === "object" ? x.name || JSON.stringify(x) : x).join(", ");
    return String(v);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: isMobile ? "48px" : "80px", padding: isMobile ? "24px" : "32px", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, background: `${CONFIG.accentColor}05` }}>
      <h3 style={{ color: CONFIG.textColor, fontSize: isMobile ? "20px" : "24px", marginBottom: "24px", letterSpacing: "0.05em", fontWeight: 700 }}>DEINE AUSWAHL</h3>
      <div style={{ display: "grid", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <p style={{ color: CONFIG.secondaryTextColor, fontSize: "12px", margin: "0 0 4px 0", letterSpacing: "0.05em", fontWeight: 600 }}>STANDORT</p>
            <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "16px", margin: 0, fontWeight: 700 }}>{selection.branch}</p>
          </div>
          <div>
            <p style={{ color: CONFIG.secondaryTextColor, fontSize: "12px", margin: "0 0 4px 0", letterSpacing: "0.05em", fontWeight: 600 }}>KATEGORIE</p>
            <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "14px" : "16px", margin: 0, fontWeight: 700 }}>{CATEGORIES_MAP[selection.category] || selection.category}</p>
          </div>
        </div>
        {Object.entries(selection.answers).filter(([_, v]) => v && v !== "" && (!Array.isArray(v) || (v as any[]).length > 0)).length > 0 && (
          <div style={{ borderTop: `${CONFIG.borderLineWidth}px solid ${CONFIG.borderLineColor}`, paddingTop: "16px", display: "grid", gap: "8px" }}>
            {Object.entries(selection.answers)
              .filter(([_, v]) => v && v !== "" && (!Array.isArray(v) || (v as any[]).length > 0))
              .map(([key, value], i) => (
                <motion.p key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ color: CONFIG.textColor, fontSize: isMobile ? "13px" : "14px", margin: 0, opacity: 0.85 }}>
                  <span style={{ color: CONFIG.accentColor }}>▸</span> {formatValue(value)}
                </motion.p>
              ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ========================================
// CONTACT FORM
// ========================================

const TextInput = ({ value, onChange, placeholder, isMobile, focusedInput, setFocusedInput, fieldId }: any) => {
  const isFocused = focusedInput === fieldId;
  return (
    <motion.input
      className="pneu360-input"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      type="text"
      value={value || ""}
      onChange={(e: any) => onChange(e.target.value)}
      onFocus={() => setFocusedInput(fieldId)}
      onBlur={() => setFocusedInput(null)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: isMobile ? "16px 0" : "20px 0",
        border: "none",
        borderBottom: `${CONFIG.borderLineWidth}px solid ${isFocused ? CONFIG.accentColor : CONFIG.borderLineColor}`,
        outline: "none",
        background: "transparent",
        color: CONFIG.textColor,
        fontSize: isMobile ? "16px" : "18px",
        fontFamily: "inherit",
        transition: `border-color ${DURATION.fast}s ease`,
        "--pneu360-placeholder": CONFIG.secondaryTextColor,
      } as any}
    />
  );
};

const ContactForm = ({ contact, updateContact, isMobile, focusedInput, setFocusedInput, privacyChecked, setPrivacyChecked }: any) => {
  const privacyText = "Ich habe die Datenschutzerklärung gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung dieser Anfrage verwendet werden.";

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ color: CONFIG.textColor, fontSize: isMobile ? "28px" : "40px", marginBottom: isMobile ? "40px" : "60px", letterSpacing: "0.05em", fontWeight: 700 }}>
        KONTAKTDATEN
      </motion.h2>
      <div style={{ display: "grid", gap: isMobile ? "24px" : "32px" }}>
        <div>
          <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "14px", display: "block", marginBottom: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>ANREDE</label>
          <div style={{ display: "flex", gap: "12px" }}>
            {["HERR", "FRAU", "FIRMA"].map((sal) => (
              <motion.button key={sal} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => updateContact("salutation", sal)}
                style={{ padding: "12px 24px", background: contact.salutation === sal ? CONFIG.accentColor : "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${contact.salutation === sal ? CONFIG.accentColor : CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: contact.salutation === sal ? CONFIG.backgroundColor : CONFIG.textColor, cursor: "pointer", fontSize: isMobile ? "12px" : "14px", letterSpacing: "0.05em", fontFamily: "inherit", fontWeight: 600 }}>
                {sal}
              </motion.button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "24px" : "32px" }}>
          <div>
            <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "14px", display: "block", marginBottom: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>VORNAME *</label>
            <TextInput value={contact.fname} onChange={(v: string) => updateContact("fname", v)} placeholder="Max" isMobile={isMobile} focusedInput={focusedInput} setFocusedInput={setFocusedInput} fieldId="fname" />
          </div>
          <div>
            <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "14px", display: "block", marginBottom: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>NACHNAME *</label>
            <TextInput value={contact.lname} onChange={(v: string) => updateContact("lname", v)} placeholder="Mustermann" isMobile={isMobile} focusedInput={focusedInput} setFocusedInput={setFocusedInput} fieldId="lname" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "24px" : "32px" }}>
          <div>
            <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "14px", display: "block", marginBottom: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>E-MAIL *</label>
            <TextInput value={contact.email} onChange={(v: string) => updateContact("email", v)} placeholder="max@example.com" isMobile={isMobile} focusedInput={focusedInput} setFocusedInput={setFocusedInput} fieldId="email" />
          </div>
          <div>
            <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "14px", display: "block", marginBottom: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>TELEFON *</label>
            <TextInput value={contact.tel} onChange={(v: string) => updateContact("tel", v)} placeholder="+41 79 123 45 67" isMobile={isMobile} focusedInput={focusedInput} setFocusedInput={setFocusedInput} fieldId="tel" />
          </div>
        </div>
        <div>
          <label style={{ color: CONFIG.textColor, fontSize: isMobile ? "12px" : "14px", display: "block", marginBottom: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>KOMMENTAR (OPTIONAL)</label>
          <TextareaInput value={contact.comment} onChange={(v: string) => updateContact("comment", v)} placeholder="Weitere Anmerkungen..." isMobile={isMobile} focusedInput={focusedInput} setFocusedInput={setFocusedInput} />
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            display: "flex", alignItems: "flex-start", gap: "14px",
            padding: isMobile ? "18px" : "22px",
            border: "none",
            boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${privacyChecked ? CONFIG.accentColor : CONFIG.borderLineColor}`,
            backfaceVisibility: "hidden" as const,
            cursor: "pointer", transition: "border-color 0.2s ease",
            background: privacyChecked ? `${CONFIG.accentColor}08` : "transparent",
          }}
          onClick={() => setPrivacyChecked((v: boolean) => !v)}>
          <motion.div
            animate={{ background: privacyChecked ? CONFIG.accentColor : "transparent", borderColor: privacyChecked ? CONFIG.accentColor : CONFIG.borderLineColor }}
            transition={{ duration: 0.18 }}
            style={{ width: isMobile ? "22px" : "24px", height: isMobile ? "22px" : "24px", flexShrink: 0, border: `${CONFIG.borderLineWidth + 1}px solid ${privacyChecked ? CONFIG.accentColor : CONFIG.borderLineColor}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
            <AnimatePresence>
              {privacyChecked && (
                <motion.span key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  style={{ color: CONFIG.backgroundColor, fontSize: isMobile ? "13px" : "15px", fontWeight: "bold", lineHeight: 1 }}>✓</motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <p style={{ color: CONFIG.textColor, fontSize: isMobile ? "13px" : "14px", margin: 0, lineHeight: 1.6, opacity: 0.9, userSelect: "none" }}>
            {privacyText}<span style={{ color: CONFIG.accentColor }}> *</span>
          </p>
        </motion.div>
        {!privacyChecked && contact.fname && contact.lname && contact.email && contact.tel && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "12px" : "13px", margin: 0, letterSpacing: "0.03em" }}>
            Bitte Datenschutzerklärung akzeptieren um fortzufahren.
          </motion.p>
        )}
      </div>
    </div>
  );
};

// ========================================
// SUCCESS VIEW
// ========================================

const SuccessView = ({ onReset, isMobile }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: DURATION.slow, ease: EASING.signature }}
    style={{ textAlign: "center", padding: isMobile ? "40px 20px" : "80px 40px" }}>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
      style={{ width: isMobile ? "80px" : "120px", height: isMobile ? "80px" : "120px", borderRadius: "50%", background: CONFIG.accentColor, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 40px", fontSize: isMobile ? "40px" : "60px", color: CONFIG.backgroundColor }}>
      ✓
    </motion.div>
    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      style={{ color: CONFIG.textColor, fontSize: isMobile ? "32px" : "48px", marginBottom: "20px", letterSpacing: "0.05em", fontWeight: 700 }}>
      VIELEN DANK!
    </motion.h2>
    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      style={{ color: CONFIG.secondaryTextColor, fontSize: isMobile ? "16px" : "18px", marginBottom: "40px", letterSpacing: "0.03em" }}>
      Wir haben deine Anfrage erhalten und melden uns so schnell wie möglich bei dir.
    </motion.p>
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onReset}
      style={{ padding: "16px 40px", background: "transparent", border: "none", boxShadow: `inset 0 0 0 ${CONFIG.borderLineWidth}px ${CONFIG.borderLineColor}`, backfaceVisibility: "hidden" as const, color: CONFIG.textColor, cursor: "pointer", fontSize: isMobile ? "14px" : "16px", letterSpacing: "0.05em", fontFamily: "inherit", fontWeight: 600 }}>
      SCHLIESSEN
    </motion.button>
  </motion.div>
);

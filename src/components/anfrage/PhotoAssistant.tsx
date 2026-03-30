import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, FileText, Pencil, ArrowLeftRight, ShieldCheck } from "lucide-react";
import { fileToBase64 } from "@/data/anfrageData";

// ── Types ──

interface TireResult {
  width: string;
  height: string;
  inch: string;
  brand?: string;
  confidence: string;
  validated: boolean;
  error?: string;
}

interface VehicleResult {
  brand: string;
  model: string;
  year: string;
  color: string;
  typengenehmigung: string;
  stammnummer: string;
  needsCOC: boolean;
  isIVI: boolean;
  confidence: string;
}

export interface PhotoAssistantResult {
  dims: { width: string; height: string; inch: string };
  dims_rear?: { width: string; height: string; inch: string };
  brand?: string[];
  vehicle: { brand: string; model: string; year: string };
  carcolor?: { label: string; custom?: string };
  typen?: { typen: string; stamm: string };
  needsCOC: boolean;
}

interface Props {
  category: string;
  isMobile: boolean;
  onComplete: (result: PhotoAssistantResult) => void;
  onCancel: () => void;
}

// ── Config ──

const CONFIG = {
  accentColor: "#ffc800",
  textColor: "#ebebeb",
  secondaryTextColor: "#8c8c8c",
  borderLineColor: "#2e2e2e",
};

const EASING = [0.19, 1, 0.22, 1] as [number, number, number, number];

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-image-reader`;

// ── Helpers ──

async function analyzeImage(type: "tire" | "vehicle-doc", images: string[]): Promise<any> {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ type, images }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Unbekannter Fehler" }));
    throw new Error(err.error || `Fehler ${resp.status}`);
  }
  return resp.json();
}

type Step = "consent" | "tire-front" | "tire-rear-ask" | "tire-rear" | "vehicle-doc" | "summary";

const needsTirePhoto = (cat: string) => cat === "tires" || cat === "rims";

// ── Main Component ──

const PhotoAssistant: React.FC<Props> = ({ category, isMobile, onComplete, onCancel }) => {
  const [step, setStep] = useState<Step>("consent");
  const [consentGiven, setConsentGiven] = useState(false);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [rearImage, setRearImage] = useState<File | null>(null);
  const [docImage, setDocImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [rearPreview, setRearPreview] = useState<string>("");
  const [docPreview, setDocPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [frontResult, setFrontResult] = useState<TireResult | null>(null);
  const [rearResult, setRearResult] = useState<TireResult | null>(null);
  const [vehicleResult, setVehicleResult] = useState<VehicleResult | null>(null);

  // Editable summary fields
  const [editData, setEditData] = useState<PhotoAssistantResult | null>(null);

  const frontRef = useRef<HTMLInputElement>(null);
  const rearRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File, target: "front" | "rear" | "doc") => {
    const url = URL.createObjectURL(file);
    if (target === "front") { setFrontImage(file); setFrontPreview(url); }
    if (target === "rear") { setRearImage(file); setRearPreview(url); }
    if (target === "doc") { setDocImage(file); setDocPreview(url); }
  }, []);

  // Analyze single front tire
  const analyzeFrontTire = useCallback(async () => {
    if (!frontImage) return;
    setLoading(true);
    setError("");
    try {
      const base64 = await fileToBase64(frontImage);
      const data = await analyzeImage("tire", [base64]);
      if (data.results?.[0]) {
        setFrontResult(data.results[0]);
        setError("");
        // For rims: skip mixed-sizing question, go straight to vehicle-doc
        if (category === "rims") {
          setStep("vehicle-doc");
        } else {
          setStep("tire-rear-ask");
        }
      } else {
        setError("Reifengrösse konnte nicht erkannt werden. Bitte versuche es mit einem besseren Foto.");
      }
    } catch (e: any) {
      setError(e.message || "Fehler bei der Erkennung");
    }
    setLoading(false);
  }, [frontImage]);

  // Analyze rear tire
  const analyzeRearTire = useCallback(async () => {
    if (!rearImage) return;
    setLoading(true);
    setError("");
    try {
      const base64 = await fileToBase64(rearImage);
      const data = await analyzeImage("tire", [base64]);
      if (data.results?.[0]) {
        setRearResult(data.results[0]);
        setStep("vehicle-doc");
      } else {
        setError("Hinterreifen konnte nicht erkannt werden. Bitte versuche es erneut.");
      }
    } catch (e: any) {
      setError(e.message || "Fehler bei der Erkennung");
    }
    setLoading(false);
  }, [rearImage]);

  const analyzeVehicleDoc = useCallback(async () => {
    if (!docImage) return;
    setLoading(true);
    setError("");
    try {
      const base64 = await fileToBase64(docImage);
      const data = await analyzeImage("vehicle-doc", [base64]);
      if (data.result) {
        setVehicleResult(data.result);
        const v = data.result as VehicleResult;
        const front = frontResult;
        const rear = rearResult;
        const hasTireData = needsTirePhoto(category) && front;

        const result: PhotoAssistantResult = {
          dims: hasTireData ? { width: front.width, height: front.height, inch: front.inch } : { width: "", height: "", inch: "" },
          vehicle: { brand: v.brand, model: v.model, year: v.year },
          needsCOC: v.needsCOC,
        };

        if (hasTireData && rear && (rear.width !== front.width || rear.height !== front.height || rear.inch !== front.inch)) {
          result.dims_rear = { width: rear.width, height: rear.height, inch: rear.inch };
        }

        if (hasTireData && front.brand) result.brand = [front.brand];
        if (v.color) result.carcolor = { label: v.color };
        if (v.typengenehmigung) {
          result.typen = { typen: v.typengenehmigung, stamm: v.stammnummer || "" };
        }

        setEditData(result);
        setStep("summary");
      } else {
        setError("Fahrzeugausweis konnte nicht gelesen werden. Bitte Vorderseite gut lesbar fotografieren.");
      }
    } catch (e: any) {
      setError(e.message || "Fehler bei der Erkennung");
    }
    setLoading(false);
  }, [docImage, frontResult, rearResult]);

  const updateEditField = useCallback((path: string, value: string) => {
    setEditData(prev => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  }, []);

  // ── Render ──

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.15em",
    color: CONFIG.secondaryTextColor,
    marginBottom: 6,
    textTransform: "uppercase",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${CONFIG.borderLineColor}`,
    color: CONFIG.textColor,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <AnimatePresence mode="wait">
        {/* ── STEP 0: CONSENT ── */}
        {step === "consent" && (
          <motion.div
            key="consent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASING }}
          >
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, letterSpacing: "0.05em", margin: 0, color: CONFIG.textColor }}>
                KI-GESTÜTZTE BILDANALYSE
              </h2>
              <p style={{ fontSize: 13, color: CONFIG.secondaryTextColor, marginTop: 12, lineHeight: 1.7 }}>
                Deine Fotos werden einmalig per KI analysiert, um Reifen- und Fahrzeugdaten zu extrahieren.
                Die Bilder werden nach der Analyse <strong style={{ color: CONFIG.textColor }}>nicht gespeichert</strong>.
              </p>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: 16,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${CONFIG.borderLineColor}`,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={e => setConsentGiven(e.target.checked)}
                style={{ marginTop: 2, accentColor: CONFIG.accentColor, width: 16, height: 16, cursor: "pointer" }}
              />
              <span style={{ fontSize: 13, color: CONFIG.textColor, lineHeight: 1.6 }}>
                Ich stimme der einmaligen KI-Analyse meiner Fotos zu.
              </span>
            </label>

            <ActionButton
              label="WEITER →"
              onClick={() => setStep(needsTirePhoto(category) ? "tire-front" : "vehicle-doc")}
              disabled={!consentGiven}
              loading={false}
              isMobile={isMobile}
            />
          </motion.div>
        )}

        {/* ── STEP 1: FRONT TIRE ── */}
        {step === "tire-front" && (
          <motion.div
            key="tire-front"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASING }}
          >
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, letterSpacing: "0.05em", margin: 0, color: CONFIG.textColor }}>
                REIFEN FOTOGRAFIEREN
              </h2>
              <p style={{ fontSize: 13, color: CONFIG.secondaryTextColor, marginTop: 8, lineHeight: 1.6 }}>
                Fotografiere <strong style={{ color: CONFIG.textColor }}>einen</strong> deiner Reifen bei gutem Licht.<br />
                Die Grösse (z.B. 225/45 R18) auf der Flanke muss sichtbar sein.
              </p>
            </div>

            <div style={{ marginTop: 24 }}>
              <UploadCard
                label="REIFEN FOTOGRAFIEREN"
                sublabel="REIFENFLANKE MIT GRÖSSE SICHTBAR"
                preview={frontPreview}
                onClick={() => frontRef.current?.click()}
                isMobile={isMobile}
                accent
                large
              />
            </div>

            <input ref={frontRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0], "front")} />

            {error && <ErrorMsg text={error} />}

            {frontImage && (
              <ActionButton
                label={loading ? "WIRD ANALYSIERT..." : "REIFEN ERKENNEN →"}
                onClick={analyzeFrontTire}
                disabled={loading}
                loading={loading}
                isMobile={isMobile}
              />
            )}
          </motion.div>
        )}

        {/* ── STEP 1b: ASK REAR ── */}
        {step === "tire-rear-ask" && (
          <motion.div
            key="tire-rear-ask"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASING }}
          >
            {/* Show front tire result */}
            {frontResult && (
              <div style={{ padding: 16, background: "rgba(255,200,0,0.06)", border: `1px solid rgba(255,200,0,0.15)`, marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: CONFIG.accentColor, fontWeight: 600, marginBottom: 8 }}>
                  ✓ REIFEN ERKANNT
                </div>
                <div style={{ fontSize: 16, color: CONFIG.textColor, fontWeight: 700 }}>
                  {frontResult.width}/{frontResult.height} R{frontResult.inch}
                  {frontResult.brand && <span style={{ color: CONFIG.secondaryTextColor, fontWeight: 400 }}> — {frontResult.brand}</span>}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, letterSpacing: "0.05em", margin: 0, color: CONFIG.textColor }}>
                MISCHBEREIFUNG?
              </h2>
              <p style={{ fontSize: 13, color: CONFIG.secondaryTextColor, marginTop: 8, lineHeight: 1.6 }}>
                Manche Fahrzeuge haben hinten breitere Reifen.<br />
                Hast du <strong style={{ color: CONFIG.textColor }}>hinten eine andere Reifengrösse</strong>?
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <motion.button
                onClick={() => setStep("tire-rear")}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "24px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${CONFIG.borderLineColor}`,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><ArrowLeftRight size={22} strokeWidth={1.5} color={CONFIG.textColor} /></div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: CONFIG.textColor }}>
                  JA, ANDERE GRÖSSE
                </div>
                <div style={{ fontSize: 11, color: CONFIG.secondaryTextColor, marginTop: 4 }}>
                  HINTERREIFEN FOTOGRAFIEREN
                </div>
              </motion.button>

              <motion.button
                onClick={() => setStep("vehicle-doc")}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "24px 16px",
                  background: "rgba(255,200,0,0.06)",
                  border: `1px solid rgba(255,200,0,0.2)`,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><Check size={22} strokeWidth={2.5} color={CONFIG.accentColor} /></div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: CONFIG.accentColor }}>
                  NEIN, ÜBERALL GLEICH
                </div>
                <div style={{ fontSize: 11, color: CONFIG.secondaryTextColor, marginTop: 4 }}>
                  WEITER ZUM FAHRZEUGAUSWEIS
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 1c: REAR TIRE ── */}
        {step === "tire-rear" && (
          <motion.div
            key="tire-rear"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASING }}
          >
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, letterSpacing: "0.05em", margin: 0, color: CONFIG.textColor }}>
                HINTERREIFEN FOTOGRAFIEREN
              </h2>
              <p style={{ fontSize: 13, color: CONFIG.secondaryTextColor, marginTop: 8, lineHeight: 1.6 }}>
                Fotografiere einen <strong style={{ color: CONFIG.textColor }}>Hinterreifen</strong>.<br />
                Gleiche Regeln: gutes Licht, Grösse sichtbar.
              </p>
            </div>

            {/* Show front result for reference */}
            {frontResult && (
              <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${CONFIG.borderLineColor}`, marginBottom: 16, fontSize: 12 }}>
                <span style={{ color: CONFIG.secondaryTextColor }}>Vorne erkannt: </span>
                <span style={{ color: CONFIG.textColor, fontWeight: 600 }}>
                  {frontResult.width}/{frontResult.height} R{frontResult.inch}
                </span>
              </div>
            )}

            <UploadCard
              label="HINTERREIFEN"
              sublabel="REIFENFLANKE FOTOGRAFIEREN"
              preview={rearPreview}
              onClick={() => rearRef.current?.click()}
              isMobile={isMobile}
              accent
              large
            />

            <input ref={rearRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0], "rear")} />

            {error && <ErrorMsg text={error} />}

            {rearImage && (
              <ActionButton
                label={loading ? "WIRD ANALYSIERT..." : "HINTERREIFEN ERKENNEN →"}
                onClick={analyzeRearTire}
                disabled={loading}
                loading={loading}
                isMobile={isMobile}
              />
            )}
          </motion.div>
        )}

        {/* ── STEP 2: VEHICLE DOC ── */}
        {step === "vehicle-doc" && (
          <motion.div
            key="vehicle-doc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASING }}
          >
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, letterSpacing: "0.05em", margin: 0, color: CONFIG.textColor }}>
                FAHRZEUGAUSWEIS
              </h2>
              <p style={{ fontSize: 13, color: CONFIG.secondaryTextColor, marginTop: 8, lineHeight: 1.6 }}>
                Fotografiere die <strong style={{ color: CONFIG.textColor }}>Vorderseite</strong> deines Schweizer Fahrzeugausweises.<br />
                Gut lesbar, bei gutem Licht.
              </p>
            </div>

            {/* Show recognized tire results only if tire photos were taken */}
            {needsTirePhoto(category) && frontResult && (
              <div style={{ padding: 16, background: "rgba(255,200,0,0.06)", border: `1px solid rgba(255,200,0,0.15)`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: CONFIG.accentColor, fontWeight: 600, marginBottom: 8 }}>
                  ✓ {category === "rims" ? "AKTUELLE BEREIFUNG" : "REIFEN ERKANNT"}
                </div>
                {frontResult && (
                  <div style={{ fontSize: 14, color: CONFIG.textColor, marginBottom: rearResult ? 4 : 0 }}>
                    {rearResult ? "Vorne" : "Alle"}: <strong>{frontResult.width}/{frontResult.height} R{frontResult.inch}</strong>
                    {frontResult.brand && <span style={{ color: CONFIG.secondaryTextColor }}> — {frontResult.brand}</span>}
                  </div>
                )}
                {rearResult && (
                  <div style={{ fontSize: 14, color: CONFIG.textColor }}>
                    Hinten: <strong>{rearResult.width}/{rearResult.height} R{rearResult.inch}</strong>
                    {rearResult.brand && <span style={{ color: CONFIG.secondaryTextColor }}> — {rearResult.brand}</span>}
                  </div>
                )}
              </div>
            )}

            <UploadCard
              label="FAHRZEUGAUSWEIS"
              sublabel="VORDERSEITE FOTOGRAFIEREN"
              preview={docPreview}
              onClick={() => docRef.current?.click()}
              isMobile={isMobile}
              accent
              large
            />

            <input ref={docRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0], "doc")} />

            {error && <ErrorMsg text={error} />}

            {docImage && (
              <ActionButton
                label={loading ? "WIRD ANALYSIERT..." : "AUSWEIS LESEN →"}
                onClick={analyzeVehicleDoc}
                disabled={loading}
                loading={loading}
                isMobile={isMobile}
              />
            )}
          </motion.div>
        )}

        {/* ── STEP 3: SUMMARY ── */}
        {step === "summary" && editData && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASING }}
          >
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, letterSpacing: "0.05em", margin: 0, color: CONFIG.textColor }}>
                ZUSAMMENFASSUNG
              </h2>
              <p style={{ fontSize: 13, color: CONFIG.secondaryTextColor, marginTop: 8 }}>
                Prüfe die erkannten Daten und korrigiere falls nötig.
              </p>
            </div>

            {/* Tire size — shown for tires and rims categories */}
            {needsTirePhoto(category) && editData.dims.width && (
              <>
                <SummarySection title={category === "rims" ? "AKTUELLE BEREIFUNG" : editData.dims_rear ? "REIFENGRÖSSE VORNE" : "REIFENGRÖSSE"}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={labelStyle}>BREITE</div>
                      <input style={inputStyle} value={editData.dims.width}
                        onChange={e => updateEditField("dims.width", e.target.value)} />
                    </div>
                    <div>
                      <div style={labelStyle}>HÖHE</div>
                      <input style={inputStyle} value={editData.dims.height}
                        onChange={e => updateEditField("dims.height", e.target.value)} />
                    </div>
                    <div>
                      <div style={labelStyle}>ZOLL</div>
                      <input style={inputStyle} value={editData.dims.inch}
                        onChange={e => updateEditField("dims.inch", e.target.value)} />
                    </div>
                  </div>
                </SummarySection>

                {editData.dims_rear && (
                  <SummarySection title="REIFENGRÖSSE HINTEN">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <div>
                        <div style={labelStyle}>BREITE</div>
                        <input style={inputStyle} value={editData.dims_rear.width}
                          onChange={e => updateEditField("dims_rear.width", e.target.value)} />
                      </div>
                      <div>
                        <div style={labelStyle}>HÖHE</div>
                        <input style={inputStyle} value={editData.dims_rear.height}
                          onChange={e => updateEditField("dims_rear.height", e.target.value)} />
                      </div>
                      <div>
                        <div style={labelStyle}>ZOLL</div>
                        <input style={inputStyle} value={editData.dims_rear.inch}
                          onChange={e => updateEditField("dims_rear.inch", e.target.value)} />
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: CONFIG.accentColor, marginTop: 8, fontWeight: 500 }}>
                      ⚠ Unterschiedliche Grössen vorne / hinten erkannt
                    </p>
                  </SummarySection>
                )}
              </>
            )}

            {/* Vehicle info */}
            <SummarySection title="FAHRZEUG">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <div style={labelStyle}>MARKE</div>
                  <input style={inputStyle} value={editData.vehicle.brand}
                    onChange={e => updateEditField("vehicle.brand", e.target.value)} />
                </div>
                <div>
                  <div style={labelStyle}>MODELL</div>
                  <input style={inputStyle} value={editData.vehicle.model}
                    onChange={e => updateEditField("vehicle.model", e.target.value)} />
                </div>
                <div>
                  <div style={labelStyle}>BAUJAHR</div>
                  <input style={inputStyle} value={editData.vehicle.year}
                    onChange={e => updateEditField("vehicle.year", e.target.value)} />
                </div>
              </div>
            </SummarySection>

            {/* Color */}
            {editData.carcolor && (
              <SummarySection title="FAHRZEUGFARBE">
                <input style={inputStyle} value={editData.carcolor.label}
                  onChange={e => {
                    setEditData(prev => prev ? { ...prev, carcolor: { label: e.target.value } } : prev);
                  }} />
              </SummarySection>
            )}

            {/* Typengenehmigung */}
            {editData.typen && (
              <SummarySection title="TYPENGENEHMIGUNG">
                <input style={inputStyle} value={editData.typen.typen}
                  onChange={e => updateEditField("typen.typen", e.target.value)} />
                {editData.typen.stamm && (
                  <div style={{ marginTop: 12 }}>
                    <div style={labelStyle}>STAMMNUMMER</div>
                    <input style={inputStyle} value={editData.typen.stamm}
                      onChange={e => updateEditField("typen.stamm", e.target.value)} />
                  </div>
                )}
                {editData.needsCOC && (
                  <p style={{ fontSize: 12, color: CONFIG.accentColor, marginTop: 12, fontWeight: 600 }}>
                    ⚠ TYPENGENEHMIGUNG "X" — COC-Dokument wird im nächsten Schritt benötigt
                  </p>
                )}
              </SummarySection>
            )}

            <ActionButton
              label="DATEN ÜBERNEHMEN →"
              onClick={() => editData && onComplete(editData)}
              disabled={false}
              loading={false}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoAssistant;

// ── Sub-components ──

const UploadCard = ({ label, sublabel, preview, onClick, isMobile, accent, large }: {
  label: string; sublabel: string; preview: string; onClick: () => void; isMobile: boolean; accent?: boolean; large?: boolean;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: large ? "40px 20px" : "28px 16px",
      background: preview ? "transparent" : "rgba(255,255,255,0.03)",
      border: `1px solid ${accent ? "rgba(255,200,0,0.3)" : CONFIG.borderLineColor}`,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      minHeight: large ? 180 : 140,
      width: "100%",
    }}
  >
    {preview ? (
      <img src={preview} alt={label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
    ) : null}
    <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>{preview ? <Check size={28} strokeWidth={2.5} color={CONFIG.accentColor} /> : <Camera size={28} strokeWidth={1.5} color={CONFIG.secondaryTextColor} />}</div>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: preview ? CONFIG.accentColor : CONFIG.textColor }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: CONFIG.secondaryTextColor, marginTop: 4, letterSpacing: "0.08em" }}>
        {preview ? "ERNEUT AUFNEHMEN" : sublabel}
      </div>
    </div>
  </motion.button>
);

const ActionButton = ({ label, onClick, disabled, loading, isMobile }: {
  label: string; onClick: () => void; disabled: boolean; loading: boolean; isMobile: boolean;
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.01 } : undefined}
    whileTap={!disabled ? { scale: 0.985 } : undefined}
    style={{
      marginTop: 24,
      width: "100%",
      padding: "16px 24px",
      background: disabled ? "rgba(255,200,0,0.15)" : CONFIG.accentColor,
      color: disabled ? CONFIG.secondaryTextColor : "#000",
      border: "none",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.15em",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      position: "relative",
    }}
  >
    {loading && (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", left: 20, top: "50%", marginTop: -8,
          width: 16, height: 16, border: "2px solid rgba(0,0,0,0.2)",
          borderTopColor: "#000", borderRadius: "50%",
        }}
      />
    )}
    {label}
  </motion.button>
);

const SummarySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{
    marginBottom: 20,
    padding: 20,
    background: "rgba(255,255,255,0.02)",
    border: `1px solid ${CONFIG.borderLineColor}`,
  }}>
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.15em",
      color: CONFIG.accentColor, marginBottom: 16,
    }}>
      {title}
    </div>
    {children}
  </div>
);

const ErrorMsg = ({ text }: { text: string }) => (
  <div style={{
    marginTop: 16,
    padding: "12px 16px",
    background: "rgba(204,17,17,0.1)",
    border: "1px solid rgba(204,17,17,0.3)",
    fontSize: 13,
    color: "#ff6666",
  }}>
    {text}
  </div>
);

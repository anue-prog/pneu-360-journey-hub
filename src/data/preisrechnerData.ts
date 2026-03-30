// ========================================
// PREISRECHNER – DATA & PRICING LOGIC
// ========================================

export type FahrzeugTyp = "PW" | "SUV" | "BUS";

export const FAHRZEUG_TYPEN: { id: FahrzeugTyp; label: string; sub: string }[] = [
  { id: "PW", label: "PW", sub: "Personenwagen bis 18 Zoll" },
  { id: "SUV", label: "SUV / Offroad", sub: "Ab 19 Zoll" },
  { id: "BUS", label: "Bus / Lieferwagen", sub: "Transporter & LLKW" },
];

export const ZOLL_OPTIONEN: number[] = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

export const CYCLE_WORDS_PREIS = ["REIFEN", "FELGEN", "SERVICE", "EINLAGERUNG", "WECHSEL"];

// ========================================
// PRICING FUNCTIONS
// ========================================

export function getReifenwechselPreis(zoll: number): number {
  if (zoll <= 16) return 90;
  if (zoll <= 18) return 110;
  if (zoll <= 20) return 120;
  if (zoll === 21) return 140;
  return 160; // 22+
}

export function getAufpreisEigeneReifen(zoll: number): number {
  // pro Reifen
  if (zoll <= 19) return 10;
  return 20; // 20+
}

export function getKomplettraederPreis(typ: FahrzeugTyp): number {
  if (typ === "PW") return 65;
  if (typ === "SUV") return 75;
  return 85; // BUS
}

export function getEinlagerungPreis(zoll: number, mitFelgen: boolean): number {
  if (mitFelgen) {
    if (zoll <= 20) return 70;
    if (zoll === 21) return 90;
    return 100; // 22+
  }
  // ohne Felgen
  if (zoll <= 20) return 60;
  if (zoll === 21) return 80;
  return 90; // 22+
}

export const REPARATUR_PREIS = 55;
export const ENTSORGUNG_PREIS_PRO_STUECK = 5;
export const ENTSORGUNG_ANZAHL = 4;
export const WASCHEN_PREIS = 10;

// ========================================
// SERVICE DEFINITIONS
// ========================================

export interface ServiceDef {
  id: string;
  label: string;
  sub: string;
  getPreis: (typ: FahrzeugTyp, zoll: number) => number;
  /** only show when another service is selected */
  dependsOn?: string;
  /** format label for summary */
  preisLabel?: (typ: FahrzeugTyp, zoll: number) => string;
}

export const SERVICES: ServiceDef[] = [
  {
    id: "komplettraeder",
    label: "Kompletträder wechseln",
    sub: "4 Räder inkl. RDKS-Check",
    getPreis: (typ) => getKomplettraederPreis(typ),
    preisLabel: () => "4 Räder",
  },
  {
    id: "reifenwechsel",
    label: "Reifenwechsel inkl. Auswuchten",
    sub: "4 Reifen montieren & auswuchten",
    getPreis: (_, zoll) => getReifenwechselPreis(zoll),
    preisLabel: () => "4 Reifen",
  },
  {
    id: "eigene_reifen",
    label: "Eigene neue Reifen mitgebracht",
    sub: "Aufpreis pro Reifen × 4",
    getPreis: (_, zoll) => getAufpreisEigeneReifen(zoll) * 4,
    dependsOn: "reifenwechsel",
    preisLabel: (_, zoll) => `4 × CHF ${getAufpreisEigeneReifen(zoll)}`,
  },
  {
    id: "reparatur",
    label: "Reifen reparieren",
    sub: "Pannenschaden beheben",
    getPreis: () => REPARATUR_PREIS,
  },
  {
    id: "einlagerung_felgen",
    label: "Einlagerung Räder (mit Felgen)",
    sub: "Pro Saison, inkl. Check",
    getPreis: (_, zoll) => getEinlagerungPreis(zoll, true),
  },
  {
    id: "einlagerung_reifen",
    label: "Einlagerung Reifen (ohne Felgen)",
    sub: "Pro Saison",
    getPreis: (_, zoll) => getEinlagerungPreis(zoll, false),
  },
  {
    id: "waschen",
    label: "Räder waschen",
    sub: "Alle 4 Räder",
    getPreis: () => WASCHEN_PREIS,
  },
  {
    id: "entsorgung",
    label: "Alte Reifen entsorgen",
    sub: `${ENTSORGUNG_ANZAHL} Stück`,
    getPreis: () => ENTSORGUNG_PREIS_PRO_STUECK * ENTSORGUNG_ANZAHL,
    preisLabel: () => `${ENTSORGUNG_ANZAHL} × CHF ${ENTSORGUNG_PREIS_PRO_STUECK}`,
  },
];

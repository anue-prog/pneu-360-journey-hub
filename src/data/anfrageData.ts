// ========================================
// ANFRAGE KONFIGURATOR – DATEN
// ========================================

export const TIRE_WIDTHS = [
  "125","135","145","155","165","175","185","195","205","215",
  "225","235","245","255","265","275","285","295","305","315","325","335","345","355",
];
export const TIRE_HEIGHTS = ["25","30","35","40","45","50","55","60","65","70","75","80","85"];
export const TIRE_INCHES = ["12","13","14","15","16","17","18","19","20","21","22","23","24"];

export const TIRE_BRANDS_FAVORITES = [
  "CONTINENTAL","HANKOOK","PIRELLI","MICHELIN","BRIDGESTONE","GOODYEAR","YOKOHAMA","BARUM",
];
export const TIRE_BRANDS_MORE = [
  "DUNLOP","FALKEN","FIRESTONE","FULDA","GISLAVED","KLEBER","KUMHO","LAUFENN",
  "MAXXIS","NEXEN","NOKIAN","SAVA","SEMPERIT","TOYO","UNIROYAL","VREDESTEIN",
];

export const POPULAR_CAR_BRANDS = [
  "MERCEDES-BENZ","BMW","AUDI","VW","PORSCHE","TOYOTA","FORD","SKODA","VOLVO","RENAULT","FIAT","SEAT",
];

export const ALL_CAR_BRANDS = [
  "ABARTH","ALFA ROMEO","ASTON MARTIN","AUDI","BENTLEY","BMW","CITROEN","CUPRA","DACIA","DODGE",
  "FERRARI","FIAT","FORD","HONDA","HYUNDAI","IVECO","JAGUAR","JEEP","KIA","LAMBORGHINI",
  "LAND ROVER","LEXUS","MAN","MASERATI","MAZDA","MERCEDES-BENZ","MINI","MITSUBISHI","NISSAN","OPEL",
  "PEUGEOT","POLESTAR","PORSCHE","RENAULT","SEAT","SKODA","SMART","SPRINTER","SUBARU","SUZUKI","TESLA",
  "TOYOTA","VOLVO","VW",
].sort();

export const CAR_MODELS: Record<string, string[]> = {
  AUDI: ["A1","A2","A3","A4","A5","A6","A7","A8","Q2","Q3","Q4 e-tron","Q5","Q6 e-tron","Q7","Q8","TT","R8","e-tron GT","RS3","RS4","RS5","RS6","RS7","S3","S4","S5","S6","S7","SQ5","SQ7","RS Q8","ANDERES"],
  BMW: ["1er","2er","3er","4er","5er","6er","7er","8er","X1","X2","X3","X4","X5","X6","X7","iX","iX1","iX2","iX3","i3","i4","i5","i7","M2","M3","M4","M5","M8","Z4","ANDERES"],
  "MERCEDES-BENZ": ["A-Klasse","B-Klasse","C-Klasse","CLA","CLS","E-Klasse","EQA","EQB","EQC","EQE","EQS","G-Klasse","GLA","GLB","GLC","GLE","GLS","S-Klasse","SL","AMG GT","Sprinter","Vito","Viano","V-Klasse","Citan","eSprinter","eVito","ANDERES"],
  VW: ["Amarok","Arteon","Caddy","Golf","ID.3","ID.4","ID.5","ID.7","Passat","Phaeton","Polo","Sharan","T-Cross","T-Roc","Tiguan","Touareg","Touran","Transporter T5","Transporter T6","Transporter T7","Crafter","ID. Buzz","Caravelle","Multivan","up!","ANDERES"],
  PORSCHE: ["911","718 Boxster","718 Cayman","Cayenne","Cayenne Coupé","Macan","Panamera","Taycan","ANDERES"],
  TESLA: ["Model 3","Model S","Model X","Model Y","Cybertruck","Semi","ANDERES"],
  SKODA: ["Enyaq iV","Fabia","Kamiq","Karoq","Kodiaq","Octavia","Rapid","Scala","Superb","ANDERES"],
  SEAT: ["Arona","Ateca","Ibiza","Leon","Mii","Tarraco","ANDERES"],
  CUPRA: ["Ateca","Born","Formentor","Leon","Terramar","ANDERES"],
  FORD: ["EcoSport","Edge","Explorer","Fiesta","Focus","Kuga","Mustang","Mustang Mach-E","Puma","Ranger","Transit","Transit Custom","Transit Connect","Transit Courier","E-Transit","ANDERES"],
  OPEL: ["Astra","Corsa","Crossland","Grandland","Insignia","Mokka","Zafira","Combo","Vivaro","Movano","ANDERES"],
  TOYOTA: ["Aygo X","bZ4X","C-HR","Camry","Corolla","GR86","GR Yaris","Hilux","Land Cruiser","Prius","ProAce","ProAce Verso","ProAce City","RAV4","Supra","Yaris","ANDERES"],
  HONDA: ["Accord","Civic","CR-V","e","e:Ny1","HR-V","Jazz","e:NV200","ANDERES"],
  HYUNDAI: ["i10","i20","i20N","i30","Ioniq 5","Ioniq 6","KONA","Nexo","Santa Fe","Staria","Tucson","ANDERES"],
  KIA: ["Ceed","EV6","EV9","Niro","Picanto","ProCeed","Rio","Sorento","Sportage","Stinger","ANDERES"],
  RENAULT: ["Arkana","Austral","Captur","Clio","Kadjar","Kangoo","Kangoo E-Tech","Koleos","Master","Megane E-Tech","Trafic","Zoe","ANDERES"],
  PEUGEOT: ["108","2008","208","3008","308","408","5008","Boxer","e-208","e-2008","Expert","Partner","ANDERES"],
  CITROEN: ["Berlingo","C1","C3","C3 Aircross","C4","C5 Aircross","C5 X","Dispatch","e-Berlingo","e-C4","Jumper","Jumpy","SpaceTourer","ANDERES"],
  FIAT: ["500","500e","500L","500X","Bravo","Doblo","Ducato","e-Ducato","Fiorino","Panda","Tipo","ANDERES"],
  VOLVO: ["C40 Recharge","EX30","EX90","S60","S90","V60","V90","XC40","XC60","XC90","ANDERES"],
  MINI: ["Cabrio","Clubman","Countryman","John Cooper Works","Mini Cooper","Paceman","ANDERES"],
  MAZDA: ["2","3","6","CX-3","CX-30","CX-5","CX-60","MX-30","MX-5","ANDERES"],
  NISSAN: ["Ariya","GT-R","Interstar","Juke","Leaf","Micra","Navara","NV200","NV300","NV400","Primastar","Qashqai","X-Trail","ANDERES"],
  MITSUBISHI: ["ASX","Colt","Eclipse Cross","L200","Outlander","ANDERES"],
  SUBARU: ["BRZ","Forester","Impreza","Legacy","Outback","XV","ANDERES"],
  SUZUKI: ["Ignis","Jimny","S-Cross","Swift","Vitara","ANDERES"],
  JEEP: ["Avenger","Cherokee","Compass","Gladiator","Grand Cherokee","Renegade","Wrangler","ANDERES"],
  "LAND ROVER": ["Defender","Discovery","Discovery Sport","Range Rover","Range Rover Evoque","Range Rover Sport","Range Rover Velar","ANDERES"],
  JAGUAR: ["E-PACE","F-PACE","F-TYPE","I-PACE","XE","XF","ANDERES"],
  DACIA: ["Bigster","Duster","Jogger","Logan","Sandero","Spring","ANDERES"],
  "ALFA ROMEO": ["Giulia","Giulietta","MiTO","Stelvio","Tonale","ANDERES"],
  POLESTAR: ["1","2","3","4","ANDERES"],
  SMART: ["#1","#3","EQ forfour","EQ fortwo","ANDERES"],
  "ASTON MARTIN": ["DB11","DB12","DBS","DBX","Vantage","ANDERES"],
  BENTLEY: ["Bentayga","Continental GT","Flying Spur","Mulsanne","ANDERES"],
  FERRARI: ["296","488","812","F8","Portofino","Roma","SF90","ANDERES"],
  LAMBORGHINI: ["Huracan","Revuelto","Urus","ANDERES"],
  LEXUS: ["ES","GS","IS","LC","LS","LX","NX","RX","UX","ANDERES"],
  MASERATI: ["Ghibli","GranTurismo","Grecale","Levante","MC20","Quattroporte","ANDERES"],
  ABARTH: ["124","500","595","695","ANDERES"],
  DODGE: ["Challenger","Charger","Durango","RAM 1500","ANDERES"],
  IVECO: ["Daily 35S","Daily 50C","Daily 65C","Daily 70C","Eurocargo","Stralis","ANDERES"],
  MAN: ["TGE","TGL","TGM","TGS","TGX","ANDERES"],
  SPRINTER: ["213 CDI","216 CDI","313 CDI","316 CDI","413 CDI","416 CDI","519 CDI","ANDERES"],
};

export const BASE_YEARS = Array.from({ length: 37 }, (_, i) => String(2026 - i));

export const QUANTITIES = ["1 STÜCK", "2 STÜCK", "4 STÜCK", "6 STÜCK", "8 STÜCK"];

export const CAR_COLORS: { label: string; hex: string | null }[] = [
  { label: "WEISS", hex: "#F5F5F5" },
  { label: "SCHWARZ", hex: "#1A1A1A" },
  { label: "SILBER", hex: "#C0C0C0" },
  { label: "GRAU", hex: "#808080" },
  { label: "DUNKELGRAU", hex: "#404040" },
  { label: "BLAU", hex: "#1C5FA8" },
  { label: "DUNKELBLAU", hex: "#0A1F6B" },
  { label: "HELLBLAU", hex: "#6EB4E8" },
  { label: "ROT", hex: "#CC1111" },
  { label: "DUNKELROT", hex: "#7A0000" },
  { label: "BORDEAUX", hex: "#6D1A29" },
  { label: "GRÜN", hex: "#2D7A2D" },
  { label: "KHAKI / OLIV", hex: "#6B7645" },
  { label: "BEIGE", hex: "#D4C29A" },
  { label: "BRAUN", hex: "#7A5230" },
  { label: "ORANGE", hex: "#D4600A" },
  { label: "GELB", hex: "#E0C000" },
  { label: "ANDERE FARBE", hex: null },
];

export const RIM_SIZES = ['14"','15"','16"','17"','18"','19"','20"','21"','22"','23"'];

export const RIM_COLORS: { label: string; hex: string | null; finish?: string | null }[] = [
  { label: "SILBER", hex: "#C0C0C0", finish: null },
  { label: "SCHWARZ", hex: "#181818", finish: null },
  { label: "ANTHRAZIT", hex: "#404040", finish: null },
  { label: "WEISS", hex: "#F0F0F0", finish: null },
  { label: "BRONZE", hex: "#8B6914", finish: null },
  { label: "GOLD", hex: "#C5A028", finish: null },
  { label: "BICOLOR", hex: null, finish: "bicolor" },
  { label: "POLIERT", hex: "#E0E0E0", finish: "polished" },
  { label: "ANDERE", hex: null, finish: null },
];

export const RIM_FINISHES = ["GLANZ", "MATT", "POLIERT"];

export const ANFRAGE_CATEGORIES = [
  { id: "tires", title: "NEUE REIFEN", sub: "VERKAUF & MONTAGE", icon: "01" },
  { id: "wheels", title: "KOMPLETTRAD", sub: "FELGEN MIT REIFEN", icon: "02" },
  { id: "rims", title: "FELGEN", sub: "OHNE REIFEN", icon: "03" },
  { id: "repair", title: "REPARATUR", sub: "FELGENREPARATUR & LACK", icon: "04" },
  { id: "other", title: "SONSTIGES", sub: "SERVICE & ANFRAGEN", icon: "05" },
];

export const BRANCHES = [
  { name: "OFTRINGEN", sub: "Perry Center" },
  { name: "LANGENTHAL", sub: "Meilenstein" },
];

export type QuestionType =
  | "tiles"
  | "multi-tiles"
  | "multi-tiles-with-images"
  | "tire-size"
  | "tire-brand"
  | "vehicle-input"
  | "file"
  | "textarea"
  | "text"
  | "rim-size"
  | "rim-color"
  | "vehicle-color"
  | "typen-genehmigung";

export interface Question {
  id: string;
  type: QuestionType;
  q: string;
  sub?: string;
  options?: string[] | { label: string; image?: string }[];
  placeholder?: string;
  conditionalOnTypen?: boolean;
}

export const QUESTIONS: Record<string, Question[]> = {
  tires: [
    { id: "dims", type: "tire-size", q: "REIFENGRÖSSE", sub: "SIEHE REIFENFLANKE" },
    { id: "season", type: "tiles", q: "SAISON", options: ["SOMMER", "WINTER", "GANZJAHRESREIFEN"] },
    { id: "quantity", type: "tiles", q: "ANZAHL", options: QUANTITIES },
    { id: "price", type: "multi-tiles", q: "PREISKLASSE", sub: "MEHRAUSWAHL MÖGLICH", options: ["BUDGET", "MITTEL", "PREMIUM"] },
    { id: "brand", type: "tire-brand", q: "WUNSCHMARKE", sub: "OPTIONAL — KLICK ODER ÜBERSPRINGEN" },
    { id: "vehicle", type: "vehicle-input", q: "FAHRZEUGDATEN" },
    { id: "docs", type: "file", q: "FAHRZEUGAUSWEIS", sub: "OPTIONAL (HILFT SEHR)" },
  ],
  wheels: [
    { id: "season", type: "tiles", q: "SAISON", options: ["SOMMER", "WINTER", "GANZJAHRESREIFEN"] },
    { id: "quality", type: "multi-tiles", q: "REIFEN QUALITÄT", options: ["BUDGET", "MITTEL", "PREMIUM"] },
    { id: "tpms", type: "tiles", q: "RDKS SENSOREN", options: ["MIT", "OHNE", "WEISS NICHT"] },
    { id: "type", type: "multi-tiles-with-images", q: "MATERIAL", options: [{ label: "ALUMINIUM" }, { label: "STAHL" }] },
    { id: "rimsize", type: "rim-size", q: "WUNSCH-ZOLLGRÖSSE", sub: "MAX. 2 GRÖSSEN WÄHLBAR — OPTIONAL" },
    { id: "rimcolor", type: "rim-color", q: "WUNSCHFARBE FELGE", sub: "OPTIONAL" },
    { id: "carcolor", type: "vehicle-color", q: "FAHRZEUGFARBE", sub: "FÜR DIE FELGEN-VISUALISIERUNG — OPTIONAL" },
    { id: "vehicle", type: "vehicle-input", q: "FAHRZEUGDATEN" },
    { id: "typen", type: "typen-genehmigung", q: "FAHRZEUGAUSWEIS", sub: "TYPENGENEHMIGUNG PRÜFEN" },
    { id: "docs", type: "file", q: "DOKUMENTE HOCHLADEN", sub: "FAHRZEUGAUSWEIS + ggf. COC", conditionalOnTypen: true },
  ],
  rims: [
    { id: "dims", type: "tire-size", q: "AKTUELLE REIFENGRÖSSE", sub: "FÜR KOMPATIBILITÄTSPRÜFUNG — SIEHE REIFENFLANKE" },
    { id: "season", type: "tiles", q: "SAISON", options: ["SOMMER", "WINTER"] },
    { id: "tpms", type: "tiles", q: "RDKS SENSOREN", options: ["MIT", "OHNE", "WEISS NICHT"] },
    { id: "type", type: "multi-tiles-with-images", q: "MATERIAL", options: [{ label: "ALUMINIUM" }, { label: "STAHL" }] },
    { id: "rimsize", type: "rim-size", q: "WUNSCH-ZOLLGRÖSSE", sub: "MAX. 2 GRÖSSEN WÄHLBAR — OPTIONAL" },
    { id: "rimcolor", type: "rim-color", q: "WUNSCHFARBE FELGE", sub: "OPTIONAL" },
    { id: "carcolor", type: "vehicle-color", q: "FAHRZEUGFARBE", sub: "OPTIONAL" },
    { id: "vehicle", type: "vehicle-input", q: "FAHRZEUGDATEN" },
    { id: "typen", type: "typen-genehmigung", q: "FAHRZEUGAUSWEIS", sub: "TYPENGENEHMIGUNG PRÜFEN" },
    { id: "docs", type: "file", q: "DOKUMENTE HOCHLADEN", sub: "FAHRZEUGAUSWEIS + ggf. COC", conditionalOnTypen: true },
  ],
  repair: [
    { id: "images", type: "file", q: "FOTOS VOM SCHADEN", sub: "BILD VOM SCHADEN & GANZES RAD" },
    { id: "count", type: "tiles", q: "ANZAHL FELGEN", options: ["1", "2", "3", "4"] },
    { id: "type", type: "tiles", q: "REPARATUR ART", options: ["SMART (GÜNSTIG)", "PREMIUM (WIE NEU)", "BEIDE ZUM VERGLEICH"] },
    { id: "color", type: "tiles", q: "FARBE FELGE", options: ["SILBER / POLIERT", "SCHWARZ MATT", "SCHWARZ GLANZ", "ANTHRAZIT", "WEISS", "ANDERE"] },
  ],
  other: [
    { id: "subject", type: "tiles", q: "BETREFF", options: ["MONTAGE", "EINLAGERUNG", "REPARATUR", "BERATUNG", "SONSTIGES"] },
    { id: "message", type: "textarea", q: "NACHRICHT", placeholder: "SCHREIB UNS..." },
    { id: "docs", type: "file", q: "ANHANG", sub: "OPTIONAL" },
  ],
};

export const CYCLE_WORDS = ["Reifen", "Felgen", "Kompletträder", "Reparatur", "Einlagerung"];

// ── Webhook Payload Builder ──

const CATEGORY_DE: Record<string, string> = {
  tires: "Neue Reifen",
  wheels: "Komplettrad",
  rims: "Felgen",
  repair: "Reparatur",
  other: "Sonstiges",
};

export function buildGermanPayload(selection: {
  branch: string;
  category: string;
  answers: Record<string, any>;
  contact: { salutation: string; fname: string; lname: string; email: string; tel: string; comment: string };
}): Record<string, string> {
  const a = selection.answers || {};
  const c = selection.contact;
  const result: Record<string, string> = {};

  result["Filiale"] = selection.branch || "";
  result["Kategorie"] = CATEGORY_DE[selection.category] || selection.category || "";

  if (a.dims) {
    if (a.dims.width && a.dims.height && a.dims.inch) {
      result["Reifengrösse"] = `${a.dims.width}/${a.dims.height} R${a.dims.inch}`;
    } else {
      if (a.dims.width) result["Reifenbreite (mm)"] = a.dims.width;
      if (a.dims.height) result["Reifenhöhe (%)"] = a.dims.height;
      if (a.dims.inch) result["Felgenzoll"] = a.dims.inch;
    }
  }
  if (a.dims_rear) {
    if (a.dims_rear.width && a.dims_rear.height && a.dims_rear.inch) {
      result["Reifengrösse Hinterachse"] = `${a.dims_rear.width}/${a.dims_rear.height} R${a.dims_rear.inch}`;
    }
  }
  if (a.season) result["Saison"] = a.season;
  if (a.quantity) result["Anzahl"] = a.quantity;
  if (a.price) result["Preisklasse"] = Array.isArray(a.price) ? a.price.join(", ") : a.price;
  if (a.quality) result["Reifenqualität"] = Array.isArray(a.quality) ? a.quality.join(", ") : a.quality;
  if (a.brand) {
    const brands = Array.isArray(a.brand) ? a.brand : [a.brand];
    if (brands.length) result["Wunschmarke Reifen"] = brands.join(", ");
  }

  if (a.vehicle) {
    if (a.vehicle.brand) result["Fahrzeugmarke"] = a.vehicle.brand;
    if (a.vehicle.model) result["Fahrzeugmodell"] = a.vehicle.model;
    if (a.vehicle.year) result["Baujahr"] = a.vehicle.year;
  }

  if (a.tpms) result["RDKS Sensoren"] = a.tpms;
  if (a.type && selection.category !== "repair") result["Material"] = Array.isArray(a.type) ? a.type.join(", ") : a.type;
  if (a.rimsize) {
    const sizes = Array.isArray(a.rimsize) ? a.rimsize : [a.rimsize];
    if (sizes.length) result["Wunsch-Zollgrösse"] = sizes.join(", ");
  }
  if (a.rimcolor) {
    const rc = a.rimcolor;
    let rimColorStr = rc.color || "";
    if (rc.finish && !["BICOLOR", "POLIERT", "ANDERE", ""].includes(rc.color || "")) rimColorStr += ` – ${rc.finish}`;
    if (rc.custom) rimColorStr = rc.custom;
    if (rimColorStr) result["Felgenfarbe"] = rimColorStr;
  }
  if (a.carcolor) {
    const cc = a.carcolor;
    const colorStr = cc.custom || cc.label || "";
    if (colorStr) result["Fahrzeugfarbe"] = colorStr;
  }

  if (a.typen) {
    if (a.typen.typen) result["Typengenehmigung"] = a.typen.typen;
    if (a.typen.stamm) result["Stammnummer"] = a.typen.stamm;
  }

  if (a.count) result["Anzahl Felgen"] = a.count;
  if (a.color && selection.category === "repair") result["Farbe Felge"] = a.color;
  if (a.type && selection.category === "repair") result["Reparaturart"] = Array.isArray(a.type) ? a.type.join(", ") : a.type;

  if (a.subject) result["Betreff"] = a.subject;
  if (a.message) result["Nachricht"] = a.message;

  if (a.docs && Array.isArray(a.docs) && a.docs.length > 0)
    result["Dokumente"] = a.docs.map((f: any) => f.name).join(", ");
  if (a.images && Array.isArray(a.images) && a.images.length > 0)
    result["Fotos"] = a.images.map((f: any) => f.name).join(", ");

  if (c.salutation) result["Anrede"] = c.salutation;
  result["Vorname"] = c.fname || "";
  result["Nachname"] = c.lname || "";
  result["E-Mail"] = c.email || "";
  result["Telefon"] = c.tel || "";
  if (c.comment) result["Kommentar"] = c.comment;

  return result;
}

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

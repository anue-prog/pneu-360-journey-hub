export const siteConfig = {
  firmaName: "Pneu 360",
  firmaUrl: "https://pneu360.ch",
  firmaTelefon: "062 552 55 55",
  firmaEmail: "anfrage@pneu360.ch",
  firmaInstagram: "https://www.instagram.com/pneu_360",
  firmaTiktok: "https://www.tiktok.com/@pneu_360",
  firmaFacebook: "https://www.facebook.com/share/1AVynXmTSY/",
  reviewScore: "4.9",
  reviewCount: "120",
  reviewSource: "Google",
};

export const usps = [
  { icon: "clock", titel: "Ohne Termin", text: "Einfach vorbeikommen – an beiden Standorten, auch samstags." },
  { icon: "zap", titel: "5–10 Minuten", text: "Radwechsel in 5–10 Min. Reifenmontage in ca. 20 Min." },
  { icon: "monitor", titel: "Digitaler Live-Status", text: "Dein Auto wird bei der Ankunft digital erfasst. Du siehst den Status live auf dem Bildschirm." },
  { icon: "mail", titel: "E-Mail wenn fertig", text: "Geh einkaufen – wir schicken dir eine E-Mail, sobald dein Auto fertig ist." },
  { icon: "coffee", titel: "Kaffee & Einkaufen", text: "Kostenloser Kaffee. Oder die Wartezeit im Perry Center bzw. Meilenstein nutzen." },
  { icon: "mapPin", titel: "2 Standorte", text: "Oftringen und Langenthal – mit über 100 Jahren Fachwissen im Team." },
];

export const services = [
  { nr: "01", titel: "Radwechsel", text: "Saisonaler Wechsel in 5–10 Min. Inkl. Luftdruck-Reset und Auswuchten.", href: "/radwechsel", tag: "5–10 Min." },
  { nr: "02", titel: "Reifenwechsel", text: "Reifen ab- und aufziehen – neue oder bestehende. Ca. 20 Min. inkl. Auswuchten.", href: "/reifenwechsel", tag: "Inkl. Auswuchten" },
  { nr: "03", titel: "Reifenhotel", text: "Klimatisiert, versichert und gereinigt gelagert – du kommst, wann's dir passt.", href: "/reifenhotel", tag: "Versichert" },
  { nr: "04", titel: "Felgen & Kompletträder", text: "Grosse Auswahl Alu- und Stahlfelgen – viele ohne MFK. Sofort montiert.", href: "/reifen", tag: "Ohne MFK" },
  { nr: "05", titel: "Autoreinigung", text: "Dein Auto – innen, aussen oder beides. Sauber und professionell.", href: "/autoreinigung", tag: "Innen & Aussen" },
  { nr: "06", titel: "Felgenreparatur", text: "Bordsteinschäden, Kratzer oder Neulackierung – deine Felgen wie neu.", href: "/felgenreparatur", tag: "Wie neu" },
  { nr: "07", titel: "Reifenreparatur", text: "Nagel oder Schraube? Minicombi-Reparatur – dauerhaft, kein Notbehelf.", href: "/reifenreparatur", tag: "Dauerhaft" },
  { nr: "08", titel: "Fleetpartner", text: "Individuelle Konditionen für Firmenflotten – persönlich, schnell und transparent.", href: "/fleetpartner", tag: "Für Firmen" },
];

export const preise = [
  {
    service: "Komplettradwechsel (4 Räder)",
    items: [
      { groesse: "PW", preis: "CHF 65" },
      { groesse: 'SUV ab 19"', preis: "CHF 75" },
      { groesse: "Bus/LLKW", preis: "CHF 85" },
    ],
  },
  {
    service: "Reifenwechsel inkl. Auswuchten (4 Reifen)",
    items: [
      { groesse: 'Bis 16"', preis: "CHF 90" },
      { groesse: '17/18"', preis: "CHF 110" },
      { groesse: '19/20"', preis: "CHF 120" },
      { groesse: '21"', preis: "CHF 140" },
      { groesse: 'Ab 22"', preis: "CHF 160" },
    ],
  },
  {
    service: "Einlagerung pro Saison (4 Stk.)",
    items: [
      { groesse: 'Reifen bis 20"', preis: "CHF 60" },
      { groesse: 'Räder bis 20"', preis: "CHF 70" },
      { groesse: 'Ab 21"', preis: "ab CHF 80" },
    ],
  },
];

export const reifenSortiment = [
  { titel: "Sommerreifen", text: "Ab 7°C aufwärts: optimaler Grip, kürzerer Bremsweg, weniger Verschleiss.", href: "/sommerreifen", saison: "Frühling – Herbst" },
  { titel: "Winterreifen", text: "Unter 7°C unverzichtbar: Alpine-Symbol für Grip auf Schnee und Eis.", href: "/winterreifen", saison: "Oktober – Ostern" },
  { titel: "Ganzjahresreifen", text: "Ein Kompromiss für beide Saisons. Ideal für Wenig- und Stadtfahrer.", href: "/ganzjahresreifen", saison: "Ganzjährig" },
  { titel: "Offroadreifen", text: "AT- und MT-Reifen für Gelände, Schotter und Abenteuer. Robust und vielseitig.", href: "/offroadreifen", saison: "Ganzjährig" },
];

export const felgen = [
  { titel: "Sommerkompletträder", text: "Felgen mit Sommerreifen – sofort fahrbereit.", href: "/reifen" },
  { titel: "Winterkompletträder", text: "Sicher auf Schnee, grosse Auswahl MFK-frei.", href: "/reifen" },
  { titel: "Alufelgen", text: "Von ausgefallen bis schlicht – für jeden Geschmack.", href: "/reifen" },
  { titel: "MFK-freie Felgen", text: "Sehr grosse Auswahl ohne MFK-Abnahme.", href: "/reifen" },
];

export const marken = [
  "Continental", "Michelin", "Pirelli", "Bridgestone", "Goodyear",
  "Hankook", "Nokian", "Yokohama", "Dunlop", "Falken",
];

export const reviews = [
  { text: "Ich bin absolut begeistert von meiner Erfahrung bei Pneu 360! Das Team war unglaublich freundlich und professionell. Mein Reifenwechsel wurde in Rekordzeit erledigt, und die Beratung war erstklassig. Ich kann Pneu 360 nur wärmstens empfehlen!", name: "DN OFM" },
  { text: "Sehr nettes, zuvorkommendes Personal. Schneller, unkomplizierter Service. Preis-Leistung stimmt. Komme gerne wieder!", name: "Katrin Gerber" },
  { text: "The best service and quality. Very friendly and professional team. Highly recommended!", name: "Bes Limani" },
  { text: "Top Personal, Top Service. Schnell, freundlich und fair. So muss ein Reifenservice sein!", name: "Peter Felder" },
  { text: "Super Team! Sehr freundlich und kompetent. Radwechsel war in wenigen Minuten erledigt. Absolut empfehlenswert.", name: "Guli Rashid" },
  { text: "Super schnell, super freundlich. Radwechsel in 10 Minuten – und der Kaffee war auch gut!", name: "Marco S." },
  { text: "Endlich ein Reifenservice ohne Termin. Komme jetzt immer her, auch samstags.", name: "Sandra M." },
  { text: "Faire Preise, top Beratung, unkompliziert. Klare Empfehlung für Oftringen und Umgebung.", name: "Thomas B." },
];

export const standorte = [
  {
    name: "Oftringen",
    slug: "oftringen",
    adresse: "Bernstrasse 1, 4665 Oftringen",
    telefon: "062 552 55 55",
    email: "anfrage@pneu360.ch",
    maps: "https://maps.google.com/?q=Pneu+360+Perry+Center+Oftringen",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.5!2d7.9267!3d47.3139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPneu+360+Oftringen!5e0!3m2!1sde!2sch!4v1700000000000",
    oeffnungszeiten: "Mo–Fr 08:30–12:00 & 13:15–19:00\nSa 08:00–12:00 & 13:15–16:00",
    detail: "Direkt beim Perry Center – viele Parkplätze, kostenloses WLAN. Während der Wartezeit im Shoppingcenter einkaufen oder einen Kaffee geniessen. Unter der Woche bis 19:00 Uhr geöffnet.",
    beschreibung: "Unser Hauptstandort in Oftringen liegt direkt beim Perry Center – einem der bekanntesten Einkaufszentren der Region. Seit über 40 Jahren ist dieser Standort eine feste Grösse für Reifenservice im Mittelland. Hier erwartet dich ein professionelles Team mit jahrzehntelanger Erfahrung, Express-Service ohne Termin und modernste Technik. Während dein Fahrzeug versorgt wird, geniesst du einen kostenlosen Kaffee oder erledigst Einkäufe im Perry Center – bequemer geht's nicht.",
    highlights: [
      { icon: "ShoppingBag", titel: "Perry Center Nähe", text: "Einkaufen, essen oder Kaffee trinken während des Services." },
      { icon: "Zap", titel: "Express ohne Termin", text: "Radwechsel in 5–10 Minuten, auch samstags." },
      { icon: "Wifi", titel: "Kostenloses WLAN", text: "Verbinde dich im Wartebereich mit unserem WLAN." },
      { icon: "ParkingCircle", titel: "Viele Parkplätze", text: "Grosszügige Parkflächen direkt vor dem Geschäft." },
    ],
    metaTitle: "Pneu 360 Oftringen – Reifenservice beim Perry Center | Ohne Termin",
    metaDescription: "Reifenwechsel, Radwechsel und Reifenhotel in Oftringen beim Perry Center. Express-Service ohne Termin, auch samstags. Über 40 Jahre Erfahrung.",
    team: [
      { name: "Platzhalter", rolle: "Filialleiter", initialen: "PH" },
      { name: "Platzhalter", rolle: "Reifentechniker", initialen: "PH" },
      { name: "Platzhalter", rolle: "Kundenberater", initialen: "PH" },
    ],
  },
  {
    name: "Langenthal",
    slug: "langenthal",
    adresse: "Lotzwilstrasse 66, 4900 Langenthal",
    telefon: "032 552 55 55",
    email: "langenthal@pneu360.ch",
    maps: "https://maps.google.com/?q=Meilenstein+Langenthal",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2710.5!2d7.7867!3d47.3508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMeilenstein+Langenthal!5e0!3m2!1sde!2sch!4v1700000000000",
    oeffnungszeiten: "Mo–Fr 08:00–12:00 & 13:00–18:00\nSa 08:00–12:00",
    detail: "Im Meilenstein Langenthal – ein einzigartiger Komplex mit Hotel, Restaurant, Formel-1-Museum und Bowling. Zentral im Oberaargau, ideal ab Autobahnausfahrt Niederbipp.",
    beschreibung: "Unser Standort in Langenthal befindet sich im Meilenstein – einem einzigartigen Erlebniskomplex mit Hotel, Restaurants, Formel-1-Museum und Bowling. Zentral im Oberaargau gelegen, erreichst du uns ideal ab der Autobahnausfahrt Niederbipp. Auch hier bieten wir den vollen Pneu 360 Service: Radwechsel, Reifenmontage, Einlagerung, Felgenverkauf und vieles mehr – schnell, persönlich und ohne Termin.",
    highlights: [
      { icon: "Trophy", titel: "Meilenstein Erlebnis", text: "Hotel, Restaurant, Formel-1-Museum und Bowling unter einem Dach." },
      { icon: "Zap", titel: "Express ohne Termin", text: "Radwechsel in 5–10 Minuten, auch samstags." },
      { icon: "Car", titel: "Top Anbindung", text: "Direkt ab Autobahnausfahrt Niederbipp erreichbar." },
      { icon: "Utensils", titel: "Gastronomie vor Ort", text: "Restaurant und Café direkt im Gebäude." },
    ],
    metaTitle: "Pneu 360 Langenthal – Reifenservice im Meilenstein | Ohne Termin",
    metaDescription: "Reifenwechsel, Radwechsel und Reifenhotel in Langenthal im Meilenstein. Express-Service ohne Termin. Restaurant, Museum und Bowling während der Wartezeit.",
    team: [
      { name: "Platzhalter", rolle: "Filialleiter", initialen: "PH" },
      { name: "Platzhalter", rolle: "Reifentechniker", initialen: "PH" },
      { name: "Platzhalter", rolle: "Kundenberater", initialen: "PH" },
    ],
  },
];

export const faqs = [
  { q: "Brauche ich einen Termin?", a: "Nein! An beiden Standorten ohne Termin – auch samstags." },
  { q: "Wo finde ich euch?", a: "Oftringen: Bernstrasse 1, direkt beim Perry Center. Langenthal: Lotzwilstrasse 66, im Meilenstein." },
  { q: "Was kostet ein Radwechsel?", a: 'Komplettradwechsel ab CHF 65 (PW). Reifenwechsel inkl. Auswuchten ab CHF 90 (bis 16"). Alle Preise inkl. MwSt.' },
  { q: "Wie lange dauert es?", a: "Radwechsel: 5–10 Min. Reifenmontage: ca. 20 Min. Jeweils inkl. Auswuchten." },
  { q: "Was mache ich während der Wartezeit?", a: "Oftringen: Kostenloser Kaffee und Einkaufen im Perry Center. Langenthal: Restaurant, Formel-1-Museum oder Bowling im Meilenstein." },
  { q: "Habt ihr Reifen am Lager?", a: "Ja – Tausende Reifen von Budget bis Premium. Nicht vorrätig? Innerhalb 24h organisiert." },
  { q: "Bietet ihr Autoreinigung an?", a: "Ja! Innen- und Aussenreinigung, Ozonbehandlung, Sitzwäsche, Tierhaar-Entfernung. Auch Abhol-/Bringservice." },
  { q: "Kann ich Reifen bei euch einlagern?", a: "Ja – klimatisiert, versichert, mit Reinigung und Profiltiefe-Check." },
  { q: "Brauchen eure Felgen eine MFK?", a: "Viele Modelle sind CH-homologiert und brauchen keine MFK. Bei anderen helfen wir beim Eintragungsprozess." },
  { q: "Welche Reifenmarken führt ihr?", a: "Continental, Michelin, Pirelli, Bridgestone, Goodyear, Hankook, Nokian, Yokohama und viele mehr – von Budget bis Premium." },
  { q: "Welche Zahlungsmittel akzeptiert ihr?", a: "Bar, EC (Maestro/V PAY), Kreditkarte (Visa, Mastercard), TWINT." },
  { q: "Sind die Öffnungszeiten an beiden Standorten gleich?", a: "Fast: Oftringen hat unter der Woche bis 19:00 Uhr geöffnet, Langenthal bis 18:00 Uhr. Samstag sind beide offen." },
  { q: "Gibt es einen Abhol-/Bringservice?", a: "Ja – für Autoreinigung und auf Anfrage auch für grössere Aufträge. Einfach anrufen." },
  { q: "Kann ich Reinigung und Radwechsel kombinieren?", a: "Ja – sehr beliebt! Räder wechseln lassen und das Auto gleich reinigen. Spart Zeit und das Auto ist rundum gepflegt." },
  { q: "Prüft ihr auch RDKS-Sensoren?", a: "Ja – Reifendrucksensoren prüfen, kalibrieren und ersetzen. Bei jedem Radwechsel kontrollieren wir den RDKS-Status." },
];

export const trustNumbers = [
  { end: 100, suffix: "+", label: "Jahre Erfahrung" },
  { end: 2, suffix: "×", label: "Standorte" },
  { end: 0, suffix: "", label: "Termin nötig", display: "Kein" },
  { end: 40, suffix: "+", label: "Jahre Perry Center" },
];

export const conciergeSteps = [
  { nr: "01", text: "Ankunft – Fahrzeug wird draussen digital erfasst" },
  { nr: "02", text: "Service – Live-Status auf dem Bildschirm im Wartebereich" },
  { nr: "03", text: "Fertig – du bekommst eine E-Mail" },
];

export const conciergeLocations = [
  { ort: "Oftringen", tipp: "Im Perry Center einkaufen oder Kaffee trinken" },
  { ort: "Langenthal", tipp: "Restaurant, Museum oder Bowling im Meilenstein" },
];

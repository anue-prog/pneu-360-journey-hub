import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, SearchCheck, ShieldCheck, ArrowRight, Crosshair, ScanEye, Plug, Gauge, Check, X } from "lucide-react";

import ServicePageHero from "@/components/shared/ServicePageHero";
import BenefitsList from "@/components/shared/BenefitsList";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import reifenGanzjahr from "@/assets/reifen-ganzjahr.webp";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Data ── */

const schnellInfos = [
  {
    icon: Zap,
    title: "Ohne Termin",
    desc: "Nagel im Reifen? Einfach vorbeikommen – wir helfen sofort. Kein Anruf, kein Warten. Auch samstags an beiden Standorten.",
  },
  {
    icon: SearchCheck,
    title: "Minicombi-System",
    desc: "Wir reparieren nach Industriestandard mit dem Minicombi-Verfahren: Der Reifen wird von innen geflickt, nicht nur provisorisch abgedichtet.",
  },
  {
    icon: ShieldCheck,
    title: "Ehrliche Diagnose",
    desc: "Nicht jeder Schaden ist reparierbar. Wir prüfen den Reifen von innen und aussen und sagen dir ehrlich, ob eine Reparatur sicher ist – oder ein Ersatz sinnvoller.",
  },
];

const PRICE = { label: "Minicombi-Reparatur", price: "CHF 55", sub: "pro Reifen" };

const EXTRAS = [
  { label: "Altreifenentsorgung (falls Ersatz nötig)", price: "CHF 5 / Reifen" },
];

const BENEFITS = [
  "Ohne Termin – Soforthilfe an beiden Standorten",
  "Reparatur nach Industriestandard (Minicombi)",
  "Reifen wird von innen und aussen geprüft",
  "Ehrliche Einschätzung: Reparatur oder Ersatz?",
  "Reifenwulst- und Seitenwandprüfung",
  "Endkontrolle mit Drucktest",
  "Auch samstags geöffnet",
];

const STEPS = [
  {
    nr: "01",
    title: "Diagnose",
    text: "Wir demontieren den Reifen und prüfen ihn von innen und aussen. So erkennen wir, ob der Schaden reparierbar ist oder ob ein Ersatz nötig ist.",
  },
  {
    nr: "02",
    title: "Minicombi-Reparatur",
    text: "Bei reparablen Schäden flicken wir den Reifen von innen mit dem Minicombi-Verfahren – dauerhaft und sicher, nicht nur ein provisorisches Pflaster.",
  },
  {
    nr: "03",
    title: "Endkontrolle & Drucktest",
    text: "Der reparierte Reifen wird auf Dichtheit geprüft, der Luftdruck nach Herstellervorgabe eingestellt und das Rad wieder montiert. Fertig.",
  },
];

const FACHBLOECKE = [
  {
    icon: Crosshair,
    title: "Schadenslokalisierung",
    text: "Wir finden den Einstichpunkt, prüfen die Grösse und Position. Nur Schäden in der Lauffläche bis max. 6 mm Durchmesser sind reparierbar.",
  },
  {
    icon: ScanEye,
    title: "Innere Struktur",
    text: "Der Reifen wird von der Felge genommen und von innen inspiziert. Verdeckte Schäden an der Karkasse oder Seitenwand erkennen wir nur so – nicht von aussen.",
  },
  {
    icon: Plug,
    title: "Minicombi-Verfahren",
    text: "Ein Kombinationspilz aus Dichtmaterial und Stopfen wird von innen eingesetzt und vulkanisiert. Das Ergebnis ist dauerhaft dicht – kein Vergleich mit einem Pannenspray.",
  },
  {
    icon: Gauge,
    title: "Endkontrolle & Drucktest",
    text: "Nach der Reparatur prüfen wir die Dichtheit im Wasserbad, stellen den Luftdruck korrekt ein und montieren das Rad mit Drehmomentschlüssel.",
  },
];

const REPARIERBAR = [
  "Nagel oder Schraube in der Lauffläche",
  "Kleiner Durchstich (bis 6 mm)",
  "Einzelner Fremdkörper ohne Folgeschaden",
];

const NICHT_REPARIERBAR = [
  "Seitenwand-Schäden",
  "Grosse oder ausgefranste Löcher",
  "Strukturrisse oder Beulen",
  "Schaden nahe der Reifenwulst",
  "Reifen mit zu wenig Restprofil",
];

const locations = [
  {
    name: "Oftringen",
    sub: "Perry Center · Bernstrasse 1, 4665 Oftringen",
    hours: "Mo–Fr 08:30–19:00 · Sa 08:00–16:00",
  },
  {
    name: "Langenthal",
    sub: "Meilenstein · Lotzwilstrasse 66, 4900 Langenthal",
    hours: "Mo–Fr 08:00–18:00 · Sa 08:00–16:00",
  },
];

const FAQS = [
  { q: "Kann jeder Reifenschaden repariert werden?", a: "Nein. Nur Durchstiche in der Lauffläche bis ca. 6 mm sind sicher reparierbar. Seitenwandschäden, grosse Löcher oder Strukturrisse bedeuten: neuer Reifen. Wir prüfen das ehrlich und beraten dich." },
  { q: "Was ist das Minicombi-System?", a: "Ein Industriestandard-Verfahren: Der Reifen wird von innen mit einem Kombinationspilz aus Dichtmaterial und Stopfen geflickt und vulkanisiert. Das ist dauerhaft dicht – kein Pannenspray, kein Provisorium." },
  { q: "Wie lange dauert eine Reifenreparatur?", a: "In der Regel 15–20 Minuten. Wenn wir einen Ersatzreifen montieren müssen, dauert es etwas länger – aber auch das geht ohne Termin." },
  { q: "Was kostet eine Reifenreparatur?", a: "CHF 55 pro Reifen für die Minicombi-Reparatur. Falls ein Ersatzreifen nötig ist, beraten wir dich zu den Optionen – transparent und ohne Druck." },
  { q: "Brauche ich einen Termin?", a: "Nein. Einfach vorbeikommen – auch samstags, an beiden Standorten. Wir helfen sofort." },
  { q: "Kann ein Runflat-Reifen repariert werden?", a: "Grundsätzlich ja, wenn der Schaden in der Lauffläche liegt und der Reifen nicht plattgefahren wurde. Runflat-Reifen haben verstärkte Seitenwände – wurde damit weitergefahren, können innere Schäden entstanden sein, die eine Reparatur ausschliessen." },
  { q: "Was soll ich tun, wenn ich auf der Autobahn eine Panne habe?", a: "Warnblinker an, Pannendreieck aufstellen, nicht selbst am Reifen arbeiten. Ruf den TCS oder deinen Pannendienst. Wenn du es zu uns schaffst: einfach vorbeikommen, wir helfen sofort." },
  { q: "Wie lange hält eine Minicombi-Reparatur?", a: "Dauerhaft. Eine korrekt durchgeführte Minicombi-Reparatur ist für die gesamte Restlebensdauer des Reifens ausgelegt – inkl. Autobahn-Geschwindigkeiten." },
];

/* ── Page ── */

const Reifenreparatur = () => {
  useEffect(() => {
    document.title = "Reifenreparatur – Soforthilfe ohne Termin | Pneu 360";
  }, []);

  return (
    <>
      <Helmet>
        <meta name="description" content="Reifenreparatur mit Minicombi-System bei Pneu 360. CHF 55 pro Reifen, ohne Termin. Ehrliche Diagnose in Oftringen & Langenthal – auch samstags." />
        <link rel="canonical" href="https://pneu360.ch/reifenreparatur" />
      </Helmet>

      {/* ── 1. Hero ── */}
      <ServicePageHero
        image={reifenGanzjahr}
        alt="Reifenreparatur bei Pneu 360"
        label="Soforthilfe · CHF 55 · Ohne Termin"
        title="Reifen"
        titleAccent="reparatur"
        subtitle="Nagel im Reifen? Wir prüfen, reparieren oder ersetzen – ehrlich, schnell und ohne Termin."
      />

      {/* ── 2. Schnell-Infos ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Reifenreparatur bei Pneu 360</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Schnelle Hilfe,</span><br />
            <span className="font-extrabold text-muted-foreground">ehrliche Diagnose</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {schnellInfos.map((info, i) => (
              <motion.div
                key={info.title}
                {...staggerItem(i)}
                className="border border-border p-8 md:p-10"
              >
                <info.icon className="w-7 h-7 text-brand-accent mb-6" strokeWidth={1.5} />
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-[-0.02em] text-foreground mb-3">
                  {info.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {info.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Reparatur oder Ersatz? ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Ehrliche Diagnose</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase"
            >
              <span className="font-light">Reparatur oder</span><br />
              <span className="font-extrabold text-muted-foreground">Ersatz?</span>
            </motion.h2>
          </div>
          <motion.div {...fadeIn()} className="space-y-5 text-brand-body text-muted-foreground">
            <p>
              Nicht jeder Schaden bedeutet einen neuen Reifen. Bei kleinen Durchstichen in der Lauffläche
              ist eine professionelle Reparatur mit dem Minicombi-System sicher und dauerhaft.
            </p>
            <p>
              Wir demontieren den Reifen und prüfen ihn von innen – nur so lassen sich verdeckte Schäden
              an der Karkasse erkennen. Bei Seitenwandschäden, grossen Löchern oder Strukturrissen
              empfehlen wir dir ehrlich einen Ersatzreifen. Kein Druck, kein Upselling.
            </p>
            <p>
              Wenn ein Ersatz nötig ist, haben wir über 3'000 Reifen aller Marken auf Lager – du fährst
              am selben Tag mit einem neuen Reifen raus.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Preis ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-brand-label text-muted-foreground mb-3">Transparent</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
            >
              <span className="font-light">Ein Preis,</span>{" "}
              <span className="font-extrabold text-muted-foreground">keine Überraschung</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Minicombi-Reparatur zum Festpreis. Demontage, Diagnose, Reparatur und Endkontrolle – alles drin.
            </motion.p>
          </div>

          <motion.div
            {...staggerItem(0)}
            className="flex justify-between items-baseline border-b border-border py-6"
          >
            <div>
              <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] text-foreground">{PRICE.label}</span>
              <span className="text-sm text-muted-foreground font-light ml-3">{PRICE.sub}</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">{PRICE.price}</span>
          </motion.div>

          <motion.div {...fadeIn()} className="mt-8 space-y-2">
            {EXTRAS.map((e) => (
              <div key={e.label} className="flex justify-between items-baseline max-w-md">
                <span className="text-sm text-muted-foreground">{e.label}</span>
                <span className="text-sm text-muted-foreground font-medium">{e.price}</span>
              </div>
            ))}
          </motion.div>

          <p className="text-brand-label text-muted-foreground mt-8">
            Alle Preise inkl. MwSt.
          </p>
        </div>
      </section>

      {/* ── 5. So läuft's + Benefits ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">So läuft's</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-8 md:mb-10"
            >
              <span className="font-light">In drei</span><br />
              <span className="font-extrabold text-muted-foreground">Schritten repariert</span>
            </motion.h2>

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <motion.div key={step.nr} {...staggerItem(i)} className="flex gap-5">
                  <span className="text-brand-accent font-bold text-sm mt-1 flex-shrink-0">{step.nr}</span>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-[-0.02em] text-foreground mb-2">{step.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Inklusive</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-8 md:mb-10"
            >
              <span className="font-light">Das steckt</span><br />
              <span className="font-extrabold text-muted-foreground">drin</span>
            </motion.h2>
            <motion.div {...fadeIn()}>
              <BenefitsList items={BENEFITS} columns={1} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. Was wir prüfen (4 Fachblöcke) ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Fachwissen</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Was wir alles</span><br />
            <span className="font-extrabold text-muted-foreground">prüfen</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {FACHBLOECKE.map((block, i) => (
              <motion.div
                key={block.title}
                {...staggerItem(i)}
                className="border border-border p-8 md:p-10"
              >
                <block.icon className="w-6 h-6 text-brand-accent mb-5" strokeWidth={1.5} />
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-[-0.02em] text-foreground mb-3">
                  {block.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {block.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Reparierbar vs. Nicht reparierbar ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Auf einen Blick</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Wann ist eine Reparatur</span><br />
            <span className="font-extrabold text-muted-foreground">möglich?</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Reparierbar */}
            <motion.div {...staggerItem(0)} className="border border-border p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-brand-accent" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-[-0.02em] text-foreground">Reparierbar</h3>
              </div>
              <ul className="space-y-3">
                {REPARIERBAR.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed">
                    <Check className="w-4 h-4 text-brand-accent flex-shrink-0 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Nicht reparierbar */}
            <motion.div {...staggerItem(1)} className="border border-border p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-[-0.02em] text-foreground">Nicht reparierbar</h3>
              </div>
              <ul className="space-y-3">
                {NICHT_REPARIERBAR.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed">
                    <X className="w-4 h-4 text-destructive flex-shrink-0 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 8. Cross-Sell ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Reifen kaputt?</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase"
            >
              <span className="font-light">Wir haben auch</span><br />
              <span className="font-extrabold text-muted-foreground">Ersatz</span>
            </motion.h2>
          </div>
          <motion.div {...fadeIn()}>
            <div className="space-y-5 text-brand-body text-muted-foreground">
              <p>
                Wenn eine Reparatur nicht mehr sicher ist, bekommst du bei uns direkt einen passenden
                Ersatzreifen – über 3'000 Reifen aller Top-Marken an Lager. Montage und Auswuchten
                erledigen wir gleich mit, du fährst am selben Tag.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/reifen"
                className="inline-flex items-center gap-2 text-brand-label text-brand-accent hover:text-foreground transition-colors group"
              >
                Reifensortiment <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/reifenwechsel"
                className="inline-flex items-center gap-2 text-brand-label text-brand-accent hover:text-foreground transition-colors group"
              >
                Reifenwechsel & Montage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. Standorte ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Soforthilfe vor Ort</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Komm vorbei –</span><br />
            <span className="font-extrabold text-muted-foreground">auch samstags</span>
          </motion.h2>

          <div className="space-y-0">
            {locations.map((loc, i) => (
              <motion.div key={loc.name} {...staggerItem(i)}>
                <Link
                  to={`/standorte/${loc.name.toLowerCase()}`}
                  className="group flex flex-col md:flex-row md:items-center gap-2 md:gap-6 py-6 md:py-7 border-b border-border hover:border-brand-accent/40 transition-all duration-500"
                >
                  <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] uppercase group-hover:text-brand-accent transition-colors duration-500">
                    {loc.name}
                  </span>
                  <span className="text-sm text-muted-foreground flex-1">{loc.sub}</span>
                  <span className="text-xs md:text-sm text-muted-foreground">{loc.hours}</span>
                  <span className="text-brand-accent group-hover:translate-x-1 transition-transform duration-500 hidden md:inline">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <PageFAQ
        items={FAQS}
        stickyLayout
        title="Häufige Fragen"
      />

      {/* ── CTA ── */}
      <InlineCTA
        title="Nagel im Reifen?"
        text="Einfach vorbeikommen – wir helfen sofort, auch ohne Termin. An beiden Standorten, auch samstags."
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: "Reifenreparatur",
                provider: { "@type": "AutoRepair", name: "Pneu 360" },
                description: "Professionelle Reifenreparatur mit Minicombi-System. CHF 55 pro Reifen, ohne Termin.",
                areaServed: ["Oftringen", "Langenthal"],
                offers: [
                  { "@type": "Offer", priceCurrency: "CHF", price: "55", description: "Minicombi-Reparatur pro Reifen" },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: FAQS.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        }}
      />
    </>
  );
};

export default Reifenreparatur;

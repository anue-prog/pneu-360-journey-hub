import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, CalendarOff, Package, ArrowRight, Disc3, Radio, CircleDot, Gauge } from "lucide-react";

import ServicePageHero from "@/components/shared/ServicePageHero";
import BenefitsList from "@/components/shared/BenefitsList";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import PreisrechnerKonfigurator, { PreisrechnerStartButton } from "@/components/preisrechner/PreisrechnerKonfigurator";
import homeFelge from "@/assets/home-felge-detail.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Data ── */

const schnellInfos = [
  {
    icon: Clock,
    title: "In 20 Minuten fertig",
    desc: "Montage, Auswuchten und Ventilwechsel – alles in einem Durchgang. Du trinkst einen Kaffee, wir machen den Rest.",
  },
  {
    icon: CalendarOff,
    title: "Ohne Termin",
    desc: "Einfach vorbeikommen – auch samstags, an beiden Standorten. Kein Anruf, kein Formular.",
  },
  {
    icon: Package,
    title: "Eigene oder neue Reifen",
    desc: "Bring deine Reifen mit oder wähle aus unserem Sortiment vor Ort. Wir montieren beides – schnell und sauber.",
  },
];

const PRICES = [
  { size: 'Bis 16"', price: "CHF 90" },
  { size: '17/18"', price: "CHF 110" },
  { size: '19/20"', price: "CHF 120" },
  { size: '21"', price: "CHF 140" },
  { size: 'Ab 22"', price: "CHF 160" },
];

const EXTRAS = [
  { label: "Neue Reifen mitgebracht (bis 19\")", price: "+ CHF 10 / Rad" },
  { label: "Neue Reifen mitgebracht (ab 20\")", price: "+ CHF 20 / Rad" },
  { label: "Altreifenentsorgung", price: "CHF 5 / Reifen" },
];

const BENEFITS = [
  "Reifen ab- und aufziehen – eigene oder neue",
  "Inkl. Auswuchten und Ventilwechsel",
  "Erledigt in ca. 20 Minuten",
  "Ohne Termin – einfach vorbeikommen",
  "Auch gebrauchte oder mitgebrachte Reifen",
  "RDKS-Sensoren geprüft und kalibriert",
  "Alte Reifen fachgerecht entsorgt",
  "Neue Reifen nötig? Grosse Auswahl vor Ort",
  "An beiden Standorten verfügbar – auch samstags",
];

const FACHBLOECKE = [
  {
    icon: Disc3,
    title: "Montage & Demontage",
    text: "Wir arbeiten mit modernen Montiermaschinen, die deine Felgen schonen. Kein Kratzer, kein Schaden – auch bei empfindlichen Alufelgen.",
  },
  {
    icon: CircleDot,
    title: "Auswuchten",
    text: "Jedes Rad wird nach der Montage elektronisch ausgewuchtet. Das verhindert Vibrationen im Lenkrad und sorgt für gleichmässigen Verschleiss.",
  },
  {
    icon: Radio,
    title: "RDKS & Sensoren",
    text: "Nach der Montage werden die Reifendrucksensoren ausgelesen und bei Bedarf per OBD neu angelernt. Kein Warnlicht, keine Überraschungen.",
  },
  {
    icon: Gauge,
    title: "Ventile & Luftdruck",
    text: "Neue Ventile bei jeder Montage inklusive. Luftdruck wird nach Herstellervorgabe eingestellt – kein Schätzwert.",
  },
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
  { q: "Was ist der Unterschied zum Radwechsel?", a: "Beim Reifenwechsel werden die Reifen von den Felgen demontiert und andere aufgezogen. Beim Radwechsel werden komplette Räder (Reifen + Felge) getauscht – zum Beispiel von Sommer- auf Winterräder." },
  { q: "Was kostet ein Reifenwechsel?", a: "Inkl. Auswuchten: ab CHF 90 (bis 16\"), ab CHF 110 (17/18\"), ab CHF 120 (19/20\"), ab CHF 140 (21\"), ab CHF 160 (ab 22\"). Alle Preise inkl. MwSt." },
  { q: "Wie lange dauert der Reifenwechsel?", a: "Ca. 20 Minuten für 4 Reifen inkl. Auswuchten und Ventilwechsel." },
  { q: "Kann ich meine eigenen Reifen mitbringen?", a: "Klar – wir montieren auch mitgebrachte oder gebrauchte Reifen auf deine Felgen. Aufpreis: CHF 10 pro Rad (bis 19\"), CHF 20 pro Rad (ab 20\")." },
  { q: "Werden die alten Reifen entsorgt?", a: "Ja – fachgerechte Entsorgung ist im Preis inbegriffen." },
  { q: "Prüft ihr den Zustand meiner Reifen?", a: "Ja – bei jedem Reifenwechsel kontrollieren wir Profiltiefe, Alter (DOT) und Zustand. Falls ein Reifen nicht mehr sicher ist, sagen wir dir das ehrlich." },
  { q: "Welche Reifenmarken habt ihr?", a: "Wir führen alle grossen Marken: Michelin, Continental, Bridgestone, Pirelli, Goodyear, Hankook, Yokohama, Falken und viele mehr – von Budget bis Premium." },
  { q: "Kann ich während dem Wechsel warten?", a: "Klar. Bei ca. 20 Minuten lohnt sich ein Kaffee im Perry Center oder Meilenstein. Wir melden uns, wenn alles fertig ist." },
  { q: "Bietet ihr auch Einlagerung an?", a: "Ja – im Reifenhotel ab CHF 60 pro Saison. Klimatisiert, versichert, inkl. Radwäsche. Vor der nächsten Saison erinnern wir dich automatisch." },
];

/* ── Page ── */

const Reifenwechsel = () => {
  const [preisrechnerOpen, setPreisrechnerOpen] = useState(false);

  useEffect(() => {
    document.title = "Reifenwechsel inkl. Auswuchten – Ab CHF 90 | Pneu 360";
  }, []);

  return (
    <>
      <Helmet>
        <meta name="description" content="Reifenwechsel inkl. Auswuchten in ca. 20 Min. bei Pneu 360. Ab CHF 90, ohne Termin. Eigene oder neue Reifen – wir montieren alles." />
        <link rel="canonical" href="https://pneu360.ch/reifenwechsel" />
      </Helmet>

      {/* ── Hero ── */}
      <ServicePageHero
        image={homeFelge}
        alt="Reifenwechsel bei Pneu 360"
        label="Inkl. Auswuchten · Ohne Termin"
        title="Reifen"
        titleAccent="wechsel"
        subtitle="Reifen ab- und aufziehen – in ca. 20 Minuten, inkl. Auswuchten, Ventilwechsel und Entsorgung."
      >
        <PreisrechnerStartButton label="Kosten berechnen" onClick={() => setPreisrechnerOpen(true)} />
      </ServicePageHero>

      {/* ── Schnell-Infos ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Reifenwechsel bei Pneu 360</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Warum du bei uns</span><br />
            <span className="font-extrabold text-muted-foreground">richtig bist</span>
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

      {/* ── Was ist ein Reifenwechsel? ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Gut zu wissen</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase"
            >
              <span className="font-light">Was genau ist</span><br />
              <span className="font-extrabold text-muted-foreground">ein Reifenwechsel?</span>
            </motion.h2>
          </div>
          <motion.div {...fadeIn()} className="space-y-5 text-brand-body text-muted-foreground">
            <p>
              Beim Reifenwechsel werden die Reifen von deinen Felgen demontiert und andere Reifen aufgezogen – ob neue, gebrauchte, saisonale oder mitgebrachte. Der Unterschied zum Radwechsel: Dort werden komplette Räder (Reifen + Felge) getauscht.
            </p>
            <p>
              <strong className="text-foreground font-medium">Wann brauchst du einen Reifenwechsel?</strong> Zum Beispiel beim Saisonwechsel mit nur einem Satz Felgen, wenn Reifen abgefahren oder beschädigt sind, oder beim Umstieg auf eine andere Reifenart.
            </p>
            <p>
              <strong className="text-foreground font-medium">Eigene Reifen oder neue?</strong> Beides geht. Du kannst deine Reifen mitbringen oder direkt bei uns aus hunderten Modellen wählen – von Budget bis Premium.
            </p>
            <p>
              Unsicher, ob deine Reifen noch gut sind? Komm vorbei – wir prüfen Profiltiefe, Alter und Zustand kostenlos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Preise ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-brand-label text-muted-foreground mb-3">Transparent</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
            >
              <span className="font-light">Preise</span>{" "}
              <span className="font-extrabold text-muted-foreground">Reifenwechsel</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Festpreise für 4 Reifen, keine Überraschungen. Im Preis drin: Montage, Auswuchten,
              Ventilwechsel und Entsorgung der alten Reifen.
            </motion.p>
          </div>

          <div className="space-y-0">
            {PRICES.map((p, i) => (
              <motion.div
                key={p.size}
                {...staggerItem(i)}
                className="flex justify-between items-baseline border-b border-border py-6"
              >
                <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] text-foreground">{p.size}</span>
                <span className="text-2xl md:text-3xl font-bold text-foreground">{p.price}</span>
              </motion.div>
            ))}
          </div>

          {/* Extras */}
          <motion.div {...fadeIn()} className="mt-8 space-y-2">
            {EXTRAS.map((e) => (
              <div key={e.label} className="flex justify-between items-baseline max-w-md">
                <span className="text-sm text-muted-foreground">{e.label}</span>
                <span className="text-sm text-muted-foreground font-medium">{e.price}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground/60 mt-3">
              Der Aufpreis gilt nur für fabrikneue Reifen, die nicht bei uns gekauft wurden.
            </p>
          </motion.div>

          <p className="text-brand-label text-muted-foreground mt-8 mb-10">
            Alle Preise inkl. MwSt.
          </p>

          <motion.div {...fadeIn()}>
            <PreisrechnerStartButton label="Gesamtkosten berechnen" onClick={() => setPreisrechnerOpen(true)} />
          </motion.div>
        </div>
      </section>

      {/* ── So läuft's + Benefits ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Der Ablauf</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-8 md:mb-10"
            >
              <span className="font-light">Professionell</span><br />
              <span className="font-extrabold text-muted-foreground">& schnell</span>
            </motion.h2>

            <motion.div {...fadeIn()} className="space-y-5 text-brand-body text-muted-foreground">
              <p>
                Beim Reifenwechsel werden die Reifen von deinen Felgen demontiert und andere Reifen aufgezogen – ob neue, saisonale oder mitgebrachte. Anschliessend wuchten wir jedes Rad aus und ersetzen die Ventile.
              </p>
              <p>
                Das Auswuchten sorgt für vibrationsfreies Fahren und gleichmässigen Verschleiss.
                Ohne Auswuchten nutzen sich Reifen ungleichmässig ab und die Lenkung kann flattern.
              </p>
              <p>
                Du brauchst auch neue Reifen? Wir beraten dich vor Ort und haben hunderte Modelle direkt ab Lager – von Budget bis Premium.
              </p>
            </motion.div>
          </div>

          {/* Benefits */}
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Inklusive</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-8 md:mb-10"
            >
              <span className="font-light">Alles im</span><br />
              <span className="font-extrabold text-muted-foreground">Paket</span>
            </motion.h2>
            <motion.div {...fadeIn()}>
              <BenefitsList items={BENEFITS} columns={1} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Was wir prüfen ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Qualität</p>
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

      {/* ── Cross-Sell: Einlagerung ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Die perfekte Kombination</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase"
            >
              <span className="font-light">Reifenwechsel +</span><br />
              <span className="font-extrabold text-muted-foreground">Einlagerung</span>
            </motion.h2>
          </div>
          <motion.div {...fadeIn()}>
            <div className="space-y-5 text-brand-body text-muted-foreground">
              <p>
                Alte Reifen noch gut? Lass sie bei uns einlagern –
                klimatisiert, versichert, kein Schleppen. Vor der nächsten
                Saison erinnern wir dich automatisch.
              </p>
              <p className="text-foreground/85 text-sm">
                Einlagerung ab CHF 60 pro Saison · inkl. Radwäsche
              </p>
            </div>
            <Link
              to="/reifenhotel"
              className="inline-flex items-center gap-2 mt-8 text-brand-label text-brand-accent hover:text-foreground transition-colors group"
            >
              Mehr zum Reifenhotel <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Standorte ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Reifenwechsel vor Ort</p>
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

      {/* ── FAQ ── */}
      <PageFAQ
        items={FAQS}
        stickyLayout
        title="Häufige Fragen"
      />

      {/* ── CTA ── */}
      <InlineCTA
        title="Reifen jetzt wechseln"
        text="Ohne Termin, ohne Stress – Beratung und Montage direkt vor Ort."
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
                name: "Reifenwechsel",
                provider: { "@type": "AutoRepair", name: "Pneu 360" },
                description: "Reifenwechsel inkl. Auswuchten, Ventilwechsel und Entsorgung. Ab CHF 90, ohne Termin.",
                areaServed: ["Oftringen", "Langenthal"],
                offers: [
                  { "@type": "Offer", priceCurrency: "CHF", price: "90", description: 'Bis 16"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "110", description: '17/18"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "120", description: '19/20"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "140", description: '21"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "160", description: 'Ab 22"' },
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

      <PreisrechnerKonfigurator isOpen={preisrechnerOpen} onClose={() => setPreisrechnerOpen(false)} />
    </>
  );
};

export default Reifenwechsel;

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Thermometer, CalendarOff, ShieldCheck, ArrowRight, Search, Ruler, BoxSelect, Wind } from "lucide-react";

import ServicePageHero from "@/components/shared/ServicePageHero";
import BenefitsList from "@/components/shared/BenefitsList";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import PreisrechnerKonfigurator, { PreisrechnerStartButton } from "@/components/preisrechner/PreisrechnerKonfigurator";
import homeLager from "@/assets/home-lager.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Data ── */

const schnellInfos = [
  {
    icon: Thermometer,
    title: "Klimatisiert & versichert",
    desc: "Deine Räder lagern bei optimaler Temperatur und Luftfeuchtigkeit – und sind gegen Diebstahl und Beschädigung versichert.",
  },
  {
    icon: CalendarOff,
    title: "Ohne Termin",
    desc: "Räder vorbeibringen oder direkt beim Radwechsel einlagern – kein Anruf nötig, auch samstags.",
  },
  {
    icon: ShieldCheck,
    title: "Inkl. Reinigung & Check",
    desc: "Jedes Rad wird vor der Einlagerung gereinigt, Profiltiefe gemessen und der Zustand dokumentiert. Bei Auffälligkeiten sagen wir dir Bescheid.",
  },
];

const PRICES = [
  { cat: "Reifen (ohne Felgen)", sub: 'bis 20"', price: "CHF 60" },
  { cat: "Reifen (ohne Felgen)", sub: '21"', price: "CHF 80" },
  { cat: "Reifen (ohne Felgen)", sub: 'ab 22"', price: "CHF 90" },
  { cat: "Räder (mit Felgen)", sub: 'bis 20"', price: "CHF 70" },
  { cat: "Räder (mit Felgen)", sub: '21"', price: "CHF 90" },
  { cat: "Räder (mit Felgen)", sub: 'ab 22"', price: "CHF 100" },
];

const EXTRAS = [
  { label: "Radwäsche (optional, 4 Räder)", price: "CHF 10" },
];

const BENEFITS = [
  "Klimatisierte Lagerung – optimale Bedingungen",
  "Professionelle Reinigung vor der Einlagerung",
  "Profiltiefe- und Zustandsprüfung bei jedem Wechsel",
  "Versicherungsschutz inklusive",
  
  "Kein Schleppen – direkte Montage bei Abholung",
  "Platz sparen zu Hause – keine Garage nötig",
  "Radwäsche optional – nur CHF 10 für alle 4 Räder",
  "An beiden Standorten verfügbar",
];

const FACHBLOECKE = [
  {
    icon: Search,
    title: "Profiltiefe & DOT",
    text: "Wir messen die Profiltiefe an mehreren Stellen und prüfen das Herstellungsdatum (DOT-Nummer). Reifen älter als 6 Jahre? Wir sagen dir Bescheid.",
  },
  {
    icon: Ruler,
    title: "Felgenzustand",
    text: "Kratzer, Dellen, Risse – wir dokumentieren den Zustand deiner Felgen bei der Einlagerung. Falls eine Reparatur sinnvoll ist, machen wir das gleich mit.",
  },
  {
    icon: BoxSelect,
    title: "Korrekte Lagerposition",
    text: "Reifen ohne Felgen werden stehend gelagert, Kompletträder hängend oder gestapelt – genau nach Herstellerempfehlung, damit nichts verformt.",
  },
  {
    icon: Wind,
    title: "Klimakontrolle",
    text: "Unsere Lagerräume sind temperatur- und feuchtigkeitskontrolliert. Kein Frost, keine Hitze, kein UV-Licht – das verlängert die Lebensdauer deiner Reifen spürbar.",
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
  { q: "Was kostet die Reifeneinlagerung?", a: "Reifen (ohne Felgen) ab CHF 60 pro Saison, Räder (mit Felgen) ab CHF 70. Ab 21\" bzw. 22\" gelten gestaffelte Preise – alle Preise inkl. MwSt." },
  { q: "Sind meine Reifen versichert?", a: "Ja – unsere Einlagerung beinhaltet einen Versicherungsschutz gegen Diebstahl und Beschädigung." },
  { q: "Wie werden die Reifen gelagert?", a: "In einem klimatisierten Raum, stehend (Reifen) oder hängend (Kompletträder), bei optimaler Temperatur und Luftfeuchtigkeit – kein UV-Licht, kein Frost." },
  { q: "Was kostet die Radwäsche?", a: "Optional – für nur CHF 10 waschen wir alle 4 Räder bei der Einlagerung. So bekommst du sie beim nächsten Wechsel sauber zurück. Wer sie nicht braucht, zahlt einfach weniger." },
  
  { q: "Kann ich die Einlagerung mit einem Radwechsel kombinieren?", a: "Klar – das ist sogar der häufigste Fall. Räder wechseln und die alten direkt einlagern. Spart dir das Schleppen komplett." },
  { q: "Kann ich jederzeit auf meine Reifen zugreifen?", a: "Ja – ruf kurz an oder komm vorbei, wir holen deine Räder aus dem Lager. Innerhalb der Öffnungszeiten ist das kein Problem." },
  { q: "Selbst lagern oder Reifenhotel – was ist besser?", a: "Zu Hause brauchst du einen trockenen, kühlen, dunklen Raum – keine Garage mit Sonneneinstrahlung, keine Tiefgarage (in vielen Kantonen verboten wegen Brandschutz). Bei uns ist alles optimal: Klima, Versicherung, kein Schleppen." },
  { q: "Bietet ihr auch Felgenreparatur während der Einlagerung an?", a: "Ja – und das ist der perfekte Zeitpunkt dafür. Während deine Räder bei uns lagern, können wir Kratzer und Schäden beheben: Smart Repair (schnell und günstig), Neulackierung in Wunschfarbe oder CNC-Abdrehen für Hochglanz-Felgen. Beim nächsten Saisonwechsel bekommst du deine Räder frisch zurück – ohne extra Termin." },
];

/* ── Page ── */

const Reifenhotel = () => {
  const [preisrechnerOpen, setPreisrechnerOpen] = useState(false);

  useEffect(() => {
    document.title = "Reifenhotel – Professionelle Reifeneinlagerung | Pneu 360 Oftringen & Langenthal";
  }, []);

  return (
    <>
      <Helmet>
        <meta name="description" content="Professionelle Reifeneinlagerung bei Pneu 360. Klimatisiert, versichert, inkl. Reinigung und Profilcheck. Ab CHF 60 pro Saison in Oftringen & Langenthal." />
        <link rel="canonical" href="https://pneu360.ch/reifenhotel" />
      </Helmet>

      {/* ── Hero ── */}
      <ServicePageHero
        image={homeLager}
        alt="Professionelle Reifeneinlagerung bei Pneu 360"
        label="Klimatisiert · Versichert · Radwäsche ab CHF 10"
        title="Reifen"
        titleAccent="hotel"
        subtitle="Professionelle Einlagerung mit Reinigung und Zustandsprüfung – deine Räder verdienen das Beste."
      >
        <PreisrechnerStartButton label="Kosten berechnen" onClick={() => setPreisrechnerOpen(true)} />
      </ServicePageHero>

      {/* ── Schnell-Infos ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Reifenhotel bei Pneu 360</p>
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

      {/* ── Warum ein Reifenhotel? ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Gut zu wissen</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase"
            >
              <span className="font-light">Warum ein</span><br />
              <span className="font-extrabold text-muted-foreground">Reifenhotel?</span>
            </motion.h2>
          </div>
          <motion.div {...fadeIn()} className="space-y-5 text-brand-body text-muted-foreground">
            <p>
              Vier Räder wiegen schnell <strong className="text-foreground font-medium">über 80 kg</strong> – das will niemand zweimal im Jahr durch die Gegend schleppen. Und wohin damit? Die Garage ist voll, der Keller feucht, und in vielen Tiefgaragen ist die Lagerung wegen Brandschutzvorschriften verboten.
            </p>
            <p>
              Falsche Lagerung verkürzt die Lebensdauer deiner Reifen deutlich: <strong className="text-foreground font-medium">UV-Licht, Hitze und Feuchtigkeit</strong> lassen die Gummimischung vorzeitig altern. Im Reifenhotel lagern deine Räder unter optimalen Bedingungen – klimatisiert, dunkel, bei kontrollierter Luftfeuchtigkeit.
            </p>
            <p>
              Dazu kommt: Bei jedem Ein- und Auslagern prüfen wir Profiltiefe, DOT-Alter und Felgenzustand. Falls etwas auffällt, sagen wir dir das ehrlich – kein Verkaufsdruck, sondern Klartext.
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
              <span className="font-extrabold text-muted-foreground">Reifenhotel</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Saisonpreise pro Einlagerung, keine versteckten Kosten. Reinigung, Profilcheck und Versicherung sind immer inklusive.
            </motion.p>
          </div>

          <div className="space-y-0">
            {PRICES.map((p, i) => (
              <motion.div
                key={`${p.cat}-${p.sub}`}
                {...staggerItem(i)}
                className="flex justify-between items-baseline border-b border-border py-6"
              >
                <div>
                  <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] text-foreground">{p.cat}</span>
                  <span className="text-sm text-muted-foreground font-light ml-3">{p.sub}</span>
                </div>
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
              Radwäsche ist optional – wer sie nicht braucht, zahlt weniger.
            </p>
          </motion.div>

          <p className="text-brand-label text-muted-foreground mt-8 mb-10">
            Alle Preise inkl. MwSt. · Pro Saison
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
            <p className="text-brand-label text-muted-foreground mb-3">So läuft's</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-8 md:mb-10"
            >
              <span className="font-light">In drei Schritten</span><br />
              <span className="font-extrabold text-muted-foreground">eingelagert</span>
            </motion.h2>

            <motion.div {...fadeIn()} className="space-y-5 text-brand-body text-muted-foreground">
              <p>
                <strong className="text-foreground font-medium">1. Anlieferung</strong> – Bring deine Räder vorbei oder wir demontieren sie direkt beim Radwechsel.
              </p>
              <p>
                <strong className="text-foreground font-medium">2. Reinigung & Check</strong> – Jedes Rad wird gereinigt, Profiltiefe gemessen und der Zustand dokumentiert.
              </p>
              <p>
                <strong className="text-foreground font-medium">3. Einlagerung</strong> – Klimatisiert, korrekt positioniert, versichert. Deine Räder sind bei uns sicher.
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
              <span className="font-light">Das steckt</span><br />
              <span className="font-extrabold text-muted-foreground">drin</span>
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

      {/* ── Cross-Sell: Radwechsel + Einlagerung ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Die perfekte Kombination</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase"
            >
              <span className="font-light">Radwechsel +</span><br />
              <span className="font-extrabold text-muted-foreground">Einlagerung</span>
            </motion.h2>
          </div>
          <motion.div {...fadeIn()}>
            <div className="space-y-5 text-brand-body text-muted-foreground">
              <p>
                Der häufigste Fall: Räder wechseln und die alten direkt einlagern. Kein Schleppen, kein Platzproblem – wir kümmern uns um alles.
              </p>
              <p className="text-foreground/85 text-sm">
                Radwechsel ab CHF 65 · Einlagerung ab CHF 60 pro Saison
              </p>
            </div>
            <Link
              to="/radwechsel"
              className="inline-flex items-center gap-2 mt-8 text-brand-label text-brand-accent hover:text-foreground transition-colors group"
            >
              Mehr zum Radwechsel <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Cross-Sell: Felgenreparatur während Einlagerung ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Tipp</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase"
            >
              <span className="font-light">Felgen reparieren</span><br />
              <span className="font-extrabold text-muted-foreground">während der Einlagerung</span>
            </motion.h2>
          </div>
          <motion.div {...fadeIn()}>
            <div className="space-y-5 text-brand-body text-muted-foreground">
              <p>
                Während deine Räder bei uns lagern, ist die perfekte Gelegenheit für eine Felgenreparatur. Ob <strong className="text-foreground font-medium">Smart Repair</strong> (schnell und günstig), <strong className="text-foreground font-medium">Neulackierung</strong> in Wunschfarbe oder <strong className="text-foreground font-medium">CNC-Abdrehen</strong> für Hochglanz-Felgen: Beim nächsten Saisonwechsel bekommst du deine Räder frisch zurück – ohne extra Termin, ohne Wartezeit.
              </p>
              <p>
                Gib den Auftrag einfach bei der Einlagerung ab – wir erledigen den Rest, bis du deine Räder wieder brauchst.
              </p>
            </div>
            <Link
              to="/felgenreparatur"
              className="inline-flex items-center gap-2 mt-8 text-brand-label text-brand-accent hover:text-foreground transition-colors group"
            >
              Mehr zur Felgenreparatur <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Standorte ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Einlagerung vor Ort</p>
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
        title="Reifen jetzt einlagern"
        text="Platz sparen, Zustand sichern – einfach vorbeikommen oder anrufen."
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
                name: "Reifenhotel – Professionelle Reifeneinlagerung",
                provider: { "@type": "AutoRepair", name: "Pneu 360" },
                description: "Klimatisierte Reifeneinlagerung inkl. Reinigung, Profilcheck und Versicherung. Ab CHF 60 pro Saison.",
                areaServed: ["Oftringen", "Langenthal"],
                offers: [
                  { "@type": "Offer", priceCurrency: "CHF", price: "60", description: 'Reifen bis 20"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "70", description: 'Räder bis 20"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "80", description: 'Reifen 21"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "90", description: 'Räder 21" / Reifen ab 22"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "100", description: 'Räder ab 22"' },
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

export default Reifenhotel;

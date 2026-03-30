import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gauge, Warehouse, Clock, Thermometer, ShieldCheck, TrendingDown, Droplets, Fuel, Volume2, ArrowRight } from "lucide-react";
import TireLabelGraphic from "@/components/sommerreifen/TireLabelGraphic";
import LabelExplainer from "@/components/sommerreifen/LabelExplainer";

import BremswegVergleich from "@/components/sommerreifen/BremswegVergleich";
import ServicePageHero from "@/components/shared/ServicePageHero";
import Marquee from "@/components/home/Marquee";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import AnfrageKonfigurator, { AnfrageCompactButton } from "@/components/anfrage/AnfrageKonfigurator";
import reifenSommer from "@/assets/reifen-sommer.webp";
import ctaSommerRoad from "@/assets/cta-sommer-road.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Data ── */

const schnellInfos = [
  {
    icon: Gauge,
    title: "Alles aus einer Hand",
    desc: "Beratung, Reifen, Montage, Auswuchten – bei uns läuft alles an einem Ort. Zum Saisonstart schenken wir dir oft die Montage gratis dazu.",
  },
  {
    icon: Warehouse,
    title: "Direkt ab Lager",
    desc: "Grosse Auswahl an Premium- und Budgetreifen sofort verfügbar. Einfach vorbeikommen – wir montieren direkt.",
  },
  {
    icon: Clock,
    title: "Live-Wartezeit prüfen",
    desc: "In der Hochsaison kann es zu kurzen Wartezeiten kommen. Checke die aktuelle Wartezeit einfach live auf unserer Website!",
  },
];

const techVorteile = [
  {
    icon: Thermometer,
    title: "Gummimischung",
    text: "Sommerreifen bestehen aus einer härteren Gummimischung als Winterreifen. Bei Wärme bleibt die Lauffläche formstabil – das bedeutet weniger Abrieb und eine deutlich längere Lebensdauer.",
  },
  {
    icon: ShieldCheck,
    title: "Bremsweg",
    text: "Bei 25 °C bremst ein Sommerreifen bis zu 20 % kürzer als ein Winterreifen. Der Grund: Die weiche Wintermischung wird bei Hitze schwammig und verliert Haftung – besonders auf trockener Strasse.",
  },
  {
    icon: TrendingDown,
    title: "Rollwiderstand",
    text: "Weniger Verformung beim Abrollen heisst weniger Energieverlust. Konkret: Du sparst Sprit und fährst leiser. Gerade bei Elektroautos macht das einen spürbaren Unterschied bei der Reichweite.",
  },
  {
    icon: Droplets,
    title: "Aquaplaning-Schutz",
    text: "Die breiten Längsrillen und offenen Profilblöcke von Sommerreifen leiten Wasser schneller ab als Ganzjahresreifen. Dadurch bleibt der Kontakt zur Strasse auch bei Starkregen bestehen.",
  },
];

const reifenWissen = [
  {
    title: "Profiltiefe & Alter",
    text: "Wechsle ab 3 mm Profiltiefe – auch wenn gesetzlich 1,6 mm reichen. Bei Regen verlierst du sonst massiv Haftung. Unbenutzte Reifen? Nach 8 bis 10 Jahren austauschen, egal wie das Profil aussieht.",
  },
  {
    title: "Reifendruck",
    text: "Kontrolliere den Druck einmal im Monat – am besten bei kalten Reifen. Zu wenig Druck kostet dich Sprit und Profil. Zu viel Druck reduziert die Auflagefläche und verschlechtert den Grip.",
  },
  {
    title: "Ganzjahresreifen?",
    text: "Ein Kompromiss: Längerer Bremsweg im Sommer, schnellerer Verschleiss, mehr Lärm. Wer viel fährt oder sportlich unterwegs ist, fährt mit saisonalen Reifen sicherer und günstiger.",
  },
];

const labelPunkte = [
  {
    icon: Fuel,
    label: "Kraftstoffeffizienz",
    klasse: "A – E",
    text: "Wie viel Energie der Reifen beim Rollen verbraucht. A ist top – jede Klasse schlechter kostet dich ca. 0,1 l/100 km mehr.",
  },
  {
    icon: Droplets,
    label: "Nasshaftung",
    klasse: "A – E",
    text: "Wie gut der Reifen auf nasser Strasse bremst. Zwischen A und E liegen bis zu 18 Meter Bremsweg-Unterschied bei Tempo 80.",
  },
  {
    icon: Volume2,
    label: "Rollgeräusch",
    klasse: "in dB",
    text: "Wie laut der Reifen auf der Strasse ist. Besonders wichtig bei Elektroautos, wo kein Motor den Lärm übertönt.",
  },
];

const empfehlungen = [
  {
    title: "Für Kleinwagen",
    text: "Continental PremiumContact oder Hankook Ventus Prime – wirtschaftlich, sicher und mit gutem Nassgrip für den Alltag.",
  },
  {
    title: "Für Mittelklasse & SUV",
    text: "Continental SportContact 7, Goodyear Eagle F1 oder Michelin Pilot Sport SUV – die ideale Balance aus Komfort und Performance.",
  },
  {
    title: "Für Sportwagen",
    text: "Pirelli P Zero, Michelin Pilot Sport oder Continental SportContact – maximaler Grip, kurze Bremswege, präzises Handling.",
  },
];

const sortimentLinks = [
  { title: "Winterreifen", href: "/winterreifen", desc: "Für die kalte Jahreszeit" },
  { title: "Ganzjahresreifen", href: "/ganzjahresreifen", desc: "Der Kompromiss fürs ganze Jahr" },
  { title: "Offroadreifen", href: "/offroadreifen", desc: "Für Gelände & Abenteuer" },
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

const faqs = [
  {
    q: "Wann soll ich Sommerreifen montieren?",
    a: "Die Faustregel ist von «Ostern bis Oktober» oder ab konstanten Temperaturen von 7 °C.",
  },
  {
    q: "Muss ich für den Reifenwechsel einen Termin machen?",
    a: "Nein! Bei uns kommst du einfach vorbei. Checke kurz unsere Live-Wartezeit auf der Website und fahre los.",
  },
  {
    q: "Kann ich meine Winterreifen bei euch einlagern?",
    a: "Ja, wir bieten die fachgerechte Reifeneinlagerung direkt vor Ort an.",
  },
  {
    q: "Habt ihr Sommerreifen an Lager?",
    a: "Ja, wir haben ein grosses Lager mit Reifen für jedes Budget in allen gängigen Grössen. Einfach vorbeikommen oder anrufen – wir montieren sofort, ohne Termin.",
  },
  {
    q: "Habt ihr auch Reifen für Elektroautos?",
    a: "Ja, wir führen spezielle Reifen für Elektro- und Hybridfahrzeuge, die auf geringen Rollwiderstand und leisen Lauf optimiert sind. Wir beraten dich gerne vor Ort.",
  },
  {
    q: "Was kosten Sommerreifen bei euch?",
    a: "Die Preise variieren je nach Marke, Grösse und Fahrzeugtyp. Wir haben Premium-, Mittelklasse- und Budgetreifen – für jedes Budget die passende Lösung. Nutze unser Online-Formular oder ruf uns direkt an.",
  },
  {
    q: "Wie lange dauert die Montage?",
    a: "In der Regel bist du in 20 bis 30 Minuten wieder auf der Strasse. Ohne Termin, ohne langes Warten.",
  },
  {
    q: "Welche Marken führt ihr?",
    a: "Über 30 Marken – darunter Continental, Michelin, Pirelli, Goodyear, Hankook, Bridgestone und viele mehr. Wir empfehlen dir gezielt, was zu deinem Fahrzeug und Fahrstil passt.",
  },
  {
    q: "Was bedeutet das EU-Reifenlabel?",
    a: "Das EU-Label zeigt dir auf einen Blick drei Werte: Kraftstoffeffizienz (A–E), Nasshaftung (A–E) und Rollgeräusch (in dB). So kannst du Reifen einfach vergleichen – wir helfen dir gerne vor Ort beim Lesen.",
  },
  {
    q: "Lohnen sich teure Sommerreifen?",
    a: "Wenn du viel fährst: ja. Premiumreifen haben kürzere Bremswege, weniger Verschleiss und besseren Nassgrip. Wer weniger fährt, ist mit einem soliden Mittelklassereifen oft genauso gut bedient. Wir beraten dich ehrlich – ohne Upselling.",
  },
];

/* ── Page ── */

const Sommerreifen = () => {
  const [anfrageOpen, setAnfrageOpen] = useState(false);
  const [activeLabelIndex, setActiveLabelIndex] = useState(-1);
  const handleLabelActive = useCallback((i: number) => setActiveLabelIndex(i), []);

  useEffect(() => {
    document.title = "Sommerreifen kaufen – Sofort ab Lager | Pneu 360 Oftringen & Langenthal";
  }, []);

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Sommerreifen sofort ab Lager bei Pneu 360. Continental, Michelin, Pirelli & mehr. Professionelle Montage in 20 Min. Ohne Termin in Oftringen & Langenthal."
        />
        <link rel="canonical" href="https://pneu360.ch/sommerreifen" />
      </Helmet>

      {/* ── Hero ── */}
      <ServicePageHero
        image={reifenSommer}
        alt="Sommerreifen Nahaufnahme Profil"
        label="Ab 7 °C aufwärts"
        title="Sommerreifen"
        titleAccent="wechseln"
        subtitle="Ob Continental, Michelin oder günstige Budgetreifen: Wir sagen dir ehrlich, was zu deinem Auto passt – und was nicht. Einfach vorbeikommen, ohne Termin!"
      >
        <AnfrageCompactButton label="Jetzt anfragen" onClick={() => setAnfrageOpen(true)} />
      </ServicePageHero>

      {/* ── Schnell-Infos ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Die 3 Schnell-Infos</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Was du wissen</span><br />
            <span className="font-extrabold text-muted-foreground">solltest</span>
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

      {/* ── Warum Sommerreifen? ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-brand-label text-muted-foreground mb-3">Technik einfach erklärt</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
            >
              <span className="font-light">Warum</span><br />
              <span className="font-extrabold text-muted-foreground">Sommerreifen?</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Winterreifen im Sommer fahren klingt bequem – ist aber teuer und unsicher. Hier siehst du, warum der Wechsel sich lohnt.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {techVorteile.map((item, i) => (
              <motion.div
                key={item.title}
                {...staggerItem(i)}
                className="border border-border p-8 md:p-10"
              >
                <item.icon className="w-7 h-7 text-brand-accent mb-6" strokeWidth={1.5} />
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-[-0.02em] text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bremsweg-Vergleich ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <p className="text-brand-label text-muted-foreground mb-3">Echte Testdaten</p>
              <motion.h2
                {...headingReveal()}
                className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
              >
                <span className="font-light">Bremsweg-</span><br />
                <span className="font-extrabold text-muted-foreground">Vergleich</span>
              </motion.h2>
              <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-10">
                So viel Unterschied macht der richtige Reifen. Echte Zahlen aus TCS- und ADAC-Tests – nicht Marketing, sondern Physik.
              </motion.p>
              <BremswegVergleich />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="border border-border p-8 md:p-10 space-y-6 lg:sticky lg:top-32"
            >
              <h3 className="text-xl font-bold uppercase tracking-[-0.02em] text-foreground">
                Was heisst das für dich?
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Im Sommer mit Winterreifen?</strong> Du brauchst über 20 Meter mehr bis du stehst. Das ist der Unterschied zwischen Anhalten und Auffahrunfall.
                  </p>
                </div>
                <div className="flex gap-3">
                  <TrendingDown className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Ganzjahresreifen?</strong> Besser als Winter, aber immer noch 7 Meter länger. Bei 100 km/h fast 2 Autolängen.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Thermometer className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Ab 7 °C wechseln.</strong> Die Gummimischung von Sommerreifen ist für Wärme optimiert – bei Hitze greifen sie am besten.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Marken Logos ── */}
      <Marquee />

      {/* ── Reifen-Wissen ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-brand-label text-muted-foreground mb-3">Reifen-Wissen & Sicherheit</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
            >
              <span className="font-light">Sicher</span><br />
              <span className="font-extrabold text-muted-foreground">unterwegs</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Ein paar Dinge, die du als Autofahrer wissen solltest – damit du nicht nur fährst, sondern sicher fährst.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {reifenWissen.map((item, i) => (
              <motion.div
                key={item.title}
                {...staggerItem(i)}
                className="border border-border p-8 md:p-10"
              >
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-[-0.02em] text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reifenlabel verstehen (Interaktiv) ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-brand-label text-muted-foreground mb-3">In 30 Sekunden verstanden</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
            >
              <span className="font-light">Das Reifenlabel</span><br />
              <span className="font-extrabold text-muted-foreground">erklärt</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Jeder Reifen hat dieses Label. Drei Werte – wir zeigen dir, was sie bedeuten und warum sie dir Geld sparen.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-10 md:gap-16 items-start">
            {/* Label Graphic – sticky on desktop */}
            <div className="md:sticky md:top-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <TireLabelGraphic activeIndex={activeLabelIndex} />
              </motion.div>
            </div>

            {/* Explainer cards */}
            <LabelExplainer onActiveChange={handleLabelActive} />
          </div>
        </div>
      </section>

      {/* ── Empfehlungen ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Empfehlungen nach Fahrzeugtyp</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Welcher Reifen</span><br />
            <span className="font-extrabold text-muted-foreground">passt zu dir?</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {empfehlungen.map((item, i) => (
              <motion.div
                key={item.title}
                {...staggerItem(i)}
                className="border border-border p-8 md:p-10"
              >
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-[-0.02em] text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeIn()} className="mt-12 md:mt-16">
            <AnfrageCompactButton label="Jetzt anfragen" onClick={() => setAnfrageOpen(true)} />
          </motion.div>
        </div>
      </section>

      {/* ── Weitere Reifentypen ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Unser Sortiment</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Weitere</span><br />
            <span className="font-extrabold text-muted-foreground">Reifentypen</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sortimentLinks.map((item, i) => (
              <motion.div key={item.title} {...staggerItem(i)}>
                <Link
                  to={item.href}
                  className="group border border-border p-8 md:p-10 block hover:border-brand-accent/40 transition-all duration-500"
                >
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-[-0.02em] text-foreground mb-3 group-hover:text-brand-accent transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <span className="text-brand-accent text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-500">
                    Mehr erfahren <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Standorte ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">2 × vor Ort</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Hier findest</span><br />
            <span className="font-extrabold text-muted-foreground">du uns</span>
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
        items={faqs}
        stickyLayout
        title="Häufige Fragen"
      />

      {/* ── CTA ── */}
      <InlineCTA
        title="Bereit für den Sommer?"
        text="Komm einfach vorbei oder frage deine Wunschreifen direkt online an. Unser Team in Oftringen und Langenthal freut sich auf dich!"
        backgroundImage={ctaSommerRoad}
      />

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Sommerreifen",
            description: "Sommerreifen aller Top-Marken sofort ab Lager bei Pneu 360.",
            brand: { "@type": "Organization", name: "Pneu 360" },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "CHF",
              lowPrice: "60",
              offerCount: "200+",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      <AnfrageKonfigurator isOpen={anfrageOpen} onClose={() => setAnfrageOpen(false)} initialCategory="tires" filterCategories={["tires"]} />
    </>
  );
};

export default Sommerreifen;

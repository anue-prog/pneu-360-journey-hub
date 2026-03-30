import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Warehouse, Coffee, Snowflake, TrendingDown, Thermometer } from "lucide-react";
import BremswegVergleich from "@/components/sommerreifen/BremswegVergleich";

import ServicePageHero from "@/components/shared/ServicePageHero";
import Marquee from "@/components/home/Marquee";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import AnfrageKonfigurator, { AnfrageCompactButton } from "@/components/anfrage/AnfrageKonfigurator";
import reifenWinter from "@/assets/reifen-winter.webp";
import ctaWinterRoad from "@/assets/cta-winter-road.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Data ── */

const schnellInfos = [
  {
    icon: ShieldCheck,
    title: "Ehrliche Beratung",
    desc: "Wir sagen dir offen, ob deine alten Winterreifen noch eine Saison halten oder ob ein Wechsel Sinn macht. Kein Upselling – nur ehrliche Empfehlungen.",
  },
  {
    icon: Warehouse,
    title: "Grosses Lager",
    desc: "Von Premium bis Budget – wir haben für jedes Auto und jeden Geldbeutel den passenden Winterreifen parat. Alle gängigen Grössen sofort verfügbar.",
  },
  {
    icon: Coffee,
    title: "Schnell montiert",
    desc: "Ohne Termin vorbeikommen, kurz einen Kaffee trinken, und du fährst mit neuen Winterreifen wieder los. Meistens in unter 30 Minuten erledigt.",
  },
];

const winterWissen = [
  {
    title: "Alpine-Symbol vs. M+S",
    text: "Das Bergpiktogramm mit Schneeflocke (3PMSF) ist der einzige echte Nachweis für Wintertauglichkeit. Das alte M+S-Zeichen sagt wenig aus – wir erklären dir gerne den Unterschied vor Ort.",
  },
  {
    title: "Profiltiefe im Winter",
    text: "Gesetzlich reichen 1,6 mm – aber aus Erfahrung wissen wir: Unter 4 mm wird's auf Schnee kritisch. Wir messen bei jedem Wechsel und beraten dich ehrlich.",
  },
  {
    title: "Lagerung & Pflege",
    text: "Winterreifen mögen es kühl, dunkel und trocken. Unser Tipp: Lass sie in unserem Reifenhotel fachgerecht einlagern – inklusive Reinigung und Profilcheck.",
  },
];

const empfehlungen = [
  {
    title: "Für Kleinwagen",
    text: "Continental WinterContact oder Hankook Winter i*cept – zuverlässig, sicher und preislich fair. Die smarte Wahl für den Alltag.",
  },
  {
    title: "Für SUV & Mittelklasse",
    text: "Michelin Alpin, Goodyear UltraGrip oder Pirelli Sottozero – Premium-Grip auch bei tiefem Schnee. Ideal für Pendler und Familien.",
  },
  {
    title: "Für Vielfahrer & Pendler",
    text: "Wer täglich unterwegs ist, braucht maximale Laufleistung. Wir empfehlen dir gezielt Modelle, die Sicherheit und Langlebigkeit kombinieren.",
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

const faqs = [
  {
    q: "Ab wann brauche ich Winterreifen?",
    a: "Unsere Faustregel: Sobald die Temperaturen regelmässig unter 7 °C fallen – in der Schweiz typischerweise ab Mitte Oktober. Wir empfehlen, nicht bis zum ersten Frost zu warten.",
  },
  {
    q: "Sind Winterreifen in der Schweiz Pflicht?",
    a: "Nein, es gibt keine generelle Winterreifenpflicht. Aber: Bei einem Unfall mit Sommerreifen auf Schnee kannst du mithaften. Auch viele Versicherungen setzen angemessene Bereifung voraus.",
  },
  {
    q: "Was bedeutet das Alpine-Symbol genau?",
    a: "Das Bergpiktogramm mit Schneeflocke (3PMSF) bestätigt, dass der Reifen strenge Winterperformance-Tests bestanden hat. Es ist deutlich aussagekräftiger als das alte M+S-Zeichen.",
  },
  {
    q: "Wie lange halten Winterreifen?",
    a: "In der Regel 3 bis 4 Saisons – abhängig von Fahrweise, Kilometerleistung und Lagerung. Wir prüfen bei jedem Saisonwechsel die Profiltiefe und sagen dir ehrlich, ob sie noch eine Saison durchhalten.",
  },
  {
    q: "Kann ich meine Reifen bei euch einlagern?",
    a: "Klar! In unserem klimatisierten Reifenhotel sind deine Reifen bestens aufgehoben. Inklusive Reinigung, Profiltiefe-Check und einer Erinnerung, wenn die nächste Saison startet.",
  },
  {
    q: "Habt ihr Winterreifen an Lager?",
    a: "Ja, wir haben ein grosses Lager mit Winterreifen für jedes Budget und alle gängigen Grössen. Einfach vorbeikommen – wir montieren sofort, ohne Termin.",
  },
  {
    q: "Habt ihr auch Winterreifen für Elektroautos?",
    a: "Ja, wir führen spezielle Winterreifen für Elektro- und Hybridfahrzeuge mit optimiertem Rollwiderstand und leiserem Abrollgeräusch. Komm vorbei, wir beraten dich gerne.",
  },
  {
    q: "Wie lange dauert die Montage?",
    a: "In der Regel bist du in 20 bis 30 Minuten wieder unterwegs. Ohne Termin, ohne langes Warten – einfach vorbeikommen.",
  },
  {
    q: "Was kosten Winterreifen bei euch?",
    a: "Die Preise hängen von Marke, Grösse und Fahrzeugtyp ab. Wir haben Premium-, Mittelklasse- und Budgetreifen – für jedes Budget die passende Lösung. Nutze unser Online-Formular oder ruf uns an für eine genaue Auskunft.",
  },
  {
    q: "Welche Marken führt ihr?",
    a: "Über 30 Marken – darunter Continental, Michelin, Pirelli, Goodyear, Hankook, Bridgestone, Nokian und viele mehr. Wir empfehlen dir gezielt, was zu deinem Fahrzeug und deinem Fahrstil passt.",
  },
];

/* ── Page ── */

const Winterreifen = () => {
  const [anfrageOpen, setAnfrageOpen] = useState(false);

  useEffect(() => {
    document.title = "Winterreifen kaufen – Sofort ab Lager | Pneu 360 Oftringen & Langenthal";
  }, []);

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Winterreifen mit Alpine-Symbol sofort ab Lager bei Pneu 360. Ehrliche Beratung, grosse Auswahl und Montage ohne Termin in Oftringen & Langenthal."
        />
        <link rel="canonical" href="https://pneu360.ch/winterreifen" />
      </Helmet>

      {/* ── Hero ── */}
      <ServicePageHero
        image={reifenWinter}
        alt="Winterreifen auf verschneiter Strasse"
        label="Unter 7 °C unverzichtbar"
        title="Winterreifen"
        titleAccent="wechseln"
        subtitle="Alpine-Symbol, maximaler Grip auf Schnee und Eis – und wir sagen dir ehrlich, welcher Reifen zu deinem Auto passt. Einfach vorbeikommen, ohne Termin!"
      >
        <AnfrageCompactButton label="Jetzt anfragen" onClick={() => setAnfrageOpen(true)} />
      </ServicePageHero>

      {/* ── Schnell-Infos ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Das Wichtigste zuerst</p>
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

      {/* ── Bremsweg-Vergleich ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
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
                Im Winter zählt jeder Meter. Echte Zahlen aus TCS- und ADAC-Tests zeigen, warum Winterreifen auf Schnee und Eis unverzichtbar sind.
              </motion.p>
              <BremswegVergleich variant="winter" />
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
                  <Snowflake className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Sommerreifen im Winter?</strong> Doppelter Bremsweg auf Schnee. Das ist nicht "etwas schlechter" – das ist lebensgefährlich.
                  </p>
                </div>
                <div className="flex gap-3">
                  <TrendingDown className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Ganzjahresreifen?</strong> Besser als Sommer, aber auf Schnee immer noch 7 Meter länger. Bei Eis wird der Unterschied noch grösser.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Thermometer className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Ab 7 °C wechseln.</strong> Die weiche Gummimischung von Winterreifen greift erst bei Kälte richtig – dann aber deutlich besser als alles andere.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Marken Logos ── */}
      <Marquee />

      {/* ── Winter-Wissen ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-brand-label text-muted-foreground mb-3">Winter-Wissen & Sicherheit</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
            >
              <span className="font-light">Sicher durch</span><br />
              <span className="font-extrabold text-muted-foreground">den Winter</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Unter 7 °C wird die Gummimischung von Sommerreifen hart – der Grip lässt nach und der Bremsweg
              wird gefährlich lang. Winterreifen sind kein Luxus, sondern Sicherheit für dich und deine Familie.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {winterWissen.map((item, i) => (
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

      {/* ── Empfehlungen ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Empfehlungen nach Fahrzeugtyp</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Welcher Winterreifen</span><br />
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

      {/* ── Standorte ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Vor Ort für dich da</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Komm einfach</span><br />
            <span className="font-extrabold text-muted-foreground">vorbei</span>
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
        title="Bereit für den Winter?"
        text="Komm einfach vorbei oder frage deine Wunschreifen direkt online an. Unser Team in Oftringen und Langenthal berät dich ehrlich und montiert ohne Termin."
        backgroundImage={ctaWinterRoad}
      />

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Winterreifen",
            description: "Winterreifen mit Alpine-Symbol aller Top-Marken sofort ab Lager bei Pneu 360.",
            brand: { "@type": "Organization", name: "Pneu 360" },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "CHF",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      <AnfrageKonfigurator isOpen={anfrageOpen} onClose={() => setAnfrageOpen(false)} initialCategory="tires" filterCategories={["tires"]} />
    </>
  );
};

export default Winterreifen;

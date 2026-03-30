import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Scale, Snowflake, CalendarOff, ShieldCheck, TrendingDown } from "lucide-react";
import BremswegVergleich from "@/components/sommerreifen/BremswegVergleich";

import ServicePageHero from "@/components/shared/ServicePageHero";
import Marquee from "@/components/home/Marquee";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import AnfrageKonfigurator, { AnfrageCompactButton } from "@/components/anfrage/AnfrageKonfigurator";
import reifenGanzjahr from "@/assets/reifen-ganzjahr.webp";
import ctaGanzjahrRoad from "@/assets/cta-ganzjahr-road.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Data ── */

const schnellInfos = [
  {
    icon: Scale,
    title: "Ehrliche Einschätzung",
    desc: "Wir sagen dir offen, ob Ganzjahresreifen zu deinem Fahrprofil passen – oder ob du mit Saisonreifen besser und sicherer fährst.",
  },
  {
    icon: Snowflake,
    title: "Nur mit Alpine-Symbol",
    desc: "Wir verkaufen ausschliesslich Ganzjahresreifen mit 3PMSF-Schneeflocke. Alles andere ist für uns kein echter Allwetterreifen.",
  },
  {
    icon: CalendarOff,
    title: "Kein Wechselstress",
    desc: "Ein Reifen, das ganze Jahr. Kein Termin zum Saisonwechsel, keine Lagerkosten – einfach aufziehen und vergessen.",
  },
];

const expertenMeinungen = [
  {
    title: "TCS-Testurteil",
    text: "Der TCS empfiehlt Ganzjahresreifen für Wenigfahrer im Flachland. Für Bergstrassen und Schnee raten sie weiterhin zu echten Winterreifen. Fazit: Ein vernünftiger Kompromiss – aber kein Ersatz für Spezialisten.",
  },
  {
    title: "ADAC-Einschätzung",
    text: "Laut ADAC eignen sich Allwetterreifen für Stadtfahrer mit unter 15'000 km pro Jahr. Bei Nässe und leichtem Schnee schneiden gute Modelle «befriedigend» ab – bei Extrembedingungen aber nicht.",
  },
  {
    title: "Unsere Erfahrung",
    text: "Wir sehen täglich, welche Reifen wie verschleissen. Ganzjahresreifen halten bei uns im Schnitt 2–3 Saisons. Für Pendler in der Stadt oft die klügere Wahl – für Vielfahrer oder Bergbewohner empfehlen wir Saisonreifen.",
  },
];

const empfehlungen = [
  {
    title: "Für Kleinwagen",
    text: "Continental AllSeasonContact oder Goodyear Vector 4Seasons – kompakte Allrounder, die im Stadtverkehr sicher und wirtschaftlich sind.",
  },
  {
    title: "Für Kompakt & Mittelklasse",
    text: "Michelin CrossClimate oder Vredestein Quatrac – die beliebtesten Modelle bei unseren Kunden. Zuverlässig bei Regen, Kälte und trockener Strasse.",
  },
  {
    title: "Für SUV & Crossover",
    text: "Nokian Seasonproof SUV oder Continental AllSeasonContact SUV – grössere Dimensionen mit gutem Nassgrip. Wir beraten dich, ob es für dein SUV reicht oder Saisonreifen besser passen.",
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
    q: "Für wen eignen sich Ganzjahresreifen wirklich?",
    a: "Ideal für Wenig- und Stadtfahrer im Flachland, die unter 15'000 km pro Jahr fahren. Wenn du selten in die Berge fährst und vorwiegend auf geräumten Strassen unterwegs bist, sind sie eine gute Wahl.",
  },
  {
    q: "Sind Ganzjahresreifen so gut wie echte Winterreifen?",
    a: "Ehrlich gesagt: Nein. Bei Schnee, Eis und Bergstrassen sind echte Winterreifen klar überlegen. Ganzjahresreifen sind ein Kompromiss – und wir sagen dir offen, ob er für dich reicht.",
  },
  {
    q: "Was bedeutet das Alpine-Symbol bei Ganzjahresreifen?",
    a: "Das Bergpiktogramm mit Schneeflocke (3PMSF) bestätigt, dass der Reifen strenge Winterperformance-Tests bestanden hat. Wir führen ausschliesslich Modelle mit diesem Symbol – alles andere wäre unseriös.",
  },
  {
    q: "Wie lange halten Ganzjahresreifen?",
    a: "Da sie das ganze Jahr gefahren werden, typischerweise 2–3 Saisons, je nach Kilometerleistung. Wir prüfen bei jeder Gelegenheit die Profiltiefe und sagen dir rechtzeitig Bescheid.",
  },
  {
    q: "Was sagt der TCS zu Ganzjahresreifen?",
    a: "Der TCS empfiehlt sie für Wenigfahrer im Flachland, rät aber für Bergstrassen und viel Schnee klar zu Winterreifen. Eine differenzierte Einschätzung, die wir aus unserer täglichen Praxis bestätigen können.",
  },
  {
    q: "Lohnt sich der Kompromiss finanziell?",
    a: "Oft ja: Du sparst einen Reifensatz, die Wechselkosten und die Einlagerung. Allerdings verschleissen Ganzjahresreifen schneller. Wir rechnen dir gerne vor, was für dein Fahrprofil günstiger kommt.",
  },
  {
    q: "Welche Marken führt ihr?",
    a: "Continental, Michelin, Goodyear, Vredestein, Nokian, Hankook und viele mehr – über 30 Marken. Wir empfehlen dir gezielt, was zu deinem Fahrzeug passt.",
  },
  {
    q: "Gibt es Ganzjahresreifen für Elektroautos?",
    a: "Ja, immer mehr Hersteller bieten spezielle Allwettermodelle mit optimiertem Rollwiderstand und leisem Abrollgeräusch für E-Autos an. Wir beraten dich gerne.",
  },
  {
    q: "Was kosten Ganzjahresreifen bei euch?",
    a: "Die Preise variieren je nach Marke, Grösse und Fahrzeugtyp. Wir haben Premium- und Budgetmodelle – für jeden Geldbeutel etwas. Nutze unser Online-Formular oder ruf uns an.",
  },
  {
    q: "Kann ich ohne Termin vorbeikommen?",
    a: "Klar! Einfach bei einem unserer Standorte in Oftringen oder Langenthal vorbeikommen. Beratung, Auswahl und Montage – alles vor Ort, ohne Wartezeit-Stress.",
  },
];

/* ── Page ── */

const Ganzjahresreifen = () => {
  const [anfrageOpen, setAnfrageOpen] = useState(false);

  useEffect(() => {
    document.title = "Ganzjahresreifen kaufen – Sofort ab Lager | Pneu 360 Oftringen & Langenthal";
  }, []);

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Ganzjahresreifen mit Alpine-Symbol bei Pneu 360. TCS & ADAC geprüft. Ehrliche Beratung, ob Allwetterreifen zu dir passen. Sofort ab Lager in Oftringen & Langenthal."
        />
        <link rel="canonical" href="https://pneu360.ch/ganzjahresreifen" />
      </Helmet>

      {/* ── Hero ── */}
      <ServicePageHero
        image={reifenGanzjahr}
        alt="Ganzjahresreifen Allwetter-Profil Nahaufnahme"
        label="Ein Reifen, alle Saisons"
        title="Ganzjahres-"
        titleAccent="reifen"
        subtitle="Der smarte Allrounder für Stadtfahrer und Wenigfahrer. Wir beraten dich ehrlich, ob Ganzjahresreifen zu deinem Fahrprofil passen – und wenn nicht, sagen wir dir das auch."
      >
        <AnfrageCompactButton label="Jetzt anfragen" onClick={() => setAnfrageOpen(true)} />
      </ServicePageHero>

      {/* ── Schnell-Infos ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Direkt auf den Punkt</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Warum</span><br />
            <span className="font-extrabold text-muted-foreground">Ganzjahresreifen?</span>
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
              <p className="text-brand-label text-muted-foreground mb-3">Der ehrliche Vergleich</p>
              <motion.h2
                {...headingReveal()}
                className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
              >
                <span className="font-light">Bremsweg im</span><br />
                <span className="font-extrabold text-muted-foreground">Vergleich</span>
              </motion.h2>
              <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl mb-10">
                Ganzjahresreifen sind ein Kompromiss – aber wie gross ist der wirklich? Wechsle zwischen Sommer- und Winterbedingungen und sieh selbst.
              </motion.p>
              <BremswegVergleich variant="ganzjahr" />
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
                  <Scale className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Der Kompromiss ist fair.</strong> Im Sommer 7 Meter mehr als Sommerreifen, im Winter 7 Meter mehr als Winterreifen. Für Stadtfahrer im Flachland oft völlig okay.
                  </p>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Aber kein Ersatz für Spezialisten.</strong> Wer regelmässig in die Berge fährt oder Vielfahrer ist, fährt mit Saisonreifen sicherer.
                  </p>
                </div>
                <div className="flex gap-3">
                  <TrendingDown className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Dafür sparst du.</strong> Kein zweiter Reifensatz, keine Wechselkosten, keine Einlagerung. Wir rechnen dir vor, was sich für dich lohnt.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Marken Logos ── */}
      <Marquee />

      {/* ── TCS & ADAC Expertenwissen ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-brand-label text-muted-foreground mb-3">Was sagen die Experten?</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
            >
              <span className="font-light">TCS, ADAC &</span><br />
              <span className="font-extrabold text-muted-foreground">unsere Meinung</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Ganzjahresreifen sind ein Kompromiss – das sagen nicht nur wir, sondern auch unabhängige
              Prüforganisationen. Hier die wichtigsten Erkenntnisse, kombiniert mit unserer täglichen Erfahrung.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {expertenMeinungen.map((item, i) => (
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
            <span className="font-light">Welcher Allwetter-</span><br />
            <span className="font-extrabold text-muted-foreground">reifen passt?</span>
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
          <p className="text-brand-label text-muted-foreground mb-3">Persönlich beraten lassen</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Komm vorbei &</span><br />
            <span className="font-extrabold text-muted-foreground">lass dich beraten</span>
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
        title="Unsicher ob Ganzjahresreifen passen?"
        text="Wir beraten dich ehrlich und ohne Druck. Komm vorbei oder frag online an – unser Team in Oftringen und Langenthal hilft dir, die richtige Entscheidung zu treffen."
        backgroundImage={ctaGanzjahrRoad}
      />

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Ganzjahresreifen",
            description: "Ganzjahresreifen mit Alpine-Symbol (3PMSF) aller Top-Marken sofort ab Lager bei Pneu 360.",
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

export default Ganzjahresreifen;

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Timer, CalendarOff, Wrench, ArrowRight, Search, Radio, CircleDot, Gauge, Droplets } from "lucide-react";

import ServicePageHero from "@/components/shared/ServicePageHero";
import BenefitsList from "@/components/shared/BenefitsList";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import PreisrechnerKonfigurator, { PreisrechnerStartButton } from "@/components/preisrechner/PreisrechnerKonfigurator";
import homeService from "@/assets/home-service.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Data ── */

const schnellInfos = [
  {
    icon: Timer,
    title: "Schnell erledigt",
    desc: "Du fährst vor, wir legen los. Kein Papierkram, keine Wartezeit. Du kannst im Perry Center oder Meilenstein einen Kaffee trinken – wir melden uns per E-Mail, wenn alles fertig ist.",
  },
  {
    icon: CalendarOff,
    title: "Ohne Termin",
    desc: "Kein Anruf, kein Online-Formular. Einfach vorbeikommen – auch samstags, an beiden Standorten. Wir sind bereit, wenn du es bist.",
  },
  {
    icon: Wrench,
    title: "Gründlich geprüft",
    desc: "RDKS-Sensoren ausgelesen und kalibriert, Luftdruck nach Herstellervorgabe, alle Radschrauben mit Drehmomentschlüssel angezogen. Bei uns gibts keine halben Sachen.",
  },
];

const PRICES = [
  { cat: "PW", sub: "alle Grössen", price: "CHF 65" },
  { cat: "SUV", sub: 'bis 18"', price: "CHF 65" },
  { cat: "SUV", sub: 'ab 19"', price: "CHF 75" },
  { cat: "Bus / LLKW", sub: "", price: "CHF 85" },
];

const EXTRAS = [
  { label: "Radwäsche (alle 4 Räder)", price: "CHF 30" },
];

const BENEFITS = [
  "Ohne Termin – einfach vorbeikommen",
  "Auswuchten der Vorderräder inklusive",
  "Nabenauflagefläche bei Bedarf gereinigt",
  "Luftdruck nach Herstellervorgabe eingestellt",
  "RDKS-Sensoren geprüft und kalibriert",
  "Radschrauben mit Drehmomentschlüssel angezogen",
  "Live-Status auf dem Bildschirm im Wartebereich",
  "E-Mail-Benachrichtigung wenn fertig",
  "An beiden Standorten verfügbar – auch samstags",
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

const FACHBLOECKE = [
  {
    icon: Search,
    title: "Räder-Check",
    text: "Wir schauen uns jedes Rad genau an – Profiltiefe, Risse, Felgenschäden, Rundlauf. Wenn was nicht stimmt, sagen wir's dir ehrlich. Kein Verkaufsdruck, sondern Klartext.",
  },
  {
    icon: Radio,
    title: "RDKS & Sensoren",
    text: "Die Reifendrucksensoren werden nach dem Wechsel ausgelesen und bei Bedarf per OBD neu angelernt. So geht kein Warnlicht an und du fährst sicher vom Hof.",
  },
  {
    icon: CircleDot,
    title: "Auswuchten",
    text: "Die Vorderräder werden bei jedem Radwechsel ausgewuchtet – das ist inklusive. Unwucht spürst du als Vibrationen im Lenkrad, besonders auf der Autobahn. Das muss nicht sein.",
  },
  {
    icon: Gauge,
    title: "Drehmoment & Luftdruck",
    text: "Alle Radschrauben werden mit dem Drehmomentschlüssel auf den Herstellerwert angezogen. Der Luftdruck wird gemäss Fahrzeugdatenblatt eingestellt – kein Schätzwert, kein Pi mal Daumen.",
  },
];

const FAQS = [
  { q: "Was ist der Unterschied zwischen Radwechsel und Reifenwechsel?", a: "Beim Radwechsel wird das komplette Rad (Reifen + Felge) getauscht – zum Beispiel von Sommer- auf Winterräder. Beim Reifenwechsel wird der Reifen von der Felge gezogen und ein neuer aufgezogen. Das braucht es, wenn die Reifen abgefahren sind." },
  { q: "Brauche ich einen Termin?", a: "Nein. Einfach vorbeikommen – kein Termin, kein Warten. Auch samstags." },
  { q: "Prüft ihr auch die RDKS-Sensoren?", a: "Ja. Nach dem Radwechsel werden die RDKS-Sensoren ausgelesen und bei Bedarf neu angelernt – das ist bei uns inklusive." },
  { q: "Werden die Räder auch ausgewuchtet?", a: "Die Vorderräder wuchten wir bei jedem Radwechsel aus – inklusive. Hinterräder auf Wunsch ebenfalls, das fällt kaum ins Gewicht." },
  { q: "Was prüft ihr beim Radwechsel genau?", a: "Profiltiefe, Felgenzustand, Rundlauf, RDKS-Sensoren, Luftdruck nach Herstellervorgabe und Drehmoment. Wenn uns was auffällt, sagen wir's dir direkt." },
  { q: "Was kostet ein Radwechsel?", a: "PW CHF 65, SUV bis 18\" auch CHF 65, SUV ab 19\" CHF 75, Bus/LLKW CHF 85 – alles inkl. MwSt. Optional: Radwäsche für alle 4 Räder CHF 30." },
  { q: "Wann sollte ich die Räder wechseln?", a: "Die Faustregel heisst «O bis O» – von Oktober bis Ostern Winterreifen, den Rest des Jahres Sommerreifen. Sobald die Temperaturen regelmässig unter 7 °C fallen, lohnt sich der Wechsel." },
  { q: "Kann ich während dem Radwechsel warten?", a: "Klar. Wir haben einen Wartebereich mit Live-Status auf dem Bildschirm. Oder du gehst im Perry Center oder Meilenstein shoppen – wir schicken dir eine E-Mail, wenn alles fertig ist." },
  { q: "Was passiert mit meinen alten Rädern?", a: "Du kannst sie bei uns einlagern – im Reifenhotel ab CHF 80 pro Saison inkl. Radwäsche." },
];

/* ── Page ── */

const Radwechsel = () => {
  const [preisrechnerOpen, setPreisrechnerOpen] = useState(false);

  useEffect(() => {
    document.title = "Radwechsel ohne Termin | Pneu 360 Oftringen & Langenthal";
  }, []);

  return (
    <>
      <Helmet>
        <meta name="description" content="Radwechsel ohne Termin bei Pneu 360. Inkl. Auswuchten, Luftdruck und RDKS-Check. Ab CHF 65 in Oftringen & Langenthal – auch samstags." />
        <link rel="canonical" href="https://pneu360.ch/radwechsel" />
      </Helmet>

      {/* ── Hero ── */}
      <ServicePageHero
        image={homeService}
        alt="Professioneller Radwechsel bei Pneu 360"
        label="Ohne Termin · Auch samstags"
        title="Radwechsel"
        subtitle="Räder tauschen ohne Stress – einfach vorbeikommen, wir kümmern uns um den Rest."
      >
        <PreisrechnerStartButton label="Kosten berechnen" onClick={() => setPreisrechnerOpen(true)} />
      </ServicePageHero>

      {/* ── Schnell-Infos ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Radwechsel bei Pneu 360</p>
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

      {/* ── Wann wechseln? ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-brand-label text-muted-foreground mb-3">Guter Zeitpunkt</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase"
            >
              <span className="font-light">Wann Räder</span><br />
              <span className="font-extrabold text-muted-foreground">wechseln?</span>
            </motion.h2>
          </div>
          <motion.div {...fadeIn()} className="space-y-5 text-brand-body text-muted-foreground">
            <p>
              Die alte Faustregel gilt immer noch: <strong className="text-foreground font-medium">«O bis O»</strong> – von Oktober bis Ostern fährst du am besten mit Winterreifen. Den Rest des Jahres mit Sommerreifen.
            </p>
            <p>
              Sobald die Temperaturen regelmässig unter 7 °C fallen, wird die Gummimischung von Sommerreifen hart – der Bremsweg verlängert sich deutlich. Umgekehrt sind Winterreifen bei Wärme zu weich und verschleissen schneller.
            </p>
            <p>
              Du bist unsicher? Komm einfach vorbei. Wir schauen uns die Reifen an und sagen dir ehrlich, ob ein Wechsel jetzt Sinn macht.
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
              <span className="font-extrabold text-muted-foreground">Radwechsel</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Festpreise, keine Überraschungen. Im Preis drin: Auswuchten der Vorderräder,
              RDKS-Check, Luftdruck und Drehmoment-Kontrolle.
            </motion.p>
          </div>

          <div className="space-y-0">
            {PRICES.map((p, i) => (
              <motion.div
                key={p.cat}
                {...staggerItem(i)}
                className="flex justify-between items-baseline border-b border-border py-6"
              >
                <div>
                  <span className="text-lg md:text-2xl font-bold tracking-[-0.02em] text-foreground">{p.cat}</span>
                  {p.sub && (
                    <span className="text-sm text-muted-foreground font-light ml-3">{p.sub}</span>
                  )}
                </div>
                <span className="text-2xl md:text-3xl font-bold text-foreground">{p.price}</span>
              </motion.div>
            ))}
          </div>

          {/* Extras */}
          <motion.div {...fadeIn()} className="mt-8 space-y-2">
            {EXTRAS.map((e) => (
              <div key={e.label} className="flex justify-between items-baseline max-w-xs">
                <span className="text-sm text-muted-foreground">{e.label}</span>
                <span className="text-sm text-muted-foreground font-medium">{e.price}</span>
              </div>
            ))}
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
            <p className="text-brand-label text-muted-foreground mb-3">So läuft's</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-8 md:mb-10"
            >
              <span className="font-light">Schnell &</span><br />
              <span className="font-extrabold text-muted-foreground">gründlich</span>
            </motion.h2>

            <motion.div {...fadeIn()} className="space-y-5 text-brand-body text-muted-foreground">
              <p>
                Du fährst vor – wir legen los. Dein Fahrzeug wird draussen digital erfasst
                und du siehst den Live-Status auf dem Bildschirm im Wartebereich.
              </p>
              <p>
                Wir prüfen den Luftdruck und die RDKS-Sensoren. Alle Radschrauben
                und Muttern werden mit dem Drehmomentschlüssel auf den vom Hersteller
                vorgegebenen Wert angezogen.
              </p>
              <p>
                Wenn alles fertig ist, bekommst du eine E-Mail. Falls du gerade
                im Perry Center oder Meilenstein unterwegs bist – perfekt, so vergeht
                die Zeit wie im Flug.
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
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
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
                Wer die Räder wechselt, kann sie gleich bei uns einlagern –
                klimatisiert, versichert, kein Schleppen. Vor der nächsten
                Saison erinnern wir dich automatisch.
              </p>
              <p className="text-foreground/85 text-sm">
                Einlagerung ab CHF 80 pro Saison · inkl. Radwäsche
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

      {/* ── Radwäsche ── */}
      <section className="bg-card py-20 md:py-28 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-16">
          <Droplets className="w-7 h-7 text-brand-accent flex-shrink-0" strokeWidth={1.5} />
          <div>
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-[-0.02em] text-foreground mb-2">
              Radwäsche
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              Saubere Räder vor dem Einlagern oder einfach so? Wir waschen alle 4 Räder für <strong className="text-foreground font-medium">CHF 30</strong>. Bei Einlagerung im Reifenhotel ist die Radwäsche inklusive.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Radwechsel vor Ort</p>
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
        title="Jetzt Räder wechseln"
        text="Einfach vorbeikommen – auch samstags, an beiden Standorten. Kein Termin nötig."
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
                name: "Radwechsel",
                provider: { "@type": "AutoRepair", name: "Pneu 360" },
                description: "Saisonaler Radwechsel ohne Termin. Inkl. Auswuchten, Luftdruckprüfung und RDKS-Kalibrierung.",
                areaServed: ["Oftringen", "Langenthal"],
                offers: [
                  { "@type": "Offer", priceCurrency: "CHF", price: "65", description: "PW alle Grössen" },
                  { "@type": "Offer", priceCurrency: "CHF", price: "65", description: 'SUV bis 18"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "75", description: 'SUV ab 19"' },
                  { "@type": "Offer", priceCurrency: "CHF", price: "85", description: "Bus / LLKW" },
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

export default Radwechsel;

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Package, Wrench } from "lucide-react";

import ServicePageHero from "@/components/shared/ServicePageHero";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import AnfrageKonfigurator, { AnfrageCompactButton } from "@/components/anfrage/AnfrageKonfigurator";
import reifenOffroad from "@/assets/reifen-offroad.jpg";
import ctaOffroadRoad from "@/assets/cta-offroad-road.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Offroad-Marken Logos ── */
import bfgoodrich from "@/assets/marken/bfgoodrich.svg";
import cooper from "@/assets/marken/cooper.svg";
import yokohama from "@/assets/marken/yokohama.svg";
import pirelli from "@/assets/marken/pirelli.svg";
import general from "@/assets/marken/general.svg";
import toyo from "@/assets/marken/toyo.svg";

const offroadLogos = [
  { name: "BF Goodrich", src: bfgoodrich },
  { name: "Cooper", src: cooper },
  { name: "Yokohama", src: yokohama },
  { name: "Pirelli", src: pirelli },
  { name: "General", src: general },
  { name: "Toyo", src: toyo },
];

/* ── Data ── */

const schnellInfos = [
  {
    icon: Shield,
    title: "Ehrliche Beratung",
    desc: "Wir sagen dir offen, ob AT oder MT für deinen Einsatz Sinn macht. Nicht jeder SUV braucht Mud-Terrain – wir beraten dich ehrlich und ohne Upselling.",
  },
  {
    icon: Package,
    title: "Schnell organisiert",
    desc: "Wir haben kein Offroad-Lager, aber wir organisieren dir die passenden Reifen schnell – meistens innerhalb von 24 Stunden oder noch am selben Tag.",
  },
  {
    icon: Wrench,
    title: "Schnell montiert",
    desc: "Auch grössere Dimensionen bis 35 Zoll montieren wir vor Ort – ohne Termin. Inklusive Beratung zu Höherlegungen und Fahrwerksanpassungen.",
  },
];

const offroadWissen = [
  {
    title: "AT vs. MT erklärt",
    text: "All-Terrain (AT) ist der vielseitige Allrounder: ca. 60 % Strasse, 40 % Gelände. Kombiniert Strassenlaufruhe mit Geländetauglichkeit. Mud-Terrain (MT) ist für echte Offroad-Einsätze – maximale Traktion auf Schlamm, Sand und Fels. Grobe Stollen sorgen für Selbstreinigung des Profils. Aus Erfahrung wissen wir: Viele SUV-Fahrer sind mit AT besser bedient als mit MT.",
  },
  {
    title: "MFK & Eintragung",
    text: "Bei grösseren Dimensionen als ab Werk kann eine MFK-Prüfung nötig sein. Das ist kein Problem – wir kennen den Prozess, beraten dich vor Ort und helfen beim Eintragungsprozess. So bist du legal und sicher unterwegs.",
  },
  {
    title: "Pflege & Haltbarkeit",
    text: "Offroad-Reifen sind robust, brauchen aber Aufmerksamkeit. Regelmässiger Reifendruck-Check ist Pflicht – besonders nach Geländefahrten. Wir prüfen bei jedem Besuch Profil und Seitenwände und sagen dir ehrlich, wann ein Wechsel fällig ist.",
  },
];

const empfehlungen = [
  {
    title: "Wochenend-Offroader",
    text: "Du fährst ab und zu über Schotterwege zum Wandern oder Biken? Ein guter AT-Reifen wie der BF Goodrich All-Terrain T/A KO2 gibt dir die nötige Sicherheit, ohne auf der Strasse Komfort einzubüssen.",
  },
  {
    title: "Overlander & Reise",
    text: "Wer lange Strecken über unbefestigte Pisten fährt, braucht Reifen mit verstärkten Seitenwänden und hoher Laufleistung. Cooper Discoverer AT3 oder General Grabber AT3 sind hier unsere Empfehlungen.",
  },
  {
    title: "Täglicher SUV-Fahrer",
    text: "Dein SUV ist hauptsächlich auf der Strasse unterwegs, aber du willst für Schnee und leichtes Gelände gerüstet sein? Ein AT-Reifen mit 3PMSF-Symbol ist die smarte Wahl – ganzjährig einsetzbar.",
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
    q: "Was ist der Unterschied zwischen AT und MT?",
    a: "AT (All-Terrain) ist der Allrounder: ca. 60 % Strasse, 40 % Gelände. MT (Mud-Terrain) ist für schweres Gelände konzipiert – Schlamm, Fels, Sand. Auf der Strasse sind MT-Reifen lauter und verschleissen schneller. Wir beraten dich, was zu deinem Einsatz passt.",
  },
  {
    q: "Kann ich Offroadreifen ganzjährig fahren?",
    a: "Viele AT-Reifen tragen das 3PMSF-Symbol (Schneeflocke) und sind damit wintertauglich. Für extreme Winterbedingungen in den Bergen empfehlen wir dennoch dedizierte Winterreifen – da sind wir ehrlich.",
  },
  {
    q: "Brauche ich eine MFK für Offroadreifen?",
    a: "Bei grösseren Dimensionen als ab Werk kann eine MFK-Prüfung nötig sein. Wir kennen den Prozess und helfen dir beim Eintragungsprozess – das ist für uns Routine.",
  },
  {
    q: "Welche Marken führt ihr?",
    a: "BF Goodrich, Cooper Discoverer, Yokohama Geolandar, Pirelli Scorpion, General Grabber, Toyo Open Country und weitere. Von Premium bis preiswert – wir finden den richtigen Reifen für dich.",
  },
  {
    q: "Montiert ihr auch grössere Reifen?",
    a: "Ja – wir montieren Reifen bis 35 Zoll und beraten bei Höherlegungen und Fahrwerksanpassungen. Einfach vorbeikommen, wir schauen uns dein Fahrzeug an.",
  },
  {
    q: "Brauche ich eine Höherlegung für grössere Reifen?",
    a: "Nicht immer. Bei einer Nummer grösser geht es oft ohne Anpassung. Bei deutlich grösseren Dimensionen empfehlen wir ein Höherlegungskit. Wir beraten dich vor Ort, was bei deinem Fahrzeug möglich ist.",
  },
  {
    q: "Was kosten Offroadreifen bei euch?",
    a: "Die Preise hängen von Marke, Grösse und Typ ab. Frag uns einfach direkt an – wir machen dir ein faires Angebot.",
  },
  {
    q: "Wie lange dauert die Montage?",
    a: "In der Regel 20 bis 30 Minuten – auch bei grösseren Dimensionen. Ohne Termin, einfach vorbeikommen.",
  },
  {
    q: "Kann ich Offroad-Reifen bei euch einlagern?",
    a: "Klar! In unserem Reifenhotel lagern wir deine Reifen fachgerecht ein – inklusive Reinigung und Profiltiefe-Check bei jedem Saisonwechsel.",
  },
];

/* ── Offroad-Marken Marquee ── */

const OffroadLogoSet = () => (
  <>
    {offroadLogos.map((m, i) => (
      <img
        key={i}
        src={m.src}
        alt={m.name}
        className="h-4 md:h-5 max-w-[100px] md:max-w-[120px] w-auto object-contain shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 [filter:brightness(0)] dark:[filter:none]"
      />
    ))}
  </>
);

/* ── Page ── */

const Offroadreifen = () => {
  const [anfrageOpen, setAnfrageOpen] = useState(false);

  useEffect(() => {
    document.title = "Offroadreifen kaufen – AT & MT Reifen | Pneu 360 Oftringen & Langenthal";
  }, []);

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Offroadreifen (AT & MT) bei Pneu 360. BF Goodrich, Cooper, Yokohama & mehr – schnell organisiert. Montage in 20 Min. Ohne Termin in Oftringen & Langenthal."
        />
        <link rel="canonical" href="https://pneu360.ch/offroadreifen" />
      </Helmet>

      {/* ── Hero ── */}
      <ServicePageHero
        image={reifenOffroad}
        alt="Offroad-Reifen für SUV und 4x4"
        label="Für Abenteuer gemacht"
        title="Offroad-"
        titleAccent="reifen"
        subtitle="AT- und MT-Reifen für Gelände, Schotter und Abenteuer – robust, vielseitig, schnell organisiert. Wir beraten dich ehrlich, welcher Reifen zu deinem Einsatz passt."
      >
        <AnfrageCompactButton label="Jetzt anfragen" onClick={() => setAnfrageOpen(true)} />
      </ServicePageHero>

      {/* ── Schnell-Infos ── */}
      <section className="bg-background py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Offroad bei Pneu 360</p>
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

      {/* ── Offroad-Marken Marquee ── */}
      <div className="relative overflow-hidden border-y border-border/50 bg-card/50 py-5 md:py-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex items-center gap-12 md:gap-20 animate-marquee w-max">
          <OffroadLogoSet />
          <OffroadLogoSet />
        </div>
      </div>

      {/* ── Offroad-Wissen ── */}
      <section className="bg-card py-24 md:py-32 lg:py-40 px-3 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-brand-label text-muted-foreground mb-3">Offroad-Wissen</p>
            <motion.h2
              {...headingReveal()}
              className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-5 md:mb-6"
            >
              <span className="font-light">Der richtige Reifen</span><br />
              <span className="font-extrabold text-muted-foreground">fürs Gelände</span>
            </motion.h2>
            <motion.p {...fadeIn()} className="text-brand-body text-muted-foreground max-w-xl">
              Ob Schotterweg, Waldpiste oder die Fahrt zum Skigebiet – Offroadreifen bieten die nötige
              Traktion und Robustheit, wenn Standardreifen an ihre Grenzen stossen. Wir erklären dir
              die wichtigsten Unterschiede.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {offroadWissen.map((item, i) => (
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
          <p className="text-brand-label text-muted-foreground mb-3">Empfehlungen nach Einsatz</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Welcher Offroad-</span><br />
            <span className="font-extrabold text-muted-foreground">reifen passt zu dir?</span>
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
          <p className="text-brand-label text-muted-foreground mb-3">Offroad-Beratung vor Ort</p>
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
        title="Bereit fürs Gelände?"
        text="Komm einfach vorbei oder frage deine Offroad-Reifen direkt online an. Unser Team in Oftringen und Langenthal berät dich ehrlich – auch bei Höherlegungen und Sondergrössen."
        backgroundImage={ctaOffroadRoad}
      />

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Offroadreifen",
            description: "AT- und MT-Offroadreifen für SUV und 4x4 bei Pneu 360.",
            brand: { "@type": "Organization", name: "Pneu 360" },
            offers: {
              "@type": "Offer",
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

export default Offroadreifen;

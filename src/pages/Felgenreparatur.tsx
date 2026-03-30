import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, ShieldCheck, Eye, Wrench, Sparkles, CircleDot, ArrowRight, Check, X } from "lucide-react";

import ServicePageHero from "@/components/shared/ServicePageHero";
import BenefitsList from "@/components/shared/BenefitsList";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import felgenAlu from "@/assets/felgen-alu.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ── Data ─────────────────────────────────────────────── */

const QUICK_INFO = [
  { icon: Clock, title: "Ohne Termin", text: "Einfach vorbeikommen – wir schauen uns deine Felgen direkt an." },
  { icon: ShieldCheck, title: "Jedes Budget", text: "Drei Methoden, drei Preisstufen – wir finden die passende Lösung." },
  { icon: Eye, title: "Ehrliche Diagnose", text: "Wir sagen dir offen, ob sich eine Reparatur lohnt oder nicht." },
];

const METHODS = [
  {
    icon: Wrench,
    name: "Smart Repair",
    price: "ab CHF 100",
    duration: "ca. 1–2 Stunden",
    desc: "Kleine Bordsteinschäden und Kratzer werden vor Ort geschliffen, gespachtelt und nachlackiert – schnell und kosteneffizient.",
    perfect: "Einzelne Kratzer, kleine Bordsteinschäden, Lackabplatzer",
  },
  {
    icon: CircleDot,
    name: "CNC-Abdrehen",
    price: "ab CHF 300",
    duration: "ca. 3–5 Arbeitstage",
    desc: "Glanzgedrehte (Diamond-Cut) Felgen werden auf der CNC-Drehbank plan abgedreht und erhalten ihren ursprünglichen Glanz zurück.",
    perfect: "Glanzgedrehte Felgen, tiefe Kratzer auf polierten Oberflächen",
  },
  {
    icon: Sparkles,
    name: "Pulverbeschichtung",
    price: "ab CHF 220",
    duration: "ca. 3–5 Arbeitstage",
    desc: "Komplett-Neubeschichtung im Ofen – extrem widerstandsfähig, in vielen Farben verfügbar. Ideal auch für Farbwechsel.",
    perfect: "Korrosion, grossflächige Schäden, Farbwechsel, Komplettaufbereitung",
  },
];

const STEPS = [
  { num: "01", title: "Diagnose & Foto", text: "Wir begutachten deine Felgen und dokumentieren jeden Schaden per Foto." },
  { num: "02", title: "Methode & Offerte", text: "Du bekommst eine klare Empfehlung mit Festpreis – keine versteckten Kosten." },
  { num: "03", title: "Reparatur & Abholung", text: "Wir reparieren, du holst ab. Bei Smart Repair oft am selben Tag." },
];

const FACHBLOECKE = [
  { title: "Bordsteinschäden", text: "Kratzer und Dellen durch Parkrempler oder Bordsteinkontakt. Je nach Tiefe per Smart Repair oder CNC lösbar." },
  { title: "Kratzer & Riefen", text: "Oberflächliche und tiefere Kratzer werden plan geschliffen und neu beschichtet – das Ergebnis: wie neu." },
  { title: "Korrosion & Lackschäden", text: "Oxidation und abblätternder Lack werden komplett entfernt. Pulverbeschichtung schützt dauerhaft." },
  { title: "Glanzgedrehte Felgen", text: "Diamond-Cut Felgen erfordern CNC-Abdrehen. Wir stellen den originalen Glanz wieder her – präzise auf der Drehbank." },
];

const REPARIERBAR = [
  "Bordsteinkratzer und leichte Dellen",
  "Lackabplatzer und Oberflächenkratzer",
  "Korrosion und Oxidation",
  "Matte, polierte und bicolor Oberflächen",
];

const NICHT_REPARIERBAR = [
  "Strukturelle Risse (sicherheitsrelevant)",
  "Starke Verformungen / Achter",
  "Felgen, die geschweisst werden müssten",
  "Schäden am Felgenhorn mit Luftverlust",
];

const BENEFITS = [
  "Drei Reparaturmethoden für jeden Schaden",
  "Festpreis nach Diagnose – keine Überraschungen",
  "Ergebnis wie neu – optisch und strukturell",
  "Auch matte, polierte und bicolor Felgen",
  "Auch Spezialfelgen und grosse Dimensionen",
  "Farbwechsel per Pulverbeschichtung möglich",
  "Auch während Reifenhotel-Einlagerung möglich",
  "Kurze Durchlaufzeiten – Smart Repair oft am selben Tag",
];

const FAQS = [
  { q: "Welche Felgenschäden könnt ihr reparieren?", a: "Bordsteinschäden, Kratzer, Dellen, Korrosion und abgeblätterte Beschichtungen. Bei strukturellen Rissen empfehlen wir aus Sicherheitsgründen den Ersatz – Schweissen machen wir bewusst nicht." },
  { q: "Was kostet eine Felgenreparatur?", a: "Smart Repair ab CHF 100 pro Felge, CNC-Abdrehen ab CHF 300, Pulverbeschichtung ab CHF 220 pro Felge. Den genauen Preis bekommst du nach der Diagnose als Festpreis." },
  { q: "Wie lange dauert die Reparatur?", a: "Smart Repair oft am selben Tag (1–2 Stunden). CNC-Abdrehen und Pulverbeschichtung dauern ca. 3–5 Arbeitstage." },
  { q: "Können auch matte oder bicolor Felgen repariert werden?", a: "Ja – wir reparieren auch matte, polierte und bicolor Oberflächen. Sprich uns direkt an, damit wir die passende Methode wählen." },
  { q: "Was ist CNC-Abdrehen (Diamond Cut)?", a: "Glanzgedrehte Felgen werden auf einer CNC-Drehbank plan abgedreht. Dabei entsteht die typische spiegelnde Oberfläche neu. Anschliessend wird die Felge versiegelt." },
  { q: "Kann ich die Farbe meiner Felgen ändern?", a: "Ja – per Pulverbeschichtung ist ein Farbwechsel in vielen RAL-Tönen möglich. Wir beraten dich gerne vor Ort." },
  { q: "Sind strukturelle Risse reparierbar?", a: "Nein – Risse in der Felgenstruktur sind sicherheitsrelevant. Wir schweissen grundsätzlich keine Felgen und empfehlen in diesem Fall den Ersatz." },
  { q: "Kann ich die Felgen während der Einlagerung reparieren lassen?", a: "Ja – das ist sogar ideal. Wenn deine Räder im Reifenhotel eingelagert sind, reparieren wir sie in der Zwischenzeit. Beim nächsten Saisonwechsel bekommst du sie frisch zurück." },
];

/* ── Component ────────────────────────────────────────── */

const Felgenreparatur = () => {
  useEffect(() => {
    document.title = "Felgenreparatur – Smart Repair, CNC & Pulverbeschichtung | Pneu 360";
  }, []);

  return (
    <>
      <Helmet>
        <meta name="description" content="Felgenreparatur bei Pneu 360: Smart Repair ab CHF 100, CNC-Abdrehen ab CHF 300, Pulverbeschichtung ab CHF 220. Professionell und preisfair in Oftringen & Langenthal." />
        <link rel="canonical" href="https://pneu360.ch/felgenreparatur" />
      </Helmet>

      {/* 1 — Hero */}
      <ServicePageHero
        image={felgenAlu}
        alt="Felgenreparatur bei Pneu 360"
        label="Smart Repair · CNC · Pulverbeschichtung"
        title="Felgen"
        titleAccent="reparatur"
        subtitle="Bordsteinschäden, Kratzer oder Komplett-Neubeschichtung – drei Methoden, ein Ziel: wie neu."
      />

      {/* 2 — Schnell-Info */}
      <section className="bg-background px-3 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_INFO.map((item, i) => (
            <motion.div
              key={item.title}
              {...staggerItem(i)}
              className="border border-border p-8 md:p-10"
            >
              <item.icon className="w-5 h-5 text-brand-accent mb-5" strokeWidth={1.5} />
              <h3 className="text-base font-bold tracking-[-0.01em] mb-2">{item.title}</h3>
              <p className="text-brand-body text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3 — Unsere Methoden (3 Karten) */}
      <section className="bg-card px-3 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Drei Methoden</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Die passende</span><br />
            <span className="font-extrabold text-muted-foreground">Lösung für jeden Schaden</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {METHODS.map((m, i) => (
              <motion.div
                key={m.name}
                {...staggerItem(i)}
                className="border border-border p-8 md:p-10 flex flex-col"
              >
                <m.icon className="w-5 h-5 text-brand-accent mb-5" strokeWidth={1.5} />
                <h3 className="text-base font-bold tracking-[-0.01em] mb-1">{m.name}</h3>
                <p className="text-2xl font-extrabold tracking-[-0.02em] text-brand-accent mb-1">{m.price}</p>
                <p className="text-xs text-muted-foreground mb-5">{m.duration}</p>
                <p className="text-brand-body text-muted-foreground mb-6">{m.desc}</p>
                <p className="text-xs text-muted-foreground/60 mt-auto">
                  <span className="font-semibold text-foreground/70">Perfekt für:</span> {m.perfect}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — So läuft's (3 Schritte) */}
      <section className="bg-background px-3 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Ablauf</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">In drei Schritten</span><br />
            <span className="font-extrabold text-muted-foreground">wie neu</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.num}
                {...staggerItem(i)}
                className="border border-border p-8 md:p-10"
              >
                <span className="text-3xl font-black text-brand-accent/20 leading-none">{s.num}</span>
                <h3 className="text-base font-bold tracking-[-0.01em] mt-4 mb-2">{s.title}</h3>
                <p className="text-brand-body text-muted-foreground">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Was wir reparieren (4 Fachblöcke) */}
      <section className="bg-card px-3 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Fachgebiete</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Was wir</span><br />
            <span className="font-extrabold text-muted-foreground">reparieren</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FACHBLOECKE.map((b, i) => (
              <motion.div
                key={b.title}
                {...staggerItem(i)}
                className="border border-border p-8 md:p-10"
              >
                <h3 className="text-base font-bold tracking-[-0.01em] mb-2">{b.title}</h3>
                <p className="text-brand-body text-muted-foreground">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Reparierbar vs. Nicht reparierbar */}
      <section className="bg-background px-3 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Einschätzung</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Reparieren</span><br />
            <span className="font-extrabold text-muted-foreground">oder ersetzen?</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div {...fadeIn()} className="border border-border p-8 md:p-10">
              <p className="text-xs font-bold tracking-[2px] uppercase text-brand-accent mb-6">Reparierbar</p>
              <div className="space-y-4">
                {REPARIERBAR.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-accent flex-shrink-0 mt-[3px]" strokeWidth={2} />
                    <span className="text-base text-foreground/90 font-light leading-[1.85]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeIn(0.1)} className="border border-border p-8 md:p-10">
              <p className="text-xs font-bold tracking-[2px] uppercase text-muted-foreground mb-6">Nicht reparierbar</p>
              <div className="space-y-4">
                {NICHT_REPARIERBAR.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-[3px]" strokeWidth={2} />
                    <span className="text-base text-muted-foreground font-light leading-[1.85]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7 — Benefits */}
      <section className="bg-card px-3 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-[900px] mx-auto">
          <p className="text-brand-label text-muted-foreground mb-3">Vorteile</p>
          <motion.h2
            {...headingReveal()}
            className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16"
          >
            <span className="font-light">Warum reparieren</span><br />
            <span className="font-extrabold text-muted-foreground">statt ersetzen?</span>
          </motion.h2>
          <motion.div {...fadeIn()}>
            <BenefitsList items={BENEFITS} />
          </motion.div>
        </div>
      </section>

      {/* 8 — Cross-Sell */}
      <section className="bg-background px-3 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div {...fadeIn()} className="border border-border p-8 md:p-10">
            <p className="text-xs font-bold tracking-[2px] uppercase text-brand-accent mb-4">Tipp</p>
            <h3 className="text-lg font-bold tracking-[-0.01em] mb-3">Felgen reparieren während der Einlagerung</h3>
            <p className="text-brand-body text-muted-foreground mb-6">
              Deine Räder sind im Reifenhotel? Perfekt – wir reparieren sie in der Zwischenzeit. Beim nächsten Wechsel bekommst du sie frisch zurück.
            </p>
            <Link to="/reifenhotel" className="inline-flex items-center gap-2 text-brand-accent text-sm font-semibold hover:gap-3 transition-all">
              Zum Reifenhotel <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div {...fadeIn(0.1)} className="border border-border p-8 md:p-10">
            <p className="text-xs font-bold tracking-[2px] uppercase text-brand-accent mb-4">Alternativ</p>
            <h3 className="text-lg font-bold tracking-[-0.01em] mb-3">Neue Felgen gesucht?</h3>
            <p className="text-brand-body text-muted-foreground mb-6">
              Wenn eine Reparatur nicht mehr sinnvoll ist, findest du bei uns eine grosse Auswahl an Alufelgen und Kompletträdern.
            </p>
            <Link to="/reifen" className="inline-flex items-center gap-2 text-brand-accent text-sm font-semibold hover:gap-3 transition-all">
              Felgen & Reifen entdecken <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 9 — FAQ */}
      <PageFAQ items={FAQS} stickyLayout title="Gut zu wissen" />

      {/* 10 — CTA */}
      <InlineCTA
        title="Felgen begutachten lassen"
        text="Komm einfach vorbei – wir beraten dich ehrlich und unverbindlich."
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Felgenreparatur",
            provider: {
              "@type": "LocalBusiness",
              name: "Pneu 360",
              url: "https://pneu360.ch",
            },
            description: "Professionelle Felgenreparatur: Smart Repair, CNC-Abdrehen und Pulverbeschichtung.",
            areaServed: "Schweiz",
            url: "https://pneu360.ch/felgenreparatur",
          }),
        }}
      />
    </>
  );
};

export default Felgenreparatur;

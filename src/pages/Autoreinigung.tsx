import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, HandMetal, MessageCircle, Sparkles, ShieldCheck, Droplets, Bug, Cigarette, Baby, Dog, Car } from "lucide-react";

import ServicePageHero from "@/components/shared/ServicePageHero";
import BenefitsList from "@/components/shared/BenefitsList";
import InlineCTA from "@/components/shared/InlineCTA";
import PageFAQ from "@/components/shared/PageFAQ";
import homeService from "@/assets/home-service.jpg";
import { fadeIn, headingReveal, staggerItem } from "@/components/home/animations";

/* ───── data ───── */

const QUICK_INFO = [
  { icon: Clock, title: "Ohne Termin", text: "Einfach vorbeikommen – wir schauen uns dein Auto an und besprechen den Umfang." },
  { icon: HandMetal, title: "Handarbeit", text: "Jedes Auto wird von Hand gereinigt – mit professionellen Produkten und viel Sorgfalt." },
  { icon: MessageCircle, title: "Ehrliche Beratung", text: "Wir sagen dir, was sinnvoll ist – und was nicht. Kein Upselling." },
];

const SERVICES = [
  {
    icon: Sparkles,
    name: "Innenreinigung",
    desc: "Gründlich saugen, Armaturen pflegen, Fenster innen reinigen, Fussmatten waschen.",
    includes: ["Staubsaugen", "Armaturenpflege", "Fenster innen", "Fussmatten"],
  },
  {
    icon: Droplets,
    name: "Sitzwäsche & Polster",
    desc: "Stoffsitze und Polster werden shampooniert und tiefengereinigt. Flecken und Gerüche verschwinden.",
    includes: ["Shampoonieren", "Fleckenentfernung", "Trocknung", "Geruchsneutralisation"],
  },
  {
    icon: ShieldCheck,
    name: "Lederpflege",
    desc: "Leder wird schonend gereinigt und versiegelt – für Geschmeidigkeit und Langlebigkeit.",
    includes: ["Lederreinigung", "Versiegelung", "Farbauffrischung", "Pflege"],
  },
  {
    icon: Bug,
    name: "Spezialbehandlung",
    desc: "Ozonbehandlung gegen Gerüche, Tierhaarentfernung mit Spezialwerkzeug, Teppiche shampoonieren.",
    includes: ["Ozonbehandlung", "Tierhaarentfernung", "Teppiche", "Geruchsbeseitigung"],
  },
];

const PRICES = [
  { service: "Innenreinigung", price: "ab CHF 80" },
  { service: "Sitzwäsche / Polsterreinigung", price: "ab CHF 60" },
  { service: "Ozonbehandlung", price: "ab CHF 50" },
  { service: "Lederpflege", price: "ab CHF 60" },
  { service: "Tierhaarentfernung", price: "ab CHF 40" },
  { service: "Teppiche shampoonieren", price: "ab CHF 40" },
];

const STEPS = [
  { num: "01", title: "Vorbeikommen", text: "Bring dein Auto vorbei – wir schauen uns den Zustand an und besprechen, was sinnvoll ist." },
  { num: "02", title: "Reinigung", text: "Wir reinigen dein Auto von Hand – genau nach deinen Wünschen, gründlich und sorgfältig." },
  { num: "03", title: "Abholung", text: "Du holst dein sauberes Auto ab – oder wir bringen es dir auf Wunsch zurück." },
];

const SITUATIONEN = [
  { icon: Cigarette, title: "Rauch oder muffiger Geruch", text: "Ozon neutralisiert Gerüche auf molekularer Ebene – wirkt nachhaltig, ohne Chemie und ohne Parfüm.", empfehlung: "Ozonbehandlung" },
  { icon: Baby, title: "Kinder, Essen, Flecken", text: "Krümel, verschüttete Getränke, Schokolade auf dem Sitz – wir kriegen das raus. Versprochen.", empfehlung: "Sitzwäsche + Innenreinigung" },
  { icon: Dog, title: "Hund fährt immer mit", text: "Haare in jeder Ritze, Geruch im Polster – mit Spezialwerkzeug und Ozon wird dein Auto wieder hundefrei.", empfehlung: "Tierhaarentfernung + Ozon" },
  { icon: Car, title: "Gebrauchtwagen gekauft", text: "Du weisst nicht, was vorher drin war? Wir machen Tabula rasa – komplett reinigen, desinfizieren, auffrischen.", empfehlung: "Komplett-Reinigung" },
];

const BENEFITS = [
  "Kombinierbar mit Radwechsel oder Einlagerung",
  "Abholservice auf Anfrage verfügbar",
  "Professionelle Produkte für jede Oberfläche",
  "Auch als Geschenkgutschein erhältlich",
  "An beiden Standorten buchbar",
  "Faire Preise – du zahlst nur was nötig ist",
];

const FAQS = [
  { q: "Was kostet eine Autoreinigung?", a: "Die Innenreinigung startet ab CHF 80, Sitzwäsche ab CHF 60. Der genaue Preis hängt vom Zustand und Umfang ab – wir beraten dich ehrlich vor Ort." },
  { q: "Wie lange dauert die Reinigung?", a: "Eine Innenreinigung dauert ca. 1–2 Stunden. Sitzwäsche oder Ozonbehandlung brauchen etwas länger – je nach Zustand 2–4 Stunden." },
  { q: "Gibt es einen Abhol- und Bringservice?", a: "Ja – auf Anfrage holen wir dein Auto ab und bringen es sauber zurück. Ruf uns einfach an." },
  { q: "Kann ich Reinigung und Radwechsel kombinieren?", a: "Ja – sehr beliebt! Räder wechseln und das Auto gleich innen auffrischen. Spart Zeit und dein Auto ist rundherum gepflegt." },
  { q: "Entfernt ihr auch Tierhaare?", a: "Ja – mit Spezialwerkzeug und Druckluft holen wir auch hartnäckige Tierhaare aus Polstern, Teppichen und Ritzen." },
  { q: "Was bringt eine Ozonbehandlung?", a: "Ozon neutralisiert Gerüche auf molekularer Ebene – ideal bei Rauch, Tier oder muffigem Innenraum. Wirkt nachhaltig und ohne Chemie." },
  { q: "Reinigt ihr auch Leder?", a: "Ja – Leder wird schonend gereinigt und anschliessend versiegelt. So bleibt es geschmeidig und sieht lange gut aus." },
  { q: "Gibt es Geschenkgutscheine?", a: "Ja – eine Autoreinigung ist ein super Geschenk. Frag einfach an einem unserer Standorte nach einem Gutschein." },
];

/* ───── component ───── */

const Autoreinigung = () => (
  <>
    <Helmet>
      <title>Autoreinigung – Innenreinigung, Sitzwäsche & Ozon | Pneu 360</title>
      <meta name="description" content="Professionelle Autoreinigung bei Pneu 360: Innenreinigung ab CHF 80, Sitzwäsche, Ozonbehandlung, Tierhaarentfernung, Lederpflege. Handarbeit in Oftringen & Langenthal." />
      <link rel="canonical" href="https://pneu360.ch/autoreinigung" />
    </Helmet>

    {/* 1 — Hero */}
    <ServicePageHero
      image={homeService}
      alt="Professionelle Autoreinigung bei Pneu 360"
      label="Innenreinigung · Sitzwäsche · Ozon"
      title="Auto"
      titleAccent="reinigung"
      subtitle="Innenreinigung, Sitzwäsche, Ozonbehandlung, Lederpflege – von Hand, gründlich, fair bepreist."
    />

    {/* 2 — Schnell-Info */}
    <section className="bg-background px-3 md:px-6 py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {QUICK_INFO.map((item, i) => (
          <motion.div key={item.title} {...staggerItem(i)} className="border border-border p-8 md:p-10">
            <item.icon className="w-5 h-5 text-brand-accent mb-5" strokeWidth={1.5} />
            <h3 className="text-base font-bold tracking-[-0.01em] mb-3">{item.title}</h3>
            <p className="text-sm text-muted-foreground font-light leading-[1.8]">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* 3 — Leistungen */}
    <section className="bg-card px-3 md:px-6 py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-brand-label text-muted-foreground mb-3">Leistungen</p>
        <motion.h2 {...headingReveal()} className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16">
          <span className="font-light">Was wir</span><br />
          <span className="font-extrabold text-muted-foreground">für dein Auto tun</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div key={s.name} {...staggerItem(i)} className="border border-border p-8 md:p-10">
              <s.icon className="w-5 h-5 text-brand-accent mb-5" strokeWidth={1.5} />
              <h3 className="text-base font-bold tracking-[-0.01em] mb-3">{s.name}</h3>
              <p className="text-sm text-muted-foreground font-light leading-[1.8] mb-5">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.includes.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground bg-muted px-3 py-1">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* 4 — Preise */}
    <section className="bg-background px-3 md:px-6 py-24 md:py-32 lg:py-40">
      <div className="max-w-[900px] mx-auto">
        <p className="text-brand-label text-muted-foreground mb-3">Preise</p>
        <motion.h2 {...headingReveal()} className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16">
          <span className="font-light">Transparent</span><br />
          <span className="font-extrabold text-muted-foreground">und fair</span>
        </motion.h2>

        <motion.div {...fadeIn()} className="border border-border divide-y divide-border">
          {PRICES.map((p) => (
            <div key={p.service} className="flex items-center justify-between px-6 md:px-8 py-5">
              <span className="text-sm font-medium">{p.service}</span>
              <span className="text-sm font-bold text-brand-accent">{p.price}</span>
            </div>
          ))}
        </motion.div>
        <motion.p {...fadeIn(0.2)} className="text-xs text-muted-foreground/60 mt-5 leading-[1.7]">
          Endpreis je nach Zustand und Aufwand – wir beraten dich ehrlich vor Ort.
        </motion.p>
      </div>
    </section>

    {/* 5 — Ablauf */}
    <section className="bg-card px-3 md:px-6 py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-brand-label text-muted-foreground mb-3">Ablauf</p>
        <motion.h2 {...headingReveal()} className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16">
          <span className="font-light">So</span><br />
          <span className="font-extrabold text-muted-foreground">läuft's</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div key={step.num} {...staggerItem(i)} className="border border-border p-8 md:p-10">
              <span className="text-3xl font-black text-brand-accent/20 leading-none block mb-5">{step.num}</span>
              <h3 className="text-base font-bold tracking-[-0.01em] mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-[1.8]">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* 6 — Typische Situationen */}
    <section className="bg-background px-3 md:px-6 py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-brand-label text-muted-foreground mb-3">Kennst du das?</p>
        <motion.h2 {...headingReveal()} className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16">
          <span className="font-light">Typische</span><br />
          <span className="font-extrabold text-muted-foreground">Situationen</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SITUATIONEN.map((s, i) => (
            <motion.div key={s.title} {...staggerItem(i)} className="border border-border p-8 md:p-10">
              <s.icon className="w-5 h-5 text-brand-accent mb-5" strokeWidth={1.5} />
              <h3 className="text-base font-bold tracking-[-0.01em] mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-[1.8] mb-4">{s.text}</p>
              <span className="text-[11px] font-medium tracking-wide uppercase text-brand-accent bg-brand-accent/10 px-3 py-1">
                Unsere Empfehlung: {s.empfehlung}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* 7 — Benefits */}
    <section className="bg-card px-3 md:px-6 py-24 md:py-32 lg:py-40">
      <div className="max-w-[900px] mx-auto">
        <p className="text-brand-label text-muted-foreground mb-3">Vorteile</p>
        <motion.h2 {...headingReveal()} className="text-brand-heading leading-[1.08] tracking-[-0.03em] uppercase mb-12 md:mb-16">
          <span className="font-light">Warum</span><br />
          <span className="font-extrabold text-muted-foreground">Pneu 360?</span>
        </motion.h2>
        <motion.div {...fadeIn()}>
          <BenefitsList items={BENEFITS} />
        </motion.div>
      </div>
    </section>

    {/* 8 — Cross-Sell */}
    <section className="bg-background px-3 md:px-6 py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div {...staggerItem(0)} className="border border-border p-8 md:p-10">
          <p className="text-brand-label text-muted-foreground mb-3">Kombi-Tipp</p>
          <h3 className="text-lg font-bold tracking-[-0.02em] mb-3">Räder wechseln & Auto reinigen</h3>
          <p className="text-sm text-muted-foreground font-light leading-[1.8] mb-5">
            Sehr beliebt: Beim Radwechsel gleich die Innenreinigung mitmachen. Spart Zeit – und dein Auto ist rundherum gepflegt.
          </p>
          <Link to="/radwechsel" className="text-sm font-semibold text-brand-accent hover:underline">Zum Radwechsel →</Link>
        </motion.div>
        <motion.div {...staggerItem(1)} className="border border-border p-8 md:p-10">
          <p className="text-brand-label text-muted-foreground mb-3">Gleich mitmachen</p>
          <h3 className="text-lg font-bold tracking-[-0.02em] mb-3">Felgen auffrischen & Auto reinigen</h3>
          <p className="text-sm text-muted-foreground font-light leading-[1.8] mb-5">
            Smart Repair für deine Felgen dauert oft nur 1–2 Stunden. Perfekt kombinierbar mit der Innenreinigung – alles am gleichen Tag erledigt.
          </p>
          <Link to="/felgenreparatur" className="text-sm font-semibold text-brand-accent hover:underline">Zur Felgenreparatur →</Link>
        </motion.div>
      </div>
    </section>

    {/* 9 — FAQ */}
    <PageFAQ items={FAQS} stickyLayout title="Gut zu wissen" />

    {/* CTA */}
    <InlineCTA
      title="Auto reinigen lassen"
      text="Einfach vorbeikommen oder anrufen – wir kümmern uns um den Rest."
    />

    {/* JSON-LD */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Autoreinigung",
      provider: { "@type": "LocalBusiness", name: "Pneu 360", url: "https://pneu360.ch" },
      description: "Professionelle Autoreinigung: Innenreinigung, Sitzwäsche, Ozonbehandlung, Tierhaarentfernung, Lederpflege. Handarbeit in Oftringen & Langenthal.",
      areaServed: { "@type": "Country", name: "CH" },
      url: "https://pneu360.ch/autoreinigung",
    }) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }) }} />
  </>
);

export default Autoreinigung;

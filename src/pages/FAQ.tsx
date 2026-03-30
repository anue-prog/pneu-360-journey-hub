import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ServicePageHero from "@/components/shared/ServicePageHero";
import InlineCTA from "@/components/shared/InlineCTA";
import ContentBlock from "@/components/shared/ContentBlock";
import { faqs } from "@/data/siteData";

const ease = [0.16, 1, 0.3, 1] as const;

const headingReveal = {
  initial: { clipPath: "inset(0 0 100% 0)", y: 12, opacity: 0 },
  whileInView: { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.9, ease },
};

/* ── Kategorien ──────────────────────────────────── */
const categories = [
  {
    label: "Allgemein",
    heading: "Gut zu wissen",
    items: faqs.filter((_, i) => [0, 3, 4, 10, 14].includes(i)),
  },
  {
    label: "Preise & Kosten",
    heading: "Transparente Konditionen",
    items: faqs.filter((_, i) => [2, 13].includes(i)),
  },
  {
    label: "Reifen & Felgen",
    heading: "Rund ums Rad",
    items: faqs.filter((_, i) => [5, 7, 8, 9].includes(i)),
  },
  {
    label: "Autoreinigung",
    heading: "Sauber & gepflegt",
    items: faqs.filter((_, i) => [6, 12].includes(i)),
  },
  {
    label: "Standorte & Zeiten",
    heading: "Wo & wann",
    items: faqs.filter((_, i) => [1, 11].includes(i)),
  },
];

/* ── Accordion ───────────────────────────────────── */
const FaqAccordion = ({ items }: { items: { q: string; a: string }[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => (
        <motion.div
          key={item.q}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.05, ease }}
          className="border-b border-border/20"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between py-7 text-left group"
          >
            <span
              className={`text-base font-semibold tracking-[-0.01em] pr-4 transition-colors duration-300 ${
                openIndex === i ? "text-brand-accent" : ""
              }`}
            >
              {item.q}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                openIndex === i ? "rotate-180 text-brand-accent" : ""
              }`}
            />
          </button>
          <motion.div
            initial={false}
            animate={{
              height: openIndex === i ? "auto" : 0,
              opacity: openIndex === i ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
          >
            <p className="pb-7 text-base text-muted-foreground font-light leading-[1.9]">
              {item.a}
            </p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

/* ── Kategorie-Sektion ───────────────────────────── */
const CategorySection = ({
  label,
  heading,
  items,
  alternate,
}: {
  label: string;
  heading: string;
  items: { q: string; a: string }[];
  alternate: boolean;
}) => (
  <section className={`${alternate ? "bg-background" : "bg-card"} px-3 md:px-6 py-24 md:py-32`}>
    <div className="max-w-[800px] mx-auto">
      <ContentBlock className="mb-14">
        <p className="text-brand-label text-brand-accent mb-3">{label}</p>
        <motion.h2
          {...headingReveal}
          className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-[-0.03em] uppercase leading-[1.1]"
        >
          {heading}
        </motion.h2>
        <div className="w-12 h-[2px] bg-brand-accent mt-6" />
      </ContentBlock>
      <FaqAccordion items={items} />
    </div>
  </section>
);

/* ── Page ─────────────────────────────────────────── */
const FAQ = () => {
  useEffect(() => {
    document.title = "FAQ – Pneu 360 | Häufige Fragen zu Reifen, Preisen & Terminen";
  }, []);

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Antworten auf die häufigsten Fragen zu Reifen, Radwechsel, Autoreinigung, Preisen und unseren Standorten in Oftringen und Langenthal."
        />
        <link rel="canonical" href="https://pneu360.ch/faq" />
      </Helmet>

      <ServicePageHero
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
        alt="FAQ – Häufige Fragen bei Pneu 360"
        label="FAQ · Alles auf einen Blick"
        title="Häufige"
        titleAccent="Fragen"
        subtitle="Schnelle Antworten auf deine wichtigsten Fragen rund um Reifen, Service und Termine."
      />

      {categories.map((cat, i) => (
        <CategorySection
          key={cat.label}
          label={cat.label}
          heading={cat.heading}
          items={cat.items}
          alternate={i % 2 === 1}
        />
      ))}

      <InlineCTA
        label="Nicht gefunden?"
        title="Frage nicht dabei?"
        text="Schreib uns direkt – wir antworten schnell und unkompliziert."
        buttonText="Kontakt aufnehmen"
        buttonTo="/kontakt"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
    </>
  );
};

export default FAQ;

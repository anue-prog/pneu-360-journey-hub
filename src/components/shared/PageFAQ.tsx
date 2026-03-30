import { motion } from "framer-motion";
import ContentBlock from "@/components/shared/ContentBlock";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface PageFAQProps {
  items: { q: string; a: string }[];
  jsonLd?: boolean;
  pageUrl?: string;
  title?: string;
  stickyLayout?: boolean;
  number?: string;
}

const headingReveal = {
  initial: { clipPath: "inset(0 0 100% 0)", y: 12, opacity: 0 },
  whileInView: { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

const FaqAccordion = ({ items }: { items: PageFAQProps["items"] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-border/20"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between py-7 text-left group"
          >
            <span className={`text-base font-semibold tracking-[-0.01em] pr-4 transition-colors duration-300 ${openIndex === i ? "text-brand-accent" : ""}`}>
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
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

const PageFAQ = ({ items, jsonLd = true, title = "Gut zu wissen", stickyLayout = false, number }: PageFAQProps) => {
  return (
    <section className="bg-card px-3 md:px-6 py-32 md:py-48">
      <div className={stickyLayout ? "max-w-[1400px] mx-auto" : "max-w-[800px] mx-auto"}>
        {stickyLayout ? (
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 md:gap-24">
            {/* Sticky left column */}
            <div className="md:sticky md:top-24 md:self-start">
              <div className={number ? "flex items-start gap-5" : ""}>
                {number && (
                  <span className="text-section-number text-brand-accent opacity-30 leading-none -mt-2">{number}</span>
                )}
                <div>
                  <p className="text-[11px] md:text-[10px] font-medium tracking-[4px] uppercase text-brand-accent mb-3">
                    Fragen
                  </p>
                  <motion.h2 {...headingReveal} className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-[-0.03em] uppercase leading-[1.1]">
                    {title}
                  </motion.h2>
                  <div className="w-6 h-[2px] bg-brand-accent/50 mt-6" />
                  <p className="text-xs text-muted-foreground/40 mt-5 leading-[1.7]">
                    Andere Frage?{" "}
                    <a href="/kontakt" className="text-brand-accent/50 underline hover:text-brand-accent transition-colors">
                      Schreiben Sie uns.
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right column – accordion */}
            <FaqAccordion items={items} />
          </div>
        ) : (
          <>
            <div className={number ? "flex items-start gap-5 mb-14" : "mb-14"}>
              {number && (
                <span className="text-section-number text-brand-accent opacity-30 leading-none -mt-2">{number}</span>
              )}
              <ContentBlock>
                <p className="text-[11px] md:text-[10px] font-medium tracking-[4px] uppercase text-brand-accent mb-3">
                  Häufige Fragen
                </p>
                <motion.h2 {...headingReveal} className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-[-0.03em] uppercase">
                  {title}
                </motion.h2>
                <div className="w-12 h-[2px] bg-brand-accent mt-6" />
              </ContentBlock>
            </div>
            <FaqAccordion items={items} />
          </>
        )}
      </div>

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      )}
    </section>
  );
};

export default PageFAQ;

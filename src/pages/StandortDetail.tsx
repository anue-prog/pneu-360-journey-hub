import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { standorte } from "@/data/siteData";
import { ShoppingBag, Zap, Wifi, ParkingCircle, Trophy, Car, Utensils, MapPin, Phone, Mail, Clock, ChevronLeft } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ReviewSection from "@/components/standorte/ReviewSection";
import CTAButton from "@/components/shared/CTAButton";
import standortOftringen from "@/assets/standort-oftringen.jpg";
import standortLangenthal from "@/assets/standort-langenthal.jpg";
import { motion } from "framer-motion";

const standortImages: Record<string, string> = {
  oftringen: standortOftringen,
  langenthal: standortLangenthal,
};

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag, Zap, Wifi, ParkingCircle, Trophy, Car, Utensils,
};

const StandortDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const standort = standorte.find((s) => s.slug === slug);

  if (!standort) return <Navigate to="/" replace />;

  const image = standortImages[standort.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutoRepair"],
    name: `Pneu 360 ${standort.name}`,
    description: standort.metaDescription,
    url: `https://pneu360.ch/standorte/${standort.slug}`,
    telephone: standort.telefon,
    email: standort.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: standort.adresse.split(",")[0],
      addressLocality: standort.name,
      postalCode: standort.adresse.match(/\d{4}/)?.[0] || "",
      addressCountry: "CH",
    },
    image: image,
    priceRange: "$$",
    openingHoursSpecification: standort.slug === "oftringen"
      ? [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "12:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "13:15", closes: "19:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "12:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "13:15", closes: "16:00" },
        ]
      : [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "12:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "13:00", closes: "18:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "12:00" },
        ],
  };

  return (
    <>
      <Helmet>
        <title>{standort.metaTitle}</title>
        <meta name="description" content={standort.metaDescription} />
        <meta property="og:title" content={standort.metaTitle} />
        <meta property="og:description" content={standort.metaDescription} />
        <link rel="canonical" href={`https://pneu360.ch/standorte/${standort.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={image}
          alt={`Pneu 360 Standort ${standort.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-3 md:px-6 pb-10 md:pb-16">
          <div className="max-w-[1400px] mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[2px] uppercase text-brand-accent hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="w-3 h-3" />
              Alle Standorte
            </Link>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em]">
              Pneu 360 {standort.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-3 md:px-6 pb-24 md:pb-36">
        <div className="max-w-[1400px] mx-auto">

          {/* Über diesen Standort */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="py-16 md:py-24"
          >
            <SectionHeading label="Über diesen Standort" title={standort.name} />
            <p className="text-base md:text-lg text-muted-foreground font-light leading-[1.9] max-w-3xl">
              {standort.beschreibung}
            </p>
          </motion.section>

          {/* Highlights */}
          <section className="pb-16 md:pb-24">
            <SectionHeading label="Highlights" title="Was dich erwartet" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {standort.highlights.map((h, i) => {
                const Icon = iconMap[h.icon] || Zap;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-card border border-border/40 p-6 md:p-8"
                  >
                    <Icon className="w-5 h-5 text-brand-accent mb-4" />
                    <h3 className="text-sm font-bold tracking-[-0.01em] mb-2">{h.titel}</h3>
                    <p className="text-xs text-muted-foreground font-light leading-[1.8]">{h.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Team */}
          {standort.team && standort.team.length > 0 && (
            <section className="pb-16 md:pb-24">
              <SectionHeading label="Unser Team" title={`Das Team in ${standort.name}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {standort.team.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-card border border-border/40 p-6 md:p-8 flex items-center gap-5"
                  >
                    <div className="w-14 h-14 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-brand-accent">{member.initialen}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-[-0.01em]">{member.name}</h3>
                      <p className="text-xs text-muted-foreground font-light mt-0.5">{member.rolle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Kontakt & Karte */}
          <section className="pb-16 md:pb-24">
            <SectionHeading label="Kontakt & Anfahrt" title="So erreichst du uns" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

              {/* Contact Info */}
              <div className="bg-card border border-border/40 p-6 md:p-10">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-4 h-4 text-brand-accent mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold tracking-[2px] uppercase text-foreground/70 block mb-1">Adresse</span>
                      <span className="text-sm text-foreground/85">{standort.adresse}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-4 h-4 text-brand-accent mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold tracking-[2px] uppercase text-foreground/70 block mb-1">Telefon</span>
                      <a href={`tel:${standort.telefon.replace(/\s/g, "")}`} className="text-sm text-brand-accent hover:text-foreground transition-colors">
                        {standort.telefon}
                      </a>
                    </div>
                  </div>
                  {standort.email && (
                    <div className="flex items-start gap-4">
                      <Mail className="w-4 h-4 text-brand-accent mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold tracking-[2px] uppercase text-foreground/70 block mb-1">E-Mail</span>
                        <a href={`mailto:${standort.email}`} className="text-sm text-brand-accent hover:text-foreground transition-colors">
                          {standort.email}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <Clock className="w-4 h-4 text-brand-accent mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold tracking-[2px] uppercase text-foreground/70 block mb-1">Öffnungszeiten</span>
                      <p className="text-sm text-foreground/85 font-light whitespace-pre-line">{standort.oeffnungszeiten}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <CTAButton href={standort.maps}>
                    <MapPin className="w-4 h-4" />
                    Route planen
                  </CTAButton>
                  <CTAButton href={`tel:${standort.telefon.replace(/\s/g, "")}`} variant="outline">
                    <Phone className="w-4 h-4" />
                    Jetzt anrufen
                  </CTAButton>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="bg-card border border-border/40 overflow-hidden aspect-square lg:aspect-auto">
                <iframe
                  src={standort.mapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 350 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Google Maps – Pneu 360 ${standort.name}`}
                />
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <SectionHeading label="Kundenstimmen" title="Das sagen unsere Kunden" />
            <ReviewSection />
          </section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-24 text-center"
          >
            <CTAButton href="/anfrage">Jetzt Anfrage stellen</CTAButton>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default StandortDetail;
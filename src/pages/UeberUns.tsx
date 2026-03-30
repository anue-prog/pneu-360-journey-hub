import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/siteData";
import CTAButton from "@/components/shared/CTAButton";
import { EASE } from "@/components/home/animations";
import heroImg from "@/assets/perry-center-aerial.png";
import vmaxImg from "@/assets/vmax-escooter.webp";

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.firmaName,
  url: siteConfig.firmaUrl,
  telephone: siteConfig.firmaTelefon,
  email: siteConfig.firmaEmail,
  description: "Pneu 360 – Tradition trifft High-Tech Mobilität. Über 40 Jahre Erfahrung, zwei Standorte, Express-Service ohne Termin.",
  foundingDate: "2023",
  sameAs: [siteConfig.firmaInstagram, siteConfig.firmaTiktok, siteConfig.firmaFacebook],
};

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 1, ease: EASE, delay },
});

const UeberUnsPage = () => (
  <>
    <Helmet>
      <title>Über Pneu 360 – Tradition trifft High-Tech Mobilität</title>
      <meta name="description" content="Pneu 360: 40 Jahre Reifen-Erfahrung, neuer Drive. Familie Dätwiler, VMAX Services AG und ein Team das Mobilität lebt." />
      <meta property="og:title" content="Über Pneu 360 – Tradition trifft High-Tech Mobilität" />
      <meta property="og:description" content="40 Jahre Erfahrung, zwei Standorte, ein Versprechen: Schnell, fair und persönlich." />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>

    <article className="bg-background">
      {/* ── Artikel-Container ── */}
      <div className="max-w-[720px] mx-auto px-6 md:px-8 pt-48 md:pt-56 pb-32 md:pb-40">

        {/* Titel */}
        <motion.header {...fade()} className="mb-20 md:mb-28">
          <p className="text-brand-label text-muted-foreground mb-4">Über Pneu 360</p>
          <h1 className="text-brand-heading leading-[1.08] uppercase text-foreground">
            Tradition trifft<br />High-Tech Mobilität.
          </h1>
        </motion.header>

        <motion.div {...fade(0.05)} className="mb-20 md:mb-28">
          <img
            src={heroImg}
            alt="Luftaufnahme Perry Center Oftringen – Standort Pneu 360"
            className="w-full object-cover"
            loading="eager"
          />
        </motion.div>

        {/* ── Geschichte ── */}
        <motion.section {...fade()} className="mb-20 md:mb-28">
          <h2 className="text-brand-subheading uppercase tracking-[-0.02em] mb-6">Unsere Geschichte</h2>
          <p className="text-brand-label text-muted-foreground mb-8">40 Jahre Erfahrung, neuer Drive.</p>

          <div className="space-y-6 text-brand-body text-muted-foreground">
            <p>
              Alles begann an einem Ort mit Geschichte: Direkt beim Perry Center in Oftringen, an einem Standort
              mit über 40 Jahren Reifen-Erfahrung. Als das frühere Unternehmen die Filiale schliessen wollte,
              haben wir die Chance ergriffen.
            </p>
            <p>
              Das bewährte Team ist geblieben – aber wir haben den Service auf ein neues Level gehoben.
              Mit der Unterstützung der Familie Dätwiler und dem Know-how der VMAX Services AG haben wir
              Pneu 360 ins Leben gearbeitet: Moderner, schneller und mit vollem Fokus auf dich.
            </p>
          </div>
        </motion.section>


        {/* ── Rundum-Service ── */}
        <motion.section {...fade()} className="mb-20 md:mb-28">
          <h2 className="text-brand-subheading uppercase tracking-[-0.02em] mb-6">Rundum-Service – ganz ohne Termin</h2>

          <p className="text-brand-body text-muted-foreground mb-8">
            Wir wissen, dass dein Alltag hektisch ist. Deshalb ist unser Versprechen simpel:
            Komm einfach vorbei. Bei uns bekommst du professionellen Service rund ums Rad – auch ohne Voranmeldung.
          </p>

          <div className="space-y-4 text-brand-body">
            <p><span className="font-semibold text-foreground">Schnell & unkompliziert</span> <span className="text-muted-foreground">– Reinfahren, drankommen, sicher weiterfahren.</span></p>
            <p><span className="font-semibold text-foreground">Lösungsorientiert</span> <span className="text-muted-foreground">– Wir finden für jedes Fahrzeug-Problem den richtigen Weg.</span></p>
            <p><span className="font-semibold text-foreground">Alles aus einer Hand</span> <span className="text-muted-foreground">– Reifen, Felgen, Autopflege und Beratung.</span></p>
          </div>
        </motion.section>

        {/* ── Familie & Team ── */}
        <motion.section {...fade()} className="mb-20 md:mb-28">
          <h2 className="text-brand-subheading uppercase tracking-[-0.02em] mb-6">Die Menschen dahinter</h2>
          <p className="text-brand-label text-muted-foreground mb-8">Familie Dätwiler & Team</p>

          <div className="space-y-6 text-brand-body text-muted-foreground">
            <p>
              Pneu 360 ist das Ergebnis einer starken Partnerschaft. Hinter dem Unternehmen steht
              die Familie Dätwiler – die Macher hinter VMAX, einem der weltweit führenden Hersteller
              für Premium E-Scooter.
            </p>
            <p>
              Auch wenn die Wurzeln der Familie in der modernen E-Mobilität liegen, ist der Anspruch
              bei Pneu 360 der gleiche: Schweizer Qualität, Innovation und absolute Verlässlichkeit.
            </p>
            <p>
              Die Familie Dätwiler bringt den unternehmerischen Weitblick und den Innovationsgeist ein –
              doch das Herzstück in der Werkstatt ist unser eingespieltes Team. Wir setzen bewusst auf
              die Profis, die teilweise seit Jahrzehnten an diesem Standort tätig sind.
            </p>
            <p>
              Das Ergebnis? Ein unschlagbarer Mix aus jahrzehntelanger Reifen-Erfahrung und modernem Drive.
              Wir verbinden das Wissen von gestern mit den Standards von morgen.
            </p>
          </div>

          <motion.div {...fade(0.1)} className="mt-12 relative">
            <div className="absolute inset-0 bg-background/30 z-10" />
            <img
              src={vmaxImg}
              alt="VMAX E-Scooter – die Familie Dätwiler steht auch hinter der Premium E-Scooter-Marke"
              className="w-full object-cover brightness-75"
              loading="lazy"
            />
          </motion.div>
        </motion.section>


        {/* ── Teil von etwas Grösserem ── */}
        <motion.section {...fade()} className="mb-20 md:mb-28">
          <h2 className="text-brand-subheading uppercase tracking-[-0.02em] mb-6">Teil von etwas Grösserem</h2>

          <div className="space-y-6 text-brand-body text-muted-foreground">
            <p>
              Als Marke der VMAX Services AG haben wir eine starke Basis im Rücken. Das ermöglicht
              es uns, neue Standards im Service zu setzen und dir immer die neuesten Lösungen anzubieten.
              Trotz der globalen Ausstrahlung unserer Partner bleibt eines bei Pneu 360 immer gleich:
              Der direkte, persönliche Handschlag vor Ort.
            </p>
          </div>
        </motion.section>

        {/* ── Wofür wir stehen ── */}
        <motion.section {...fade()} className="mb-20 md:mb-28 py-12 border-y border-border/40">
          <h2 className="text-brand-subheading uppercase tracking-[-0.02em] mb-8">Wofür wir stehen</h2>

          <div className="space-y-4 text-brand-body">
            <p><span className="font-semibold text-foreground">Ehrliche Beratung</span> <span className="text-muted-foreground">– Wir sagen dir direkt, was Sache ist.</span></p>
            <p><span className="font-semibold text-foreground">Saubere Arbeit</span> <span className="text-muted-foreground">– Dein Fahrzeug ist bei unseren Profis in besten Händen.</span></p>
            <p><span className="font-semibold text-foreground">Schweizer Qualität</span> <span className="text-muted-foreground">– Von der Reifenmontage bis zum High-End E-Scooter.</span></p>
          </div>
        </motion.section>

        {/* ── Warum wir das machen ── */}
        <motion.section {...fade()} className="mb-20 md:mb-28">
          <div className="space-y-6 text-brand-body text-muted-foreground">
            <p>
              Weil wir Mobilität leben – egal ob auf zwei oder vier Rädern.
              Wir sind überzeugt, dass guter Service den Unterschied macht.
              Für dich, dein Fahrzeug und deine Sicherheit.
            </p>
            <p className="text-foreground font-semibold">
              Pneu 360: Dein Partner für Reifen, Räder und moderne Mobilität.
            </p>
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.section {...fade()} className="text-center pt-12 border-t border-border/40">
          <p className="text-brand-label text-muted-foreground mb-3">Zeit für einen Boxenstopp?</p>
          <p className="text-brand-body text-muted-foreground mb-10">
            Komm einfach ohne Termin vorbei – wir freuen uns auf dich.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton to="/standorte/oftringen">Unsere Standorte entdecken</CTAButton>
            <CTAButton to="/kontakt" variant="outline">Kontakt aufnehmen</CTAButton>
          </div>
        </motion.section>

      </div>
    </article>
  </>
);

export default UeberUnsPage;

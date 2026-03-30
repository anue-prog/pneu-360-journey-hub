import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/siteData";
import { Phone, Mail, ChevronRight, Instagram, Music, Facebook } from "lucide-react";
import LogoClaim from "@/assets/logo-claim.svg";
import footerBg from "@/assets/footer-bg.webp";

const navLinks = [
  { to: "/radwechsel", label: "Services" },
  { to: "/sommerreifen", label: "Reifen & Felgen" },
  { to: "/standorte/oftringen", label: "Standorte" },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/faq", label: "FAQ" },
];

const legalLinks = [
  { to: "#", label: "Impressum" },
  { to: "#", label: "Datenschutz" },
];

const socialLinks = [
  { href: siteConfig.firmaInstagram, icon: Instagram },
  { href: siteConfig.firmaTiktok, icon: Music },
  { href: siteConfig.firmaFacebook, icon: Facebook },
];

const Footer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <footer ref={ref} className="sticky bottom-0 z-0 min-h-screen flex flex-col relative overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 -inset-y-[10%]"
        style={{ y: bgY, scale: bgScale, willChange: "transform", transform: "translateZ(0)" }}
      >
        <img
          src={footerBg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/35" />

      {/* Centered Logo Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-20 md:pt-24">
        <img
          src={LogoClaim}
          alt="Pneu 360 – Dein Reifen. Dein Style. Dein Move."
          className="w-[320px] md:w-[400px] lg:w-[460px] h-auto brightness-0 invert"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 md:px-8 pb-6 md:pb-10">

        {/* CTAs */}
        <div className="flex flex-wrap gap-2 mb-10 md:mb-14">
          <Link
            to="/anfrage"
            className="inline-flex items-center gap-2 bg-brand-accent px-5 py-3 text-[10px] font-bold uppercase tracking-[2px] text-black transition-all hover:bg-brand-accent/90"
          >
            Jetzt anfragen
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={`tel:${siteConfig.firmaTelefon.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 border border-white/30 px-5 py-3 text-[10px] font-bold uppercase tracking-[2px] text-white transition-colors hover:border-white/60"
          >
            <Phone className="h-3.5 w-3.5" />
            Anrufen
          </a>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-8 border-t border-white/15 pt-8 md:pt-12 mb-8 md:mb-12">
          {/* Seiten */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[3px] text-white/70">Seiten</p>
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[11px] md:text-sm text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[3px] text-white/70">Kontakt</p>
            <div className="flex flex-col gap-1.5">
              <a
                href={`mailto:${siteConfig.firmaEmail}`}
                className="inline-flex items-center gap-1.5 text-[11px] md:text-sm text-white/90 transition-colors hover:text-white"
              >
                <Mail className="h-3 w-3 shrink-0" />
                {siteConfig.firmaEmail}
              </a>
              <a
                href={`tel:${siteConfig.firmaTelefon.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 text-[11px] md:text-sm text-white/90 transition-colors hover:text-white"
              >
                <Phone className="h-3 w-3 shrink-0" />
                {siteConfig.firmaTelefon}
              </a>
              <Link
                to="/standorte/oftringen"
                className="mt-1 text-[11px] md:text-sm text-white/90 transition-colors hover:text-white"
              >
                Standorte & Öffnungszeiten →
              </Link>
            </div>
          </div>

          {/* Rechtliches */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[3px] text-white/70">Rechtliches</p>
            <div className="flex flex-col gap-1.5">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[11px] md:text-sm text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[3px] text-white/70">Social</p>
            <div className="flex gap-3">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center border border-white/30 text-white/80 transition-colors hover:border-white/60 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/15 pt-4 md:pt-6">
          <p className="text-[10px] md:text-xs text-white/60">
            © {new Date().getFullYear()} {siteConfig.firmaName}. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

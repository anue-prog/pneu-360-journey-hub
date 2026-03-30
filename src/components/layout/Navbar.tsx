import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Phone, Sun, Moon } from "lucide-react";
import { siteConfig, standorte } from "@/data/siteData";
import logo from "@/assets/logo.svg";
import { useTheme } from "@/components/shared/ThemeProvider";

const navLinks = [
  { to: "/", label: "Home" },
  {
    label: "Services",
    children: [
      { to: "/radwechsel", label: "Radwechsel" },
      { to: "/reifenwechsel", label: "Reifenwechsel" },
      { to: "/reifenhotel", label: "Reifen einlagern" },
      { to: "/reifenreparatur", label: "Reifenreparatur" },
      { to: "/felgenreparatur", label: "Felgenreparatur" },
      { to: "/autoreinigung", label: "Autoreinigung" },
    ],
  },
  {
    label: "Reifen & Felgen",
    children: [
      { to: "/sommerreifen", label: "Sommerreifen" },
      { to: "/winterreifen", label: "Winterreifen" },
      { to: "/ganzjahresreifen", label: "Ganzjahresreifen" },
      { to: "/offroadreifen", label: "Offroadreifen" },
      { to: "/hersteller", label: "Hersteller-Weltkarte" },
    ],
  },
  {
    label: "Standorte",
    children: [
      { to: "/standorte/oftringen", label: "Oftringen" },
      { to: "/standorte/langenthal", label: "Langenthal" },
    ],
  },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/faq", label: "FAQ" },
];

type MobileNavItem =
  | { to: string; label: string; children?: undefined }
  | { label: string; to?: undefined; children: { to: string; label: string }[] };

const mobileNav: MobileNavItem[] = [
  { to: "/", label: "Home" },
  {
    label: "Services",
    children: [
      { to: "/radwechsel", label: "Radwechsel" },
      { to: "/reifenwechsel", label: "Reifenwechsel" },
      { to: "/reifenhotel", label: "Reifen einlagern" },
      { to: "/reifenreparatur", label: "Reifenreparatur" },
      { to: "/felgenreparatur", label: "Felgenreparatur" },
      { to: "/autoreinigung", label: "Autoreinigung" },
    ],
  },
  {
    label: "Reifen & Felgen",
    children: [
      { to: "/sommerreifen", label: "Sommerreifen" },
      { to: "/winterreifen", label: "Winterreifen" },
      { to: "/ganzjahresreifen", label: "Ganzjahresreifen" },
      { to: "/offroadreifen", label: "Offroadreifen" },
      { to: "/hersteller", label: "Hersteller-Weltkarte" },
    ],
  },
  
  {
    label: "Standorte",
    children: [
      { to: "/standorte/oftringen", label: "Oftringen" },
      { to: "/standorte/langenthal", label: "Langenthal" },
    ],
  },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/faq", label: "FAQ" },
];

interface DropdownProps {
  children: { to: string; label: string }[];
  isOpen: boolean;
  isHeroVisible?: boolean;
}

const Dropdown = ({ children, isOpen, isHeroVisible }: DropdownProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute top-full left-0 mt-2 min-w-[200px] py-3 z-50 ${
          isHeroVisible
            ? "bg-black/80 backdrop-blur-xl border border-white/10"
            : "bg-card border border-border"
        }`}
      >
        {children.map((child) => (
          <Link
            key={child.to}
            to={child.to}
            className={`block px-5 py-2.5 text-[10px] font-semibold tracking-[1.5px] uppercase transition-colors ${
              isHeroVisible
                ? "text-white/70 hover:text-brand-accent"
                : "text-foreground/70 hover:text-brand-accent hover:bg-foreground/[0.03]"
            }`}
          >
            {child.label}
          </Link>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [callOpen, setCallOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isHome = location.pathname === "/";
  const isHeroVisible = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  // Logo sizes: big on homepage hero, normal elsewhere or after scroll
  const logoClass = isHome && !scrolled
    ? "h-20 md:h-24"
    : scrolled
      ? "h-14 md:h-11"
      : "h-14 md:h-16";

  const navHeight = isHome && !scrolled
    ? "h-28 md:h-32"
    : scrolled
      ? "h-20 md:h-20"
      : "h-22 md:h-24";

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "bg-background/20 backdrop-blur-2xl border-b border-border/20"
            : "bg-transparent backdrop-blur-none border-b border-transparent"
        }`}
      >
        <div className={`max-w-[1400px] mx-auto flex items-center justify-between px-3 md:px-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${navHeight}`}>
          <Link to="/" className="flex items-center mix-blend-difference">
            <img src={logo} alt={siteConfig.firmaName} className={`w-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] brightness-0 invert ${logoClass}`} />
          </Link>

          {/* Desktop */}
          <div className={`hidden md:flex items-center gap-7 ${isHeroVisible ? "[&_*]:!text-white/85 [&_*:hover]:!text-white" : ""}`}>
            {navLinks.map((link) =>
              "children" in link && link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`text-[13px] font-semibold tracking-[1.5px] uppercase transition-colors duration-300 flex items-center gap-1 ${
                      openDropdown === link.label ? "text-brand-accent" : "text-foreground/85 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 5l3 3 3-3" />
                    </svg>
                  </button>
                  <Dropdown children={link.children} isOpen={openDropdown === link.label} isHeroVisible={isHeroVisible} />
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to!}
                  className={`text-[13px] font-semibold tracking-[1.5px] uppercase transition-colors duration-300 ${
                    location.pathname === link.to
                      ? "text-brand-accent"
                      : "text-foreground/85 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <button
              onClick={toggleTheme}
              className="text-foreground/70 hover:text-foreground transition-colors p-2"
              aria-label="Theme wechseln"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              to="/anfrage"
              className="bg-brand-accent text-primary-foreground text-[12px] font-bold tracking-[1.5px] uppercase px-6 py-3 hover:brightness-110 transition-all"
            >
              Anfrage
            </Link>
          </div>

          {/* Mobile menu toggle */}
          {/* Mobile: phone + menu */}
          <div className={`md:hidden flex items-center gap-5 ${isHeroVisible ? "text-white" : "text-foreground"}`}>
            <button
              onClick={toggleTheme}
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Theme wechseln"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setCallOpen(true)}
              aria-label="Anrufen"
            >
              <Phone size={22} strokeWidth={2} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[13px] font-bold tracking-[2px] uppercase"
              aria-label="Menu"
            >
              {mobileOpen ? "Close" : "Menü"}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[55] bg-background flex flex-col"
          >
            {/* Top bar — matches navbar height */}
            <div className="flex items-center justify-between px-3 h-22 shrink-0">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <img src={logo} alt={siteConfig.firmaName} className="h-16 w-auto brightness-0 invert" />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[13px] font-bold tracking-[2px] uppercase text-foreground"
              >
                Close
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {mobileNav.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setOpenAccordion(openAccordion === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between py-3.5 text-xl font-bold tracking-[-0.02em] uppercase text-foreground/80 hover:text-foreground transition-colors"
                      >
                        {item.label}
                        <motion.svg
                          animate={{ rotate: openAccordion === item.label ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </motion.svg>
                      </button>
                      <AnimatePresence>
                        {openAccordion === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-3 flex flex-col gap-1 border-l border-border/20 ml-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.to}
                                  to={child.to}
                                  onClick={() => setMobileOpen(false)}
                                  className={`py-2.5 text-[16px] font-semibold tracking-wide transition-colors ${
                                    location.pathname === child.to
                                      ? "text-brand-accent"
                                      : "text-foreground/50 hover:text-foreground/80"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.to!}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3.5 text-xl font-bold tracking-[-0.02em] uppercase transition-colors ${
                        location.pathname === item.to
                          ? "text-brand-accent"
                          : "text-foreground/80 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="px-8 pb-10 shrink-0"
            >
              <Link
                to="/anfrage"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-brand-accent text-primary-foreground text-[13px] font-bold tracking-[2px] uppercase px-6 py-5 hover:brightness-110 transition-all"
              >
                Anfrage starten
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen call popup — portaled to body */}
      {createPortal(
        <AnimatePresence>
          {callOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setCallOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="text-center mb-10">
                  <p className="text-[11px] tracking-[4px] uppercase text-muted-foreground mb-3">
                    Anrufen
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Standort wählen
                  </h2>
                </div>

                {/* Standort-Karten */}
                <div className="space-y-4">
                  {standorte.map((s, i) => (
                    <motion.a
                      key={s.name}
                      href={`tel:${s.telefon.replace(/\s/g, "")}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-4 border border-white/10 bg-white/[0.03] p-6 rounded-sm transition-all duration-300 group hover:border-brand-accent/40"
                    >
                      <div className="w-10 h-10 flex items-center justify-center border border-white/15 group-hover:border-brand-accent/40 group-hover:text-brand-accent transition-colors">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-[-0.01em] text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground font-light mt-0.5">{s.telefon}</p>
                      </div>
                      <span className="ml-auto text-muted-foreground group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-300">→</span>
                    </motion.a>
                  ))}
                </div>

                {/* Schliessen */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="mt-10 flex justify-center"
                >
                  <button
                    onClick={() => setCallOpen(false)}
                    className="flex items-center gap-2 text-xs tracking-[3px] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    Schliessen
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Navbar;

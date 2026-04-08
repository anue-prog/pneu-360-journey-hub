import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Sun, Moon } from "lucide-react";
import { siteConfig, standorte } from "@/data/siteData";
import logo from "@/assets/logo.svg";
import navImage from "@/assets/hero-felge-premium.webp";
import { useTheme } from "@/components/shared/ThemeProvider";

const ease = [0.22, 1, 0.36, 1] as const;

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

type NavItem =
  | { to: string; label: string; children?: undefined }
  | { label: string; to?: undefined; children: { to: string; label: string }[] };

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [callOpen, setCallOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isHeroVisible = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenAccordion(null);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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
        transition={{ duration: 0.8, ease }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-transparent border-b border-transparent"
      >
        <div className={`max-w-[1400px] mx-auto flex items-center justify-between px-3 md:px-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${navHeight}`}>
          <Link to="/" className="flex items-center mix-blend-difference">
            <img src={logo} alt={siteConfig.firmaName} className={`w-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] brightness-0 invert ${logoClass}`} />
          </Link>

          {/* Right side controls */}
          <div className={`flex items-center gap-5 ${isHeroVisible ? "text-white" : "text-foreground"}`}>
            <button
              onClick={toggleTheme}
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Theme wechseln"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setCallOpen(true)}
              aria-label="Anrufen"
              className="hidden md:block opacity-70 hover:opacity-100 transition-opacity"
            >
              <Phone size={18} strokeWidth={2} />
            </button>
            <button
              className="md:hidden opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => setCallOpen(true)}
              aria-label="Anrufen"
            >
              <Phone size={22} strokeWidth={2} />
            </button>

            {/* Minimal 2-line burger */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative flex flex-col justify-center items-end gap-[7px] w-9 h-9 cursor-pointer"
              aria-label="Menu"
              whileTap={{ scale: 0.92 }}
            >
              <motion.span
                animate={menuOpen
                  ? { rotate: 45, y: 4.5, width: "24px" }
                  : { rotate: 0, y: 0, width: "24px" }
                }
                transition={{ duration: 0.35, ease }}
                className="block h-[1.5px] bg-current origin-center"
              />
              <motion.span
                animate={menuOpen
                  ? { rotate: -45, y: -4.5, width: "24px" }
                  : { rotate: 0, y: 0, width: "16px" }
                }
                transition={{ duration: 0.35, ease }}
                className="block h-[1.5px] bg-current origin-center"
              />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Premium fullscreen nav panel */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Nav content — slides in first */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%", transition: { delay: 0.15, duration: 0.45, ease } }}
              transition={{ type: "tween", duration: 0.5, ease }}
              className="fixed inset-0 z-[56] flex"
            >
              {/* Navigation panel */}
              <div className="flex-1 md:w-[65%] lg:w-[60%] bg-[#0a0a0a] flex flex-col overflow-y-auto">
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 md:px-12 h-24 md:h-28 shrink-0">
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    <img src={logo} alt={siteConfig.firmaName} className="h-14 md:h-16 w-auto brightness-0 invert" />
                  </Link>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-[11px] font-bold tracking-[3px] uppercase text-white/60 hover:text-white transition-colors"
                  >
                    Schliessen
                  </button>
                </div>

                <nav className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 gap-0">
                  {(navLinks as NavItem[]).map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease }}
                      className="border-b border-white/[0.06]"
                    >
                      {item.children ? (
                        <>
                          <button
                            onClick={() => setOpenAccordion(openAccordion === item.label ? null : item.label)}
                            className="w-full flex items-center justify-between py-4 md:py-5 text-lg md:text-2xl lg:text-3xl font-bold tracking-[-0.02em] uppercase text-white/70 hover:text-white transition-colors duration-300"
                          >
                            {item.label}
                            <motion.svg
                              animate={{ rotate: openAccordion === item.label ? 180 : 0 }}
                              transition={{ duration: 0.25 }}
                              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                              className="md:w-5 md:h-5"
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
                                transition={{ duration: 0.3, ease }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 md:pl-6 pb-4 flex flex-col gap-0.5 border-l border-white/10 ml-1">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.to}
                                      to={child.to}
                                      onClick={() => setMenuOpen(false)}
                                      className={`py-2 md:py-2.5 text-sm md:text-base font-medium tracking-wide transition-colors duration-200 ${
                                        location.pathname === child.to
                                          ? "text-brand-accent"
                                          : "text-white/40 hover:text-white/80"
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
                          onClick={() => setMenuOpen(false)}
                          className={`block py-4 md:py-5 text-lg md:text-2xl lg:text-3xl font-bold tracking-[-0.02em] uppercase transition-colors duration-300 ${
                            location.pathname === item.to
                              ? "text-brand-accent"
                              : "text-white/70 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4, ease }}
                  className="px-6 md:px-12 lg:px-16 pb-8 md:pb-12 shrink-0"
                >
                  <Link
                    to="/anfrage"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-brand-accent text-black text-[12px] md:text-[13px] font-bold tracking-[2px] uppercase px-6 py-4 md:py-5 hover:brightness-110 transition-all"
                  >
                    Anfrage starten
                  </Link>
                </motion.div>
              </div>

              {/* Decorative image — revealed with delay */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60, transition: { duration: 0.25, ease } }}
                transition={{ delay: 0.35, duration: 0.6, ease }}
                className="hidden md:block relative md:w-[35%] lg:w-[40%] overflow-hidden"
              >
                <motion.img
                  src={navImage}
                  alt=""
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              </motion.div>
            </motion.div>
          </>
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
              transition={{ duration: 0.3, ease }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setCallOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.5, ease }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-10">
                  <p className="text-[11px] tracking-[4px] uppercase text-muted-foreground mb-3">
                    Anrufen
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Standort wählen
                  </h2>
                </div>

                <div className="space-y-4">
                  {standorte.map((s, i) => (
                    <motion.a
                      key={s.name}
                      href={`tel:${s.telefon.replace(/\s/g, "")}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease }}
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

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWaitTimes } from "@/hooks/useWaitTimes";
import { Clock, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const locationLabels: Record<string, string> = {
  oftringen: "Oftringen",
  langenthal: "Langenthal",
};

function getStatus(minutes: number, isOpen: boolean) {
  if (!isOpen) return { label: "Geschlossen", color: "bg-muted-foreground", textColor: "text-muted-foreground" };
  if (minutes === 0) return { label: "Keine Wartezeit", color: "bg-emerald-500", textColor: "text-emerald-500" };
  if (minutes <= 20) return { label: `ca. ${minutes} Min.`, color: "bg-amber-500", textColor: "text-amber-500" };
  return { label: `ca. ${minutes} Min.`, color: "bg-red-500", textColor: "text-red-500" };
}

function getOverallColor(waitTimes: { wait_minutes: number }[], isOpen: boolean) {
  if (!isOpen) return "bg-muted-foreground";
  const max = Math.max(...waitTimes.map((w) => w.wait_minutes));
  if (max === 0) return "bg-emerald-500";
  if (max <= 20) return "bg-amber-500";
  return "bg-red-500";
}

const ease = [0.16, 1, 0.3, 1] as const;

const LABEL = "Live Wartezeiten";

const WaitTimeTicker = () => {
  const { waitTimes, loading, isOpen, minutesAgo } = useWaitTimes();
  const [open, setOpen] = useState(false);
  const [glowActive, setGlowActive] = useState(false);

  // Trigger the gold letter sweep every 8s
  useEffect(() => {
    setGlowActive(true);
    const interval = setInterval(() => {
      setGlowActive(false);
      requestAnimationFrame(() => setGlowActive(true));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading || waitTimes.length === 0) return null;

  const dotColor = getOverallColor(waitTimes, isOpen);

  return (
    <>
      {/* Trigger – kein Rahmen, gleiche Höhe wie CTA */}
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center justify-end gap-4 w-full sm:w-auto px-5 py-3.5 sm:px-0 sm:py-4 transition-all duration-300 cursor-pointer"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {isOpen && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-60`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
        </span>

        {/* Letter-by-letter gold sweep */}
        <span className="flex items-center gap-0 text-[13px] sm:text-[15px] font-bold tracking-[2px] uppercase whitespace-nowrap leading-none">
          {LABEL.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block transition-colors duration-300"
              style={{
                color: glowActive ? undefined : "rgba(255,255,255,0.5)",
                animation: glowActive
                  ? `letterGlow 1.6s ease ${i * 0.06}s forwards`
                  : "none",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>

        <motion.span
          className="hidden sm:inline text-white/40 group-hover:text-white/80 transition-colors text-[15px]"
          animate={{ x: [0, 2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 6 }}
        >
          →
        </motion.span>
      </button>

      {/* Fullscreen Popup — portaled to body to escape scroll-fade */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.5, ease }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="text-center mb-10">
                  <p className="text-[11px] tracking-[4px] uppercase text-muted-foreground mb-3">
                    Wartezeiten
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Aktuelle Auslastung
                  </h2>
                </div>

                {/* Standort-Karten */}
                <div className="space-y-4">
                  {waitTimes.map((wt, i) => {
                    const status = getStatus(wt.wait_minutes, isOpen);
                    const ago = minutesAgo(wt.updated_at);

                    return (
                      <motion.div
                        key={wt.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease }}
                        className="border border-white/10 bg-white/[0.03] p-6 rounded-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3 mt-0.5">
                              {isOpen && wt.wait_minutes >= 0 && (
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.color} opacity-60`} />
                              )}
                              <span className={`relative inline-flex rounded-full h-3 w-3 ${status.color}`} />
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-semibold text-foreground">
                                  {locationLabels[wt.location] || wt.location}
                                </span>
                              </div>
                              {isOpen && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {ago === 0 ? "Gerade aktualisiert" : `Vor ${ago} Min. aktualisiert`}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`font-bold text-lg ${status.textColor}`}>
                            {status.label}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Schliessen */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="mt-10 flex justify-center"
                >
                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-xs tracking-[3px] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    <X className="h-4 w-4" />
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

export default WaitTimeTicker;

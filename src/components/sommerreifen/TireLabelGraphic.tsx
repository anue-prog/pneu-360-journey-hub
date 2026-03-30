import { motion, AnimatePresence } from "framer-motion";

interface TireLabelGraphicProps {
  activeIndex?: number;
}

const GRADES = ["A", "B", "C", "D", "E"];
const COLORS = [
  "hsl(142, 71%, 35%)",
  "hsl(85, 55%, 42%)",
  "hsl(45, 80%, 50%)",
  "hsl(25, 85%, 50%)",
  "hsl(0, 70%, 48%)",
];

const BAR_WIDTHS = [100, 120, 140, 160, 180];

// Which bar index is "active" per section
const ACTIVE_BAR = [1, 0, -1]; // Fuel=B(1), Wet=A(0), Noise=separate

const TireLabelGraphic = ({ activeIndex = -1 }: TireLabelGraphicProps) => {
  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="border-2 border-foreground/20 rounded-xl overflow-hidden bg-card">
        {/* Header */}
        <div className="bg-foreground/5 px-5 py-4 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
              <span className="text-[10px] font-bold tracking-[1.5px] text-muted-foreground uppercase">EU</span>
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">Reifenlabel</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Verordnung (EU) 2020/740</p>
        </div>

        {/* Section: Kraftstoffeffizienz */}
        <LabelSection
          active={activeIndex === 0}
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 22V5a2 2 0 012-2h4a2 2 0 012 2v17" />
              <path d="M14 13a2 2 0 012-2h2a2 2 0 012 2v9" />
              <path d="M14 5h2" /><path d="M14 9h4" />
            </svg>
          }
          label="Spritverbrauch"
          hasBorder
        >
          <GradeScale activeBar={1} sectionActive={activeIndex === 0} pointerText="← Dein Reifen" />
        </LabelSection>

        {/* Section: Nasshaftung */}
        <LabelSection
          active={activeIndex === 1}
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
            </svg>
          }
          label="Bremsen bei Nässe"
          hasBorder
        >
          <GradeScale activeBar={0} sectionActive={activeIndex === 1} pointerText="← Top-Wert" />
        </LabelSection>

        {/* Section: Rollgeräusch */}
        <LabelSection
          active={activeIndex === 2}
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
              <path d="M19.07 4.93a10 10 0 010 14.14" />
            </svg>
          }
          label="Lautstärke"
          hasBorder={false}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: activeIndex === 2 ? 1.08 : 1 }}
              transition={{ duration: 0.3 }}
              className="bg-foreground text-background px-3 py-2 rounded-md"
            >
              <span className="text-2xl font-black">68</span>
              <span className="text-xs font-medium ml-0.5">dB</span>
            </motion.div>
            <div className="flex gap-0.5">
              {[1, 2, 3].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-2.5 rounded-full bg-foreground/30"
                  style={{ height: bar * 8 + 8 }}
                  animate={{
                    backgroundColor: activeIndex === 2 && bar <= 2
                      ? "hsl(var(--brand-accent))"
                      : "hsl(var(--foreground) / 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ≈ normales Gespräch
            </span>
          </div>
        </LabelSection>
      </div>
    </div>
  );
};

function LabelSection({
  active,
  icon,
  label,
  hasBorder,
  children,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  hasBorder: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{
        backgroundColor: active ? "hsl(var(--brand-accent) / 0.08)" : "transparent",
      }}
      transition={{ duration: 0.4 }}
      className={`px-5 py-4 ${hasBorder ? "border-b border-foreground/10" : ""}`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[11px] font-bold tracking-[1px] text-muted-foreground uppercase">
          {label}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function GradeScale({
  activeBar,
  sectionActive,
  pointerText,
}: {
  activeBar: number;
  sectionActive: boolean;
  pointerText: string;
}) {
  return (
    <div className="space-y-[3px]">
      {GRADES.map((g, i) => (
        <div key={g} className="flex items-center gap-2">
          <motion.div
            className="h-6 rounded-r-sm flex items-center justify-end pr-2"
            style={{ width: BAR_WIDTHS[i], backgroundColor: COLORS[i] }}
            animate={{
              opacity: sectionActive && i === activeBar ? 1 : sectionActive ? 0.35 : 0.85,
              scale: sectionActive && i === activeBar ? 1.06 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-[11px] font-black text-white">{g}</span>
          </motion.div>
          {i === activeBar && (
            <>
              <motion.div
                animate={{ opacity: sectionActive ? 1 : 0.5 }}
                className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center"
              >
                <span className="text-[11px] font-black text-background">{g}</span>
              </motion.div>
              <AnimatePresence>
                {sectionActive && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="text-[10px] font-bold text-brand-accent whitespace-nowrap"
                  >
                    {pointerText}
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TireLabelGraphic;

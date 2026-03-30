import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Sparkles, MapPin } from "lucide-react";
import { Manufacturer } from "@/data/herstellerData";

interface Props {
  manufacturer: Manufacturer;
  isActive: boolean;
  onToggle: () => void;
  index: number;
  isLast: boolean;
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const slideUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
} as const;

const HerstellerTimelineItem = ({ manufacturer: m, isActive, onToggle, index, isLast }: Props) => {
  return (
    <div className="relative flex gap-6 md:gap-10">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0 w-10 md:w-14">
        {/* Dot */}
        <motion.div
          className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 transition-all duration-500 flex-shrink-0 ${
            isActive
              ? "bg-brand-accent border-brand-accent scale-125 shadow-[0_0_16px_hsl(var(--brand-accent)/0.4)]"
              : "bg-background border-border group-hover:border-muted-foreground"
          }`}
          layout
        />
        {/* Connecting line */}
        {!isLast && (
          <div className="w-px flex-1 bg-border min-h-[24px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12 md:pb-16 min-w-0">
        {/* Collapsed header – always visible, CLICK to toggle */}
        <div className="flex items-center gap-4 cursor-pointer group" onClick={onToggle}>
          <div className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
            isActive ? "scale-110" : "opacity-60 group-hover:opacity-100"
          }`}>
            {m.logo ? (
              <img
                src={m.logo}
                alt={m.name}
                className="w-full h-full object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            ) : (
              <span className="text-sm md:text-base font-extrabold uppercase tracking-tight text-foreground">
                {m.name}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 md:gap-3">
              <span className={`text-base md:text-lg font-bold tracking-tight transition-colors duration-500 ${
                isActive ? "text-brand-accent" : "text-muted-foreground"
              }`}>
                {m.founded}
              </span>
              <img
                src={`https://flagcdn.com/w40/${m.countryCode.toLowerCase()}.png`}
                alt={m.country}
                className="w-5 h-3.5 md:w-6 md:h-4 object-cover rounded-[2px]"
              />
            </div>
            <p className={`text-[13px] md:text-[15px] font-medium tracking-[0.5px] transition-all duration-500 ${
              isActive ? "text-brand-accent" : "text-muted-foreground/0"
            }`}>
              {m.signature}
            </p>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              key={m.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="mt-8 md:mt-10 pb-2"
              >
              {/* Story */}
              <motion.div variants={slideUp} className="mb-5">
                <p className="text-[15px] md:text-base text-foreground/85 leading-[1.8] max-w-2xl">
                  {m.story}
                </p>
              </motion.div>

              {/* Inline meta line */}
              <motion.div variants={slideUp} className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] md:text-sm text-muted-foreground mb-5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  {m.hq}
                </span>
                {m.employees && <span>· {m.employees} Mitarbeiter</span>}
                {m.revenue && <span>· Umsatz {m.revenue}</span>}
                {m.subBrands.length > 0 && (
                  <span>· {m.subBrands.join(", ")}</span>
                )}
              </motion.div>

              {/* Milestones as simple list */}
              <motion.div variants={slideUp} className="mb-5">
                <p className="text-brand-label text-muted-foreground mb-2">Meilensteine</p>
                <ul className="space-y-1.5">
                  {m.innovations.map((inn, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] md:text-sm text-foreground/85 leading-relaxed">
                      <Lightbulb className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>{inn}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Fun Fact */}
              <motion.div variants={slideUp} className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <p className="text-[13px] md:text-sm text-foreground/70 leading-relaxed italic">
                  {m.funFact}
                </p>
              </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HerstellerTimelineItem;

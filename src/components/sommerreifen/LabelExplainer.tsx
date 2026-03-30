import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Fuel, Droplets, Volume2, Check, X } from "lucide-react";

interface ExplainerItem {
  icon: typeof Fuel;
  title: string;
  takeaway: string;
  grade: string;
  gradeColor: string;
  comparison: string;
  description: string;
  barPercent: number;
  scaleItems: { label: string; color: string; active: boolean }[];
}

const items: ExplainerItem[] = [
  {
    icon: Fuel,
    title: "Spritverbrauch",
    takeaway: "Klasse A statt E spart dir ca. CHF 150 pro Jahr an der Tanke.",
    grade: "B",
    gradeColor: "hsl(85, 55%, 42%)",
    comparison: "Pro Klasse schlechter zahlst du ~CHF 30 mehr im Jahr – nur wegen der Reifen.",
    description: "Dieser Wert zeigt, wie viel Energie der Reifen beim Rollen frisst. Je besser die Klasse, desto weniger Sprit brauchst du.",
    barPercent: 80,
    scaleItems: [
      { label: "A", color: "hsl(142, 71%, 35%)", active: false },
      { label: "B", color: "hsl(85, 55%, 42%)", active: true },
      { label: "C", color: "hsl(45, 80%, 50%)", active: false },
      { label: "D", color: "hsl(25, 85%, 50%)", active: false },
      { label: "E", color: "hsl(0, 70%, 48%)", active: false },
    ],
  },
  {
    icon: Droplets,
    title: "Bremsen bei Nässe",
    takeaway: "A bremst 3 Autolängen früher als E – bei Regen der Unterschied zwischen Anhalten und Crash.",
    grade: "A",
    gradeColor: "hsl(142, 71%, 35%)",
    comparison: "Bei 80 km/h auf nasser Strasse: bis zu 18 Meter kürzerer Bremsweg.",
    description: "Der wichtigste Wert für deine Sicherheit. A heisst: du stehst, wo E noch rutscht.",
    barPercent: 100,
    scaleItems: [
      { label: "A", color: "hsl(142, 71%, 35%)", active: true },
      { label: "B", color: "hsl(85, 55%, 42%)", active: false },
      { label: "C", color: "hsl(45, 80%, 50%)", active: false },
      { label: "D", color: "hsl(25, 85%, 50%)", active: false },
      { label: "E", color: "hsl(0, 70%, 48%)", active: false },
    ],
  },
  {
    icon: Volume2,
    title: "Lautstärke",
    takeaway: "68 dB ist so laut wie ein normales Gespräch. Klasse A klingt wie eine Bibliothek.",
    grade: "68 dB",
    gradeColor: "hsl(85, 55%, 42%)",
    comparison: "Ohne Motorlärm hörst du bei E-Autos jeden Reifen – leise Reifen = mehr Komfort.",
    description: "Wie laut der Reifen auf der Strasse rollt. Besonders wichtig bei Elektro- und Hybridautos.",
    barPercent: 55,
    scaleItems: [
      { label: "A", color: "hsl(142, 71%, 35%)", active: false },
      { label: "B", color: "hsl(85, 55%, 42%)", active: true },
      { label: "C", color: "hsl(45, 80%, 50%)", active: false },
    ],
  },
];

function AnimatedBar({ percent, inView, color }: { percent: number; inView: boolean; color: string }) {
  return (
    <div className="w-full h-2.5 bg-foreground/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${percent}%` } : { width: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </div>
  );
}

interface LabelExplainerProps {
  onActiveChange?: (index: number) => void;
}

const LabelExplainer = ({ onActiveChange }: LabelExplainerProps) => {
  return (
    <div className="space-y-8 md:space-y-12">
      {items.map((item, i) => (
        <ExplainerCard key={item.title} item={item} index={i} onVisible={onActiveChange} />
      ))}
    </div>
  );
};

function ExplainerCard({
  item,
  index,
  onVisible,
}: {
  item: ExplainerItem;
  index: number;
  onVisible?: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (inView && onVisible) onVisible(index);
  }, [inView, index, onVisible]);

  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="border border-border p-8 md:p-10 rounded-none"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-brand-accent" strokeWidth={1.5} />
        <h3 className="text-lg md:text-xl font-bold uppercase tracking-[-0.02em] text-foreground">
          {item.title}
        </h3>
      </div>

      {/* Takeaway – the "dummsicher" sentence */}
      <p className="text-base md:text-lg font-semibold text-foreground leading-snug mb-5">
        Was heisst das für dich?<br />
        <span className="text-brand-accent">{item.takeaway}</span>
      </p>

      {/* Scale A-E with checkmarks */}
      <div className="flex gap-1.5 mb-4">
        {item.scaleItems.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-10 h-7 rounded-sm flex items-center justify-center text-xs font-black text-white transition-all"
              style={{
                backgroundColor: s.color,
                opacity: s.active ? 1 : 0.35,
                transform: s.active ? "scale(1.15)" : "scale(1)",
              }}
            >
              {s.label}
            </div>
            {s.active ? (
              <Check className="w-3.5 h-3.5 text-brand-accent" strokeWidth={3} />
            ) : (
              <span className="w-3.5 h-3.5" />
            )}
          </div>
        ))}
      </div>

      {/* Animated bar */}
      <AnimatedBar percent={item.barPercent} inView={inView} color={item.gradeColor} />

      {/* Comparison */}
      <p className="text-sm font-medium text-muted-foreground mt-4">
        {item.comparison}
      </p>

      {/* Description */}
      <p className="text-sm text-muted-foreground/70 leading-relaxed mt-2">
        {item.description}
      </p>
    </motion.div>
  );
}

export default LabelExplainer;

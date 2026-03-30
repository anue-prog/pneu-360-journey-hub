import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, AlertTriangle, XCircle, Sun, CloudRain, Snowflake, Thermometer } from "lucide-react";

interface BrakingEntry {
  label: string;
  distance: number;
  color: string;
  icon: typeof Check;
  iconColor: string;
}

interface BrakingScenario {
  title: string;
  speed: string;
  entries: BrakingEntry[];
}

// Sommer-Perspektive: Sommerreifen = Best
const sommerScenarios: Record<string, BrakingScenario> = {
  dry: {
    title: "Trockene Strasse",
    speed: "100 km/h → 0 · 25 °C",
    entries: [
      { label: "Sommerreifen", distance: 35, color: "hsl(142, 71%, 35%)", icon: Check, iconColor: "text-green-500" },
      { label: "Ganzjahresreifen", distance: 42, color: "hsl(45, 80%, 50%)", icon: AlertTriangle, iconColor: "text-yellow-500" },
      { label: "Winterreifen", distance: 56, color: "hsl(0, 70%, 48%)", icon: XCircle, iconColor: "text-red-500" },
    ],
  },
  wet: {
    title: "Nasse Strasse",
    speed: "80 km/h → 0 · Regen",
    entries: [
      { label: "Sommerreifen", distance: 26, color: "hsl(142, 71%, 35%)", icon: Check, iconColor: "text-green-500" },
      { label: "Ganzjahresreifen", distance: 31, color: "hsl(45, 80%, 50%)", icon: AlertTriangle, iconColor: "text-yellow-500" },
      { label: "Winterreifen", distance: 34, color: "hsl(0, 70%, 48%)", icon: XCircle, iconColor: "text-red-500" },
    ],
  },
};

// Winter-Perspektive: Winterreifen = Best (Schnee/Eis-Bedingungen, Daten aus TCS/ADAC)
const winterScenarios: Record<string, BrakingScenario> = {
  snow: {
    title: "Schneebedeckte Strasse",
    speed: "50 km/h → 0 · –5 °C",
    entries: [
      { label: "Winterreifen", distance: 31, color: "hsl(142, 71%, 35%)", icon: Check, iconColor: "text-green-500" },
      { label: "Ganzjahresreifen", distance: 38, color: "hsl(45, 80%, 50%)", icon: AlertTriangle, iconColor: "text-yellow-500" },
      { label: "Sommerreifen", distance: 62, color: "hsl(0, 70%, 48%)", icon: XCircle, iconColor: "text-red-500" },
    ],
  },
  ice: {
    title: "Vereiste Strasse",
    speed: "30 km/h → 0 · –10 °C",
    entries: [
      { label: "Winterreifen", distance: 25, color: "hsl(142, 71%, 35%)", icon: Check, iconColor: "text-green-500" },
      { label: "Ganzjahresreifen", distance: 35, color: "hsl(45, 80%, 50%)", icon: AlertTriangle, iconColor: "text-yellow-500" },
      { label: "Sommerreifen", distance: 58, color: "hsl(0, 70%, 48%)", icon: XCircle, iconColor: "text-red-500" },
    ],
  },
};

const sommerCallouts: Record<string, string> = {
  dry: "Bei 100 km/h auf trockener Strasse fährt ein Winterreifen noch mit 57 km/h, wenn der Sommerreifen bereits steht.",
  wet: "Auch bei Regen bremst der Sommerreifen deutlich besser als Winter- oder Ganzjahresreifen.",
};

const winterCallouts: Record<string, string> = {
  snow: "Auf Schnee braucht ein Sommerreifen doppelt so lang zum Anhalten. Der Winterreifen steht, wo der Sommerreifen noch rutscht.",
  ice: "Auf Eis ist der Unterschied noch dramatischer – Sommerreifen haben praktisch keinen Grip mehr.",
};

// Ganzjahr-Perspektive: Kompromiss – Ganzjahr in der Mitte (orange)
const ganzjahrScenarios: Record<string, BrakingScenario> = {
  dry: {
    title: "Trockene Strasse · Sommer",
    speed: "100 km/h → 0 · 25 °C",
    entries: [
      { label: "Sommerreifen", distance: 35, color: "hsl(142, 71%, 35%)", icon: Check, iconColor: "text-green-500" },
      { label: "Ganzjahresreifen", distance: 42, color: "hsl(35, 85%, 50%)", icon: AlertTriangle, iconColor: "text-orange-500" },
      { label: "Winterreifen", distance: 56, color: "hsl(0, 70%, 48%)", icon: XCircle, iconColor: "text-red-500" },
    ],
  },
  snow: {
    title: "Schneebedeckte Strasse · Winter",
    speed: "50 km/h → 0 · –5 °C",
    entries: [
      { label: "Winterreifen", distance: 31, color: "hsl(142, 71%, 35%)", icon: Check, iconColor: "text-green-500" },
      { label: "Ganzjahresreifen", distance: 38, color: "hsl(35, 85%, 50%)", icon: AlertTriangle, iconColor: "text-orange-500" },
      { label: "Sommerreifen", distance: 62, color: "hsl(0, 70%, 48%)", icon: XCircle, iconColor: "text-red-500" },
    ],
  },
};

const ganzjahrCallouts: Record<string, string> = {
  dry: "Im Sommer bremst der Ganzjahresreifen 7 Meter später als ein Sommerreifen – aber immer noch 14 Meter früher als ein Winterreifen. Ein fairer Kompromiss.",
  snow: "Auf Schnee liegt der Ganzjahresreifen 7 Meter hinter dem Winterreifen – aber Welten vor dem Sommerreifen. Für Flachland-Fahrer oft ausreichend.",
};

function CountUp({ end, inView }: { end: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) { setCount(0); return; }
    let current = 0;
    const step = end / (1.2 * 60);
    const id = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(id); }
      else setCount(Math.floor(current));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, end]);

  return <span>{count}</span>;
}

interface BremswegVergleichProps {
  variant?: "sommer" | "winter" | "ganzjahr";
}

const BremswegVergleich = ({ variant = "sommer" }: BremswegVergleichProps) => {
  const scenarioMap = { sommer: sommerScenarios, winter: winterScenarios, ganzjahr: ganzjahrScenarios };
  const calloutMap = { sommer: sommerCallouts, winter: winterCallouts, ganzjahr: ganzjahrCallouts };
  const scenarios = scenarioMap[variant];
  const callouts = calloutMap[variant];
  const toggleMap: Record<string, { key: string; icon: typeof Sun; label: string }[]> = {
    sommer: [
      { key: "dry", icon: Sun, label: "Trocken" },
      { key: "wet", icon: CloudRain, label: "Nass" },
    ],
    winter: [
      { key: "snow", icon: Snowflake, label: "Schnee" },
      { key: "ice", icon: Thermometer, label: "Eis" },
    ],
    ganzjahr: [
      { key: "dry", icon: Sun, label: "Sommer" },
      { key: "snow", icon: Snowflake, label: "Winter" },
    ],
  };
  const defaultModeMap = { sommer: "dry", winter: "snow", ganzjahr: "dry" };
  const toggleOptions = toggleMap[variant];
  const defaultMode = defaultModeMap[variant];

  const [mode, setMode] = useState(defaultMode);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });

  const scenario = scenarios[mode];
  const maxDist = Math.max(...scenario.entries.map((e) => e.distance));
  const lastIdx = scenario.entries.length - 1;
  const diff = scenario.entries[lastIdx].distance - scenario.entries[0].distance;
  const carLengths = Math.round(diff / 4.5);

  return (
    <div ref={ref}>
      {/* Toggle */}
      <div className="flex gap-2 mb-10">
        {toggleOptions.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setMode(btn.key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wide border transition-all duration-300 ${
              mode === btn.key
                ? "border-brand-accent bg-brand-accent/10 text-foreground"
                : "border-border text-muted-foreground hover:border-foreground/30"
            }`}
          >
            <btn.icon className="w-4 h-4" strokeWidth={1.5} />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Scenario info */}
      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium text-muted-foreground mb-8"
        >
          {scenario.title} · {scenario.speed}
        </motion.p>
      </AnimatePresence>

      {/* Bars */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {scenario.entries.map((entry, i) => {
              const Icon = entry.icon;
              const pct = (entry.distance / maxDist) * 100;

              return (
                <div key={entry.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${entry.iconColor}`} strokeWidth={2} />
                      <span className="text-sm font-bold text-foreground">{entry.label}</span>
                    </div>
                    <span className="text-2xl font-black text-foreground tabular-nums">
                      {inView ? <CountUp end={entry.distance} inView={inView} /> : 0}
                      <span className="text-sm font-medium text-muted-foreground ml-1">m</span>
                    </span>
                  </div>

                  <div className="w-full h-8 bg-foreground/5 rounded-sm overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-sm"
                      style={{ backgroundColor: entry.color }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${pct}%` } : { width: 0 }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                    <motion.div
                      className="absolute top-0 h-full flex items-center"
                      initial={{ left: 0 }}
                      animate={inView ? { left: `${pct}%` } : { left: 0 }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div
                        className="w-1 h-full"
                        style={{ backgroundColor: entry.color, filter: "brightness(0.7)" }}
                      />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Difference callout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 p-5 border border-brand-accent/30 bg-brand-accent/5"
      >
        <p className="text-base md:text-lg font-bold text-foreground">
          <span className="text-brand-accent">{diff} Meter Unterschied</span>{" "}
          = {carLengths} Autolängen
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {callouts[mode]}
        </p>
      </motion.div>

      {/* Source */}
      <p className="text-[11px] text-muted-foreground/50 mt-6">
        Basierend auf TCS- und ADAC-Reifentests · Continental-Daten · Bremsweg bei Vollbremsung, ABS aktiv
      </p>
    </div>
  );
};

export default BremswegVergleich;

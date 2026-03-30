import { motion } from "framer-motion";
import { timelineEvents } from "@/data/herstellerData";
import { useRef, useEffect } from "react";

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
}

const HerstellerTimeline = ({ activeId, onSelect }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div className="relative">
      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="flex items-start overflow-x-auto pb-4 -mx-3 px-3 md:-mx-6 md:px-6"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {timelineEvents.map((event, i) => {
          const isActive = event.id === activeId;
          return (
            <motion.button
              key={event.id + event.year}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(event.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex-shrink-0 flex flex-col items-center cursor-pointer group"
              style={{ minWidth: "80px", paddingLeft: "8px", paddingRight: "8px" }}
            >
              {/* Year */}
              <span className={`text-base md:text-lg font-bold tracking-tight transition-colors duration-500 ${
                isActive ? "text-brand-accent" : "text-foreground/15 group-hover:text-foreground/50"
              }`}>
                {event.year}
              </span>

              {/* Dot + connecting line */}
              <div className="relative my-2 flex items-center">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  isActive ? "bg-brand-accent scale-150" : "bg-muted-foreground/20 group-hover:bg-muted-foreground/40"
                }`} />
                {i < timelineEvents.length - 1 && (
                  <div className="absolute left-[8px] top-[3px] h-px bg-border" style={{ width: "calc(80px - 8px)" }} />
                )}
              </div>

              {/* Flag + name */}
              <span className="text-sm mb-0.5">{event.flag}</span>
              <span className={`text-[10px] md:text-[11px] font-bold tracking-[1px] uppercase whitespace-nowrap transition-colors duration-500 ${
                isActive ? "text-brand-accent" : "text-muted-foreground group-hover:text-foreground"
              }`}>
                {event.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default HerstellerTimeline;

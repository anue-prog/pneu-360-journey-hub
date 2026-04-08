import { useRef, useEffect, useState } from "react";

interface BlockHeadingProps {
  lines: string[];
  className?: string;
  maxWidth?: number;
}

const BlockHeading = ({ lines, className = "", maxWidth = 420 }: BlockHeadingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [fontSizes, setFontSizes] = useState<number[]>([]);

  useEffect(() => {
    const calculate = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = Math.min(container.offsetWidth, maxWidth);
      const baseFontSize = 16;

      // Reset to measure natural widths
      lineRefs.current.forEach((el) => {
        if (el) el.style.fontSize = `${baseFontSize}px`;
      });

      // Force reflow
      void container.offsetHeight;

      const newSizes = lineRefs.current.map((el) => {
        if (!el) return baseFontSize;
        const naturalWidth = el.scrollWidth;
        if (naturalWidth === 0) return baseFontSize;
        const scale = containerWidth / naturalWidth;
        return baseFontSize * scale;
      });

      setFontSizes(newSizes);
    };

    calculate();

    const observer = new ResizeObserver(calculate);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [lines]);

  return (
    <h2 ref={containerRef} className={`overflow-hidden ${className}`} style={{ maxWidth: `${maxWidth}px` }}>
      {lines.map((line, i) => (
        <span
          key={i}
          ref={(el) => { lineRefs.current[i] = el; }}
          style={{ fontSize: fontSizes[i] ? `${fontSizes[i]}px` : undefined }}
          className="block whitespace-nowrap leading-[0.92] font-extrabold uppercase tracking-[-0.03em]"
        >
          {line}
        </span>
      ))}
    </h2>
  );
};

export default BlockHeading;

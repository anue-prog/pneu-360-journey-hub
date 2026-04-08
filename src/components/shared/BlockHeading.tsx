import { useRef, useEffect, useState } from "react";

interface BlockHeadingProps {
  lines: string[];
  className?: string;
}

const BlockHeading = ({ lines, className = "" }: BlockHeadingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSizes, setFontSizes] = useState<number[]>([]);

  useEffect(() => {
    const calculate = () => {
      const container = containerRef.current;
      if (!container) return;

      const targetWidth = container.offsetWidth;
      if (targetWidth === 0) return;

      // Measure each line's natural text width using a hidden canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const baseFontSize = 100; // Use large base for accurate measurement
      const style = getComputedStyle(container);
      const fontFamily = style.fontFamily || "Inter, sans-serif";

      const newSizes = lines.map((line) => {
        ctx.font = `800 ${baseFontSize}px ${fontFamily}`;
        const textWidth = ctx.measureText(line.toUpperCase()).width;
        if (textWidth === 0) return baseFontSize;
        const scale = targetWidth / textWidth;
        return Math.floor(baseFontSize * scale);
      });

      setFontSizes(newSizes);
    };

    // Small delay to ensure container is laid out
    requestAnimationFrame(calculate);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(calculate);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [lines]);

  return (
    <h2 ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      {lines.map((line, i) => (
        <span
          key={i}
          style={{ fontSize: fontSizes[i] ? `${fontSizes[i]}px` : "48px" }}
          className="block whitespace-nowrap leading-[0.92] font-extrabold uppercase tracking-[-0.03em]"
        >
          {line}
        </span>
      ))}
    </h2>
  );
};

export default BlockHeading;

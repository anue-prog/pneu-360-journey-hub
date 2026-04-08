import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PixelRevealProps {
  src: string;
  alt: string;
  className?: string;
  duration?: number;       // total effect duration in ms
  initialPixelSize?: number; // starting pixel block size
}

const PixelReveal = ({
  src,
  alt,
  className = "",
  duration = 1400,
  initialPixelSize = 64,
}: PixelRevealProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const prefersReduced = useReducedMotion();

  const drawPixelated = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, pixelSize: number) => {
      if (pixelSize <= 1) {
        ctx.drawImage(img, 0, 0, w, h);
        return;
      }
      // Draw at reduced resolution, then scale up
      const sw = Math.max(1, Math.ceil(w / pixelSize));
      const sh = Math.max(1, Math.ceil(h / pixelSize));

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);

      // Draw small
      ctx.drawImage(img, 0, 0, sw, sh);
      // Scale up pixelated
      ctx.drawImage(ctx.canvas, 0, 0, sw, sh, 0, 0, w, h);
    },
    []
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const startTime = performance.now();

    // Easing — decelerate (ease-out cubic)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeOutCubic(rawProgress);

      // Interpolate pixel size: large → 1
      const currentPixel = Math.max(1, Math.round(initialPixelSize * (1 - progress)));

      drawPixelated(ctx, img, w, h, currentPixel);

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // Final frame at full resolution
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, w, h);
        setRevealed(true);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [duration, initialPixelSize, drawPixelated]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Set canvas size to match container
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      setLoaded(true);

      if (prefersReduced) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        setRevealed(true);
        return;
      }

      animate();
    };

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src, animate, prefersReduced]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Canvas for pixel effect */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
          revealed ? "opacity-0" : "opacity-100"
        }`}
        style={{ imageRendering: "pixelated" }}
      />
      {/* Actual image underneath — visible after reveal */}
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${!loaded ? "opacity-0" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default PixelReveal;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Brand green 800 — dark green to match site
const BRAND_GREEN_R = 16;
const BRAND_GREEN_G = 53;
const BRAND_GREEN_B = 30;

interface HoverVideoProps {
  src: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function HoverVideo({ src, className = "", width = 300, height = 300 }: HoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const drawKeyedFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cw = canvas.width;
    const ch = canvas.height;

    // Draw video scaled to canvas (full frame — no crop)
    ctx.drawImage(video, 0, 0, vw, vh, 0, 0, cw, ch);

    const frame = ctx.getImageData(0, 0, cw, ch);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);

      // Key out near-black background
      if (max < 26) {
        data[i + 3] = 0;
      } else if (max < 44) {
        data[i + 3] = Math.min(data[i + 3], (max - 26) * 14);
      } else {
        // Darken greens to match brand green (tree/grass)
        const isGreen = g >= r && g >= b && g > 50;
        if (isGreen) {
          const t = 0.45; // blend strength toward brand green
          data[i] = Math.round(r * (1 - t) + BRAND_GREEN_R * t);
          data[i + 1] = Math.round(g * (1 - t) + BRAND_GREEN_G * t);
          data[i + 2] = Math.round(b * (1 - t) + BRAND_GREEN_B * t);
        }
      }
    }

    ctx.putImageData(frame, 0, 0);
    rafRef.current = requestAnimationFrame(drawKeyedFrame);
  }, []);

  const startRendering = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(drawKeyedFrame);
  }, [drawKeyedFrame]);

  const stopRendering = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const schedulePause = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      videoRef.current?.pause();
      stopRendering();
      setIsPlaying(false);
    }, 140);
  };

  const handlePointerMove = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    }
    startRendering();
    setIsPlaying(true);
    schedulePause();
  };

  const handlePointerLeave = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    videoRef.current?.pause();
    stopRendering();
    setIsPlaying(false);
  };

  const handleVideoLoaded = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const w = width;
    const h = height;
    const scale = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    drawKeyedFrame();
    stopRendering();
  };

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      stopRendering();
    };
  }, [stopRendering]);

  return (
    <div
      className={`relative ${className}`}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoaded}
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          opacity: isPlaying ? 1 : 0.95,
          transition: "opacity 0.2s ease",
        }}
        className="block"
      />
    </div>
  );
}

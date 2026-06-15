import React, { useEffect, useRef } from "react";
import { drawPramaCanvasIllustration } from "../utils/illustrationPainter";

interface PramaAnimatedIllustrationProps {
  slideTitle: string;
  slideIndex: number;
}

export const PramaAnimatedIllustration: React.FC<PramaAnimatedIllustrationProps> = ({
  slideTitle,
  slideIndex
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let frame = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handles smart device pixel ratio scaling inside the container
    const resizeAndPaint = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 400;
      const height = rect.height || 280;

      // Handle retina high-resolution displays smoothly
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Draw the beautiful design illustration
      drawPramaCanvasIllustration(ctx, width, height, slideTitle, slideIndex, frame);
    };

    const renderLoop = () => {
      frame++;
      resizeAndPaint();
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // Initialize render cycle
    renderLoop();

    // Listen to container or window updates
    window.addEventListener("resize", resizeAndPaint);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeAndPaint);
    };
  }, [slideTitle, slideIndex]);

  return (
    <div className="w-full h-full relative p-0.5 overflow-hidden rounded bg-slate-50 flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        style={{ width: "100%", height: "100%", display: "block" }}
        className="transition-all duration-300 rounded"
      />
    </div>
  );
};

import { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface Bar {
  x: number;
  width: number;
  baseHeight: number;
  currentHeight: number;
  targetHeight: number;
}

export default function AudioReactiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<Bar[]>([]);
  const frameRef = useRef<number>(0);
  const { isPlaying } = useAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initBars();
    };

    const initBars = () => {
      const barCount = 50;
      barsRef.current = [];
      for (let i = 0; i < barCount; i++) {
        barsRef.current.push({
          x: Math.random() * canvas.width,
          width: 2 + Math.random() * 2,
          baseHeight: 20 + Math.random() * 80,
          currentHeight: 20 + Math.random() * 80,
          targetHeight: 20 + Math.random() * 80,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Trailing effect
      ctx.fillStyle = 'rgba(11, 11, 16, 0.2)';
      ctx.fillRect(0, 0, w, h);

      barsRef.current.forEach(bar => {
        if (isPlaying) {
          bar.targetHeight = bar.baseHeight + Math.random() * 40;
        } else {
          bar.targetHeight = bar.baseHeight;
        }

        bar.currentHeight += (bar.targetHeight - bar.currentHeight) * 0.1;

        const gradient = ctx.createLinearGradient(bar.x, h, bar.x, h - bar.currentHeight);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0.4)');

        ctx.fillStyle = gradient;
        ctx.fillRect(bar.x, h - bar.currentHeight, bar.width, bar.currentHeight);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.3,
        zIndex: 0,
      }}
    />
  );
}

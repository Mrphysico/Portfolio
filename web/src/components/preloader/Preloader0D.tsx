import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../../data/content';

interface Preloader0DProps {
  onComplete: () => void;
}

export const Preloader0D: React.FC<Preloader0DProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('0D SINGULARITY DETECTED');
  const [isExploding, setIsExploding] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      setIsDismissed(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText('BIG-BANG EXPANSION');
          setIsExploding(true);
          setTimeout(() => {
            setIsDismissed(true);
            onComplete();
          }, 1200);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 3;
        if (next > 30 && next < 60) {
          setStatusText('SYNTHESIZING 4D ROTATION TENSORS');
        } else if (next >= 60 && next < 85) {
          setStatusText('CALIBRATING GPU COMPUTE SHADERS');
        } else if (next >= 85) {
          setStatusText('SINGULARITY EXPANSION READY');
        }
        return Math.min(100, next);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 select-none ${
        isExploding ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 0D Glowing Central Photon / Point */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing glow aura */}
        <div
          className={`absolute w-32 h-32 rounded-full bg-cyan-400/20 blur-2xl transition-transform duration-700 ${
            isExploding ? 'scale-[20] opacity-0' : 'animate-pulse-slow'
          }`}
        />
        {/* Concentric quantum rings */}
        <div
          className={`w-20 h-20 rounded-full border border-cyan-400/30 flex items-center justify-center transition-transform duration-500 ${
            isExploding ? 'scale-150 opacity-0' : 'animate-spin-slow'
          }`}
        >
          <div className="w-10 h-10 rounded-full border border-purple-500/40 animate-spin" />
        </div>

        {/* Central singularity particle (0D Point) */}
        <div
          className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_20px_#00f7ff,0_0_40px_#00f7ff] transition-all duration-700 ${
            isExploding ? 'scale-[50] bg-cyan-300' : 'scale-100'
          }`}
        />
      </div>

      {/* Counter & Technical Telemetry */}
      <div className="mt-12 text-center flex flex-col items-center font-mono">
        <div className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
          <span className="text-cyan-400">{progress}</span>
          <span className="text-xs text-slate-500 ml-1">%</span>
        </div>

        <div className="mt-2 text-xs text-cyan-300/80 tracking-widest uppercase animate-pulse">
          {statusText}
        </div>

        <div className="mt-6 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-[10px] text-slate-500 tracking-wider">
          COORDINATES: (0, 0, 0, 0) · ORIGIN POINT
        </div>

        {/* Skip preloader button for fast review */}
        <button
          onClick={() => {
            setIsDismissed(true);
            onComplete();
          }}
          className="mt-6 text-[10px] text-slate-500 hover:text-cyan-400 transition-colors underline cursor-pointer"
        >
          [SKIP PRELOADER]
        </button>
      </div>
    </div>
  );
};

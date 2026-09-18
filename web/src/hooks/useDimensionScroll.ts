import { useState, useEffect, useCallback, useRef } from 'react';
import Lenis from 'lenis';

export type DimensionKey = '0D' | '1D' | '2D' | '3D' | '4D' | 'Singularity';

export interface DimensionState {
  currentDimension: DimensionKey;
  progress: number; // 0.0 to 1.0 overall scroll
  dimensionProgress: number; // 0.0 to 1.0 within active dimension
  velocity: number;
}

export const DIMENSION_BREAKPOINTS: { key: DimensionKey; start: number; end: number }[] = [
  { key: '0D', start: 0.00, end: 0.14 },
  { key: '1D', start: 0.14, end: 0.33 },
  { key: '2D', start: 0.33, end: 0.53 },
  { key: '3D', start: 0.53, end: 0.73 },
  { key: '4D', start: 0.73, end: 0.90 },
  { key: 'Singularity', start: 0.90, end: 1.00 },
];

export function useDimensionScroll() {
  const [scrollState, setScrollState] = useState<DimensionState>({
    currentDimension: '0D',
    progress: 0,
    dimensionProgress: 0,
    velocity: 0,
  });

  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lastProgressRef = useRef<number>(-1);
  const lastDimRef = useRef<DimensionKey>('0D');

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.5,
    });

    setLenisInstance(lenis);

    function onScroll(e: any) {
      const p = Math.max(0, Math.min(1, e.progress || 0));
      const vel = e.velocity || 0;

      let currentDim: DimensionKey = '0D';
      let dimProg = 0;

      for (const bp of DIMENSION_BREAKPOINTS) {
        if (p >= bp.start && p <= bp.end) {
          currentDim = bp.key;
          dimProg = (p - bp.start) / (bp.end - bp.start);
          break;
        }
      }

      // Avoid re-renders on sub-pixel micro-jitter unless crossing dimensional boundary or progress > 0.0015
      const pDiff = Math.abs(p - lastProgressRef.current);
      if (pDiff >= 0.0015 || currentDim !== lastDimRef.current || p === 0 || p === 1) {
        lastProgressRef.current = p;
        lastDimRef.current = currentDim;

        setScrollState({
          currentDimension: currentDim,
          progress: p,
          dimensionProgress: Math.max(0, Math.min(1, dimProg)),
          velocity: vel,
        });
      }
    }

    lenis.on('scroll', onScroll);

    let reqId: number;
    function raf(time: number) {
      lenis.raf(time);
      reqId = requestAnimationFrame(raf);
    }
    reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
    };
  }, []);

  const scrollToDimension = useCallback(
    (dim: DimensionKey) => {
      if (!lenisInstance) return;
      const bp = DIMENSION_BREAKPOINTS.find((b) => b.key === dim);
      if (bp) {
        const targetScroll = bp.start * (document.documentElement.scrollHeight - window.innerHeight);
        lenisInstance.scrollTo(targetScroll, { duration: 1.4 });
      }
    },
    [lenisInstance]
  );

  return {
    ...scrollState,
    scrollToDimension,
  };
}

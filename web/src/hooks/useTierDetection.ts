import { useState, useEffect, useRef } from 'react';

export type QualityTier = 'ULTRA' | 'HIGH' | 'BALANCED' | 'LITE' | 'STATIC';

export interface TierConfig {
  tier: QualityTier;
  particleCount: number;
  enablePostProcessing: boolean;
  enableBloom: boolean;
  enableSSAO: boolean;
  enableChromaticAberration: boolean;
  dpr: number;
  useWebGPU: boolean;
  fps: number;
  autoDowngraded: boolean;
}

export const TIER_PRESETS: Record<QualityTier, Omit<TierConfig, 'tier' | 'fps' | 'autoDowngraded'>> = {
  ULTRA: {
    particleCount: 1_000_000,
    enablePostProcessing: true,
    enableBloom: true,
    enableSSAO: true,
    enableChromaticAberration: true,
    dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
    useWebGPU: true,
  },
  HIGH: {
    particleCount: 500_000,
    enablePostProcessing: true,
    enableBloom: true,
    enableSSAO: false,
    enableChromaticAberration: true,
    dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1,
    useWebGPU: true,
  },
  BALANCED: {
    particleCount: 150_000,
    enablePostProcessing: true,
    enableBloom: true,
    enableSSAO: false,
    enableChromaticAberration: false,
    dpr: 1,
    useWebGPU: false,
  },
  LITE: {
    particleCount: 25_000,
    enablePostProcessing: false,
    enableBloom: false,
    enableSSAO: false,
    enableChromaticAberration: false,
    dpr: 1,
    useWebGPU: false,
  },
  STATIC: {
    particleCount: 2_000,
    enablePostProcessing: false,
    enableBloom: false,
    enableSSAO: false,
    enableChromaticAberration: false,
    dpr: 1,
    useWebGPU: false,
  },
};

const TIER_ORDER: QualityTier[] = ['STATIC', 'LITE', 'BALANCED', 'HIGH', 'ULTRA'];

export function useTierDetection() {
  const [tier, setTier] = useState<QualityTier>('HIGH');
  const [fps, setFps] = useState<number>(60);
  const [autoDowngraded, setAutoDowngraded] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);

  // Hardware capability detection on initial mount
  useEffect(() => {
    async function detectCapabilities() {
      if (typeof window === 'undefined') return;

      // 1. Check prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTier('STATIC');
        return;
      }

      // 2. Check mobile viewport / touch
      const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 4;

      // 3. Check WebGPU support
      const hasWebGPU = !!(navigator as any).gpu;

      if (isMobile) {
        setTier(memory >= 6 && cores >= 8 ? 'BALANCED' : 'LITE');
      } else if (hasWebGPU && cores >= 8 && memory >= 8) {
        setTier('ULTRA');
      } else if (cores >= 4 && memory >= 4) {
        setTier('HIGH');
      } else {
        setTier('BALANCED');
      }
    }

    detectCapabilities();
  }, []);

  // Performance Monitor with 2s downgrade / 10s upgrade hysteresis and throttled React state updates
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(typeof performance !== 'undefined' ? performance.now() : 0);
  const lastStateUpdateRef = useRef<number>(0);
  const lowFpsCountRef = useRef<number>(0);
  const highFpsCountRef = useRef<number>(0);

  useEffect(() => {
    let animId: number;

    const measure = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (delta > 0 && delta < 200) {
        const currentFps = 1000 / delta;
        frameTimesRef.current.push(currentFps);
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }

        // Throttle React state updates to 3Hz (every 330ms) to prevent re-render thrashing
        if (time - lastStateUpdateRef.current > 330 && frameTimesRef.current.length >= 20) {
          lastStateUpdateRef.current = time;
          const avgFps = Math.round(
            frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
          );

          setFps((prev) => (Math.abs(prev - avgFps) >= 2 ? avgFps : prev));

          // Real-Time Auto-Quality Governor with Hysteresis
          if (!isManual) {
            // Downgrade condition: FPS below 40 for > 2 seconds (~6 checks at 330ms)
            if (avgFps < 40) {
              lowFpsCountRef.current++;
              highFpsCountRef.current = 0;

              if (lowFpsCountRef.current >= 6) {
                lowFpsCountRef.current = 0;
                setTier((current) => {
                  const idx = TIER_ORDER.indexOf(current);
                  if (idx > 1) {
                    setAutoDowngraded(true);
                    return TIER_ORDER[idx - 1];
                  }
                  return current;
                });
              }
            }
            // Upgrade condition: Sustained FPS >= 58 for > 10 seconds (~30 checks at 330ms)
            else if (avgFps >= 58 && autoDowngraded) {
              highFpsCountRef.current++;
              lowFpsCountRef.current = 0;

              if (highFpsCountRef.current >= 30) {
                highFpsCountRef.current = 0;
                setTier((current) => {
                  const idx = TIER_ORDER.indexOf(current);
                  if (idx < TIER_ORDER.length - 1) {
                    return TIER_ORDER[idx + 1];
                  }
                  return current;
                });
              }
            } else {
              lowFpsCountRef.current = Math.max(0, lowFpsCountRef.current - 1);
              highFpsCountRef.current = 0;
            }
          }
        }
      }

      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, [isManual, autoDowngraded]);

  const setManualTier = (newTier: QualityTier) => {
    setIsManual(true);
    setTier(newTier);
  };

  const currentConfig: TierConfig = {
    tier,
    ...TIER_PRESETS[tier],
    fps,
    autoDowngraded,
  };

  return {
    config: currentConfig,
    tier,
    fps,
    autoDowngraded,
    setTier: setManualTier,
  };
}

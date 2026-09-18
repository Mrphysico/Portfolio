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
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    useWebGPU: true,
  },
  HIGH: {
    particleCount: 500_000,
    enablePostProcessing: true,
    enableBloom: true,
    enableSSAO: false,
    enableChromaticAberration: true,
    dpr: Math.min(window.devicePixelRatio || 1, 1.5),
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

export function useTierDetection() {
  const [tier, setTier] = useState<QualityTier>('HIGH');
  const [fps, setFps] = useState<number>(60);
  const [autoDowngraded, setAutoDowngraded] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);

  // Hardware capability detection on initial mount
  useEffect(() => {
    async function detectCapabilities() {
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

  // Live FPS Monitor with auto-downgrade safeguard
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    let animId: number;

    const measure = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (delta > 0 && delta < 200) {
        const currentFps = 1000 / delta;
        frameTimesRef.current.push(currentFps);
        if (frameTimesRef.current.length > 90) { // ~1.5 - 2s window
          frameTimesRef.current.shift();
          const avgFps = Math.round(
            frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
          );
          setFps(avgFps);

          // Auto-downgrade if fps stays below 45 and not manually set
          if (!isManual && avgFps < 45) {
            setTier((current) => {
              if (current === 'ULTRA') {
                setAutoDowngraded(true);
                return 'HIGH';
              }
              if (current === 'HIGH') {
                setAutoDowngraded(true);
                return 'BALANCED';
              }
              if (current === 'BALANCED') {
                setAutoDowngraded(true);
                return 'LITE';
              }
              return current;
            });
          }
        }
      }

      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, [isManual]);

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

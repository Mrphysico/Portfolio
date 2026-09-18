import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { DimensionKey } from '../../hooks/useDimensionScroll';
import { TierConfig } from '../../hooks/useTierDetection';
import { ParticleSystem } from './ParticleSystem';
import { RigModel } from './RigModel';
import { TesseractScene } from '../tesseract/TesseractScene';
import { SingularityScene } from './SingularityScene';

export type BackgroundRenderState = 'running' | 'paused' | 'disposed';

interface DimensionCanvasProps {
  currentDimension: DimensionKey;
  dimensionProgress: number;
  overallProgress: number;
  tierConfig: TierConfig;
  isAntiGravity: boolean;
}

// Lightweight inner component to monitor frame updates and publish debug telemetry
const FrameLoopWatcher: React.FC<{
  tierConfig: TierConfig;
  renderState: BackgroundRenderState;
}> = ({ tierConfig, renderState }) => {
  const frameCountRef = useRef(0);
  const lastDomUpdateRef = useRef(0);
  const startTimeRef = useRef(performance.now());

  useFrame(() => {
    try {
      frameCountRef.current++;
      const uTime = (performance.now() - startTimeRef.current) * 0.001;

      if (typeof window !== 'undefined') {
        const debugObj = (window as any).__DIMENSION_CANVAS_DEBUG__ || {};
        debugObj.state = renderState;
        debugObj.frameCount = frameCountRef.current;
        debugObj.uTime = uTime;
        debugObj.tier = tierConfig.tier;
        debugObj.lastUpdate = performance.now();
        (window as any).__DIMENSION_CANVAS_DEBUG__ = debugObj;

        // Throttled DOM update for dev HUD (every 100ms) without React re-render overhead
        const now = performance.now();
        if (now - lastDomUpdateRef.current > 100) {
          lastDomUpdateRef.current = now;
          const frameEl = document.getElementById('debug-bg-frame');
          if (frameEl) frameEl.textContent = String(frameCountRef.current);
          const timeEl = document.getElementById('debug-bg-utime');
          if (timeEl) timeEl.textContent = `${uTime.toFixed(2)}s`;
        }
      }
    } catch (err) {
      console.error('[DimensionCanvas FrameLoopWatcher error]', err);
    }
  });

  return null;
};

export const DimensionCanvas: React.FC<DimensionCanvasProps> = ({
  currentDimension,
  dimensionProgress,
  overallProgress,
  tierConfig,
  isAntiGravity,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [renderState, setRenderState] = useState<BackgroundRenderState>('running');
  const stateRef = useRef<BackgroundRenderState>('running');

  // State machine transition helper with dev logging
  const transitionState = useCallback((nextState: BackgroundRenderState, reason: string) => {
    if (stateRef.current === nextState) return;
    const prevState = stateRef.current;
    stateRef.current = nextState;
    setRenderState(nextState);
    if (import.meta.env.DEV) {
      console.debug(`[DimensionCanvas State] ${prevState} -> ${nextState} (${reason})`);
    }
    if (typeof window !== 'undefined') {
      const debugObj = (window as any).__DIMENSION_CANVAS_DEBUG__ || {};
      debugObj.state = nextState;
      (window as any).__DIMENSION_CANVAS_DEBUG__ = debugObj;
      const stateEl = document.getElementById('debug-bg-state');
      if (stateEl) stateEl.textContent = nextState.toUpperCase();
    }
  }, []);

  // Robust Page Visibility & Window Focus Lifecycle
  useEffect(() => {
    transitionState('running', 'Component mounted');

    const handleVisibilityChange = () => {
      if (document.hidden) {
        transitionState('paused', 'Page visibility hidden');
      } else {
        transitionState('running', 'Page visibility visible');
      }
    };

    const handleFocus = () => {
      if (!document.hidden) {
        transitionState('running', 'Window focused');
      }
    };

    const handleBlur = () => {
      // Optional: keep running or pause when completely blurred.
      // To avoid unwanted pausing during DevTools inspection, we only pause on document.hidden
      if (document.hidden) {
        transitionState('paused', 'Window blurred and hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      transitionState('disposed', 'Component unmounted');
    };
  }, [transitionState]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates (-1.0 to 1.0)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Dev-Only Diagnostic Debug HUD */}
      {import.meta.env.DEV && (
        <div
          id="dimension-canvas-debug"
          className="fixed top-20 left-6 z-50 bg-black/85 backdrop-blur-md border border-cyan-500/30 rounded-lg px-3 py-1.5 text-[11px] font-mono text-cyan-300 shadow-xl pointer-events-auto flex items-center gap-2 select-none"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              renderState === 'running' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`}
          />
          <span>
            BG:{' '}
            <strong
              id="debug-bg-state"
              className={renderState === 'running' ? 'text-green-400' : 'text-red-400'}
            >
              {renderState.toUpperCase()}
            </strong>
          </span>
          <span className="text-zinc-600">|</span>
          <span>
            Frames: <strong id="debug-bg-frame">0</strong>
          </span>
          <span className="text-zinc-600">|</span>
          <span>
            uTime: <strong id="debug-bg-utime">0.00s</strong>
          </span>
          <span className="text-zinc-600">|</span>
          <span>
            Tier: <strong>{tierConfig.tier}</strong>
          </span>
        </div>
      )}

      <Canvas
        frameloop={renderState === 'running' ? 'always' : 'never'}
        dpr={tierConfig.dpr}
        gl={{
          antialias: tierConfig.tier !== 'LITE' && tierConfig.tier !== 'STATIC',
          powerPreference: 'high-performance',
          alpha: true,
        }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const handleContextLost = (e: Event) => {
            e.preventDefault();
            console.warn('[DimensionCanvas] WebGL Context Lost! Preventing default to allow restoration.');
            transitionState('paused', 'WebGL context lost');
          };
          const handleContextRestored = () => {
            console.info('[DimensionCanvas] WebGL Context Restored! Resuming background animation.');
            transitionState('running', 'WebGL context restored');
          };
          canvas.addEventListener('webglcontextlost', handleContextLost, false);
          canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={50} />

        {/* Cinematic Multi-Color Space Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#00f7ff" />
        <directionalLight position={[-5, -8, -5]} intensity={1.0} color="#ff7700" />
        <pointLight position={[0, 0, 2]} intensity={2.0} color="#a855f7" distance={10} />

        {/* Diagnostic watcher & telemetry collector */}
        <FrameLoopWatcher tierConfig={tierConfig} renderState={renderState} />

        {/* 1. GPU / Compute Particle System (0D to 4D to Singularity) */}
        <ParticleSystem
          currentDimension={currentDimension}
          dimensionProgress={dimensionProgress}
          tierConfig={tierConfig}
          mousePos={mousePos}
          isAntiGravity={isAntiGravity}
        />

        {/* 2. Hero 3D Gaming PC Rig (RigForge - Visible in 4D) */}
        <RigModel
          progress={dimensionProgress}
          visible={currentDimension === '4D'}
        />

        {/* 3. True 4D Tesseract & Polytopes (Visible in 4D) */}
        <TesseractScene
          progress={dimensionProgress}
          visible={currentDimension === '4D'}
        />

        {/* 4. Gravitational Lensing Singularity (Visible in Singularity chapter) */}
        <SingularityScene
          progress={dimensionProgress}
          visible={currentDimension === 'Singularity'}
          tierConfig={tierConfig}
        />
      </Canvas>
    </div>
  );
};

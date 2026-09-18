import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { useTierDetection, QualityTier } from './hooks/useTierDetection';
import { useDimensionScroll, DimensionKey } from './hooks/useDimensionScroll';
import { Navbar } from './components/hud/Navbar';
import { DimensionMeter } from './components/hud/DimensionMeter';
import { Preloader0D } from './components/preloader/Preloader0D';
import { DimensionCanvas } from './components/canvas/DimensionCanvas';
import { Chapter0D } from './components/chapters/Chapter0D';

// Route-level code-splitting: Lazy load chapters and heavy subsystems
const Chapter1D = lazy(() => import('./components/chapters/Chapter1D').then((m) => ({ default: m.Chapter1D })));
const Chapter2D = lazy(() => import('./components/chapters/Chapter2D').then((m) => ({ default: m.Chapter2D })));
const Chapter3D = lazy(() => import('./components/chapters/Chapter3D').then((m) => ({ default: m.Chapter3D })));
const Chapter4D = lazy(() => import('./components/chapters/Chapter4D').then((m) => ({ default: m.Chapter4D })));
const LanguageGalaxy = lazy(() => import('./components/galaxy/LanguageGalaxy').then((m) => ({ default: m.LanguageGalaxy })));
const WorkshopSection = lazy(() => import('./components/chapters/WorkshopSection').then((m) => ({ default: m.WorkshopSection })));
const CommandPalette = lazy(() => import('./components/terminal/CommandPalette').then((m) => ({ default: m.CommandPalette })));

export function App() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isAntiGravity, setIsAntiGravity] = useState(false);
  const [theme, setTheme] = useState<'neon-cyan' | 'solar-flare' | 'deep-void'>('neon-cyan');

  const { config: tierConfig, setTier } = useTierDetection();
  const { currentDimension, progress, dimensionProgress, velocity, scrollToDimension } = useDimensionScroll();

  // Handle audio toggle: Lazy load ToneAudio module only on first user gesture
  const handleToggleAudio = useCallback(async () => {
    const { toneAudio } = await import('./components/audio/ToneAudio');
    const active = await toneAudio.toggle();
    setIsAudioActive(active);
  }, []);

  // Sync scroll velocity to audio filter frequency only when audio is active
  useEffect(() => {
    if (isAudioActive) {
      import('./components/audio/ToneAudio').then(({ toneAudio }) => {
        const freq = 400 + Math.abs(velocity) * 500 + progress * 800;
        toneAudio.updateFilter(freq);
      });
    }
  }, [velocity, progress, isAudioActive]);

  const handleToggleAntiG = useCallback(() => {
    setIsAntiGravity((prev) => !prev);
  }, []);

  const handleOpenTerminal = useCallback(() => {
    setIsTerminalOpen(true);
  }, []);

  const handleCloseTerminal = useCallback(() => {
    setIsTerminalOpen(false);
  }, []);

  return (
    <div className={`relative min-h-[100dvh] w-full max-w-full bg-void-950 text-slate-100 overflow-x-clip ${theme}`}>
      {/* 1. 0D Preloader & Singularity Startup */}
      <Preloader0D onComplete={() => setIsPreloaderDone(true)} />

      {/* 2. Three.js / WebGPU / R3F Canvas Layer (Persistent Background) */}
      <DimensionCanvas
        currentDimension={currentDimension}
        dimensionProgress={dimensionProgress}
        overallProgress={progress}
        tierConfig={tierConfig}
        isAntiGravity={isAntiGravity}
      />

      {/* 3. High-Tech Glass Navigation Bar */}
      <Navbar
        currentDimension={currentDimension}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        isAntiGravity={isAntiGravity}
        onToggleAntiGravity={handleToggleAntiG}
        onOpenTerminal={handleOpenTerminal}
        onSelectDimension={scrollToDimension}
        theme={theme}
        onChangeTheme={setTheme}
      />

      {/* 4. Bottom Dimension Meter & Quality Tier Switcher */}
      <DimensionMeter
        currentDimension={currentDimension}
        progress={progress}
        dimensionProgress={dimensionProgress}
        tierConfig={tierConfig}
        onSelectTier={setTier}
        onSelectDimension={scrollToDimension}
      />

      {/* 5. Main Semantic Content: Dimensional Chapters with content-visibility containment */}
      <main id="main-content" className="relative z-10">
        <Chapter0D onExplore={() => scrollToDimension('1D')} />
        <Suspense fallback={<div className="min-h-screen" />}>
          <div className="chapter-container">
            <Chapter1D />
          </div>
          <div className="chapter-container">
            <Chapter2D />
          </div>
          <div className="chapter-container">
            <Chapter3D />
          </div>
          <div className="chapter-container">
            <Chapter4D />
          </div>
          <div className="chapter-container">
            <LanguageGalaxy />
          </div>
          <div className="chapter-container">
            <WorkshopSection />
          </div>
        </Suspense>
      </main>

      {/* 6. Interactive Command Palette (Ctrl+K) */}
      {isTerminalOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={isTerminalOpen}
            onClose={handleCloseTerminal}
            onSelectDimension={scrollToDimension}
            onToggleAntiGravity={handleToggleAntiG}
            onSelectTier={setTier}
          />
        </Suspense>
      )}

      {/* 7. Static Mode / Reduced Motion Notice */}
      {tierConfig.tier === 'STATIC' && (
        <div
          id="reduced-motion-notice"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-zinc-950/90 backdrop-blur-md border border-amber-500/40 px-4 py-2 rounded-xl text-xs font-mono text-amber-200 shadow-2xl pointer-events-auto"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Animations paused (reduced motion / static mode)</span>
          <button
            type="button"
            onClick={() => setTier('BALANCED')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 font-bold transition-all"
          >
            Enable Animations
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

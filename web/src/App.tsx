import React, { useState, useEffect } from 'react';
import { useTierDetection, QualityTier } from './hooks/useTierDetection';
import { useDimensionScroll, DimensionKey } from './hooks/useDimensionScroll';
import { Navbar } from './components/hud/Navbar';
import { DimensionMeter } from './components/hud/DimensionMeter';
import { Preloader0D } from './components/preloader/Preloader0D';
import { DimensionCanvas } from './components/canvas/DimensionCanvas';
import { Chapter0D } from './components/chapters/Chapter0D';
import { Chapter1D } from './components/chapters/Chapter1D';
import { Chapter2D } from './components/chapters/Chapter2D';
import { Chapter3D } from './components/chapters/Chapter3D';
import { Chapter4D } from './components/chapters/Chapter4D';
import { LanguageGalaxy } from './components/galaxy/LanguageGalaxy';
import { SingularityContact } from './components/chapters/SingularityContact';
import { CommandPalette } from './components/terminal/CommandPalette';
import { toneAudio } from './components/audio/ToneAudio';

export function App() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isAntiGravity, setIsAntiGravity] = useState(false);
  const [theme, setTheme] = useState<'neon-cyan' | 'solar-flare' | 'deep-void'>('neon-cyan');

  const { config: tierConfig, setTier } = useTierDetection();
  const { currentDimension, progress, dimensionProgress, velocity, scrollToDimension } = useDimensionScroll();

  // Handle audio toggle
  const handleToggleAudio = async () => {
    const active = await toneAudio.toggle();
    setIsAudioActive(active);
  };

  // Sync scroll velocity to audio filter frequency
  useEffect(() => {
    if (isAudioActive) {
      const freq = 400 + Math.abs(velocity) * 500 + progress * 800;
      toneAudio.updateFilter(freq);
    }
  }, [velocity, progress, isAudioActive]);

  return (
    <div className={`relative min-h-screen bg-void-950 text-slate-100 overflow-x-hidden ${theme}`}>
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
        onToggleAntiGravity={() => setIsAntiGravity(!isAntiGravity)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
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

      {/* 5. Main Semantic Content: Dimensional Chapters (Accessible for screen-readers & crawlers) */}
      <main id="main-content" className="relative z-10">
        <Chapter0D onExplore={() => scrollToDimension('1D')} />
        <Chapter1D />
        <Chapter2D />
        <Chapter3D />
        <Chapter4D />
        <LanguageGalaxy />
        <SingularityContact />
      </main>

      {/* 6. Interactive Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onSelectDimension={scrollToDimension}
        onToggleAntiGravity={() => setIsAntiGravity(!isAntiGravity)}
        onSelectTier={setTier}
      />
    </div>
  );
}

export default App;

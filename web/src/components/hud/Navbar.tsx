import React from 'react';
import { Volume2, VolumeX, Terminal, Sparkles, Orbit, Github, Linkedin, Compass } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/content';
import { DimensionKey } from '../../hooks/useDimensionScroll';

interface NavbarProps {
  currentDimension: DimensionKey;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  isAntiGravity: boolean;
  onToggleAntiGravity: () => void;
  onOpenTerminal: () => void;
  onSelectDimension: (dim: DimensionKey) => void;
  theme: 'neon-cyan' | 'solar-flare' | 'deep-void';
  onChangeTheme: (theme: 'neon-cyan' | 'solar-flare' | 'deep-void') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDimension,
  isAudioActive,
  onToggleAudio,
  isAntiGravity,
  onToggleAntiGravity,
  onOpenTerminal,
  onSelectDimension,
  theme,
  onChangeTheme,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between pointer-events-none w-full max-w-full">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => onSelectDimension('0D')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
            <Orbit className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-wider text-white flex items-center gap-1.5">
              <span>{PERSONAL_INFO.name.toUpperCase()}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                {currentDimension}
              </span>
            </div>
            <div className="hidden sm:block text-[10px] font-mono text-slate-400 tracking-tight">
              THE DIMENSIONAL PORTFOLIO
            </div>
          </div>
        </button>
      </div>

      {/* Center navigation */}
      <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 glass-panel px-2 lg:px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto shadow-2xl font-mono text-xs">
        <button
          onClick={() => onSelectDimension('0D')}
          className={`px-2.5 lg:px-3 py-1 rounded-full transition-all ${
            currentDimension === '0D' ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/50' : 'text-slate-400 hover:text-white'
          }`}
        >
          0D<span className="hidden xl:inline ml-1">Origin</span>
        </button>
        <button
          onClick={() => onSelectDimension('1D')}
          className={`px-2.5 lg:px-3 py-1 rounded-full transition-all ${
            currentDimension === '1D' ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/50' : 'text-slate-400 hover:text-white'
          }`}
        >
          1D<span className="hidden xl:inline ml-1">Line</span>
        </button>
        <button
          onClick={() => onSelectDimension('2D')}
          className={`px-2.5 lg:px-3 py-1 rounded-full transition-all ${
            currentDimension === '2D' ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/50' : 'text-slate-400 hover:text-white'
          }`}
        >
          2D<span className="hidden xl:inline ml-1">Plane</span>
        </button>
        <button
          onClick={() => onSelectDimension('3D')}
          className={`px-2.5 lg:px-3 py-1 rounded-full transition-all ${
            currentDimension === '3D' ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/50' : 'text-slate-400 hover:text-white'
          }`}
        >
          3D<span className="hidden xl:inline ml-1">World</span>
        </button>
        <button
          onClick={() => onSelectDimension('4D')}
          className={`px-2.5 lg:px-3 py-1 rounded-full transition-all ${
            currentDimension === '4D' ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/50' : 'text-slate-400 hover:text-white'
          }`}
        >
          4D<span className="hidden xl:inline ml-1">RigForge</span>
        </button>
        <button
          onClick={() => onSelectDimension('Singularity')}
          className={`px-2.5 lg:px-3 py-1 rounded-full transition-all ${
            currentDimension === 'Singularity' ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/50' : 'text-slate-400 hover:text-white'
          }`}
        >
          Singularity
        </button>
      </nav>

      {/* Controls & Socials */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Anti-Gravity flip button */}
        <button
          onClick={onToggleAntiGravity}
          className={`p-1.5 sm:p-2 rounded-lg border transition-all text-xs font-mono flex items-center gap-1.5 ${
            isAntiGravity
              ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/50 animate-bounce'
              : 'glass-panel text-slate-300 border-white/10 hover:border-purple-400/50 hover:text-purple-300'
          }`}
          title="Toggle Anti-Gravity (physics buoyancy mode)"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden lg:inline">{isAntiGravity ? 'ANTI-G: ON' : 'ANTI-G'}</span>
        </button>

        {/* Terminal toggle */}
        <button
          onClick={onOpenTerminal}
          className="p-1.5 sm:p-2 glass-panel rounded-lg border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors flex items-center gap-1.5 font-mono text-xs"
          title="Open interactive terminal (Ctrl+K)"
        >
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="hidden lg:inline">TERM [^K]</span>
        </button>

        {/* Generative audio toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
            isAudioActive
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
              : 'glass-panel text-slate-400 border-white/10 hover:text-white'
          }`}
          title={isAudioActive ? 'Soundtrack: ON' : 'Soundtrack: OFF (Click to unmute)'}
        >
          {isAudioActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Verified Social links (hidden on very small screens to prevent navbar overflow) */}
        <a
          href={PERSONAL_INFO.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex p-1.5 sm:p-2 glass-panel rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-colors"
          title="Arth Jadav's GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href={PERSONAL_INFO.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex p-1.5 sm:p-2 glass-panel rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-colors"
          title="Arth Jadav's LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};

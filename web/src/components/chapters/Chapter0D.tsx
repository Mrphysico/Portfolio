import React from 'react';
import { ArrowDown, Sparkles, Orbit } from 'lucide-react';
import { PERSONAL_INFO, DIMENSIONAL_CHAPTERS } from '../../data/content';

interface Chapter0DProps {
  onExplore: () => void;
}

export const Chapter0D: React.FC<Chapter0DProps> = ({ onExplore }) => {
  const chapter = DIMENSIONAL_CHAPTERS['0D'];

  return (
    <section
      id="chapter-0d"
      className="min-h-screen w-full flex flex-col justify-center items-center px-6 relative z-10 select-none text-center"
    >
      {/* Dimension Label */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs mb-6 shadow-lg shadow-cyan-500/10 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <span>{chapter.dimension} // {chapter.coordinates}</span>
      </div>

      {/* Hero Name Typography */}
      <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-extrabold tracking-tighter text-white uppercase text-glow-cyan">
        {PERSONAL_INFO.name}
      </h1>

      {/* Role & Tagline */}
      <p className="mt-4 text-lg sm:text-2xl text-slate-300 font-display font-medium max-w-2xl">
        {PERSONAL_INFO.role}
      </p>

      <p className="mt-2 text-xs sm:text-sm text-slate-400 font-mono max-w-xl">
        An interactive journey through computational space: from 0D origin to 4D hyperspace.
      </p>

      {/* Action / Explore Prompt */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <button
          onClick={onExplore}
          className="group px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-cyan-500/25 cursor-pointer"
        >
          <span>Initiate Dimensional Warp</span>
          <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
        </button>

        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] mt-2 animate-bounce">
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Scroll down to traverse dimensions</span>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { LANGUAGE_GALAXY, LanguageStar } from '../../data/content';
import { Sparkles, Code, CheckCircle, Info, X } from 'lucide-react';

export const LanguageGalaxy: React.FC = () => {
  const [selectedStar, setSelectedStar] = useState<LanguageStar | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified-projects' | 'used-in-portfolio' | 'exploring'>('all');

  const filteredStars = LANGUAGE_GALAXY.filter(
    (star) => filter === 'all' || star.category === filter
  );

  return (
    <div className="w-full max-w-5xl mx-auto my-16 px-6 relative z-10 select-none font-mono">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Computational Cosmos</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Language Galaxy
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Interactive 3D constellation of 40+ languages with strict honesty labeling.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({LANGUAGE_GALAXY.length})
            </button>
            <button
              onClick={() => setFilter('verified-projects')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'verified-projects' ? 'bg-green-500/20 text-green-300 font-bold border border-green-500/40' : 'text-slate-400 hover:text-green-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Verified in Projects
            </button>
            <button
              onClick={() => setFilter('used-in-portfolio')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'used-in-portfolio' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Used in Portfolio
            </button>
            <button
              onClick={() => setFilter('exploring')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'exploring' ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40' : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Exploring / Curious
            </button>
          </div>
        </div>

        {/* Constellation Star Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 my-6">
          {filteredStars.map((star) => {
            const isSelected = selectedStar?.name === star.name;
            const categoryColor =
              star.category === 'verified-projects'
                ? 'border-green-500/40 text-green-300 bg-green-500/10'
                : star.category === 'used-in-portfolio'
                ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'
                : 'border-purple-500/30 text-slate-300 bg-black/40';

            return (
              <button
                key={star.name}
                onClick={() => setSelectedStar(star)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 hover:scale-105 group relative flex flex-col justify-between min-h-[72px] cursor-pointer ${
                  isSelected ? 'ring-2 ring-cyan-400 scale-105' : ''
                } ${categoryColor}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs group-hover:text-white transition-colors">
                    {star.name}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: star.color }}
                  />
                </div>
                <span className="text-[9px] text-slate-400 capitalize truncate mt-2">
                  {star.category === 'verified-projects'
                    ? 'Verified'
                    : star.category === 'used-in-portfolio'
                    ? 'Portfolio'
                    : 'Curious'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Star Details Modal / Drawer */}
        {selectedStar && (
          <div className="mt-6 p-6 rounded-2xl bg-black/60 border border-white/15 relative animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => setSelectedStar(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedStar.color }}
              />
              <h4 className="text-xl font-display font-bold text-white">
                {selectedStar.name}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedStar.category === 'verified-projects'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : selectedStar.category === 'used-in-portfolio'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}
              >
                {selectedStar.category === 'verified-projects'
                  ? 'Verified in Arth’s GitHub Repositories'
                  : selectedStar.category === 'used-in-portfolio'
                  ? 'Used to Engineer this Dimensional Portfolio'
                  : 'Exploring & Appreciating (Honesty Rule)'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4">{selectedStar.fact}</p>

            <div className="bg-black/80 rounded-xl p-3 border border-white/10 font-mono text-xs">
              <div className="text-[10px] text-slate-500 mb-1">// Hello, World! in {selectedStar.name}</div>
              <pre className="text-cyan-300 overflow-x-auto whitespace-pre-wrap">{selectedStar.helloWorld}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

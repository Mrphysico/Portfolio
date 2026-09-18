import React, { useState } from 'react';
import { DimensionKey } from '../../hooks/useDimensionScroll';
import { QualityTier, TierConfig } from '../../hooks/useTierDetection';
import { DIMENSIONAL_CHAPTERS } from '../../data/content';
import { Activity, Gauge, Sliders, Cpu } from 'lucide-react';

interface DimensionMeterProps {
  currentDimension: DimensionKey;
  progress: number;
  dimensionProgress: number;
  tierConfig: TierConfig;
  onSelectTier: (tier: QualityTier) => void;
  onSelectDimension: (dim: DimensionKey) => void;
}

export const DimensionMeter: React.FC<DimensionMeterProps> = ({
  currentDimension,
  progress,
  dimensionProgress,
  tierConfig,
  onSelectTier,
  onSelectDimension,
}) => {
  const [showTierMenu, setShowTierMenu] = useState(false);
  const chapter = DIMENSIONAL_CHAPTERS[currentDimension];

  const dimensions: DimensionKey[] = ['0D', '1D', '2D', '3D', '4D', 'Singularity'];

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2 font-mono text-xs select-none">
      {/* Dimension HUD card */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/10 shadow-2xl flex flex-col gap-2.5 min-w-[280px]">
        {/* Top row: Current Dimension & Coordinates */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-cyan-400 text-sm tracking-widest">{chapter.dimension}</span>
            <span className="text-slate-400 font-semibold uppercase">{chapter.title}</span>
          </div>
          <span className="text-slate-400 bg-white/5 px-2 py-0.5 rounded text-[10px]">
            {chapter.coordinates}
          </span>
        </div>

        {/* Dimension steps selector */}
        <div className="grid grid-cols-6 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          {dimensions.map((dim) => {
            const isActive = currentDimension === dim;
            return (
              <button
                key={dim}
                onClick={() => onSelectDimension(dim)}
                className={`py-1 text-[10px] font-bold rounded transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title={`Jump to ${dim}`}
              >
                {dim === 'Singularity' ? 'Ω' : dim}
              </button>
            );
          })}
        </div>

        {/* Progress scrub bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>WARP PROGRESS</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Bottom row: Quality Tier & FPS counter */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
          <div className="relative">
            <button
              onClick={() => setShowTierMenu(!showTierMenu)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors bg-white/5 px-2 py-1 rounded"
              title="Click to change quality tier"
            >
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span className="font-semibold">{tierConfig.tier}</span>
              {tierConfig.autoDowngraded && (
                <span className="text-[9px] text-amber-400 font-bold" title="Auto-adjusted for smooth frame rate">
                  AUTO
                </span>
              )}
            </button>

            {/* Quality tier popup menu */}
            {showTierMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-44 glass-panel rounded-lg p-1.5 shadow-2xl border border-white/15 flex flex-col gap-1 z-50">
                <span className="text-[10px] text-slate-400 px-2 py-1 uppercase font-semibold">
                  Graphics Quality Tier
                </span>
                {(['ULTRA', 'HIGH', 'BALANCED', 'LITE', 'STATIC'] as QualityTier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      onSelectTier(t);
                      setShowTierMenu(false);
                    }}
                    className={`text-left px-2 py-1.5 rounded text-xs transition-colors flex justify-between items-center ${
                      tierConfig.tier === t
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{t}</span>
                    <span className="text-[10px] text-slate-400">
                      {t === 'ULTRA' ? '1M pts' : t === 'HIGH' ? '500k' : t === 'BALANCED' ? '150k' : t === 'LITE' ? '25k' : '2k'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-green-400" />
            <span className={`font-bold ${tierConfig.fps < 45 ? 'text-amber-400' : 'text-green-400'}`}>
              {tierConfig.fps} FPS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

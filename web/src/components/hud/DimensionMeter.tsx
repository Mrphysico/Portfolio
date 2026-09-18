import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DimensionKey } from '../../hooks/useDimensionScroll';
import { QualityTier, TierConfig } from '../../hooks/useTierDetection';
import { DIMENSIONAL_CHAPTERS } from '../../data/content';
import { Activity, Cpu, GripVertical, ChevronDown, ChevronUp, CornerDownLeft, CornerDownRight, CornerUpLeft, CornerUpRight } from 'lucide-react';

interface DimensionMeterProps {
  currentDimension: DimensionKey;
  progress: number;
  dimensionProgress: number;
  tierConfig: TierConfig;
  onSelectTier: (tier: QualityTier) => void;
  onSelectDimension: (dim: DimensionKey) => void;
}

type CornerSnap = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'custom';

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

  // Load layout preferences from localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dimension_meter_collapsed');
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    // Default to collapsed in Singularity to prevent covering the 3D scene
    return currentDimension === 'Singularity';
  });

  const [cornerSnap, setCornerSnap] = useState<CornerSnap>(() => {
    try {
      const saved = localStorage.getItem('dimension_meter_corner');
      if (saved) return saved as CornerSnap;
    } catch {
      // Ignore
    }
    return currentDimension === 'Singularity' ? 'bottom-right' : 'bottom-left';
  });

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('dimension_meter_pos');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return { x: 0, y: 0 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('dimension_meter_collapsed', JSON.stringify(isCollapsed));
      localStorage.setItem('dimension_meter_corner', cornerSnap);
      localStorage.setItem('dimension_meter_pos', JSON.stringify(position));
    } catch {
      // Ignore
    }
  }, [isCollapsed, cornerSnap, position]);

  // Corner snap positions
  const getCornerClasses = () => {
    if (cornerSnap === 'top-left') return 'top-20 left-6';
    if (cornerSnap === 'top-right') return 'top-20 right-6';
    if (cornerSnap === 'bottom-right') return 'bottom-6 right-6';
    return 'bottom-6 left-6'; // default bottom-left
  };

  const handleSnap = (corner: CornerSnap) => {
    setCornerSnap(corner);
    setPosition({ x: 0, y: 0 });
  };

  // Dragging logic
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    setIsDragging(true);
    setCornerSnap('custom');
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setPosition({
        x: dragStartRef.current.posX + dx,
        y: dragStartRef.current.posY + dy,
      });
    },
    [isDragging]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className={`fixed z-40 flex flex-col gap-2 font-mono text-xs select-none transition-shadow ${getCornerClasses()} ${
        isDragging ? 'shadow-[0_0_25px_rgba(0,247,255,0.4)]' : ''
      }`}
    >
      {/* ================= COLLAPSED STATUS PILL ================= */}
      {isCollapsed ? (
        <div className="glass-panel rounded-full px-3 py-1.5 border border-white/20 shadow-2xl flex items-center gap-2.5 bg-black/80 backdrop-blur-xl">
          <button
            type="button"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="cursor-grab active:cursor-grabbing p-0.5 text-zinc-500 hover:text-zinc-300"
            title="Drag HUD"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-cyan-400">
              {currentDimension === 'Singularity' ? 'Ω' : currentDimension}
            </span>
            <span className="text-zinc-400 text-[10px] hidden sm:inline">{chapter.title}</span>
          </div>

          <div className="h-3 w-px bg-zinc-700" />

          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Activity className="w-3 h-3" />
            <span>{tierConfig.fps} FPS</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Expand HUD Panel"
            aria-label="Expand HUD Panel"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* ================= EXPANDED FULL HUD CARD ================= */
        <div className="glass-panel rounded-xl p-3.5 border border-white/15 shadow-2xl flex flex-col gap-2.5 min-w-[280px] bg-black/85 backdrop-blur-xl">
          {/* Header & Drag Handle */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-white/5 pb-2"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5 text-zinc-500" />
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-cyan-400 text-sm tracking-widest">
                  {chapter.dimension}
                </span>
                <span className="text-slate-400 font-semibold uppercase text-[11px]">
                  {chapter.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Snap buttons */}
              <button
                type="button"
                onClick={() => handleSnap('top-left')}
                className="p-0.5 rounded hover:bg-white/10 text-zinc-500 hover:text-zinc-300"
                title="Snap Top-Left"
              >
                <CornerUpLeft className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSnap('top-right')}
                className="p-0.5 rounded hover:bg-white/10 text-zinc-500 hover:text-zinc-300"
                title="Snap Top-Right"
              >
                <CornerUpRight className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSnap('bottom-left')}
                className="p-0.5 rounded hover:bg-white/10 text-zinc-500 hover:text-zinc-300"
                title="Snap Bottom-Left"
              >
                <CornerDownLeft className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSnap('bottom-right')}
                className="p-0.5 rounded hover:bg-white/10 text-zinc-500 hover:text-zinc-300"
                title="Snap Bottom-Right"
              >
                <CornerDownRight className="w-2.5 h-2.5" />
              </button>

              {/* Collapse button */}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors ml-1"
                title="Collapse HUD to pill"
                aria-label="Collapse HUD"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
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
                  <span
                    className="text-[9px] text-amber-400 font-bold"
                    title="Auto-adjusted for smooth frame rate"
                  >
                    AUTO
                  </span>
                )}
              </button>

              {/* Quality tier popup menu */}
              {showTierMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-44 glass-panel rounded-lg p-1.5 shadow-2xl border border-white/15 flex flex-col gap-1 z-50 bg-black/95">
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
                        {t === 'ULTRA'
                          ? '1M pts'
                          : t === 'HIGH'
                          ? '500k'
                          : t === 'BALANCED'
                          ? '150k'
                          : t === 'LITE'
                          ? '25k'
                          : '2k'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-green-400" />
              <span
                className={`font-bold ${
                  tierConfig.fps < 45 ? 'text-amber-400' : 'text-green-400'
                }`}
              >
                {tierConfig.fps} FPS
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

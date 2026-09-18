import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2, RotateCcw, Move, ChevronDown, ChevronUp } from 'lucide-react';

interface MovableWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  className?: string;
  headerControls?: React.ReactNode;
  onResetLayout?: () => void;
}

export const MovableWindow: React.FC<MovableWindowProps> = ({
  id,
  title,
  children,
  defaultPosition = { x: 0, y: 0 },
  defaultSize = { width: 720, height: 600 },
  minWidth = 280,
  minHeight = 360,
  className = '',
  headerControls,
  onResetLayout,
}) => {
  // Load saved position & size from localStorage
  const storageKey = `workshop_window_${id}`;
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return { x: parsed.x, y: parsed.y };
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    return defaultPosition;
  });

  const [size, setSize] = useState<{ width: number; height: number }>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.width === 'number' && typeof parsed.height === 'number') {
          return { width: parsed.width, height: parsed.height };
        }
      }
    } catch {
      // Ignore
    }
    return defaultSize;
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });
  const resizeStartRef = useRef<{ startX: number; startY: number; width: number; height: number }>({
    startX: 0,
    startY: 0,
    width: 0,
    height: 0,
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          x: position.x,
          y: position.y,
          width: size.width,
          height: size.height,
        })
      );
    } catch {
      // Ignore
    }
  }, [position, size, storageKey]);

  // Handle Fullscreen Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Dragging logic
  const handlePointerDownDrag = (e: React.PointerEvent) => {
    if (isFullscreen) return;
    if ((e.target as HTMLElement).closest('button, input, select, textarea')) return;

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;

      // Clamp within screen boundaries
      const newX = Math.max(-window.innerWidth * 0.4, Math.min(window.innerWidth * 0.4, dragStartRef.current.posX + dx));
      const newY = Math.max(-200, Math.min(400, dragStartRef.current.posY + dy));

      setPosition({ x: newX, y: newY });
    },
    [isDragging]
  );

  const handlePointerUpDrag = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  // Resizing logic
  const handlePointerDownResize = (e: React.PointerEvent) => {
    if (isFullscreen || isMinimized) return;
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      width: size.width,
      height: size.height,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveResize = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizing) return;
      const dw = e.clientX - resizeStartRef.current.startX;
      const dh = e.clientY - resizeStartRef.current.startY;

      const newWidth = Math.max(minWidth, Math.min(window.innerWidth - 32, resizeStartRef.current.width + dw));
      const newHeight = Math.max(minHeight, Math.min(window.innerHeight - 80, resizeStartRef.current.height + dh));

      setSize({ width: newWidth, height: newHeight });
    },
    [isResizing, minWidth, minHeight]
  );

  const handlePointerUpResize = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  // Reset to default layout
  const handleReset = () => {
    setPosition(defaultPosition);
    setSize(defaultSize);
    setIsMinimized(false);
    setIsFullscreen(false);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
    if (onResetLayout) onResetLayout();
  };

  // Keyboard accessibility
  const handleKeyDownHeader = (e: React.KeyboardEvent) => {
    if (isFullscreen) return;
    const step = e.shiftKey ? 30 : 10;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((prev) => ({ ...prev, x: prev.x - step }));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((prev) => ({ ...prev, x: prev.x + step }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setPosition((prev) => ({ ...prev, y: prev.y - step }));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setPosition((prev) => ({ ...prev, y: prev.y + step }));
    }
  };

  return (
    <div
      ref={containerRef}
      style={
        isFullscreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100dvh',
              zIndex: 9999,
              transform: 'none',
            }
          : {
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              width: '100%',
              maxWidth: `${size.width}px`,
              height: isMinimized ? 'auto' : `min(${size.height}px, 75dvh)`,
            }
      }
      className={`relative flex flex-col bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 rounded-2xl shadow-2xl transition-[width,height,border-color] duration-150 ${
        isDragging ? 'border-cyan-500 shadow-[0_0_30px_rgba(0,247,255,0.25)]' : ''
      } ${className}`}
    >
      {/* ================= WINDOW TITLE BAR / DRAG HANDLE ================= */}
      <div
        role="toolbar"
        tabIndex={0}
        onKeyDown={handleKeyDownHeader}
        onPointerDown={handlePointerDownDrag}
        onPointerMove={handlePointerMoveDrag}
        onPointerUp={handlePointerUpDrag}
        className={`px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between rounded-t-2xl select-none ${
          isFullscreen ? '' : 'cursor-grab active:cursor-grabbing'
        }`}
        title="Drag to reposition window • Use arrow keys when focused"
      >
        <div className="flex items-center gap-2">
          <Move className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-mono font-bold text-zinc-200 tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {title}
          </span>
        </div>

        {/* Custom Header Controls & Window Buttons */}
        <div className="flex items-center gap-1.5">
          {headerControls}

          {/* Reset position button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Reset position & size"
            aria-label="Reset window layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Minimize / Expand button */}
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={isMinimized ? 'Expand Window' : 'Minimize Window'}
            aria-label={isMinimized ? 'Expand Window' : 'Minimize Window'}
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Maximize / Fullscreen button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Maximize Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Maximize Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ================= WINDOW CONTENT ================= */}
      {!isMinimized && (
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
          {children}

          {/* Corner Resize Handle */}
          {!isFullscreen && (
            <div
              onPointerDown={handlePointerDownResize}
              onPointerMove={handlePointerMoveResize}
              onPointerUp={handlePointerUpResize}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5 z-30 group"
              title="Drag to resize window"
            >
              <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-zinc-600 group-hover:border-cyan-400 transition-colors" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

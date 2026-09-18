import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, CornerDownLeft, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO, PROJECTS, LANGUAGE_GALAXY } from '../../data/content';
import { DimensionKey } from '../../hooks/useDimensionScroll';
import { QualityTier } from '../../hooks/useTierDetection';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDimension: (dim: DimensionKey) => void;
  onToggleAntiGravity: () => void;
  onSelectTier: (tier: QualityTier) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectDimension,
  onToggleAntiGravity,
  onSelectTier,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ cmd: string; output: React.ReactNode }>>([
    {
      cmd: 'init',
      output: (
        <span className="text-slate-400">
          Welcome to <span className="text-cyan-400 font-bold">ARTH-OS v4.0</span>. Type <code className="text-cyan-300">help</code> for a list of quantum commands.
        </span>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Auto-scroll terminal history
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Global Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = null;

    if (cmd === 'help') {
      output = (
        <div className="space-y-1 text-xs">
          <div><span className="text-cyan-300 font-bold">whoami</span> — Display Arth Jadav's core profile</div>
          <div><span className="text-cyan-300 font-bold">projects</span> — List all dimensional projects</div>
          <div><span className="text-cyan-300 font-bold">dimension &lt;0D|1D|2D|3D|4D|singularity&gt;</span> — Warp to chapter</div>
          <div><span className="text-cyan-300 font-bold">gravity --flip</span> — Toggle zero-gravity physics</div>
          <div><span className="text-cyan-300 font-bold">tier &lt;ultra|high|balanced|lite|static&gt;</span> — Set graphics tier</div>
          <div><span className="text-cyan-300 font-bold">hello --lang=&lt;name&gt;</span> — Print language hello world</div>
          <div><span className="text-cyan-300 font-bold">sudo hire arth</span> — Executive recruitment clearance</div>
          <div><span className="text-cyan-300 font-bold">clear</span> — Wipe terminal history</div>
        </div>
      );
    } else if (cmd === 'whoami') {
      output = (
        <div className="text-xs space-y-1">
          <div className="font-bold text-white">{PERSONAL_INFO.name}</div>
          <div className="text-cyan-400">{PERSONAL_INFO.role}</div>
          <div className="text-slate-400">GitHub: {PERSONAL_INFO.githubUrl}</div>
          <div className="text-slate-400">LinkedIn: {PERSONAL_INFO.linkedinUrl}</div>
        </div>
      );
    } else if (cmd === 'projects') {
      output = (
        <div className="space-y-1 text-xs">
          {PROJECTS.map((p) => (
            <div key={p.id}>
              <span className="text-cyan-400 font-bold">[{p.dimension}]</span>{' '}
              <span className="text-white font-semibold">{p.title}</span> — {p.tagline}
            </div>
          ))}
        </div>
      );
    } else if (cmd.startsWith('dimension ')) {
      const dimArg = cmd.replace('dimension ', '').toUpperCase();
      const valid: DimensionKey[] = ['0D', '1D', '2D', '3D', '4D', 'Singularity'];
      const match = valid.find((v) => v.toUpperCase() === dimArg);
      if (match) {
        onSelectDimension(match);
        output = <span className="text-green-400">Warping to {match}...</span>;
        setTimeout(onClose, 600);
      } else {
        output = <span className="text-red-400">Invalid dimension. Choose: 0D, 1D, 2D, 3D, 4D, or Singularity</span>;
      }
    } else if (cmd === 'gravity --flip') {
      onToggleAntiGravity();
      output = <span className="text-purple-400">Gravity flipped! Physics fields inverted.</span>;
    } else if (cmd.startsWith('tier ')) {
      const tierArg = cmd.replace('tier ', '').toUpperCase() as QualityTier;
      if (['ULTRA', 'HIGH', 'BALANCED', 'LITE', 'STATIC'].includes(tierArg)) {
        onSelectTier(tierArg);
        output = <span className="text-cyan-400">Graphics tier set to {tierArg}.</span>;
      } else {
        output = <span className="text-red-400">Invalid tier. Choose: ULTRA, HIGH, BALANCED, LITE, or STATIC.</span>;
      }
    } else if (cmd.startsWith('hello --lang=')) {
      const langQuery = cmd.replace('hello --lang=', '').toLowerCase();
      const match = LANGUAGE_GALAXY.find((s) => s.name.toLowerCase() === langQuery);
      if (match) {
        output = (
          <div className="space-y-1">
            <span className="text-cyan-400 font-bold">// {match.name}:</span>
            <pre className="text-white bg-black/60 p-2 rounded">{match.helloWorld}</pre>
          </div>
        );
      } else {
        output = <span className="text-amber-400">Language '{langQuery}' not found in galaxy.</span>;
      }
    } else if (cmd === 'sudo hire arth') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f7ff', '#a855f7', '#ff7700', '#34d399'],
      });
      output = (
        <div className="text-xs p-3 rounded bg-green-500/20 border border-green-400 text-green-300 font-bold space-y-1">
          <div>ACCESS GRANTED: Excellent choice!</div>
          <div>Let’s connect on LinkedIn: {PERSONAL_INFO.linkedinUrl}</div>
        </div>
      );
    } else if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else {
      output = (
        <span className="text-red-400">
          Command not recognized: "{cmd}". Type <code className="text-cyan-300 font-bold">help</code>.
        </span>
      );
    }

    setHistory((prev) => [...prev, { cmd: rawCmd, output }]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col font-mono max-h-[80vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <TerminalIcon className="w-4 h-4" />
            <span className="font-bold">ARTH-OS // QUANTUM TERMINAL [CTRL+K]</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Output History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-black/30">
          {history.map((h, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <span>arth@dimensional:~$</span>
                <span className="text-white font-normal">{h.cmd}</span>
              </div>
              <div className="pl-4">{h.output}</div>
            </div>
          ))}
          <div ref={scrollEndRef} />
        </div>

        {/* Terminal Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(input);
          }}
          className="flex items-center gap-2 p-3 bg-black/60 border-t border-white/10 text-xs"
        >
          <span className="text-cyan-400 font-bold">arth@dimensional:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help', 'whoami', 'projects', 'sudo hire arth'..."
            className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-xs"
          />
          <button
            type="submit"
            className="p-1.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

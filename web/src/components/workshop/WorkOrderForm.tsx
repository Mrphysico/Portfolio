import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Send,
  CheckCircle2,
  Wrench,
  Sparkles,
  Github,
  Linkedin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

interface WorkOrderFormProps {
  onFormFocus: () => void;
  onFormBlur: () => void;
  screwsTightenedCount: number;
  isBooted: boolean;
  onQuickAssemble: () => void;
  isAntiG: boolean;
  onToggleAntiG: () => void;
  speechText: string;
  onResetLayout?: () => void;
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  onFormFocus,
  onFormBlur,
  screwsTightenedCount,
  isBooted,
  onQuickAssemble,
  isAntiG,
  onToggleAntiG,
  speechText,
  onResetLayout,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '3D / WebGL / Creative',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const projectTypes = [
    '3D / WebGL / Creative',
    'Full-Stack Web App',
    'High-Perf / WASM',
    'Something Wild',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Launch victory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f7ff', '#38bdf8', '#818cf8', '#a855f7'],
      });
    }, 900);
  };

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0 flex flex-col gap-4 relative z-20 font-sans">
      {/* ================= ARTH'S SPEECH BUBBLE ================= */}
      <div
        className="relative bg-zinc-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3.5 shadow-[0_0_20px_rgba(0,247,255,0.15)] flex items-start gap-3 transition-all duration-300"
        aria-live="polite"
      >
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_8px_rgba(0,247,255,0.4)]">
          AJ
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Arth Jadav &bull; Lead Hardware &amp; Web Architect
          </div>
          <p className="text-xs text-zinc-200 mt-0.5 leading-relaxed font-mono">
            &ldquo;{speechText}&rdquo;
          </p>
        </div>
        <div className="absolute -bottom-2 left-6 w-3 h-3 bg-zinc-900 border-r border-b border-cyan-500/40 transform rotate-45" />
      </div>

      {/* ================= WORK ORDER CLIPBOARD CARD ================= */}
      <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-200">
        {/* Top Clipboard Metallic Clip */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 border-b border-x border-zinc-700 rounded-b-lg flex items-center justify-center shadow-md">
          <div className="w-12 h-1 bg-zinc-600 rounded-full" />
        </div>

        {/* Card Header & Controls */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 mt-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              ENGINEERING WORK ORDER #2026-09
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Let&apos;s Build Together
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right font-mono text-[10px] text-zinc-400 hidden sm:block">
              <div>STATUS: {isBooted ? 'ALL CLEAR' : 'ASSEMBLING'}</div>
              <div>SCREWS: {screwsTightenedCount}/4</div>
            </div>

            {/* Collapse/Expand Card Button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title={isCollapsed ? 'Expand Form' : 'Collapse Form'}
              aria-label={isCollapsed ? 'Expand Form' : 'Collapse Form'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ================= WORKBENCH TOOLBAR BUTTONS ================= */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onQuickAssemble}
              disabled={isBooted}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                isBooted
                  ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 cursor-default shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-400 text-zinc-200 hover:text-cyan-300 active:scale-95'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isBooted ? 'Rig Fully Booted' : 'Quick Assemble Screws'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleAntiG}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                isAntiG
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,247,255,0.3)]'
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-400 text-zinc-200 hover:text-cyan-300 active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Anti-Gravity: {isAntiG ? 'ON (Floating)' : 'OFF'}</span>
            </button>
          </div>

          {onResetLayout && (
            <button
              type="button"
              onClick={onResetLayout}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
              title="Reset window layouts to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Layout</span>
            </button>
          )}
        </div>

        {/* Collapsible Content */}
        {!isCollapsed && (
          <>
            {/* ================= SUBMISSION SUCCESS / APPROVED STAMP ================= */}
            {isSubmitted ? (
              <div className="relative py-8 flex flex-col items-center justify-center text-center animate-fadeIn">
                {/* Rubber Stamp "APPROVED" Animation */}
                <div className="mb-4 transform -rotate-12 border-4 border-emerald-500 text-emerald-400 font-mono font-black text-2xl px-6 py-2 rounded-lg tracking-widest uppercase shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-bounce">
                  ✓ APPROVED &amp; QUEUED
                </div>

                <h4 className="text-lg font-bold text-white mb-2">Work Order Received!</h4>
                <p className="text-xs text-zinc-400 max-w-sm font-mono mb-6">
                  Thanks for reaching out, {formData.name}. Arth has logged your request on the workshop
                  terminal and will respond within 24 hours.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      projectType: '3D / WebGL / Creative',
                      message: '',
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-all"
                >
                  Submit Another Work Order
                </button>
              </div>
            ) : (
              /* ================= CONTACT FORM FIELDS ================= */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="client-name"
                      className="block text-[11px] font-mono text-zinc-400 mb-1"
                    >
                      CLIENT NAME *
                    </label>
                    <input
                      id="client-name"
                      type="text"
                      required
                      placeholder="e.g. Satoshi Nakamoto"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={onFormFocus}
                      onBlur={onFormBlur}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs font-mono placeholder-zinc-600 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="client-email"
                      className="block text-[11px] font-mono text-zinc-400 mb-1"
                    >
                      DISPATCH EMAIL *
                    </label>
                    <input
                      id="client-email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={onFormFocus}
                      onBlur={onFormBlur}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs font-mono placeholder-zinc-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Project Type Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1.5">
                    PROJECT CLASSIFICATION
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {projectTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, projectType: type })}
                        className={`px-2.5 py-2 rounded-lg text-left text-[11px] font-mono transition-all border ${
                          formData.projectType === type
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,247,255,0.2)]'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message / Specifications */}
                <div>
                  <label
                    htmlFor="client-message"
                    className="block text-[11px] font-mono text-zinc-400 mb-1"
                  >
                    SPECIFICATIONS &amp; GOALS *
                  </label>
                  <textarea
                    id="client-message"
                    required
                    rows={3}
                    placeholder="Describe your vision, timeline, or engineering challenge..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={onFormFocus}
                    onBlur={onFormBlur}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs font-mono placeholder-zinc-600 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,247,255,0.4)] hover:shadow-[0_0_30px_rgba(0,247,255,0.7)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>DISPATCHING WORK ORDER...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>TRANSMIT WORK ORDER</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= SOCIAL / NETWORKING PLUGS ================= */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">
                DIRECT COMMUNICATION PLUGS
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Mrphysico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-400 text-zinc-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
                  aria-label="Arth Jadav's GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Mrphysico</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>

                <a
                  href="https://www.linkedin.com/in/arth-jadav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-blue-400 text-zinc-300 hover:text-blue-300 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
                  aria-label="Arth Jadav's LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>Arth Jadav</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

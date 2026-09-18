import React, { useState } from 'react';
import { Send, CheckCircle, Github, Linkedin, Mail, Sparkles, Orbit } from 'lucide-react';
import { PERSONAL_INFO, DIMENSIONAL_CHAPTERS } from '../../data/content';

export const SingularityContact: React.FC = () => {
  const chapter = DIMENSIONAL_CHAPTERS['Singularity'];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Try posting to Python API guestbook or fallback smoothly
    try {
      await fetch('http://localhost:8000/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          dimension: 'Singularity',
        }),
      });
    } catch {
      // Graceful offline fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section
      id="chapter-singularity"
      className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 relative z-10 py-24 select-none"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Dimension Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 font-mono text-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span>{chapter.dimension} // {chapter.coordinates} · {chapter.title}</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          Enter the Singularity
        </h2>
        <p className="mt-2 text-lg text-slate-300 font-display">
          All dimensions converge into connection. Send a transmission into the event horizon.
        </p>

        {/* Contact & Guestbook Container */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-3 glass-panel p-8 rounded-2xl border border-white/15 shadow-2xl">
            {isSubmitted ? (
              <div className="py-12 text-center flex flex-col items-center font-mono">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Transmission Received</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Your signal has crossed the event horizon. Thank you for visiting the Dimensional Portfolio!
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-6 px-4 py-2 rounded-lg bg-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Send Another Transmission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Your Name / Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Satoshi Nakamoto"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Email / Contact Coordinates
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="optional@domain.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Transmission Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message, opportunity, or feedback..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-black font-bold uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Transmission'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Social Coordinates & Verified Data Card */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 font-mono text-xs">
              <h4 className="text-[11px] text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Orbit className="w-4 h-4 text-cyan-400" />
                Direct Signals
              </h4>

              <div className="space-y-3">
                <a
                  href={PERSONAL_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-200 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-cyan-400" />
                    <span>GitHub // Mrphysico</span>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-white transition-colors">›</span>
                </a>

                <a
                  href={PERSONAL_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-200 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Linkedin className="w-4 h-4 text-purple-400" />
                    <span>LinkedIn Profile</span>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-white transition-colors">›</span>
                </a>
              </div>

              {/* Strict Integrity & Placeholder Note */}
              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-amber-400 font-bold block mb-1">Integrity Notice:</span>
                Personal details without public repository verification (phone numbers, UPI IDs, private emails) are intentionally excluded per portfolio security protocols.
              </div>
            </div>

            {/* Terminal Command Quick Hint */}
            <div className="glass-panel p-4 rounded-xl border border-white/5 font-mono text-[11px] text-slate-400">
              <span>Protip: Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-cyan-300">Ctrl+K</kbd> anywhere to open the interactive terminal and run commands like <code className="text-cyan-300">sudo hire arth</code>.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

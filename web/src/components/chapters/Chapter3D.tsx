import React, { useState } from 'react';
import { ExternalLink, Github, Radio, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { PROJECTS, DIMENSIONAL_CHAPTERS } from '../../data/content';

export const Chapter3D: React.FC = () => {
  const project = PROJECTS.find((p) => p.id === 'smart-accident-detection')!;
  const chapter = DIMENSIONAL_CHAPTERS['3D'];

  const [simulatedIncident, setSimulatedIncident] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateAccident = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulatedIncident({
        id: `INC-${Math.floor(Math.random() * 9000) + 1000}`,
        severity: 'CRITICAL (Level 4)',
        lat: '19.0760° N',
        lng: '72.8777° E',
        impactG: (Math.random() * 4.5 + 3.5).toFixed(1) + ' G',
        respondersDispatched: 2,
        status: 'DISPATCH_CONFIRMED',
      });
      setIsSimulating(false);
    }, 800);
  };

  return (
    <section
      id="chapter-3d"
      className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 relative z-10 py-24 select-none"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Dimension Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>{chapter.dimension} // {chapter.coordinates} · {chapter.title}</span>
        </div>

        {/* Project Title & Tagline */}
        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          {project.title}
        </h2>
        <p className="mt-2 text-lg text-amber-300 font-mono">
          {project.tagline}
        </p>

        {/* Real-time Telemetry Simulator Widget */}
        <div className="my-8 glass-panel p-6 rounded-2xl border border-amber-500/20 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-mono font-bold text-sm text-white">FastAPI Telematics Stream Simulator</h4>
                <p className="font-mono text-xs text-slate-400">Grounded in backend/simulator/simulator.py</p>
              </div>
            </div>

            <button
              onClick={handleSimulateAccident}
              disabled={isSimulating}
              className="px-4 py-2 rounded-lg bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isSimulating ? 'Processing...' : 'Trigger Accident Packet'}</span>
            </button>
          </div>

          {/* Simulated Telemetry Feed */}
          <div className="mt-4 font-mono text-xs bg-black/50 p-4 rounded-xl border border-white/5">
            {simulatedIncident ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Incident ID</span>
                  <span className="text-amber-300 font-bold">{simulatedIncident.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Telemetry Impact</span>
                  <span className="text-red-400 font-bold">{simulatedIncident.impactG}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">GPS Coordinates</span>
                  <span className="text-slate-300">{simulatedIncident.lat}, {simulatedIncident.lng}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Expo Responder App</span>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Dispatched (2 units)
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                <span>Sensor network idle. Click 'Trigger Accident Packet' to test FastAPI ingestion.</span>
              </div>
            )}
          </div>
        </div>

        {/* Narrative & Case Study Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                System Architecture
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed mb-4">
                {project.summary}
              </p>
              <p className="text-slate-400 text-xs leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
                "{project.narrative}"
              </p>
            </div>

            {/* Key Features */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Core Capabilities</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">›</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics & Links */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-4">Telematics Spec</h4>
              <div className="space-y-3 font-mono text-xs">
                {project.metrics?.map((m, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-amber-300 font-semibold">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="mt-6">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Render & Repo Links */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel p-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white transition-all flex items-center justify-between font-mono text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>Live Render Deployment</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel p-3.5 rounded-xl border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all flex items-center justify-between font-mono text-xs group"
            >
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

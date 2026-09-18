import React, { useState } from 'react';
import { ExternalLink, Github, Zap, Shield, Cpu, Monitor, CheckCircle, AlertTriangle } from 'lucide-react';
import { PROJECTS, DIMENSIONAL_CHAPTERS } from '../../data/content';

export const Chapter4D: React.FC = () => {
  const project = PROJECTS.find((p) => p.id === 'rigforge')!;
  const chapter = DIMENSIONAL_CHAPTERS['4D'];

  // Interactive RigForge Compatibility Engine Demo
  const [selectedCpu, setSelectedCpu] = useState('i7-14700K (LGA1700)');
  const [selectedMobo, setSelectedMobo] = useState('Z790 (LGA1700)');
  const [selectedRam, setSelectedRam] = useState('32GB DDR5-6000');
  const [selectedGpu, setSelectedGpu] = useState('RTX 4080 Super 16GB');

  // Compatibility validation logic
  const isCpuIntel = selectedCpu.includes('LGA1700');
  const isMoboIntel = selectedMobo.includes('LGA1700');
  const isSocketCompatible = isCpuIntel === isMoboIntel;
  const isRamCompatible = selectedMobo.includes('Z790') || selectedMobo.includes('X670E') ? selectedRam.includes('DDR5') : selectedRam.includes('DDR4');

  // Estimated TDP and Gaming FPS
  const estimatedTdp = isCpuIntel ? 650 : 580;
  const recommendedPsu = estimatedTdp + 150;
  const fpsCyberpunk = selectedGpu.includes('4080') ? 118 : 82;
  const fpsValorant = 420;

  return (
    <section
      id="chapter-4d"
      className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 relative z-10 py-24 select-none"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Dimension Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{chapter.dimension} // {chapter.coordinates} · {chapter.title}</span>
        </div>

        {/* Flagship Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl sm:text-7xl font-display font-extrabold text-white tracking-tight text-glow-cyan">
              {project.title}
            </h2>
            <p className="mt-2 text-lg text-cyan-300 font-mono">
              {project.tagline}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-400/40">
              FLAGSHIP PROJECT
            </span>
          </div>
        </div>

        {/* Interactive RigForge Engine Sandbox */}
        <div className="my-8 glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-mono font-bold text-sm text-white">Live Compatibility & TDP Engine</h4>
                <p className="font-mono text-xs text-slate-400">Directly ported from RigForge’s real-time engine</p>
              </div>
            </div>

            <div className="font-mono text-xs flex items-center gap-2">
              {isSocketCompatible && isRamCompatible ? (
                <span className="text-green-400 flex items-center gap-1 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                  <CheckCircle className="w-3.5 h-3.5" /> 100% Compatible
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" /> Socket / Memory Mismatch
                </span>
              )}
            </div>
          </div>

          {/* Component Selectors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-4 font-mono text-xs">
            {/* CPU */}
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Processor (CPU)</label>
              <select
                value={selectedCpu}
                onChange={(e) => setSelectedCpu(e.target.value)}
                className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value="i7-14700K (LGA1700)">Intel i7-14700K (LGA1700)</option>
                <option value="Ryzen 7 7800X3D (AM5)">AMD Ryzen 7 7800X3D (AM5)</option>
                <option value="Ryzen 5 5600X (AM4)">AMD Ryzen 5 5600X (AM4)</option>
              </select>
            </div>

            {/* Motherboard */}
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Motherboard</label>
              <select
                value={selectedMobo}
                onChange={(e) => setSelectedMobo(e.target.value)}
                className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value="Z790 (LGA1700)">ASUS ROG Strix Z790 (LGA1700)</option>
                <option value="X670E (AM5)">MSI MAG X670E Tomahawk (AM5)</option>
                <option value="B550 (AM4)">Gigabyte B550 AORUS (AM4)</option>
              </select>
            </div>

            {/* Memory */}
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <label className="text-[10px] text-slate-400 uppercase block mb-1">RAM Memory</label>
              <select
                value={selectedRam}
                onChange={(e) => setSelectedRam(e.target.value)}
                className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value="32GB DDR5-6000">G.Skill Trident Z5 32GB DDR5-6000</option>
                <option value="16GB DDR4-3600">Corsair Vengeance 16GB DDR4-3600</option>
              </select>
            </div>

            {/* Graphics Card */}
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Graphics Card (GPU)</label>
              <select
                value={selectedGpu}
                onChange={(e) => setSelectedGpu(e.target.value)}
                className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value="RTX 4080 Super 16GB">NVIDIA RTX 4080 Super 16GB</option>
                <option value="RTX 4070 Ti 12GB">NVIDIA RTX 4070 Ti 12GB</option>
                <option value="RX 7800 XT 16GB">AMD Radeon RX 7800 XT 16GB</option>
              </select>
            </div>
          </div>

          {/* Engine Real-Time Results */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Est. System TDP</span>
              <span className="text-cyan-300 font-bold">{estimatedTdp} Watts</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Recommended PSU</span>
              <span className="text-amber-300 font-bold">{recommendedPsu}W 80+ Gold</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Cyberpunk 2077 (1440p)</span>
              <span className="text-green-400 font-bold">{fpsCyberpunk} FPS (Ultra)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Valorant (1440p)</span>
              <span className="text-purple-400 font-bold">{fpsValorant}+ FPS</span>
            </div>
          </div>
        </div>

        {/* Narrative & Case Study Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Full-Stack Architecture & Security
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
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Verified Highlights</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">›</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics & Repository Card */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-4">Architecture Specs</h4>
              <div className="space-y-3 font-mono text-xs">
                {project.metrics?.map((m, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-cyan-300 font-semibold">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="mt-6">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Core Stack</span>
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

            {/* Repo Link */}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all flex items-center justify-between font-mono text-xs group"
            >
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>Inspect RigForge Codebase</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

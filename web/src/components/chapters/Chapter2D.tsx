import React from 'react';
import { ExternalLink, Github, Layers, Sparkles } from 'lucide-react';
import { PROJECTS, DIMENSIONAL_CHAPTERS } from '../../data/content';

export const Chapter2D: React.FC = () => {
  const project = PROJECTS.find((p) => p.id === 'minor-project-demo')!;
  const chapter = DIMENSIONAL_CHAPTERS['2D'];

  return (
    <section
      id="chapter-2d"
      className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 relative z-10 py-24 select-none"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Dimension Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 font-mono text-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span>{chapter.dimension} // {chapter.coordinates} · {chapter.title}</span>
        </div>

        {/* Project Title & Tagline */}
        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          {project.title}
        </h2>
        <p className="mt-2 text-lg text-purple-300 font-mono">
          {project.tagline}
        </p>

        {/* 2D Origami Folding Plane Graphic */}
        <div className="my-8 p-6 glass-panel rounded-2xl border border-purple-500/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-transparent opacity-60 pointer-events-none" />
          <div className="grid grid-cols-3 gap-3 relative z-10">
            <div className="h-20 rounded-lg bg-black/40 border border-purple-500/30 flex items-center justify-center font-mono text-xs text-purple-300 transform -rotate-1 hover:rotate-0 transition-transform">
              [X-AXIS WIDTH]
            </div>
            <div className="h-20 rounded-lg bg-black/40 border border-cyan-500/30 flex items-center justify-center font-mono text-xs text-cyan-300 transform rotate-1 hover:rotate-0 transition-transform">
              [Y-AXIS HEIGHT]
            </div>
            <div className="h-20 rounded-lg bg-black/40 border border-pink-500/30 flex items-center justify-center font-mono text-xs text-pink-300 transform -rotate-2 hover:rotate-0 transition-transform">
              [CSS 2D FOLD]
            </div>
          </div>
        </div>

        {/* Narrative & Case Study Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Architectural Evolution
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
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Key Modules</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">›</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics & Repository Card */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-4">Project Parameters</h4>
              <div className="space-y-3 font-mono text-xs">
                {project.metrics?.map((m, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-purple-300 font-semibold">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="mt-6">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Technologies</span>
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
              className="glass-panel p-4 rounded-xl border border-purple-500/20 hover:border-purple-400 text-purple-300 hover:text-white transition-all flex items-center justify-between font-mono text-xs group"
            >
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>Inspect Repository</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

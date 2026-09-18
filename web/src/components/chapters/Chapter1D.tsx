import React from 'react';
import { ExternalLink, Github, Code2, Sparkles } from 'lucide-react';
import { PROJECTS, DIMENSIONAL_CHAPTERS } from '../../data/content';

export const Chapter1D: React.FC = () => {
  const project = PROJECTS.find((p) => p.id === 'amazon-clone')!;
  const chapter = DIMENSIONAL_CHAPTERS['1D'];

  return (
    <section
      id="chapter-1d"
      className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 relative z-10 py-24 select-none"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Dimension Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{chapter.dimension} // {chapter.coordinates} · {chapter.title}</span>
        </div>

        {/* Project Title & Tagline */}
        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          {project.title}
        </h2>
        <p className="mt-2 text-lg text-cyan-300 font-mono italic">
          "{project.tagline}"
        </p>

        {/* 1D Laser Line Divider */}
        <div className="my-8 relative">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f7ff]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f7ff]" />
        </div>

        {/* Narrative & Case Study Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                The Origin Story
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
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Key Takeaways</h4>
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
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-4">Technical Specs</h4>
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
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Built With</span>
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

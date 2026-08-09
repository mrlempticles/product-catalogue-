import React from 'react';
import { Play, Code2, Layers, ArrowUpRight, Cpu } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface HeroProps {
  onFeaturedClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onFeaturedClick }) => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 border-b border-[#E64A19]/15">
      {/* Background Decorative Subtle SVG Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#FF5722]/10 to-[#E64A19]/5 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBE9E7] border border-[#E64A19]/25 text-[#E64A19] text-xs font-mono font-semibold mb-6 shadow-sm">
          <Cpu size={14} />
          <span>Interactive Grid & Embedded Runtime Engine</span>
        </div>

        {/* Hero Title & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Explore projects <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E64A19] via-[#FF5722] to-[#D97706]">
                running inside a project.
              </span>
            </h1>

            <p className="text-slate-600 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Welcome to my portfolio! Browse through interactive web applications, inspect source code trees, test REST API logic, and explore live project demos built by 
              <strong className="text-slate-900 font-semibold"> @mrlempticles</strong>.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onFeaturedClick}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E64A19] hover:bg-[#FF5722] text-white font-bold text-sm shadow-md shadow-[#E64A19]/25 transition-all transform hover:-translate-y-0.5"
              >
                <Play size={16} fill="white" />
                Launch Project Viewport
              </button>

              <a
                href="https://github.com/mrlempticles"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#FBE9E7] text-slate-800 font-semibold text-sm border border-[#E64A19]/25 transition-all shadow-sm"
              >
                <GithubIcon size={18} />
                Visit @mrlempticles GitHub
                <ArrowUpRight size={16} className="text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right Hero Graphic Card: Grid & Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-[#E64A19]/20 shadow-xl shadow-[#E64A19]/5 space-y-4 animate-pulse-border">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-700">
                  <div className="w-3 h-3 rounded-full bg-[#E64A19]" />
                  <span>EMBEDDED_RUNTIME_VIEWER.SYS</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  ACTIVE
                </span>
              </div>

              {/* Grid Feature Highlights */}
              <div className="space-y-3 font-mono text-xs text-slate-600">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E64A19]/10">
                  <span className="flex items-center gap-2">
                    <Layers size={14} className="text-[#E64A19]" />
                    Featured Web Apps:
                  </span>
                  <span className="font-bold text-slate-900">Ontripio, Travio, E-Commerce</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E64A19]/10">
                  <span className="flex items-center gap-2">
                    <Code2 size={14} className="text-[#E64A19]" />
                    Backend Services:
                  </span>
                  <span className="font-bold text-slate-900">CodeVectors API, Spotify Mood</span>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="text-[11px] text-slate-500 bg-[#FBE9E7]/60 p-3 rounded-xl border border-[#E64A19]/15 flex items-start gap-2">
                <span className="text-base">💡</span>
                <p className="leading-snug">
                  Click on any project card below to launch its interactive iframe runner or source code explorer!
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

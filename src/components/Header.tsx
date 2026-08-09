import React from 'react';
import { Grid, Terminal, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface HeaderProps {
  totalProjects: number;
  onExploreClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalProjects, onExploreClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E64A19]/15 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Identifier */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#E64A19] flex items-center justify-center text-white shadow-md shadow-[#E64A19]/20 font-mono font-bold text-lg border border-white/20">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-lg">mrlempticles</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#FBE9E7] text-[#E64A19] font-semibold border border-[#E64A19]/20">
                PORTFOLIO v2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">grid beige & orange aesthetic</p>
          </div>
        </div>

        {/* Center Quick Stats */}
        <div className="hidden md:flex items-center gap-6 text-sm font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 border border-[#E64A19]/15 text-slate-700">
            <Grid size={15} className="text-[#E64A19]" />
            <span><strong className="text-slate-900">{totalProjects}</strong> Projects Ready</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 border border-[#E64A19]/15 text-slate-700">
            <Terminal size={15} className="text-[#E64A19]" />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Embedded Viewport
            </span>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onExploreClick}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-white hover:bg-[#FBE9E7] text-slate-800 border border-[#E64A19]/20 transition-all shadow-sm"
          >
            <Sparkles size={14} className="text-[#E64A19]" />
            Browse Grid
          </button>
          
          <a
            href="https://github.com/mrlempticles"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-[#E64A19] hover:bg-[#FF5722] text-white shadow-sm shadow-[#E64A19]/25 transition-all"
          >
            <GithubIcon size={16} />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>

      </div>
    </header>
  );
};

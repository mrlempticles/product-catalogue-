import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#E64A19]/15 bg-white/60 backdrop-blur-md py-12 px-4 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-slate-600">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E64A19] flex items-center justify-center text-white font-bold">
            L
          </div>
          <div>
            <p className="font-bold text-slate-900">mrlempticles • Portfolio</p>
            <p className="text-[11px] text-slate-500">Built with React, Vite, TypeScript & Thin Grid aesthetic</p>
          </div>
        </div>

        {/* Center Credits */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <span>Crafted with</span>
          <Heart size={13} className="text-[#E64A19] fill-[#E64A19]" />
          <span>for interactive project exploration</span>
        </div>

        {/* Right Links & Back to top */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/mrlempticles"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-[#E64A19] transition"
          >
            <GithubIcon size={15} />
            <span>@mrlempticles</span>
          </a>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FBE9E7] border border-[#E64A19]/20 text-slate-700 hover:text-[#E64A19] transition"
            title="Scroll to Top"
          >
            <ArrowUp size={15} />
          </button>
        </div>

      </div>
    </footer>
  );
};

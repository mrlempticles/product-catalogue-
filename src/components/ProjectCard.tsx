import React from 'react';
import type { Project } from '../types/project';
import { Play, Code, Star, GitFork } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface ProjectCardProps {
  project: Project;
  onOpenProject: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenProject }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E64A19]/15 card-hover-effect flex flex-col justify-between relative group">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="tag-pill uppercase tracking-wider font-mono">
            {project.category}
          </span>
          
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            {project.stars !== undefined && (
              <span className="flex items-center gap-1">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                {project.stars}
              </span>
            )}
            {project.forks !== undefined && (
              <span className="flex items-center gap-1">
                <GitFork size={13} className="text-slate-400" />
                {project.forks}
              </span>
            )}
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#E64A19] transition-colors mb-1.5 flex items-center gap-2">
          {project.title}
          {project.featured && (
            <span className="w-2 h-2 rounded-full bg-[#FF5722]" title="Featured Project" />
          )}
        </h3>

        <p className="text-xs font-semibold text-[#E64A19] font-mono mb-2">
          {project.tagline}
        </p>

        <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F2] text-slate-700 border border-[#E64A19]/10 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Actions Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 font-mono text-xs">
        
        {/* Project Stats summary */}
        <div className="text-slate-400 text-[11px]">
          {project.stats?.linesOfCode} LOC • {project.stats?.filesCount} files
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FBE9E7] text-slate-700 hover:text-[#E64A19] border border-[#E64A19]/15 transition-all"
            title="View Source on GitHub"
          >
            <GithubIcon size={15} />
          </a>

          <button
            onClick={() => onOpenProject(project)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E64A19] hover:bg-[#FF5722] text-white font-bold text-xs shadow-sm shadow-[#E64A19]/20 transition-all transform active:scale-95"
          >
            {project.previewCapabilities.hasLiveIframe ? (
              <>
                <Play size={13} fill="white" />
                Run App
              </>
            ) : (
              <>
                <Code size={13} />
                Inspect
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

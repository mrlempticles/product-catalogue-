import React, { useState, useMemo } from 'react';
import type { Project, ProjectCategory } from '../types/project';
import { ProjectCard } from './ProjectCard';
import { Search, Filter, Layers, Code, Server, Terminal, Sparkles } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onOpenProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: ProjectCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All Projects', icon: <Layers size={14} /> },
    { key: 'web', label: 'Web Apps', icon: <Code size={14} /> },
    { key: 'fullstack', label: 'Full Stack', icon: <Sparkles size={14} /> },
    { key: 'python', label: 'Python & Backend', icon: <Server size={14} /> },
    { key: 'tools', label: 'Tools & Utilities', icon: <Terminal size={14} /> },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects-grid" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-[#E64A19]/15 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-[#E64A19] text-white shadow-sm shadow-[#E64A19]/20 font-bold'
                  : 'bg-white text-slate-700 hover:bg-[#FBE9E7] border border-[#E64A19]/15'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input Bar */}
        <div className="relative min-w-[240px] md:min-w-[280px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by tech or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#E64A19]/20 focus:outline-none focus:border-[#E64A19] focus:ring-2 focus:ring-[#E64A19]/10 text-slate-800 font-mono transition-all"
          />
        </div>

      </div>

      {/* Grid Header Info */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredProjects.length}</strong> of {projects.length} repositories
        </span>
        <span className="hidden sm:inline">Click "Run App" or "Inspect" to open viewport</span>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenProject={onOpenProject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E64A19]/25 p-8 space-y-3">
          <Filter size={32} className="mx-auto text-[#E64A19] opacity-60" />
          <h3 className="text-lg font-bold text-slate-800">No projects found matching query</h3>
          <p className="text-xs text-slate-500 font-mono">Try searching for React, Python, Supabase, or TypeScript</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-[#E64A19] underline"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

    </section>
  );
};

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectModal } from './components/ProjectModal';
import { Footer } from './components/Footer';
import { PROJECTS_DATA } from './data/projectsData';
import type { Project } from './types/project';

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleOpenFeatured = () => {
    // Open first featured project by default (Ontripio)
    const featured = PROJECTS_DATA.find((p) => p.featured) || PROJECTS_DATA[0];
    setSelectedProject(featured);
  };

  const handleScrollToGrid = () => {
    const el = document.getElementById('projects-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-grid-pattern text-slate-900 selection:bg-[#E64A19]/20 selection:text-[#E64A19] flex flex-col justify-between">
      <div>
        <Header
          totalProjects={PROJECTS_DATA.length}
          onExploreClick={handleScrollToGrid}
        />

        <main>
          <Hero onFeaturedClick={handleOpenFeatured} />

          <ProjectGrid
            projects={PROJECTS_DATA}
            onOpenProject={(project) => setSelectedProject(project)}
          />
        </main>
      </div>

      <Footer />

      {/* Interactive Project Runner Viewport Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default App;

export type ProjectCategory = 'all' | 'web' | 'fullstack' | 'python' | 'tools';

export interface ProjectFile {
  name: string;
  type: 'file' | 'folder';
  path: string;
  language?: string;
  content?: string;
  children?: ProjectFile[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  githubUrl: string;
  liveUrl?: string; // Live embedded URL or preview frame URL
  localPath: string;
  featured: boolean;
  stars?: number;
  forks?: number;
  stats?: {
    filesCount: number;
    linesOfCode: string;
    status: 'Completed' | 'Active' | 'In Development';
  };
  readmeMarkdown?: string;
  sampleFiles?: ProjectFile[];
  previewCapabilities: {
    hasLiveIframe: boolean;
    hasCodeExplorer: boolean;
    hasInteractiveSim: boolean;
  };
  simulatedOutput?: string;
}

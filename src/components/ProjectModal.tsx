import React, { useState, useEffect } from 'react';
import type { Project, ProjectFile } from '../types/project';
import { 
  X, Play, Code, FileText, Terminal, Monitor, Tablet, Smartphone, 
  ExternalLink, RefreshCw, Copy, Check, Folder, FileCode, ChevronRight, ChevronDown, Sparkles
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import confetti from 'canvas-confetti';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'iframe' | 'code' | 'readme' | 'sim'>(
    project.previewCapabilities.hasLiveIframe ? 'iframe' : 'code'
  );
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ 'src': true, 'src/pages': true });
  const [copiedCode, setCopiedCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Auto-select first available sample file if available
  useEffect(() => {
    if (project && project.sampleFiles && project.sampleFiles.length > 0) {
      const findFirstFile = (files: ProjectFile[]): ProjectFile | null => {
        for (const f of files) {
          if (f.type === 'file') return f;
          if (f.children) {
            const found = findFirstFile(f.children);
            if (found) return found;
          }
        }
        return null;
      };
      setSelectedFile(findFirstFile(project.sampleFiles));
    }
  }, [project]);

  // Trigger celebration confetti when live iframe tab is selected
  useEffect(() => {
    if (activeTab === 'iframe') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#E64A19', '#FF5722', '#D97706', '#FAF7F2']
      });
    }
  }, [activeTab]);

  // Keyboard shortcut to close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCopyCode = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Render Directory Tree Recursive Component
  const renderTree = (files: ProjectFile[], depth = 0) => {
    return files.map((file) => {
      const isFolder = file.type === 'folder';
      const isExpanded = expandedFolders[file.path];
      const isSelected = selectedFile?.path === file.path;

      return (
        <div key={file.path} className="select-none text-xs font-mono">
          <div
            onClick={() => {
              if (isFolder) {
                toggleFolder(file.path);
              } else {
                setSelectedFile(file);
              }
            }}
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
              isSelected
                ? 'bg-[#E64A19] text-white font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {isFolder ? (
              <>
                {isExpanded ? <ChevronDown size={14} className="text-amber-400" /> : <ChevronRight size={14} className="text-amber-400" />}
                <Folder size={14} className="text-amber-400 fill-amber-400/20" />
              </>
            ) : (
              <>
                <FileCode size={14} className="text-orange-400 ml-3" />
              </>
            )}
            <span className="truncate">{file.name}</span>
          </div>

          {isFolder && isExpanded && file.children && (
            <div>{renderTree(file.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      
      {/* Modal Viewport Window Container */}
      <div className="bg-[#121417] text-white w-full max-w-6xl h-[92vh] rounded-2xl border border-[#E64A19]/30 modal-shadow flex flex-col overflow-hidden">
        
        {/* Top Viewport Header Bar */}
        <div className="bg-[#1A1D23] px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
          
          {/* Left: Window Controls & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">{project.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E64A19]/20 text-[#FF5722] border border-[#E64A19]/30 font-semibold">
                  {project.category}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs sm:max-w-md">
                {project.tagline}
              </p>
            </div>
          </div>

          {/* Center: Viewport Tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-[#121417] p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {project.previewCapabilities.hasLiveIframe && (
              <button
                onClick={() => setActiveTab('iframe')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'iframe'
                    ? 'bg-[#E64A19] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play size={13} fill="currentColor" />
                Live App Preview
              </button>
            )}

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-[#E64A19] text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code size={13} />
              Code Explorer
            </button>

            <button
              onClick={() => setActiveTab('readme')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'readme'
                  ? 'bg-[#E64A19] text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText size={13} />
              README
            </button>

            <button
              onClick={() => setActiveTab('sim')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'sim'
                  ? 'bg-[#E64A19] text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal size={13} />
              Logs & Telemetry
            </button>
          </div>

          {/* Right: Quick Links & Close Button */}
          <div className="flex items-center gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="View on GitHub"
            >
              <GithubIcon size={18} />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-600/30 hover:border-rose-500 border border-transparent transition"
              title="Close Viewport (Esc)"
            >
              <X size={20} />
            </button>
          </div>

        </div>

        {/* Viewport Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-[#0B0C0E]">
          
          {/* TAB 1: Live Interactive Iframe Viewport */}
          {activeTab === 'iframe' && (
            <div className="h-full flex flex-col">
              
              {/* Device Frame Switcher & URL Bar */}
              <div className="bg-[#16181D] px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-4 font-mono text-xs">
                
                {/* Simulated Browser URL Input Bar */}
                <div className="flex-1 flex items-center gap-2 bg-[#0E1013] border border-slate-700/60 rounded-lg px-3 py-1 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-500">https://</span>
                  <span className="text-slate-200 truncate">{project.id}.mrlempticles.dev</span>
                  <button onClick={() => setIframeKey(k => k + 1)} className="ml-auto text-slate-400 hover:text-white">
                    <RefreshCw size={13} />
                  </button>
                </div>

                {/* Device Selector */}
                <div className="flex items-center gap-1 bg-[#0E1013] p-1 rounded-lg border border-slate-700/60">
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`p-1.5 rounded ${deviceView === 'desktop' ? 'bg-[#E64A19] text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Desktop View (100%)"
                  >
                    <Monitor size={15} />
                  </button>
                  <button
                    onClick={() => setDeviceView('tablet')}
                    className={`p-1.5 rounded ${deviceView === 'tablet' ? 'bg-[#E64A19] text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Tablet View (768px)"
                  >
                    <Tablet size={15} />
                  </button>
                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`p-1.5 rounded ${deviceView === 'mobile' ? 'bg-[#E64A19] text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Mobile View (375px)"
                  >
                    <Smartphone size={15} />
                  </button>
                </div>

                {/* Open in external tab */}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                  >
                    <span>External</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Viewport Frame Container */}
              <div className="flex-1 bg-[#0B0C0E] overflow-auto flex items-center justify-center p-4">
                <div 
                  className={`h-full transition-all duration-300 rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-white ${
                    deviceView === 'desktop' ? 'w-full' :
                    deviceView === 'tablet' ? 'w-[768px] max-w-full' : 'w-[375px] max-w-full'
                  }`}
                >
                  <iframe
                    key={iframeKey}
                    src={project.liveUrl || 'about:blank'}
                    title={project.title}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    onError={() => console.log('Iframe fallback mode active')}
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Interactive Code Explorer */}
          {activeTab === 'code' && (
            <div className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
              
              {/* Left Sidebar: Directory Tree */}
              <div className="w-full md:w-64 bg-[#14161B] p-3 overflow-y-auto space-y-2 border-r border-slate-800">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
                  <span>FILES & FOLDERS</span>
                  <span className="text-orange-400">{project.sampleFiles?.length || 0} top-level</span>
                </div>

                {project.sampleFiles && project.sampleFiles.length > 0 ? (
                  <div>{renderTree(project.sampleFiles)}</div>
                ) : (
                  <div className="text-xs text-slate-500 p-2 font-mono">No preview files cataloged</div>
                )}
              </div>

              {/* Right Panel: Code Viewer */}
              <div className="flex-1 flex flex-col bg-[#0E1013] overflow-hidden">
                
                {/* Code Header Bar */}
                <div className="bg-[#17191E] px-4 py-2 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileCode size={15} className="text-orange-400" />
                    <span>{selectedFile ? selectedFile.path : 'Select a file'}</span>
                  </div>

                  {selectedFile?.content && (
                    <button
                      onClick={() => handleCopyCode(selectedFile.content)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {/* Code Editor Body */}
                <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
                  {selectedFile?.content ? (
                    <pre className="whitespace-pre overflow-x-auto selection:bg-[#E64A19]/30">
                      <code>{selectedFile.content}</code>
                    </pre>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 font-mono">
                      Select a file from the tree to inspect code snippet
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: README Markdown Renderer */}
          {activeTab === 'readme' && (
            <div className="h-full overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto space-y-6 text-slate-200">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <FileText size={24} className="text-[#E64A19]" />
                <h2 className="text-2xl font-bold text-white font-mono">{project.title} README.md</h2>
              </div>

              <div className="prose prose-invert max-w-none font-sans leading-relaxed text-slate-300 space-y-4">
                <pre className="bg-[#14161B] p-6 rounded-xl border border-slate-800 font-mono text-sm whitespace-pre-wrap text-slate-200">
                  {project.readmeMarkdown || 'No README documentation provided for this repository.'}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Terminal Logs & Telemetry Simulator */}
          {activeTab === 'sim' && (
            <div className="h-full p-6 bg-[#090A0C] font-mono text-xs overflow-y-auto space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
                <Sparkles size={16} />
                <span>TERMINAL_OUTPUT_STREAM // {project.id}.sys</span>
              </div>

              <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
                {project.simulatedOutput || `[INFO] Initializing service runtime...
[SUCCESS] Verified repository integrity for ${project.title}.
[METRICS] Files: ${project.stats?.filesCount} | Lines of code: ${project.stats?.linesOfCode}.`}
              </pre>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

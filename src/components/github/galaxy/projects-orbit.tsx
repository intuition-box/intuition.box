'use client';

import type { ProjectDisplay } from '../types';

interface ProjectsOrbitProps {
  projects: ProjectDisplay[];
  onProjectHover: (project: ProjectDisplay, position: { x: number; y: number }) => void;
  onProjectLeave: () => void;
}

function getOrbitStyle(i: number, total: number, color?: string): React.CSSProperties {
  const duration = 70;
  const delay = -(duration / total) * i;
  return {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    backgroundColor: color,
  };
}

export function ProjectsOrbit({ projects, onProjectHover, onProjectLeave }: ProjectsOrbitProps) {
  if (projects.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[3]" aria-label="Active projects">
      {projects.map((project, i) => (
        <div
          key={project.id}
          className="absolute top-1/2 left-1/2 origin-[0_0] w-[30px] h-[30px] rounded-md flex items-center justify-center text-[0.6rem] pointer-events-auto cursor-pointer select-none will-change-transform shadow-[0_2px_6px_rgba(0,0,0,0.4)] motion-safe:animate-[orbit-spin_linear_infinite] max-sm:w-5 max-sm:h-5"
          style={{
            ...getOrbitStyle(i, projects.length, project.color),
            '--orbit-radius': 'calc(var(--orbit-base) * 0.95)',
            background: `linear-gradient(135deg, ${project.color}44, ${project.color}cc)`,
          } as React.CSSProperties}
          role="button"
          tabIndex={0}
          aria-label={`Project: ${project.title}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = 'paused';
            const rect = e.currentTarget.getBoundingClientRect();
            onProjectHover(project, { x: rect.right + 12, y: rect.top });
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = 'running';
            onProjectLeave();
          }}
          onFocus={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onProjectHover(project, { x: rect.right + 12, y: rect.top });
          }}
          onBlur={onProjectLeave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              window.open(project.url, '_blank', 'noopener,noreferrer');
            }
          }}
        />
      ))}
    </div>
  );
}

'use client';

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@waveso/ui/tooltip';
import type { CommitDisplay } from '../types';

interface CommitsOrbitProps {
  commits: CommitDisplay[];
}

function getOrbitStyle(i: number, total: number, color?: string): React.CSSProperties {
  const duration = 85;
  const delay = -(duration / total) * i;
  return {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    backgroundColor: color,
  };
}

export function CommitsOrbit({ commits }: CommitsOrbitProps) {
  if (commits.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="absolute inset-0 pointer-events-none z-[2]" aria-label="Recent commits">
        {commits.map((commit, i) => (
          <Tooltip key={commit.id}>
            <TooltipTrigger>
              <a
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-1/2 left-1/2 origin-[0_0] w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.6rem] text-white pointer-events-auto cursor-pointer select-none will-change-transform shadow-[0_2px_6px_rgba(0,0,0,0.4)] motion-safe:animate-[orbit-spin_linear_infinite] max-sm:w-3 max-sm:h-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
                style={{
                  ...getOrbitStyle(i, commits.length, commit.color),
                  '--orbit-radius': 'calc(var(--orbit-base) * 0.68)',
                  background: `radial-gradient(circle at 30% 30%, rgb(255 255 255 / 22%), ${commit.color || 'rgb(131 145 255 / 95%)'})`,
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animationPlayState = 'paused';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animationPlayState = 'running';
                }}
              >
                <span className="sr-only">Commit {commit.name}</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              Commit {commit.name}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

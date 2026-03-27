'use client';

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@waveso/ui/tooltip';
import type { OrbitItem } from '../types';

interface ActivityOrbitProps {
  items: OrbitItem[];
}

const INNER_RADIUS = 0.68;
const OUTER_RADIUS = 0.95;
const INNER_DURATION = 85;
const OUTER_DURATION = 70;

function getOrbitStyle(i: number, total: number, radius: number, duration: number): React.CSSProperties {
  const delay = -(duration / total) * i;
  return {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    '--orbit-radius': `calc(var(--orbit-base) * ${radius})`,
  } as React.CSSProperties;
}

/** Git commit icon — circle with vertical lines */
function GitCommitIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="max-sm:w-3.5 max-sm:h-3.5"
      aria-hidden
    >
      <line x1="10" y1="0" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="14" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function CommitDot({ item, style }: { item: OrbitItem; style: React.CSSProperties }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-1/2 left-1/2 origin-[0_0] w-[20px] h-[20px] flex items-center justify-center text-fd-primary pointer-events-auto cursor-pointer select-none will-change-transform motion-safe:animate-[orbit-spin_linear_infinite] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
      style={style}
      onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
      onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
    >
      <GitCommitIcon />
      <span className="sr-only">Commit {item.label}</span>
    </a>
  );
}

function ProjectDot({ item, style }: { item: OrbitItem; style: React.CSSProperties }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 origin-[0_0] w-[22px] h-[22px] rounded-sm pointer-events-auto cursor-pointer select-none will-change-transform motion-safe:animate-[orbit-spin_linear_infinite] max-sm:w-3.5 max-sm:h-3.5 group/project focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
      style={style}
      role="link"
      tabIndex={0}
      aria-label={`Project: ${item.label}`}
      onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
      onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.open(item.url, '_blank', 'noopener,noreferrer');
        }
      }}
      onClick={() => { window.open(item.url, '_blank', 'noopener,noreferrer'); }}
    >
      <span
        className="block w-full h-full rounded-sm border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.4)] group-hover/project:border-white/50 transition-colors"
        style={{ background: item.color }}
      />
    </div>
  );
}

export function ActivityOrbit({ items }: ActivityOrbitProps) {
  if (items.length === 0) return null;

  // Split into inner and outer rings by alternating (sorted by date, interleaved)
  const inner: OrbitItem[] = [];
  const outer: OrbitItem[] = [];
  items.forEach((item, i) => {
    if (i % 2 === 0) {
      inner.push(item);
    } else {
      outer.push(item);
    }
  });

  return (
    <TooltipProvider>
      {/* Inner ring */}
      <div className="absolute inset-0 pointer-events-none z-[2]" aria-label="Recent activity (inner)">
        {inner.map((item, i) => (
          <Tooltip key={item.id}>
            <TooltipTrigger>
              {item.type === 'commit'
                ? <CommitDot item={item} style={getOrbitStyle(i, inner.length, INNER_RADIUS, INNER_DURATION)} />
                : <ProjectDot item={item} style={getOrbitStyle(i, inner.length, INNER_RADIUS, INNER_DURATION)} />
              }
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {item.type === 'commit' ? `Commit ${item.label}` : item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Outer ring */}
      <div className="absolute inset-0 pointer-events-none z-[3]" aria-label="Recent activity (outer)">
        {outer.map((item, i) => (
          <Tooltip key={item.id}>
            <TooltipTrigger>
              {item.type === 'commit'
                ? <CommitDot item={item} style={getOrbitStyle(i, outer.length, OUTER_RADIUS, OUTER_DURATION)} />
                : <ProjectDot item={item} style={getOrbitStyle(i, outer.length, OUTER_RADIUS, OUTER_DURATION)} />
              }
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {item.type === 'commit' ? `Commit ${item.label}` : item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

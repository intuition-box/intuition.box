'use client';

import { useEffect, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@waveso/ui/tooltip';
import type { OrbitItem } from '../types';

interface ActivityOrbitProps {
  items: OrbitItem[];
}

const INNER_RADIUS = 0.68;
const OUTER_RADIUS = 0.95;
const INNER_DURATION = 85;
const OUTER_DURATION = 70;

/** Base delay before dots start appearing */
const BASE_DELAY_MS = 300;
/** Stagger between each dot */
const STAGGER_MS = 60;

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

function OrbitDot({ item, style, label, delayMs }: { item: OrbitItem; style: React.CSSProperties; label: string; delayMs: number }) {
  const isCommit = item.type === 'commit';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  const handlePause = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
  };
  const handleResume = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
  };

  const fadeStyle: React.CSSProperties = {
    ...style,
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.4s ease-out',
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        {isCommit ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-1/2 left-1/2 origin-[0_0] w-[20px] h-[20px] flex items-center justify-center text-fd-primary pointer-events-auto cursor-pointer select-none will-change-transform motion-safe:animate-[orbit-spin_linear_infinite] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
            style={fadeStyle}
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
          >
            <GitCommitIcon />
            <span className="sr-only">{label}</span>
          </a>
        ) : (
          <div
            className="absolute top-1/2 left-1/2 origin-[0_0] w-[22px] h-[22px] rounded-sm pointer-events-auto cursor-pointer select-none will-change-transform motion-safe:animate-[orbit-spin_linear_infinite] max-sm:w-3.5 max-sm:h-3.5 group/project focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
            style={fadeStyle}
            role="link"
            tabIndex={0}
            aria-label={label}
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
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
        )}
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function ActivityOrbit({ items }: ActivityOrbitProps) {
  if (items.length === 0) return null;

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
          <OrbitDot
            key={item.id}
            item={item}
            delayMs={BASE_DELAY_MS + i * STAGGER_MS}
            style={getOrbitStyle(i, inner.length, INNER_RADIUS, INNER_DURATION)}
            label={item.type === 'commit' ? `Commit ${item.label}` : item.label}
          />
        ))}
      </div>

      {/* Outer ring */}
      <div className="absolute inset-0 pointer-events-none z-[3]" aria-label="Recent activity (outer)">
        {outer.map((item, i) => (
          <OrbitDot
            key={item.id}
            item={item}
            delayMs={BASE_DELAY_MS + (inner.length + i) * STAGGER_MS}
            style={getOrbitStyle(i, outer.length, OUTER_RADIUS, OUTER_DURATION)}
            label={item.type === 'commit' ? `Commit ${item.label}` : item.label}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}

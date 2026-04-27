'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@waveso/ui/tooltip';
import { AnimateIn } from '@/components/animate';
import { Card, CardContent } from '@/components/card';
import type { ContributorDisplay } from '../types';
import { ContributorHeader } from './contributor-header';

interface ContributorCardsProps {
  items: ContributorDisplay[];
  isMobile: boolean;
  safeOffsets: Array<{ x: number; y: number }>;
  onAvatarOpen: (contributor: ContributorDisplay) => void;
  ready: boolean;
}

const MAX_VISIBLE = 4;

function ContributorCard({
  contributor,
  offset,
  index,
}: {
  contributor: ContributorDisplay;
  offset: { x: number; y: number };
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 max-sm:hidden"
      style={{ left: offset.x, top: offset.y }}
    >
      <AnimateIn scale delay={index * 0.1} transition={{ duration: 0.4 }}>
        <Card
          variant="compact"
          className="w-auto max-w-[min(88vw,260px)] overflow-visible bg-fd-card/80 backdrop-blur-[14px] saturate-[1.15] shadow-lg"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          onFocus={() => setExpanded(true)}
          onBlur={() => setExpanded(false)}
        >
          <CardContent>
            <ContributorHeader contributor={contributor} size={36} />

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                {contributor.projects.length > 0 ? (
                  <>
                    <div className="h-px bg-fd-border my-2" />
                    <ul className="list-none m-0 p-0 grid gap-1">
                      {contributor.projects.slice(0, 4).map((p) => (
                        <li key={p.id} className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-sm flex-shrink-0 shadow-sm"
                            style={{ background: p.color }}
                          />
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm truncate no-underline text-inherit opacity-90 hover:opacity-100"
                          >
                            {p.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-fd-border my-2" />
                    <p className="text-xs opacity-60 m-0">No recent projects found</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimateIn>
    </div>
  );
}

function MobileAvatarButton({
  contributor,
  offset,
  onOpen,
  index,
}: {
  contributor: ContributorDisplay;
  offset: { x: number; y: number };
  onOpen: () => void;
  index: number;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10"
      style={{ left: offset.x, top: offset.y }}
    >
      <AnimateIn scale delay={index * 0.1} transition={{ duration: 0.4 }}>
        <div className="w-11 h-11">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  type="button"
                  className="w-full h-full rounded-full overflow-hidden border border-fd-border bg-fd-card/80 shadow-lg p-0 grid place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
                  onClick={onOpen}
                  aria-label={`View ${contributor.id}'s profile`}
                >
                  <Image
                    src={contributor.avatarUrl}
                    alt={contributor.id}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover block"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                {contributor.id}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </AnimateIn>
    </div>
  );
}

export function ContributorCards({
  items,
  isMobile,
  safeOffsets,
  onAvatarOpen,
  ready,
}: ContributorCardsProps) {
  if (!ready) return null;

  const visible = items.slice(0, MAX_VISIBLE);

  return (
    <div className="absolute inset-0 pointer-events-none z-[6]">
      {visible.map((contributor, i) => {
        const offset = safeOffsets[i] ?? { x: 0, y: 0 };

        if (isMobile) {
          return (
            <MobileAvatarButton
              key={contributor.id}
              contributor={contributor}
              offset={offset}
              onOpen={() => onAvatarOpen(contributor)}
              index={i}
            />
          );
        }

        return (
          <ContributorCard
            key={contributor.id}
            contributor={contributor}
            offset={offset}
            index={i}
          />
        );
      })}
    </div>
  );
}

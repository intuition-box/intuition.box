'use client';

import { useMemo, useRef, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@waveso/ui/drawer';
import Image from 'next/image';
import type { ActivityData } from '@/lib/github/types';
import type { ContributorDisplay, OrbitItem } from '../types';
import { GITHUB_ORG } from '@/lib/github/constants';
import { useOrbitDimensions } from './use-orbit-dimensions';
import { GalaxyBackground } from './galaxy-background';
import { ContributorCards } from './contributor-cards';
import { ActivityOrbit } from './activity-orbit';

const PROJECT_COLORS = ['#01c3a8', '#ffb741', '#a63d2a', '#1890ff', '#8a55e6', '#f56c6c'];
const COMMIT_COLOR = '#8391ff';

interface GalaxyProps {
  activity: ActivityData;
  fetchedAt?: string;
}

export function Galaxy({ activity, fetchedAt }: GalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, safeOffsets } = useOrbitDimensions(containerRef);

  const [activeContrib, setActiveContrib] = useState<ContributorDisplay | null>(null);

  // Transform data for display components
  const contribItems: ContributorDisplay[] = useMemo(
    () =>
      activity.contributors.map((c) => ({
        id: c.login,
        summary: `Last activity: ${c.date.slice(0, 10)}`,
        projects: (activity.contributorProjects[c.login] ?? []).slice(0, 6).map((name) => ({
          id: name,
          name,
          url: `https://github.com/${GITHUB_ORG}/${name}`,
        })),
        avatarUrl: c.avatarUrl,
        profileUrl: `https://github.com/${c.login}`,
      })),
    [activity],
  );

  // Merge commits + projects into a single timeline, sorted newest → oldest
  const orbitItems: OrbitItem[] = useMemo(() => {
    const commitItems: OrbitItem[] = activity.commits.slice(0, 8).map((c, i) => ({
      id: c.sha || `c-${i}`,
      type: 'commit' as const,
      label: c.sha ? c.sha.slice(0, 7) : (c.message?.slice(0, 7) ?? 'commit'),
      url: c.url || `https://github.com/${GITHUB_ORG}/${c.repo}/commit/${c.sha}`,
      color: COMMIT_COLOR,
      date: c.date,
    }));

    const projectItems: OrbitItem[] = activity.projects.slice(0, 6).map((p, i) => ({
      id: `p-${p.name}`,
      type: 'project' as const,
      label: p.name,
      url: `https://github.com/${GITHUB_ORG}/${p.name}`,
      color: PROJECT_COLORS[i % PROJECT_COLORS.length],
      date: p.date,
    }));

    return [...commitItems, ...projectItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activity.commits, activity.projects]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center mb-16 mt-[clamp(40px,6vw,120px)]"
      style={{
        '--orbit-base': 'clamp(260px, 34vmin, 340px)',
        height: 'clamp(520px, 72svh, 850px)',
        minHeight: 480,
      } as React.CSSProperties}
    >
      <GalaxyBackground fetchedAt={fetchedAt} />

      <ContributorCards
        items={contribItems}
        isMobile={isMobile}
        safeOffsets={safeOffsets}
        onAvatarOpen={setActiveContrib}
      />

      <ActivityOrbit items={orbitItems} />

      {/* Contributor detail drawer (mobile) */}
      <Drawer open={!!activeContrib} onOpenChange={(open) => !open && setActiveContrib(null)}>
        <DrawerContent showCloseButton>
          {activeContrib && (
            <>
              <DrawerHeader>
                <div className="flex items-center gap-3">
                  <Image
                    src={activeContrib.avatarUrl}
                    alt={activeContrib.id}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <DrawerTitle>{activeContrib.id}</DrawerTitle>
                    <p className="text-sm text-fd-muted-foreground mt-0.5">
                      {activeContrib.summary}
                    </p>
                  </div>
                </div>
              </DrawerHeader>

              <div className="space-y-4 px-4 pb-6">
                {activeContrib.projects.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Projects</h4>
                    <ul className="m-0 p-0 list-none grid gap-2">
                      {activeContrib.projects.slice(0, 8).map((p) => (
                        <li key={p.id} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-gradient-to-br from-white/60 to-white/5 shadow-sm flex-shrink-0" />
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm no-underline text-fd-foreground hover:text-fd-primary"
                          >
                            {p.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-fd-muted-foreground">No recent projects found</p>
                )}
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

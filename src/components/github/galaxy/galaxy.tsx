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
import type { ContributorDisplay, ProjectDisplay, CommitDisplay } from '../types';
import { GITHUB_ORG } from '@/lib/github/constants';
import { useOrbitDimensions } from './use-orbit-dimensions';
import { GalaxyBackground } from './galaxy-background';
import { ContributorCards } from './contributor-cards';
import { CommitsOrbit } from './commits-orbit';
import { ProjectsOrbit } from './projects-orbit';

const PARTICIPANT_COLORS = ['#ffb4b4', '#a7d8ff', '#c7a7ff', '#94e2c4', '#ffe4a7', '#ffa7d6', '#aef3e3', '#ffc7a7'];
const PROJECT_COLORS = ['#01c3a8', '#ffb741', '#a63d2a', '#1890ff', '#8a55e6', '#f56c6c'];
const COMMIT_COLORS = PARTICIPANT_COLORS;

interface GalaxyProps {
  activity: ActivityData;
  fetchedAt?: string;
}

export function Galaxy({ activity, fetchedAt }: GalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, safeOffsets } = useOrbitDimensions(containerRef);

  const [activeContrib, setActiveContrib] = useState<ContributorDisplay | null>(null);

  // Build contributor→project mapping for per-repo authors
  const contributorsByLogin = useMemo(() => {
    const m = new Map<string, { avatarUrl?: string; last?: Date }>();
    for (const c of activity.contributors) {
      m.set(c.login, { avatarUrl: c.avatarUrl, last: new Date(c.date) });
    }
    return m;
  }, [activity.contributors]);

  const perRepoAuthors = useMemo(() => {
    const map = new Map<string, Array<{ login: string; avatarUrl?: string }>>();

    for (const c of activity.commits) {
      if (!c.repo || !c.author) continue;
      const existing = map.get(c.repo) ?? [];
      if (!existing.some((a) => a.login === c.author)) {
        const info = contributorsByLogin.get(c.author);
        existing.push({ login: c.author, avatarUrl: info?.avatarUrl });
        map.set(c.repo, existing);
      }
    }
    return map;
  }, [activity.commits, contributorsByLogin]);

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

  const projects: ProjectDisplay[] = useMemo(
    () =>
      activity.projects.slice(0, 6).map((p, i) => {
        const authors = perRepoAuthors.get(p.name) ?? [];
        return {
          id: p.name,
          title: p.name,
          color: PROJECT_COLORS[i % PROJECT_COLORS.length],
          date: p.date,
          url: `https://github.com/${GITHUB_ORG}/${p.name}`,
          participants: authors.slice(0, 4).map((a, j) => ({
            name: a.login,
            color: PARTICIPANT_COLORS[j % PARTICIPANT_COLORS.length],
            avatarUrl: a.avatarUrl,
          })),
        };
      }),
    [activity.projects, perRepoAuthors],
  );

  const commits: CommitDisplay[] = useMemo(
    () =>
      activity.commits.slice(0, 8).map((c, i) => ({
        id: c.sha || `c-${i}`,
        name: c.sha ? c.sha.slice(0, 7) : (c.message?.slice(0, 7) ?? 'commit'),
        url: c.url || `https://github.com/${GITHUB_ORG}/${c.repo}/commit/${c.sha}`,
        color: COMMIT_COLORS[i % COMMIT_COLORS.length],
      })),
    [activity.commits],
  );


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

      <CommitsOrbit commits={commits} />
      <ProjectsOrbit projects={projects} />

      {/* Contributor detail drawer (swipes down to dismiss) */}
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

'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@waveso/ui/dialog';
import type { ProjectDisplay } from '../types';

interface ProjectCardProps {
  project: ProjectDisplay | null;
  position: { x: number; y: number };
  isMobile: boolean;
  onClose: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

function DesktopCard({
  project,
  position,
}: {
  project: ProjectDisplay;
  position: { x: number; y: number };
}) {
  // Constrain to viewport
  const margin = 12;
  const cardW = 320;
  const x = Math.min(position.x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - cardW - margin);
  const y = Math.max(margin, position.y);

  return (
    <div
      className="fixed z-[100] w-80 rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.55)] bg-fd-card text-fd-foreground border border-fd-border"
      style={{ left: x, top: y }}
      role="tooltip"
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-sm text-fd-muted-foreground">
          {formatDate(project.date)}
        </span>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 flex items-center justify-center text-fd-foreground hover:text-fd-primary"
          aria-label={`Open ${project.title} on GitHub`}
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <div className="px-4 pb-1 pt-1">
        <h3 className="text-lg font-bold my-1">{project.title}</h3>
      </div>

      {project.participants.length > 0 && (
        <div className="border-t border-fd-border flex items-center px-4 py-3">
          <ul className="flex items-center m-0 p-0 list-none">
            {project.participants.map((p, i) => (
              <li key={p.name} className="flex -mr-2.5">
                {p.avatarUrl ? (
                  <Image
                    src={p.avatarUrl}
                    alt={p.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-fd-border object-cover shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full border border-fd-border grid place-items-center text-xs font-bold"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name[0]?.toUpperCase()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ProjectCard({ project, position, isMobile, onClose }: ProjectCardProps) {
  if (!project) return null;

  if (isMobile) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{project.title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-6 space-y-4">
            <p className="text-sm text-fd-muted-foreground">
              Last update: {formatDate(project.date)}
            </p>

            {project.participants.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Contributors</h4>
                <ul className="flex items-center m-0 p-0 list-none">
                  {project.participants.map((p) => (
                    <li key={p.name} className="flex -mr-2.5">
                      {p.avatarUrl ? (
                        <Image
                          src={p.avatarUrl}
                          alt={p.name}
                          width={32}
                          height={32}
                          className="rounded-full border border-fd-border object-cover"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full border border-fd-border grid place-items-center text-xs font-bold"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.name[0]?.toUpperCase()}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-fd-border text-sm no-underline text-fd-foreground hover:bg-fd-accent"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <DesktopCard project={project} position={position} />;
}

'use client';

import Image from 'next/image';
import type { ContributorDisplay } from '../types';

interface ContributorCardsProps {
  items: ContributorDisplay[];
  isMobile: boolean;
  safeOffsets: Array<{ x: number; y: number }>;
  onAvatarOpen: (contributor: ContributorDisplay) => void;
}

const ANGLES = [-90, 0, 180, 90];

function ContributorCard({
  contributor,
  offset,
}: {
  contributor: ContributorDisplay;
  offset: { x: number; y: number };
}) {
  return (
    <article
      className="absolute w-[min(88vw,260px)] p-2.5 bg-white/10 border border-white/20 rounded-[14px] backdrop-blur-[14px] saturate-[1.15] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-fd-foreground pointer-events-auto cursor-pointer z-10 will-change-transform transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_22px_52px_rgba(0,0,0,0.28)] hover:border-white/90 max-sm:hidden"
      style={{ left: offset.x, top: offset.y }}
    >
      <a
        href={contributor.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 no-underline text-inherit hover:opacity-85"
      >
        <Image
          src={contributor.avatarUrl}
          alt={contributor.id}
          width={32}
          height={32}
          className="rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
        />
        <h3 className="text-base m-0 font-semibold">{contributor.id}</h3>
      </a>
      <p className="mt-0.5 text-center text-xs opacity-90 line-clamp-1">
        {contributor.summary}
      </p>
      {contributor.projects.length > 0 && (
        <>
          <div className="h-px bg-white/15 my-2" />
          <ul className="list-none m-0 p-0 grid gap-1">
            {contributor.projects.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded flex-shrink-0 bg-gradient-to-br from-white/60 to-white/5 shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm truncate no-underline text-inherit opacity-90 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring focus-visible:rounded"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

function MobileAvatarButton({
  contributor,
  offset,
  onOpen,
}: {
  contributor: ContributorDisplay;
  offset: { x: number; y: number };
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="absolute w-11 h-11 rounded-full overflow-hidden border border-white/20 bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-0 pointer-events-auto grid place-items-center z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
      style={{ left: offset.x, top: offset.y }}
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
  );
}

export function ContributorCards({
  items,
  isMobile,
  safeOffsets,
  onAvatarOpen,
}: ContributorCardsProps) {
  const visible = items.slice(0, ANGLES.length);

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
            />
          );
        }

        return (
          <ContributorCard
            key={contributor.id}
            contributor={contributor}
            offset={offset}
          />
        );
      })}
    </div>
  );
}

import Image from 'next/image';
import type { ContributorDisplay } from '../types';

interface ContributorHeaderProps {
  contributor: ContributorDisplay;
  /** Avatar size in px */
  size?: number;
  /** Wrap in a link to the contributor's GitHub profile */
  linked?: boolean;
  className?: string;
}

export function ContributorHeader({
  contributor,
  size = 36,
  linked = true,
  className = '',
}: ContributorHeaderProps) {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={contributor.avatarUrl}
        alt={contributor.id}
        width={size}
        height={size}
        className="rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.12)] flex-shrink-0 object-cover"
        style={{ width: size, height: size }}
      />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold truncate">{contributor.id}</span>
        <span className="text-xs opacity-70 truncate">{contributor.summary}</span>
      </div>
    </div>
  );

  if (linked) {
    return (
      <a
        href={contributor.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline text-inherit hover:opacity-85"
      >
        {content}
      </a>
    );
  }

  return content;
}

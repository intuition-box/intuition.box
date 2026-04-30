import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Site-wide page hero: glow background + gradient title + optional
 * description. Used on every top-level page except `/docs`. Each page
 * picks a `tone` so the glow + title gradient share a color story.
 */

export type HeroTone =
  | 'default'
  | 'mint'
  | 'missions'
  | 'yellow'
  | 'teal'
  | 'purple'
  | 'lilac'
  | 'red';

// `tone` only controls the glow background. Title gradient is intentionally
// the same on every page (matches the homepage) for brand consistency.
const TONE_GLOW: Record<HeroTone, string> = {
  default: 'bg-hero-glow',
  mint: 'bg-hero-glow-mint',
  missions: 'bg-hero-glow-missions',
  yellow: 'bg-hero-glow-yellow',
  teal: 'bg-hero-glow-teal',
  purple: 'bg-hero-glow-purple',
  lilac: 'bg-hero-glow-lilac',
  red: 'bg-hero-glow-red',
};

const TITLE_GRADIENT = 'from-fd-primary from-15% to-fd-muted-foreground to-85%';

interface PageHeroProps {
  title: ReactNode;
  description?: ReactNode;
  /** Optional content above the title (e.g. a Logomark on the homepage). */
  before?: ReactNode;
  /** Optional content below the description (e.g. CTAs). */
  children?: ReactNode;
  /** Color theme for the glow background and title gradient. */
  tone?: HeroTone;
  className?: string;
}

export function PageHero({
  title,
  description,
  before,
  children,
  tone = 'default',
  className,
}: PageHeroProps) {
  return (
    <header className={cn('relative isolate -z-10', className)}>
      <div
        aria-hidden
        className={cn(
          // Extends 70px above the hero (so the glow continues behind the
          // navbar) and a fixed height that gives the radial gradients
          // room to fade out smoothly past the hero's content. Clipping
          // at the hero's bottom edge made the gradient feel truncated
          // ("doesn't expand") on shorter heroes.
          'absolute inset-x-0 -top-[70px] h-[870px] -z-10 pointer-events-none',
          TONE_GLOW[tone],
        )}
      />

      <div className="max-w-5xl mx-auto pt-32 pb-16 px-8 text-center">
        {before && <div className="mb-8 flex justify-center">{before}</div>}

        <h1
          className={cn(
            // leading-tight (1.25) gives descenders like the "g" in "Blog"
            // enough vertical room — anything tighter clips them when
            // bg-clip-text is applied. pb-2 keeps a small visual buffer.
            'text-5xl md:text-6xl leading-tight pb-2 font-bold mb-4 tracking-tight bg-clip-text text-transparent antialiased [box-decoration-break:clone] bg-linear-[103deg]',
            TITLE_GRADIENT,
          )}
        >
          {title}
        </h1>

        {description && (
          <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto m-0">
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}

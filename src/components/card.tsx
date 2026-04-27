'use client';

import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  Card as WavesoCard,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@waveso/ui/card';
import { cn } from '@/lib/cn';

/**
 * Site-wide Card design system. The Card itself is wave-ui's `<Card>` —
 * the wrapper here only adds two things on top of it:
 *
 *  1. A `variant` prop that maps to a column width (used by `<CardGrid>`
 *     and consumers using `<Masonry>` directly).
 *  2. A React context so cards inside `<CardGrid>` inherit the variant
 *     without the consumer having to repeat themselves.
 *
 * Use the wave-ui slots for structure: `<CardHeader>`, `<CardContent>`,
 * `<CardFooter>`. Footer is the home for action buttons.
 */

export type CardVariant = 'compact' | 'default' | 'wide' | 'interactive';

const COLUMN_WIDTHS: Record<CardVariant, number> = {
  compact: 240,
  default: 320,
  wide: 480,
  interactive: 720,
};

/** The min column width (in px) used by grid/masonry for a given variant. */
export function getCardColumnWidth(variant: CardVariant = 'default'): number {
  return COLUMN_WIDTHS[variant];
}

/**
 * Returns a Tailwind class string that mimics wave-ui's `<Card>` +
 * inner content padding. Use only when you can't render an actual `<Card>`
 * element — e.g. a `<button>` trigger inside a Dialog where you need real
 * button semantics for accessibility.
 */
export function cardClasses(variant: CardVariant = 'default'): string {
  const compact = variant === 'compact';
  return cn(
    'ring-foreground/10 bg-card text-card-foreground flex flex-col overflow-hidden rounded-xl text-sm ring-1',
    compact ? 'gap-3 py-3 px-3' : 'gap-4 py-4 px-4',
  );
}

const CardContext = createContext<{ variant: CardVariant }>({ variant: 'default' });

export interface CardProps extends ComponentProps<typeof WavesoCard> {
  variant?: CardVariant;
}

export function Card({ variant: variantProp, ...rest }: CardProps) {
  const ctx = useContext(CardContext);
  const variant = variantProp ?? ctx.variant;
  // wave-ui's own `size` prop only accepts default / sm. Map compact → sm,
  // everything else inherits the default visual scale.
  const wavesoSize = variant === 'compact' ? 'sm' : 'default';
  return <WavesoCard size={wavesoSize} data-variant={variant} {...rest} />;
}

// ── Layout primitive ─────────────────────────────────────────────────

export interface CardGridProps extends ComponentProps<'div'> {
  variant?: CardVariant;
  children?: ReactNode;
}

/**
 * CSS-grid layout that auto-fills columns at the variant's column width.
 * Cards inside inherit the variant via context, so consumers never repeat
 * themselves and column widths stay consistent across the site.
 *
 * Heights grow naturally; if you need row alignment, add `auto-rows-fr`
 * via `className`.
 */
export function CardGrid({
  variant = 'default',
  className,
  children,
  ...rest
}: CardGridProps) {
  const minWidth = `${COLUMN_WIDTHS[variant]}px`;
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        data-card-grid-variant={variant}
        className={cn('grid gap-6', className)}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}, 100%), 1fr))`,
        }}
        {...rest}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

// ── Re-exports ───────────────────────────────────────────────────────

export {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};

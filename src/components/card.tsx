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
  CardContent as WavesoCardContent,
  CardDescription,
  CardFooter as WavesoCardFooter,
  CardHeader as WavesoCardHeader,
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
export function cardClasses(_variant: CardVariant = 'default'): string {
  // Mirrors the `<Card>` wrapper defaults so non-div triggers (e.g. a
  // `<button>` Dialog trigger) match real Cards exactly: solid bg, single
  // 1px border (no doubled ring), uniform 20px padding regardless of variant.
  return cn(
    'bg-fd-card text-card-foreground border border-fd-border flex flex-col overflow-hidden rounded-xl text-sm',
    'gap-4 p-5',
  );
}

const CardContext = createContext<{ variant: CardVariant }>({ variant: 'default' });

export interface CardProps extends ComponentProps<typeof WavesoCard> {
  variant?: CardVariant;
}

export function Card({
  variant: variantProp,
  className,
  ...rest
}: CardProps) {
  const ctx = useContext(CardContext);
  const variant = variantProp ?? ctx.variant;
  // wave-ui's own `size` prop only accepts default / sm. Map compact → sm,
  // everything else inherits the default visual scale.
  const wavesoSize = variant === 'compact' ? 'sm' : 'default';
  return (
    <WavesoCard
      size={wavesoSize}
      data-variant={variant}
      // Site-wide card defaults:
      //  - `bg-fd-card`: solid card fill
      //  - `border border-fd-border`: 1px subtle gray border
      //  - `ring-0`: nullify library `ring-1 ring-foreground/10` so the
      //    border is the only edge — avoids a doubled ring+border line
      // Consumers can still override any of these via `className`.
      className={cn(
        // Site-wide 20px padding via py-5; the `data-[size=sm]:py-5`
        // override beats wave-ui's `data-[size=sm]:py-3` so compact
        // cards also get 20px (otherwise the same-specificity conditional
        // wins by source order).
        'py-5 data-[size=sm]:py-5 bg-fd-card border border-fd-border ring-0',
        className,
      )}
      {...rest}
    />
  );
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

// ── Slot overrides ───────────────────────────────────────────────────
// Site-wide 20px horizontal padding (`px-5`) on every slot, replacing
// wave-ui's `px-4` (default) / `px-3` (compact). Keeps padding uniform
// regardless of card variant.

export function CardHeader({
  className,
  ...rest
}: ComponentProps<typeof WavesoCardHeader>) {
  return (
    <WavesoCardHeader
      className={cn('px-5 group-data-[size=sm]/card:px-5', className)}
      {...rest}
    />
  );
}

export function CardContent({
  className,
  ...rest
}: ComponentProps<typeof WavesoCardContent>) {
  return (
    <WavesoCardContent
      className={cn('px-5 group-data-[size=sm]/card:px-5', className)}
      {...rest}
    />
  );
}

/**
 * wave-ui's `CardFooter` defaults to a divider + filled action shelf
 * (`border-t bg-muted/50 p-4`). We drop the top border site-wide and
 * apply the uniform 20px padding so footer matches header/content.
 */
export function CardFooter({
  className,
  ...rest
}: ComponentProps<typeof WavesoCardFooter>) {
  return (
    <WavesoCardFooter
      className={cn(
        'p-5 group-data-[size=sm]/card:p-5 border-t-0',
        className,
      )}
      {...rest}
    />
  );
}

// ── Re-exports ───────────────────────────────────────────────────────

export { CardAction, CardDescription, CardTitle };

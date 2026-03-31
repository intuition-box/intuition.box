'use client';

// Re-export from wave-ui with 'use client' boundary.
// Temporarily wraps to forward strokeWidth/baseColor props
// until wave-ui publishes with them natively.
export { GradientRevealText } from '@waveso/ui/gradient-reveal-text';
export type { GradientRevealTextProps } from '@waveso/ui/gradient-reveal-text';

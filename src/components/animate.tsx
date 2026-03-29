'use client';

// Re-export from wave-ui with 'use client' boundary.
// wave-ui's dist doesn't preserve the directive due to tsup code splitting.
export { AnimateIn, AnimateOnView, Stagger, Pulse, Float } from '@waveso/ui/animate';
export type { AnimateInProps, AnimateOnViewProps, StaggerProps, PulseProps, FloatProps, Direction } from '@waveso/ui/animate';

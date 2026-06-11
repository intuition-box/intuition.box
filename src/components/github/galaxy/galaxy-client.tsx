'use client';

import dynamic from 'next/dynamic';

/**
 * Client-side wrapper that lazy-loads the Galaxy three.js scene.
 *
 *  - `ssr: false` skips server rendering, removing three.js from the
 *    initial HTML. The component is below the fold on the homepage so
 *    deferring it has no perceived UX cost.
 *  - Loading the module dynamically means three-force-graph + react-force-graph
 *    + three.js + d3-force ship in a separate chunk that's fetched on demand.
 *
 *  `next/dynamic` with `ssr: false` is only valid inside a Client Component —
 *  hence this wrapper file exists so the homepage (Server Component) can
 *  import a `<Galaxy />` symbol without owning the dynamic-import call.
 */
export const Galaxy = dynamic(
  () => import('./galaxy').then((mod) => ({ default: mod.Galaxy })),
  { ssr: false },
);

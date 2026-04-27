'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface OrbitDimensions {
  /** Container width in px */
  width: number;
  /** Container height in px */
  height: number;
  /** Whether viewport is <= 640px */
  isMobile: boolean;
  /** Contributor card orbit radius */
  contribRadius: number;
  /** Clamped contributor orbit positions to keep avatars within bounds */
  safeOffsets: { x: number; y: number }[];
  /** True after the first layout computation */
  ready: boolean;
}

const CONTRIB_ANGLES = [-90, 0, 180, 90]; // diamond layout (degrees)

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Single ResizeObserver-based hook that computes all Galaxy layout values.
 * Replaces the old useIsMobile + useGalaxyBox + useRespContribOrbit hooks.
 */
export function useOrbitDimensions(
  containerRef: React.RefObject<HTMLDivElement | null>,
): OrbitDimensions {
  const [dims, setDims] = useState<OrbitDimensions>({
    width: 0,
    height: 0,
    isMobile: false,
    contribRadius: 200,
    safeOffsets: CONTRIB_ANGLES.map(() => ({ x: 0, y: 0 })),
    ready: false,
  });

  const frameRef = useRef<number | null>(null);

  const compute = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const isMobile = w <= 640;

    // Match the old responsive orbit base logic
    const orbitBase = isMobile
      ? Math.max(115, Math.min(w * 0.3, 230))
      : Math.max(260, Math.min(w * 0.34, 340));

    const contribRadius = orbitBase * 1.2;
    const cardW = isMobile ? 44 : Math.min(w * 0.88, 260);
    const cardH = isMobile ? 44 : 120;
    const cx = w / 2;
    const cy = h / 2;
    const margin = 12;

    // Offsets point to the card's CENTER — consumers apply translate(-50%, -50%)
    // to render the card so actual rendered width/height don't need to be known.
    const halfW = cardW / 2;
    const halfH = cardH / 2;
    const safeOffsets = CONTRIB_ANGLES.map((deg) => {
      const rad = degToRad(deg);
      let x = cx + contribRadius * Math.cos(rad);
      let y = cy + contribRadius * Math.sin(rad);

      // Clamp so the card's bounding box stays inside the container
      x = Math.max(halfW + margin, Math.min(x, w - halfW - margin));
      y = Math.max(halfH + margin, Math.min(y, h - halfH - margin));

      return { x, y };
    });

    setDims((prev) => {
      // Skip the update if every value is identical to the previous tick.
      // ResizeObserver fires on every fractional pixel change in some
      // browsers; without this, every resize causes a full Galaxy re-render.
      if (
        prev.ready &&
        prev.width === w &&
        prev.height === h &&
        prev.isMobile === isMobile &&
        prev.contribRadius === contribRadius &&
        prev.safeOffsets.length === safeOffsets.length &&
        prev.safeOffsets.every(
          (o, i) => o.x === safeOffsets[i].x && o.y === safeOffsets[i].y,
        )
      ) {
        return prev;
      }
      return { width: w, height: h, isMobile, contribRadius, safeOffsets, ready: true };
    });
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(compute);
    });

    observer.observe(el);
    compute(); // initial computation

    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [containerRef, compute]);

  return dims;
}

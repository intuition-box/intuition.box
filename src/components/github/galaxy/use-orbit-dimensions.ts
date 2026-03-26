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

    const safeOffsets = CONTRIB_ANGLES.map((deg) => {
      const rad = degToRad(deg);
      let x = cx + contribRadius * Math.cos(rad) - cardW / 2;
      let y = cy + contribRadius * Math.sin(rad) - cardH / 2;

      // Clamp within container bounds
      x = Math.max(margin, Math.min(x, w - cardW - margin));
      y = Math.max(margin, Math.min(y, h - cardH - margin));

      return { x, y };
    });

    setDims({ width: w, height: h, isMobile, contribRadius, safeOffsets });
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

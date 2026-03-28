'use client';

import { useRef, useEffect, useState, useId, useCallback } from 'react';
import { motion } from 'motion/react';

interface GradientRevealTextProps {
  text: string;
  /** Spotlight follow speed in seconds. Default: 0 (instant) */
  duration?: number;
  className?: string;
}

export function GradientRevealText({
  text,
  duration = 0,
  className,
}: GradientRevealTextProps) {
  const uid = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState('0 0 100 20');
  const [dims, setDims] = useState({ w: 100, h: 20 });
  const [hovered, setHovered] = useState(false);
  const [maskPos, setMaskPos] = useState({ cx: '50%', cy: '50%' });

  // Measure text bbox → set viewBox and track aspect ratio
  const measure = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    const bbox = el.getBBox();
    if (bbox.width === 0) return;

    setViewBox(`${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    setDims({ w: bbox.width, h: bbox.height });
  }, []);

  useEffect(() => {
    measure();
    document.fonts?.ready?.then(measure);
  }, [text, measure]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 100;
    const cy = ((e.clientY - rect.top) / rect.height) * 100;
    setMaskPos({ cx: `${cx}%`, cy: `${cy}%` });
  };

  // Spotlight radius: based on text height (smallest dimension) so it's always a circle
  // r in userSpaceOnUse = half the text height → covers the text vertically
  const spotlightR = dims.h * 0.6;

  // Convert percentage position to viewBox coordinates
  const vbParts = viewBox.split(' ').map(Number);
  const vbX = vbParts[0] ?? 0;
  const vbY = vbParts[1] ?? 0;
  const cxVal = vbX + (parseFloat(maskPos.cx) / 100) * dims.w;
  const cyVal = vbY + (parseFloat(maskPos.cy) / 100) * dims.h;

  const gradientId = `grad-${uid}`;
  const maskId = `mask-${uid}`;
  const revealId = `reveal-${uid}`;

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`select-none ${className ?? ''}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        {/* userSpaceOnUse + explicit r = perfect circle regardless of aspect ratio */}
        <motion.radialGradient
          id={revealId}
          gradientUnits="userSpaceOnUse"
          r={spotlightR}
          initial={{ cx: dims.w / 2 + vbX, cy: dims.h / 2 + vbY }}
          animate={{ cx: cxVal, cy: cyVal }}
          transition={{ duration, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id={maskId}>
          <rect
            x={vbX - dims.w}
            y={vbY - dims.h}
            width={dims.w * 3}
            height={dims.h * 3}
            fill={`url(#${revealId})`}
          />
        </mask>
      </defs>

      {/* Hidden text for measurement */}
      <text
        ref={textRef}
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold"
        style={{ fontSize: '1em', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', visibility: 'hidden' }}
      >
        {text}
      </text>

      {/* Base stroke — subtle outline always visible */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold stroke-neutral-200 dark:stroke-neutral-800"
        style={{
          fontSize: '1em',
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fill: 'none',
          strokeWidth: dims.h * 0.015,
          strokeLinejoin: 'round',
          strokeLinecap: 'round',
          paintOrder: 'stroke fill',
          opacity: hovered ? 0.7 : 0.3,
          transition: 'opacity 0.3s ease',
        }}
      >
        {text}
      </text>

      {/* Gradient reveal on hover */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        mask={`url(#${maskId})`}
        className="font-bold"
        style={{
          fontSize: '1em',
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fill: 'none',
          stroke: `url(#${gradientId})`,
          strokeWidth: dims.h * 0.015,
          strokeLinejoin: 'round',
          strokeLinecap: 'round',
          paintOrder: 'stroke fill',
        }}
      >
        {text}
      </text>
    </svg>
  );
}

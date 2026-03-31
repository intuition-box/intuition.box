'use client';

import { Iridescence } from '@/components/backgrounds/iridescence';

export function GalaxyCoreGlow() {
  return (
    <>
      {/* Core glow — Iridescence masked to radial shape */}
      <div
        className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
        style={{
          mask: 'radial-gradient(circle, white 0%, white 33%, transparent 70%)',
          WebkitMask: 'radial-gradient(circle, white 0%, white 33%, transparent 70%)',
        }}
      >
        <Iridescence
          className="w-full h-full opacity-20"
          color={[0.3, 0.7, 0.9]}
          speed={0.4}
          amplitude={1}
        />
      </div>

      {/* Pulsing outer glow — Iridescence with pulse animation */}
      <div
        className="absolute inset-0 w-full h-full rounded-full overflow-hidden opacity-50 motion-safe:animate-[star-pulse_4s_ease-in-out_infinite]"
        style={{
          mask: 'radial-gradient(circle, white 0%, transparent 70%)',
          WebkitMask: 'radial-gradient(circle, white 0%, transparent 70%)',
        }}
      >
        <Iridescence
          className="w-full h-full opacity-10"
          color={[0.4, 0.8, 1.0]}
          speed={0.3}
          amplitude={0.1}
        />
      </div>
    </>
  );
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

interface GalaxyBackgroundProps {
  fetchedAt?: string;
}

export function GalaxyBackground({ fetchedAt }: GalaxyBackgroundProps) {
  return (
    <>
      {/* Spinning galaxy SVG background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-no-repeat bg-center motion-safe:animate-[spin-galaxy_200s_linear_infinite]"
        style={{
          backgroundImage: 'var(--galaxy-svg)',
          backgroundSize: '62%',
        }}
        aria-hidden
      />

      {/* Central glowing circle with title */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none grid place-items-center w-[280px] h-[280px] rounded-full max-sm:w-[148px] max-sm:h-[148px]"
        aria-hidden
      >
        {/* Core glow */}
        <div className="absolute inset-0 rounded-full blur-[12px] bg-[radial-gradient(circle,rgba(200,235,255,1)_0%,rgba(94,194,231,0.8)_35%,transparent_70%)]" />
        {/* Pulsing outer glow */}
        <div className="absolute inset-0 rounded-full blur-[25px] opacity-50 motion-safe:animate-[star-pulse_4s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(200,235,255,1)_0%,transparent_70%)]" />
        {/* Title + date */}
        <div className="relative z-[1] text-center">
          <h2 className="m-0 font-bold tracking-wider text-[#0b2545] max-sm:text-sm">
            Live Activity
          </h2>
          {fetchedAt && (
            <p className="m-0 mt-1 text-xs text-[#0b2545]/60 max-sm:text-[10px]">
              {formatDate(fetchedAt)}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

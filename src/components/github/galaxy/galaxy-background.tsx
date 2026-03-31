import { FilmGrain } from '@waveso/ui/film-grain';

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
      <div
        className="absolute inset-0 z-0 pointer-events-none motion-safe:animate-[spin-galaxy_200s_linear_infinite]"
        style={{
          mask: 'var(--galaxy-svg) center / 62% no-repeat',
          WebkitMask: 'var(--galaxy-svg) center / 62% no-repeat',
        }}
        aria-hidden
      >
        <FilmGrain
          density={1}
          opacity={0.5}
          fps={24}
          color="#ffffff"
          style={{
            mask: 'radial-gradient(circle, transparent 0%, transparent 15%, white 20%)',
            WebkitMask: 'radial-gradient(circle, transparent 0%, transparent 15%, white 20%)',
          }}
        />
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none grid place-items-center w-[320px] h-[320px] rounded-full max-sm:w-[148px] max-sm:h-[148px]"
        aria-hidden
      >

        {/* Glow */}
        <div className="absolute inset-0 rounded-full blur-[12px] opacity-1 bg-[radial-gradient(circle,rgba(200,235,255,0.6)_0%,rgba(94,194,231,0.6)_35%,transparent_70%)]" />
        <div className="absolute inset-0 rounded-full blur-[25px] opacity-1 motion-safe:animate-[star-pulse_4s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(200,235,255,0.6)_0%,transparent_70%)]" />

        <div className="relative z-[1] text-center">
          <h2 className="m-0 font-bold tracking-wider max-sm:text-sm">
            Live Activity
          </h2>
          {fetchedAt && (
            <p className="m-0 mt-1 text-xs text-fd-muted-foreground max-sm:text-[10px]">
              {formatDate(fetchedAt)}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

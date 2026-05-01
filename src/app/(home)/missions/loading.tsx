import { PageHero } from '@/components/page-hero';

/**
 * Skeleton shown while `/missions` is regenerating ISR or hydrating
 * a fresh fetch. Matches the real page's hero + stats panel + masonry
 * shape so layout doesn't shift when content arrives.
 */
export default function MissionsLoading() {
  return (
    <main>
      <PageHero
        tone="missions"
        title="Missions"
        description="Open contributions that serve the whole builder community — from ideas to rewards."
      />

      <div className="relative z-10">
        <section className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-3 gap-4 rounded-xl border border-fd-border bg-fd-card p-5">
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </div>
        </section>

        <section className="max-w-5xl mx-auto pt-32 pb-16 px-6 md:px-8">
          <div className="mb-12 text-center">
            <div className="mx-auto h-7 w-56 rounded bg-fd-muted/40 animate-pulse" />
            <div className="mx-auto mt-3 h-5 w-96 max-w-full rounded bg-fd-muted/30 animate-pulse" />
          </div>

          <div className="flex justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-20 rounded-full bg-fd-muted/30 animate-pulse"
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-20 rounded-md bg-fd-muted/30 animate-pulse" />
              <div className="h-7 w-44 rounded-md bg-fd-muted/30 animate-pulse" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SkeletonStat() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-3 w-20 rounded bg-fd-muted/30 animate-pulse" />
      <div className="h-7 w-16 rounded bg-fd-muted/40 animate-pulse" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="h-5 w-24 rounded-full bg-fd-muted/30 animate-pulse" />
        <div className="h-5 w-12 rounded-full bg-fd-muted/30 animate-pulse" />
      </div>
      <div className="h-5 w-3/4 rounded bg-fd-muted/40 animate-pulse mb-2" />
      <div className="h-3 w-32 rounded bg-fd-muted/20 animate-pulse mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-fd-muted/20 animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-fd-muted/20 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-fd-muted/20 animate-pulse" />
      </div>
    </div>
  );
}

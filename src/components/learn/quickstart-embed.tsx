import Link from 'next/link';
import { ArrowRight, Compass, Hammer, Radio } from 'lucide-react';

const phases = [
  { label: 'Discover', icon: Compass },
  { label: 'Build', icon: Hammer },
  { label: 'Signal', icon: Radio },
] as const;

export function QuickstartEmbed() {
  return (
    <aside className="not-prose my-10 overflow-hidden rounded-2xl border border-ib-brand/25 bg-ib-brand-alpha">
      <div className="px-5 py-6 sm:px-7">
        <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
          Continue in the builder track
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fd-foreground">
          Turn this model into a small React app
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
          The ten-step Quickstart moves from read-only graph discovery to a
          rendered product concept. Every transaction remains a Testnet-only
          simulation, so no wallet or tTRUST is used here.
        </p>

        <div className="mt-6 grid border-y border-fd-border sm:grid-cols-3">
          {phases.map(({ label, icon: Icon }, index) => (
            <div
              key={label}
              className="flex min-h-16 items-center gap-3 border-b border-fd-border py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0"
            >
              <span className="text-xs tabular-nums text-fd-muted-foreground">
                0{index + 1}
              </span>
              <Icon className="size-4 text-ib-brand" />
              <span className="text-sm font-medium text-fd-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/learn/quickstart"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-ib-brand px-5 text-sm font-medium text-ib-brand-dark no-underline transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
        >
          Open the Quickstart
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </aside>
  );
}

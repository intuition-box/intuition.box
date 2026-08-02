import Link from 'next/link';
import { ArrowRight, Compass, Hammer, Radio } from 'lucide-react';

const phases = [
  {
    number: '01',
    title: 'Discover',
    description: 'Install the skill, inspect Testnet, and choose a graph-shaped app idea.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Build',
    description: 'Install the SDK, configure Testnet, and resolve existing terms before writing.',
    icon: Hammer,
  },
  {
    number: '03',
    title: 'Signal',
    description: 'Preview an atom, triple, vault behavior, and the final React product state.',
    icon: Radio,
  },
] as const;

export function QuickstartPreview() {
  return (
    <div className="border-y border-fd-border">
      <div className="grid lg:grid-cols-3">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <div
              key={phase.title}
              className="border-b border-fd-border px-0 py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs tabular-nums text-fd-muted-foreground">
                  {phase.number}
                </span>
                <Icon className="size-4 text-ib-brand" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-fd-foreground">
                {phase.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                {phase.description}
              </p>
              {index === phases.length - 1 && (
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ib-brand">
                  Simulated writes only
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fd-border py-5">
        <p className="m-0 text-sm text-fd-muted-foreground">
          Ten steps · approximately 20 minutes · no wallet required
        </p>
        <Link
          href="/learn/quickstart"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ib-brand px-5 text-sm font-medium text-ib-brand-dark no-underline transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
        >
          Open the Quickstart
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

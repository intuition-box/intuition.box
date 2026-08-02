import { ArrowRight } from 'lucide-react';

interface UseCaseScenarioProps {
  title: string;
  problem: string;
  subject: string;
  predicate: string;
  object: string;
  signal: string;
  product: string;
}

export function UseCaseScenario({
  title,
  problem,
  subject,
  predicate,
  object,
  signal,
  product,
}: UseCaseScenarioProps) {
  return (
    <section className="not-prose my-10 border-y border-fd-border py-8">
      <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
        Product pattern
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-fd-foreground">
        {title}
      </h3>
      <p className="mt-3 max-w-2xl text-base leading-7 text-fd-muted-foreground">
        {problem}
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        {[subject, predicate, object].map((term, index) => (
          <div key={term} className="contents">
            <div className="rounded-xl border border-fd-border bg-fd-card px-4 py-4 text-center text-sm font-medium text-fd-foreground">
              {term}
            </div>
            {index < 2 && (
              <ArrowRight className="mx-auto size-4 rotate-90 text-ib-brand md:rotate-0" />
            )}
          </div>
        ))}
      </div>

      <dl className="mt-7 grid gap-5 border-t border-fd-border pt-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
            Role of signal
          </dt>
          <dd className="mt-2 text-sm leading-6 text-fd-foreground">{signal}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
            Possible product
          </dt>
          <dd className="mt-2 text-sm leading-6 text-fd-foreground">{product}</dd>
        </div>
      </dl>
    </section>
  );
}

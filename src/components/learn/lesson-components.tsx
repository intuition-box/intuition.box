import type { ReactNode } from 'react';
import {
  CheckCircle2,
  CircleAlert,
  Flag,
  Lightbulb,
  Search,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';

export function LearningObjectives({ items }: { items: string[] }) {
  return (
    <aside className="not-prose my-8 rounded-xl border border-ib-brand-alpha bg-ib-brand-dark/45 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ib-brand">
        <CheckCircle2 className="size-4" />
        Learning objectives
      </div>
      <ul className="m-0 grid list-none gap-2 p-0 text-sm text-fd-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ib-brand" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <aside className="not-prose my-10 rounded-xl border border-ib-purple-alpha bg-ib-purple-dark/50 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ib-purple">
        <Sparkles className="size-4" />
        Key takeaways
      </div>
      <ul className="m-0 grid list-none gap-2 p-0 text-sm text-fd-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ib-purple" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function ConceptCheck({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  return (
    <details className="not-prose group my-8 rounded-xl border border-ib-yellow-alpha bg-ib-yellow-dark/35">
      <summary className="flex cursor-pointer list-none items-start gap-3 p-5 text-sm font-medium marker:content-none">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ib-yellow-alpha text-ib-yellow">
          <Lightbulb className="size-4" />
        </span>
        <span className="pt-1.5">{question}</span>
        <span className="ml-auto pt-1.5 text-xs text-fd-muted-foreground group-open:hidden">
          Reveal answer
        </span>
      </summary>
      <div className="border-t border-ib-yellow-alpha px-5 py-4 pl-16 text-sm leading-6 text-fd-muted-foreground">
        {children}
      </div>
    </details>
  );
}

export function CaseStudy({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="not-prose my-8 overflow-hidden rounded-xl border border-ib-teal-alpha bg-fd-card">
      <div className="flex items-center gap-2 border-b border-ib-teal-alpha bg-ib-teal-alpha px-5 py-3 text-sm font-semibold text-ib-teal">
        <Search className="size-4" />
        {title}
      </div>
      <div className="p-5 text-sm leading-7 text-fd-muted-foreground">{children}</div>
    </aside>
  );
}

export function ThinkAbout({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-8 border-l-2 border-ib-brand bg-ib-brand-alpha px-5 py-4 text-sm leading-6 text-fd-muted-foreground">
      <strong className="mb-1 block text-fd-foreground">Think about it</strong>
      {children}
    </aside>
  );
}

export function BuildCheckpoint({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="not-prose my-9 rounded-xl border border-ib-brand-alpha bg-ib-brand-dark/40 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-ib-brand">
        <Flag className="size-4" /> Checkpoint: {title}
      </div>
      <div className="mt-3 text-sm leading-7 text-fd-muted-foreground">{children}</div>
    </aside>
  );
}

export function ExpectedResult({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-9 overflow-hidden rounded-xl border border-ib-teal-alpha bg-fd-card">
      <div className="flex items-center gap-2 border-b border-ib-teal-alpha bg-ib-teal-alpha px-5 py-3 text-sm font-semibold text-ib-teal">
        <TerminalSquare className="size-4" /> Expected result
      </div>
      <div className="p-5 text-sm leading-7 text-fd-muted-foreground">{children}</div>
    </aside>
  );
}

export function Troubleshooting({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="not-prose group my-5 rounded-xl border border-ib-yellow-alpha bg-ib-yellow-dark/25">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm font-medium marker:content-none">
        <CircleAlert className="size-4 shrink-0 text-ib-yellow" />
        <span>{title}</span>
        <span className="ml-auto text-xs text-fd-muted-foreground group-open:hidden">Show fix</span>
      </summary>
      <div className="border-t border-ib-yellow-alpha px-5 py-4 text-sm leading-7 text-fd-muted-foreground">
        {children}
      </div>
    </details>
  );
}

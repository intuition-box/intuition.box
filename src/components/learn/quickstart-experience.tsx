'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clipboard,
  Copy,
  ExternalLink,
  ShieldCheck,
  Terminal,
  TriangleAlert,
} from 'lucide-react';
import {
  appIdeas,
  hydrateQuickstartStep,
  intuitionTestnetLearnNetwork,
  quickstartSteps,
  type AppIdea,
  type QuickstartPhase,
  type QuickstartStep,
} from '@/lib/learn';
import { cn } from '@/lib/cn';

const phaseMeta: Record<
  QuickstartPhase,
  { number: string; label: string; description: string; color: string }
> = {
  discover: {
    number: '01',
    label: 'Discover',
    description: 'Skill installation and graph-shaped ideas',
    color: 'text-ib-brand',
  },
  build: {
    number: '02',
    label: 'Build',
    description: 'SDK setup and read-before-write modeling',
    color: 'text-ib-teal',
  },
  signal: {
    number: '03',
    label: 'Signal',
    description: 'Simulated atom, triple, vault, and app state',
    color: 'text-ib-yellow',
  },
};

type CopyStatus = {
  key: string;
  state: 'copied' | 'error';
} | null;

export function QuickstartExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);
  const copyTimer = useRef<number | null>(null);
  const selectedIdea = appIdeas[selectedIdeaIndex];
  const activeStep = useMemo(
    () => hydrateQuickstartStep(quickstartSteps[activeIndex], selectedIdea),
    [activeIndex, selectedIdea],
  );
  const progress = Math.round(((activeIndex + 1) / quickstartSteps.length) * 100);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  async function copyText(key: string, value: string) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(value);
      setCopyStatus({ key, state: 'copied' });
    } catch {
      setCopyStatus({ key, state: 'error' });
    }

    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyStatus(null), 2200);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
      <div className="mb-7 grid gap-3 border-y border-ib-brand/20 bg-ib-brand-alpha py-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ib-brand" />
          <div>
            <p className="m-0 text-sm font-medium text-fd-foreground">
              Testnet · read-only discovery · simulated writes
            </p>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              No wallet connection, signature request, RPC write, or transaction broadcast occurs here.
            </p>
          </div>
        </div>
        <span className="text-xs uppercase tracking-[0.18em] text-ib-brand">
          {intuitionTestnetLearnNetwork.symbol} · chain {intuitionTestnetLearnNetwork.chainId}
        </span>
      </div>

      <div className="grid gap-7 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        <details className="group rounded-2xl border border-fd-border bg-fd-card/60 p-4 lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand">
            Step {activeIndex + 1} of {quickstartSteps.length}: {activeStep.title}
            <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <div className="mt-4 border-t border-fd-border pt-4">
            <StepList activeIndex={activeIndex} onSelect={setActiveIndex} />
          </div>
        </details>

        <aside className="hidden lg:block" aria-label="Quickstart steps">
          <div className="sticky top-24 rounded-2xl border border-fd-border bg-fd-card/60 p-3">
            <div className="px-3 pb-4 pt-2">
              <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-fd-muted-foreground">
                <span>Quickstart</span>
                <span>{progress}%</span>
              </div>
              <div
                className="mt-3 h-1 overflow-hidden rounded-full bg-fd-muted"
                role="progressbar"
                aria-label="Quickstart progress"
                aria-valuemin={1}
                aria-valuemax={quickstartSteps.length}
                aria-valuenow={activeIndex + 1}
              >
                <div
                  className="h-full origin-left bg-ib-brand transition-transform duration-300 motion-reduce:transition-none"
                  style={{ transform: 'scaleX(' + progress / 100 + ')' }}
                />
              </div>
            </div>
            <StepList activeIndex={activeIndex} onSelect={setActiveIndex} />
          </div>
        </aside>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-fd-border bg-[#0b1013]">
          <header className="border-b border-white/10 px-5 py-5 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className={cn(
                  'text-xs font-medium uppercase tracking-[0.2em]',
                  phaseMeta[activeStep.phase].color,
                )}
              >
                {phaseMeta[activeStep.phase].label} · Step {activeIndex + 1}
              </span>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={kindLabel(activeStep)} />
                {activeStep.walletRequired && (
                  <StatusPill label="Wallet required later" warning />
                )}
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-fd-foreground sm:text-3xl">
              {activeStep.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-fd-muted-foreground sm:text-base">
              {activeStep.summary}
            </p>
          </header>

          {activeStep.id === 'select-idea' && (
            <IdeaSelector
              ideas={appIdeas}
              selectedIndex={selectedIdeaIndex}
              onSelect={setSelectedIdeaIndex}
            />
          )}

          <div className="grid xl:grid-cols-2">
            {activeStep.command && (
              <CopyablePanel
                label="Shell command"
                value={activeStep.command}
                copyKey={activeStep.id + '-command'}
                status={copyStatus}
                onCopy={copyText}
              />
            )}
            {activeStep.prompt && (
              <CopyablePanel
                label="Agent prompt"
                value={activeStep.prompt}
                copyKey={activeStep.id + '-prompt'}
                status={copyStatus}
                onCopy={copyText}
              />
            )}
            {activeStep.code && (
              <CopyablePanel
                label={activeStep.file ? 'Generated file · ' + activeStep.file : 'Code'}
                value={activeStep.code}
                copyKey={activeStep.id + '-code'}
                status={copyStatus}
                onCopy={copyText}
              />
            )}
          </div>

          <div className="grid border-t border-white/10 lg:grid-cols-[1fr_0.85fr]">
            <OutputPanel step={activeStep} />
            <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0 sm:p-7">
              <p className="m-0 text-xs font-medium uppercase tracking-[0.18em] text-ib-brand">
                Checkpoint
              </p>
              <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">
                {activeStep.checkpoint}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
                  disabled={activeIndex === 0}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-fd-foreground transition-colors duration-150 hover:border-ib-brand/40 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
                >
                  <ArrowLeft className="size-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((index) =>
                      Math.min(quickstartSteps.length - 1, index + 1),
                    )
                  }
                  disabled={activeIndex === quickstartSteps.length - 1}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ib-brand px-5 text-sm font-medium text-ib-brand-dark transition-opacity duration-150 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
                >
                  Next step
                  <ArrowRight className="size-4" />
                </button>
              </div>
              <a
                href={intuitionTestnetLearnNetwork.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
              >
                Open Testnet explorer
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <p
        className="sr-only"
        role="status"
        aria-live="polite"
      >
        {copyStatus?.state === 'copied'
          ? 'Copied to clipboard.'
          : copyStatus?.state === 'error'
            ? 'Copy failed. Select the text and copy it manually.'
            : ''}
      </p>
    </section>
  );
}

function StepList({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const phases = Object.keys(phaseMeta) as QuickstartPhase[];

  return (
    <div className="space-y-5">
      {phases.map((phase) => (
        <div key={phase}>
          <div className="px-3">
            <p
              className={cn(
                'm-0 text-[0.68rem] font-medium uppercase tracking-[0.18em]',
                phaseMeta[phase].color,
              )}
            >
              {phaseMeta[phase].number} · {phaseMeta[phase].label}
            </p>
            <p className="mt-1 text-xs leading-5 text-fd-muted-foreground">
              {phaseMeta[phase].description}
            </p>
          </div>
          <div className="mt-2 space-y-1">
            {quickstartSteps.map((step, index) => {
              if (step.phase !== phase) return null;
              const active = index === activeIndex;
              const passed = index < activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'grid min-h-11 w-full grid-cols-[1.25rem_1fr] items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ib-brand',
                    active
                      ? 'bg-ib-brand-alpha text-fd-foreground'
                      : 'text-fd-muted-foreground hover:bg-fd-muted/50 hover:text-fd-foreground',
                  )}
                >
                  {passed ? (
                    <CheckCircle2 className="size-4 text-ib-brand" />
                  ) : active ? (
                    <Check className="size-4 text-ib-brand" />
                  ) : (
                    <Circle className="size-4 opacity-40" />
                  )}
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function IdeaSelector({
  ideas,
  selectedIndex,
  onSelect,
}: {
  ideas: readonly AppIdea[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <fieldset className="border-b border-white/10 p-5 sm:p-7">
      <legend className="text-xs font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
        Example ideas
      </legend>
      <div className="mt-4 grid gap-3">
        {ideas.map((idea, index) => {
          const selected = index === selectedIndex;
          return (
            <label
              key={idea.title}
              className={cn(
                'grid min-h-14 cursor-pointer grid-cols-[1.25rem_1fr] gap-3 rounded-xl border p-4 transition-colors duration-150',
                selected
                  ? 'border-ib-brand/45 bg-ib-brand-alpha'
                  : 'border-white/10 hover:border-white/20',
              )}
            >
              <input
                type="radio"
                name="quickstart-idea"
                checked={selected}
                onChange={() => onSelect(index)}
                className="mt-1 size-4 accent-[var(--color-ib-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
              />
              <span>
                <span className="block text-sm font-medium text-fd-foreground">
                  {idea.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-fd-muted-foreground">
                  {idea.problem}
                </span>
                <span className="mt-2 block text-xs text-ib-brand">
                  {idea.graphPattern}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function CopyablePanel({
  label,
  value,
  copyKey,
  status,
  onCopy,
}: {
  label: string;
  value: string;
  copyKey: string;
  status: CopyStatus;
  onCopy: (key: string, value: string) => void;
}) {
  const current = status?.key === copyKey ? status.state : null;

  return (
    <section className="min-w-0 border-b border-white/10 p-5 xl:border-b-0 xl:border-r xl:last:border-r-0 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-xs font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
          {label}
        </p>
        <button
          type="button"
          onClick={() => onCopy(copyKey, value)}
          className={cn(
            'inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand',
            current === 'error'
              ? 'border-ib-red/40 text-ib-red'
              : 'border-white/10 text-fd-muted-foreground hover:border-ib-brand/40 hover:text-fd-foreground',
          )}
        >
          {current === 'copied' ? (
            <Check className="size-3.5 text-ib-brand" />
          ) : current === 'error' ? (
            <TriangleAlert className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {current === 'copied'
            ? 'Copied'
            : current === 'error'
              ? 'Copy failed'
              : 'Copy'}
        </button>
      </div>
      <pre className="m-0 max-h-[32rem] min-h-56 overflow-auto rounded-xl bg-[#080c0e] p-4 text-xs leading-6 text-fd-foreground [font-variant-ligatures:none]">
        <code>{value}</code>
      </pre>
      {current === 'error' && (
        <p className="mt-3 text-xs leading-5 text-ib-red">
          Clipboard access is unavailable. Select the text and copy it manually.
        </p>
      )}
    </section>
  );
}

function OutputPanel({ step }: { step: QuickstartStep }) {
  const readOnly = !step.walletRequired && step.kind !== 'simulated';

  return (
    <section className="p-5 sm:p-7">
      <div className="flex items-center gap-2">
        {readOnly ? (
          <Clipboard className="size-4 text-ib-teal" />
        ) : (
          <Terminal className="size-4 text-ib-yellow" />
        )}
        <p className="m-0 text-xs font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
          {readOnly ? 'Read-only output' : 'Simulated output'}
        </p>
      </div>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#080c0e] p-4 text-xs leading-6 text-fd-foreground">
        {step.output}
      </pre>
    </section>
  );
}

function StatusPill({
  label,
  warning = false,
}: {
  label: string;
  warning?: boolean;
}) {
  return (
    <span
      className={cn(
        'rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.14em]',
        warning
          ? 'border-ib-yellow/25 bg-ib-yellow-alpha text-ib-yellow'
          : 'border-ib-brand/25 bg-ib-brand-alpha text-ib-brand',
      )}
    >
      {label}
    </span>
  );
}

function kindLabel(step: QuickstartStep) {
  if (step.kind === 'agent-prompt') return 'Agent prompt';
  if (step.kind === 'shell') return 'Shell command';
  if (step.kind === 'simulated') return 'Simulated';
  return 'Generated code';
}

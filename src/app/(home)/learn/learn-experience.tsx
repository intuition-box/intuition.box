'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  ExternalLink,
  Terminal,
} from 'lucide-react';
import { Button } from '@waveso/ui/button';
import type { LearnModule, LearnNetwork, QuickstartStep } from '@/lib/learn';
import { cn } from '@/lib/cn';

interface LearnExperienceProps {
  modules: readonly LearnModule[];
  steps: readonly QuickstartStep[];
  network: LearnNetwork;
}

export function LearnExperience({
  modules,
  steps,
  network,
}: LearnExperienceProps) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeModule = modules[activeModuleIndex] ?? modules[0];
  const activeStep = steps[activeStepIndex] ?? steps[0];

  const progress = useMemo(
    () => Math.round(((activeStepIndex + 1) / steps.length) * 100),
    [activeStepIndex, steps.length],
  );

  async function copyText(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1600);
  }

  return (
    <>
      <section id="syllabus" className="max-w-5xl mx-auto w-full scroll-mt-24 px-8 py-16">
        <div className="mb-10 grid gap-4 md:grid-cols-[0.82fr_1fr] md:items-end">
          <div>
            <p className="m-0 text-sm font-medium uppercase tracking-[0.22em] text-ib-brand">
              Syllabus
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              A builder path that starts from the basics.
            </h2>
          </div>
          <p className="m-0 text-fd-muted-foreground">
            Each module has one job. The sequence introduces enough protocol context to make the quickstart meaningful without turning the page into a documentation wall.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="rounded-3xl border border-ib-brand-dark bg-linear-to-b from-fd-card to-ib-brand-dark p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-ib-brand">
                Module {activeModule.number}
              </span>
              <span className="rounded-full border border-ib-brand/20 bg-ib-brand-alpha px-3 py-1 text-xs text-ib-brand">
                {activeModule.level} · {activeModule.duration}
              </span>
            </div>
            <h3 className="mt-8 text-3xl font-semibold tracking-tight">
              {activeModule.title}
            </h3>
            <p className="mt-4 leading-7 text-fd-muted-foreground">
              {activeModule.description}
            </p>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="m-0 text-sm font-medium text-fd-foreground">Outcome</p>
              <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                {activeModule.outcome}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {activeModule.concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-fd-muted-foreground"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="divide-y divide-fd-border border-y border-fd-border">
            {modules.map((module, index) => {
              const isActive = index === activeModuleIndex;
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActiveModuleIndex(index)}
                  className={cn(
                    'group grid w-full gap-4 px-0 py-5 text-left transition-colors sm:grid-cols-[3.25rem_1fr_auto]',
                    isActive ? 'text-fd-foreground' : 'text-fd-muted-foreground hover:text-fd-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                      isActive
                        ? 'border-ib-brand bg-ib-brand text-ib-brand-dark'
                        : 'border-fd-border group-hover:border-ib-brand/40',
                    )}
                  >
                    {module.number}
                  </span>
                  <span>
                    <span className="block font-medium">{module.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-fd-muted-foreground">
                      {module.description}
                    </span>
                  </span>
                  <span className="hidden items-center gap-2 text-xs uppercase tracking-[0.18em] text-fd-muted-foreground sm:flex">
                    {module.duration}
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="quickstart" className="max-w-5xl mx-auto w-full scroll-mt-24 px-8 py-16">
        <div className="mb-10 grid gap-4 md:grid-cols-[0.9fr_1fr] md:items-end">
          <div>
            <p className="m-0 text-sm font-medium uppercase tracking-[0.22em] text-ib-brand">
              Interactive quickstart
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Build the first atom + triple path.
            </h2>
          </div>
          <p className="m-0 text-fd-muted-foreground">
            This is a simulated builder flow for the pitch. It shows the commands, files, outputs, and protocol checkpoints without requiring a wallet connection.
          </p>
        </div>

        <div className="mb-6 grid gap-3 rounded-3xl border border-fd-border bg-fd-card/60 p-5 sm:grid-cols-3">
          <NetworkFact label="Network" value={network.name} />
          <NetworkFact label="Chain" value={`${network.chainId} · ${network.symbol}`} />
          <NetworkFact label="MultiVault" value={shortAddress(network.multiVault)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.48fr_1fr]">
          <div className="rounded-3xl border border-fd-border bg-fd-card p-3">
            <div className="px-3 pb-3 pt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-fd-muted">
                <div
                  className="h-full rounded-full bg-ib-brand transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
                {progress}% complete
              </p>
            </div>

            <div className="space-y-1">
              {steps.map((step, index) => {
                const isActive = index === activeStepIndex;
                const isComplete = index < activeStepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStepIndex(index)}
                    className={cn(
                      'group grid w-full grid-cols-[1.75rem_1fr] gap-3 rounded-2xl px-3 py-3 text-left transition-colors',
                      isActive
                        ? 'bg-ib-brand-alpha text-fd-foreground'
                        : 'text-fd-muted-foreground hover:bg-fd-muted/60 hover:text-fd-foreground',
                    )}
                  >
                    <span className="mt-0.5">
                      {isComplete ? (
                        <CheckCircle2 className="size-4 text-ib-brand" />
                      ) : isActive ? (
                        <Check className="size-4 text-ib-brand" />
                      ) : (
                        <Circle className="size-4 text-fd-muted-foreground/50" />
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">
                        {step.number}. {step.title}
                      </span>
                      <span className="mt-1 block text-xs text-fd-muted-foreground">
                        {step.eyebrow}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-fd-border bg-[#0b1013]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <Terminal className="size-4 text-ib-brand" />
                <div>
                  <p className="m-0 text-sm font-medium">{activeStep.title}</p>
                  <p className="m-0 text-xs text-fd-muted-foreground">
                    {activeStep.summary}
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-ib-brand/20 bg-ib-brand-alpha px-3 py-1 text-xs text-ib-brand">
                Simulated
              </span>
            </div>

            <div className="grid gap-0 xl:grid-cols-[0.86fr_1.14fr]">
              <CodePanel
                label="Command"
                value={activeStep.command}
                copied={copiedKey === `${activeStep.id}-command`}
                onCopy={() => copyText(`${activeStep.id}-command`, activeStep.command)}
              />
              <CodePanel
                label={activeStep.file}
                value={activeStep.code}
                copied={copiedKey === `${activeStep.id}-code`}
                onCopy={() => copyText(`${activeStep.id}-code`, activeStep.code)}
              />
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
                <div>
                  <p className="m-0 text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
                    Demo output
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/30 p-4 text-xs leading-6 text-fd-foreground">
                    {activeStep.output}
                  </pre>
                </div>
                <div className="rounded-2xl border border-ib-brand/20 bg-ib-brand-alpha p-4">
                  <p className="m-0 text-xs uppercase tracking-[0.18em] text-ib-brand">
                    Checkpoint
                  </p>
                  <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">
                    {activeStep.checkpoint}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      size="sm"
                      className="bg-ib-brand text-ib-brand-dark hover:bg-ib-brand hover:opacity-70"
                      disabled={activeStepIndex >= steps.length - 1}
                      onClick={() => setActiveStepIndex((index) => Math.min(index + 1, steps.length - 1))}
                    >
                      Next step
                    </Button>
                    <a
                      href={network.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                    >
                      Testnet explorer
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function NetworkFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="m-0 text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-medium text-fd-foreground">{value}</p>
    </div>
  );
}

function CodePanel({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="min-w-0 border-white/10 p-5 xl:border-l xl:first:border-l-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="m-0 text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
          {label}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-fd-muted-foreground transition-colors hover:border-ib-brand/40 hover:text-fd-foreground"
        >
          {copied ? <Check className="size-3 text-ib-brand" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="min-h-64 overflow-x-auto rounded-2xl bg-black/30 p-4 text-xs leading-6 text-fd-foreground">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function shortAddress(value: string) {
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { cn } from '@/lib/cn';
import type { EcosystemProject } from '@/lib/ecosystem';

const PLACEHOLDER_GRADIENTS = [
  'from-ib-brand-dark via-[#13251f] to-[#172f29]',
  'from-ib-yellow-dark via-[#27230c] to-[#3b3010]',
  'from-ib-purple-dark via-[#1f1e36] to-[#29264c]',
  'from-[#10252c] via-[#102d35] to-[#123e47]',
  'from-[#27151f] via-[#351725] to-[#4a1b2f]',
] as const;

interface EcosystemGridProps {
  projects: EcosystemProject[];
}

export function EcosystemGrid({ projects }: EcosystemGridProps) {
  const [query, setQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return projects.filter((project) => {
      const searchableText = [
        project.name,
        project.description ?? '',
        project.builder ?? '',
        getProjectHost(project.website),
        ...(project.tags ?? []),
      ]
        .join(' ')
        .toLocaleLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [projects, query]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xl">
          <Search
            aria-hidden
            className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ecosystem projects"
            aria-label="Search ecosystem projects"
            className={cn(
              'h-12 w-full rounded-xl border border-fd-border bg-fd-card pl-11 pr-10 text-sm text-fd-foreground',
              'placeholder:text-fd-muted-foreground/70 outline-none transition-colors',
              'hover:border-fd-foreground/20 focus:border-ib-brand/50 focus:ring-2 focus:ring-ib-brand/10',
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>
        <p
          className="m-0 shrink-0 text-sm text-fd-muted-foreground"
          aria-live="polite"
        >
          {filteredProjects.length}{' '}
          {filteredProjects.length === 1 ? 'project' : 'projects'}
        </p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-fd-border px-6 py-20 text-center">
          <p className="text-lg font-medium">No projects found</p>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Try another name, domain, or use case.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-5 text-sm font-medium text-ib-brand transition-opacity hover:opacity-70"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: EcosystemProject;
  index: number;
}) {
  const host = getProjectHost(project.website);

  return (
    <Card className="group h-full overflow-hidden pt-0 transition-colors hover:border-fd-foreground/20">
      <div
        className={cn(
          'relative aspect-[16/9] overflow-hidden bg-linear-to-br',
          !project.image &&
            PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length],
        )}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt ?? ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 340px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.12),transparent_40%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none text-5xl font-semibold tracking-tight text-white/85 transition-transform duration-500 group-hover:scale-105">
                {getProjectInitials(project.name)}
              </span>
            </div>
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-fd-card to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
          {host}
        </span>
      </div>

      <CardHeader className="gap-2">
        <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
        {project.builder && (
          <p className="text-xs text-fd-muted-foreground">
            Built by {project.builder}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <p className="m-0 text-sm leading-6 text-fd-muted-foreground">
          {project.description ?? `Explore ${project.name} at ${host}.`}
        </p>
        {project.tags && project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-fd-muted px-2 py-1 text-[11px] text-fd-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-wrap gap-x-4 gap-y-2 bg-transparent pt-1">
        <a
          href={project.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-foreground no-underline transition-colors hover:text-ib-brand"
        >
          Open project
          <ExternalLink aria-hidden className="size-3.5" />
        </a>
        {project.spotlight && (
          <Link
            href={project.spotlight}
            className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground no-underline transition-colors hover:text-ib-brand"
          >
            Builder story
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

function getProjectHost(website: string): string {
  return new URL(website).hostname.replace(/^www\./, '');
}

function getProjectInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);

  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

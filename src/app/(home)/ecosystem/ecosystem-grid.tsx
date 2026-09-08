'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink, Globe2, Search, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { cn } from '@/lib/cn';
import {
  ECOSYSTEM_CATEGORIES,
  type EcosystemCategory,
  type EcosystemProject,
} from '@/lib/ecosystem';

const ALL_CATEGORIES = 'All';
type CategoryFilter = typeof ALL_CATEGORIES | EcosystemCategory;

interface EcosystemGridProps {
  projects: EcosystemProject[];
}

export function EcosystemGrid({ projects }: EcosystemGridProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>(ALL_CATEGORIES);
  const shouldReduceMotion = useReducedMotion();

  const categoryOptions = useMemo<
    Array<{ label: CategoryFilter; count: number }>
  >(
    () => [
      { label: ALL_CATEGORIES, count: projects.length },
      ...ECOSYSTEM_CATEGORIES.map((label) => ({
        label,
        count: projects.filter((project) => project.category === label).length,
      })),
    ],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return projects.filter((project) => {
      if (category !== ALL_CATEGORIES && project.category !== category) {
        return false;
      }

      const searchableText = [
        project.name,
        project.description,
        project.category,
        project.builder ?? '',
        getProjectHost(project.website),
        ...(project.tags ?? []),
      ]
        .join(' ')
        .toLocaleLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [category, projects, query]);

  const hasActiveFilters =
    category !== ALL_CATEGORIES || query.trim().length > 0;

  const clearFilters = () => {
    setQuery('');
    setCategory(ALL_CATEGORIES);
  };

  return (
    <div>
      <div className="mb-10 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            {hasActiveFilters
              ? `${filteredProjects.length} of ${projects.length} projects`
              : `${filteredProjects.length} ${filteredProjects.length === 1 ? 'project' : 'projects'}`}
          </p>
        </div>

        <div>
          <div className="mb-2.5 flex min-h-6 items-center justify-between gap-4">
            <p
              id="ecosystem-category-label"
              className="m-0 text-xs font-medium uppercase tracking-[0.14em] text-fd-muted-foreground"
            >
              Filter by category
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-ib-brand transition-opacity hover:opacity-70"
              >
                Clear filters
              </button>
            )}
          </div>
          <div
            role="group"
            aria-labelledby="ecosystem-category-label"
            className="flex flex-wrap gap-2"
          >
            {categoryOptions.map((option) => {
              const isActive = option.label === category;

              return (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCategory(option.label)}
                  className={cn(
                    'relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-2 text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ib-brand/40',
                    isActive
                      ? 'border-ib-brand/50 text-ib-brand-dark'
                      : 'border-fd-border bg-fd-card text-fd-muted-foreground hover:border-fd-foreground/20 hover:text-fd-foreground',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-ecosystem-category"
                      aria-hidden
                      className="absolute inset-0 -z-10 bg-ib-brand"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 480, damping: 38 }
                      }
                    />
                  )}
                  <span>{option.label}</span>
                  <span
                    className={cn(
                      'text-xs tabular-nums',
                      isActive
                        ? 'text-ib-brand-dark/60'
                        : 'text-fd-muted-foreground/60',
                    )}
                  >
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredProjects.length > 0 ? (
          <motion.div
            key="project-grid"
            layout={!shouldReduceMotion}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  layout={shouldReduceMotion ? false : 'position'}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 12, filter: 'blur(5px)' }
                  }
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.97, filter: 'blur(3px)' }
                  }
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    opacity: {
                      duration: shouldReduceMotion ? 0 : 0.24,
                      delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.32),
                    },
                    y: {
                      duration: shouldReduceMotion ? 0 : 0.32,
                      delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.32),
                      ease: [0.22, 1, 0.36, 1],
                    },
                    filter: {
                      duration: shouldReduceMotion ? 0 : 0.28,
                      delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.32),
                    },
                    scale: { duration: shouldReduceMotion ? 0 : 0.18 },
                    layout: shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 38, mass: 0.7 },
                  }}
                  className="h-full"
                >
                  <ProjectCard
                    project={project}
                    reduceMotion={Boolean(shouldReduceMotion)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="rounded-2xl border border-dashed border-fd-border px-6 py-20 text-center"
          >
            <p className="text-lg font-medium">No projects found</p>
            <p className="mt-2 text-sm text-fd-muted-foreground">
              Try another name, category, domain, or use case.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 text-sm font-medium text-ib-brand transition-opacity hover:opacity-70"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({
  project,
  reduceMotion,
}: {
  project: EcosystemProject;
  reduceMotion: boolean;
}) {
  const host = getProjectHost(project.website);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType === 'touch') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--pointer-x',
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      '--pointer-y',
      `${event.clientY - bounds.top}px`,
    );
  };

  return (
    <Card
      onPointerMove={handlePointerMove}
      className="group relative h-full overflow-hidden transition-all duration-300 motion-reduce:transition-none motion-safe:hover:-translate-y-0.5 hover:border-fd-foreground/20 hover:shadow-[0_18px_50px_-28px_rgba(141,241,201,0.35)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(260px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(141, 241, 201, 0.10), transparent 68%)',
        }}
      />

      <CardHeader className="relative gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ProjectFavicon website={project.website} />
          <div className="min-w-0">
            <CardTitle className="truncate text-lg font-semibold">
              {project.name}
            </CardTitle>
            <p className="mt-1 truncate text-xs text-fd-muted-foreground">
              {host}
            </p>
          </div>
        </div>
        {project.builder && (
          <p className="text-xs text-fd-muted-foreground">
            Built by {project.builder}
          </p>
        )}
      </CardHeader>

      <CardContent className="relative flex-1">
        <p className="m-0 text-sm leading-6 text-fd-muted-foreground">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-md border border-ib-brand/15 bg-ib-brand-alpha px-2 py-1 text-[11px] text-ib-brand">
            {project.category}
          </span>
          {project.tags &&
            project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-fd-muted px-2 py-1 text-[11px] text-fd-muted-foreground"
              >
                {tag}
              </span>
            ))}
        </div>
      </CardContent>

      <CardFooter className="relative flex-wrap gap-x-4 gap-y-2 bg-transparent pt-1">
        <a
          href={project.website}
          target="_blank"
          rel="noopener noreferrer"
          className="group/project-link inline-flex items-center gap-1.5 text-sm font-medium text-fd-foreground no-underline transition-colors hover:text-ib-brand"
        >
          Open project
          <ExternalLink
            aria-hidden
            className="size-3.5 transition-transform duration-200 motion-safe:group-hover/project-link:translate-x-0.5 motion-safe:group-hover/project-link:-translate-y-0.5"
          />
        </a>
        {project.spotlight && (
          <Link
            href={project.spotlight}
            className="group/story-link inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground no-underline transition-colors hover:text-ib-brand"
          >
            Builder story
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 motion-safe:group-hover/story-link:translate-x-0.5"
            />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

function ProjectFavicon({ website }: { website: string }) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const candidates = getFaviconCandidates(website);
    let candidateIndex = 0;

    const loadNextCandidate = () => {
      if (!active) return;

      const candidate = candidates[candidateIndex];
      candidateIndex += 1;

      if (!candidate) {
        setLoadedUrl(null);
        return;
      }

      const favicon = new window.Image();
      favicon.onload = () => {
        if (active) setLoadedUrl(candidate);
      };
      favicon.onerror = loadNextCandidate;
      favicon.src = candidate;
    };

    setLoadedUrl(null);
    loadNextCandidate();

    return () => {
      active = false;
    };
  }, [website]);

  return (
    <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-fd-border bg-fd-muted/70 transition-all duration-300 group-hover:border-ib-brand/20 group-hover:bg-ib-brand-alpha motion-safe:group-hover:-rotate-1 motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none">
      <Globe2 aria-hidden className="size-5 text-fd-muted-foreground" />
      {loadedUrl && (
        <span
          aria-hidden
          className="absolute inset-0 bg-fd-muted bg-center bg-no-repeat transition-transform duration-300 motion-safe:group-hover:scale-110 motion-reduce:transition-none"
          style={{
            backgroundImage: `url(${JSON.stringify(loadedUrl)})`,
            backgroundSize: '28px 28px',
          }}
        />
      )}
    </div>
  );
}

function getProjectHost(website: string): string {
  return new URL(website).hostname.replace(/^www\./, '');
}

function getFaviconCandidates(website: string): string[] {
  const googleFavicon = new URL('https://www.google.com/s2/favicons');
  googleFavicon.searchParams.set('domain_url', website);
  googleFavicon.searchParams.set('sz', '128');

  return [
    new URL('/icon.svg', website).toString(),
    new URL('/favicon.ico', website).toString(),
    googleFavicon.toString(),
  ];
}

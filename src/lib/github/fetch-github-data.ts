import 'server-only';

import { unstable_cache } from 'next/cache';
import type {
  GitHubData,
  OrgCounters,
  ActivityData,
  Contributor,
  ProjectActivity,
  CommitItem,
} from './types';

const GH_API = 'https://api.github.com';

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: 'application/vnd.github+json' };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

// ── GitHub API response types ────────────────────────────────────────

interface GHRepo {
  name: string;
  full_name: string;
  private: boolean;
  archived: boolean;
  html_url: string;
  pushed_at: string;
  updated_at: string;
}

interface GHEvent {
  type: string;
  actor: { login: string; avatar_url: string };
  repo: { name: string };
  payload: {
    size?: number;
    commits?: Array<{ sha: string; message: string }>;
  };
  created_at: string;
}

interface GHCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  author: { login: string } | null;
}

// ── Fetchers ─────────────────────────────────────────────────────────

async function fetchOrgRepos(org: string): Promise<GHRepo[]> {
  const repos = await fetchJSON<GHRepo[]>(
    `${GH_API}/orgs/${org}/repos?per_page=100&type=public&sort=pushed`,
  );
  return repos.filter((r) => !r.private && !r.archived);
}

async function fetchOrgEvents(org: string): Promise<GHEvent[]> {
  return fetchJSON<GHEvent[]>(`${GH_API}/orgs/${org}/events?per_page=100`);
}

async function fetchRepoCommits(
  org: string,
  repo: string,
  limit = 3,
): Promise<GHCommit[]> {
  return fetchJSON<GHCommit[]>(
    `${GH_API}/repos/${org}/${repo}/commits?per_page=${limit}`,
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

function normalizeLogin(login: string): string {
  return login.toLowerCase();
}

function emptyData(): GitHubData {
  return {
    counters: { projects: 0, contributors: 0, commits: 0, fetchedAt: new Date().toISOString() },
    activity: { contributors: [], projects: [], commits: [], contributorProjects: {} },
  };
}

// ── Main (uncached) ──────────────────────────────────────────────────

async function fetchGitHubDataUncached(
  org: string,
  repoLimit: number,
  perRepoCommits: number,
): Promise<GitHubData> {
  const [reposResult, eventsResult] = await Promise.allSettled([
    fetchOrgRepos(org),
    fetchOrgEvents(org),
  ]);

  const repoList = reposResult.status === 'fulfilled' ? reposResult.value : [];
  const events = eventsResult.status === 'fulfilled' ? eventsResult.value : [];

  // ── Counters ──

  const uniqueLogins = new Set<string>();
  let totalCommits = 0;

  for (const ev of events) {
    const login = ev.actor?.login;
    if (login) uniqueLogins.add(normalizeLogin(login));
  }

  const pushEvents = events.filter((e) => e.type === 'PushEvent');

  for (const ev of pushEvents) {
    if (typeof ev.payload?.size === 'number') {
      totalCommits += ev.payload.size;
    } else if (Array.isArray(ev.payload?.commits)) {
      totalCommits += ev.payload.commits.length;
    } else {
      totalCommits += 1;
    }
  }

  const counters: OrgCounters = {
    projects: repoList.length,
    contributors: uniqueLogins.size,
    commits: totalCommits,
    fetchedAt: new Date().toISOString(),
  };

  // ── Activity ──

  const contribByLast = new Map<string, Contributor>();
  const contribToProjects = new Map<string, Set<string>>();
  const projectByLast = new Map<string, Date>();

  for (const ev of pushEvents) {
    const login = ev.actor?.login;
    const avatar = ev.actor?.avatar_url;
    const when = ev.created_at ? new Date(ev.created_at) : null;
    const repoFull = ev.repo?.name;
    if (!login || !when || Number.isNaN(when.getTime())) continue;

    const prev = contribByLast.get(login);
    if (!prev || new Date(prev.date) < when) {
      contribByLast.set(login, {
        login,
        date: when.toISOString(),
        avatarUrl: avatar || `https://github.com/${login}.png?size=80`,
      });
    }

    if (repoFull) {
      const repoName = repoFull.split('/')[1] ?? repoFull;
      const pv = projectByLast.get(repoFull);
      if (!pv || pv < when) projectByLast.set(repoFull, when);

      const set = contribToProjects.get(login) ?? new Set<string>();
      set.add(repoName);
      contribToProjects.set(login, set);
    }
  }

  const contributors: Contributor[] = Array.from(contribByLast.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const projects: ProjectActivity[] = Array.from(projectByLast.entries())
    .map(([fullName, date]) => ({
      fullName,
      name: fullName.split('/')[1] ?? fullName,
      date: date.toISOString(),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, repoLimit);

  // Fetch recent commits per top repo (parallel)
  const topRepos = repoList.slice(0, Math.min(4, repoLimit)).map((r) => r.name);
  const commitResults = await Promise.allSettled(
    topRepos.map((repo) => fetchRepoCommits(org, repo, perRepoCommits)),
  );

  const recentCommits: CommitItem[] = [];
  for (let idx = 0; idx < commitResults.length; idx++) {
    const result = commitResults[idx];
    if (result.status !== 'fulfilled') continue;
    const repo = topRepos[idx];
    for (const c of result.value) {
      const dateStr = c.commit?.author?.date;
      if (!dateStr) continue;
      recentCommits.push({
        sha: c.sha,
        repo,
        message: c.commit.message,
        date: dateStr,
        url: c.html_url,
        author: c.author?.login ?? c.commit.author.name ?? 'unknown',
      });
    }
  }

  const seenSha = new Set<string>();
  const commits: CommitItem[] = recentCommits
    .filter((c) => {
      if (seenSha.has(c.sha)) return false;
      seenSha.add(c.sha);
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const contributorProjects: Record<string, string[]> = Object.fromEntries(
    Array.from(contribToProjects.entries()).map(([k, v]) => [k, Array.from(v)]),
  );

  const activity: ActivityData = {
    contributors,
    projects,
    commits,
    contributorProjects,
  };

  return { counters, activity };
}

// ── Cached export ────────────────────────────────────────────────────
// Single cache entry for the entire function — all fetches revalidate
// together so data is never mixed-age across repos/events/commits.

export async function fetchGitHubData(
  org: string,
  options: { repoLimit?: number; perRepoCommits?: number } = {},
): Promise<GitHubData> {
  const { repoLimit = 8, perRepoCommits = 2 } = options;

  const cachedFetch = unstable_cache(
    () => fetchGitHubDataUncached(org, repoLimit, perRepoCommits),
    [`github-data-${org}`],
    { revalidate: 3600 },
  );

  try {
    return await cachedFetch();
  } catch (error) {
    console.error('[github-stats] Failed to fetch GitHub data:', error);
    return emptyData();
  }
}

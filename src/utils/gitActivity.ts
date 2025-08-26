type OrgRepo = { name: string; pushed_at?: string; private?: boolean };
type GitHubEvent = {
  type: string;
  actor?: { login?: string; avatar_url?: string };
  repo?: { name?: string };
  created_at?: string;
};
type CommitAPI = {
  sha: string;
  html_url: string;
  commit: { author?: { name?: string; date?: string }; message?: string };
  author?: { login?: string; avatar_url?: string };
};

export type RecentContrib = { login: string; date: Date; avatarUrl?: string };
export type RecentProject = { fullName: string; name: string; date: Date };
export type RecentCommit = {
  sha: string;
  repo: string;
  message: string;
  date: Date;
  url: string;
  author: string;
};

const avatarOf = (login: string, hinted?: string) =>
  hinted && hinted.startsWith("http")
    ? hinted
    : `https://github.com/${login}.png?size=80`;

export type HybridResult = {
  mode: "api-events" | "api-repos" | "local-json";
  contributors: RecentContrib[];
  projects: RecentProject[];
  commitDates: Date[];
  commits?: RecentCommit[];
  contributorProjects: Record<string, string[]>;
  error?: string | null;
};

const GH = "https://api.github.com";
const headers: Record<string, string> = { Accept: "application/vnd.github+json" };

const uniq = <T, K>(arr: T[], key: (t: T) => K) => {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const x of arr) {
    const k = key(x);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(x);
    }
  }
  return out;
};

const byDateDesc =
  <T>(sel: (t: T) => Date | null | undefined) =>
  (a: T, b: T) => {
    const da = sel(a)?.getTime() ?? 0;
    const db = sel(b)?.getTime() ?? 0;
    return db - da;
  };

function isRateLimited(res: Response) {
  if (res.status === 403 || res.status === 429) return true;
  const remain = res.headers.get("X-RateLimit-Remaining");
  if (remain !== null && Number(remain) <= 0) return true;
  return false;
}

async function fetchOrgEvents(org: string) {
  const res = await fetch(`${GH}/orgs/${org}/events?per_page=100`, { headers });
  if (!res.ok) throw new Error("org events");
  const data: GitHubEvent[] = await res.json();
  return data;
}

async function fetchOrgRepos(org: string, perPage = 30) {
  const res = await fetch(`${GH}/orgs/${org}/repos?per_page=${perPage}&sort=pushed`, { headers });
  if (!res.ok) throw new Error("org repos");
  const data: OrgRepo[] = await res.json();
  return data.filter((r) => !r.private);
}

async function fetchRepoHeadCommit(org: string, repo: string) {
  const res = await fetch(`${GH}/repos/${org}/${repo}/commits?per_page=1`, { headers });
  if (!res.ok) throw new Error("commits head");
  const data: CommitAPI[] = await res.json();
  return data[0];
}

async function fetchRepoRecentCommits(org: string, repo: string, limit = 3) {
  const res = await fetch(`${GH}/repos/${org}/${repo}/commits?per_page=${limit}`, { headers });
  if (!res.ok) throw new Error("commits recent");
  const data: CommitAPI[] = await res.json();
  return data;
}

async function recentFromOrgEvents(org: string, topRepos = 6): Promise<HybridResult> {
  const events = await fetchOrgEvents(org);
  const pushes = events.filter((e) => e.type === "PushEvent");

  const contribByLast = new Map<string, { date: Date; avatar?: string }>();
  const projectByLast = new Map<string, Date>();
  const contribToProjects = new Map<string, Set<string>>();
  const allDates: Date[] = [];

  for (const ev of pushes) {
    const login = ev.actor?.login;
    const avatar = ev.actor?.avatar_url;
    const when = ev.created_at ? new Date(ev.created_at) : null;
    const repoFull = ev.repo?.name;
    if (!login || !when || Number.isNaN(when.getTime())) continue;

    const prev = contribByLast.get(login);
    if (!prev || prev.date < when) contribByLast.set(login, { date: when, avatar });

    if (repoFull) {
      const pv = projectByLast.get(repoFull);
      if (!pv || pv < when) projectByLast.set(repoFull, when);

      if (!contribToProjects.has(login)) contribToProjects.set(login, new Set());
      contribToProjects.get(login)!.add(repoFull.split("/")[1] || repoFull);
    }

    allDates.push(when);
  }

  const contributors = Array.from(contribByLast.entries())
    .map(([login, { date, avatar }]) => ({
      login,
      date,
      avatarUrl: avatarOf(login, avatar),
    }))
    .sort(byDateDesc((x) => x.date))
    .slice(0, 4);

  const projects = Array.from(projectByLast.entries())
    .map(([fullName, date]) => ({ fullName, name: fullName.split("/")[1] || fullName, date }))
    .sort(byDateDesc((x) => x.date))
    .slice(0, topRepos);

  const commitDates = allDates.sort((a, b) => b.getTime() - a.getTime());

  return {
    mode: "api-events",
    contributors,
    projects,
    commitDates,
    contributorProjects: Object.fromEntries(
      Array.from(contribToProjects.entries()).map(([k, v]) => [k, Array.from(v)])
    ),
  };
}

async function recentFromRepos(
  org: string,
  repoLimit = 8,
  perRepoCommitList = 0
): Promise<HybridResult> {
  const repos = await fetchOrgRepos(org, repoLimit);
  const selected = repos.slice(0, repoLimit).map((r) => r.name);
  const contribToProjects = new Map<string, Set<string>>();

  const headResults = await Promise.allSettled(selected.map((name) => fetchRepoHeadCommit(org, name)));

  const projects: RecentProject[] = [];
  const contributorsRaw: RecentContrib[] = [];
  const commitsRaw: RecentCommit[] = [];

  headResults.forEach((r, i) => {
    if (r.status !== "fulfilled" || !r.value) return;
    const repo = selected[i];
    const c = r.value;
    const dateStr = c.commit?.author?.date;
    const date = dateStr ? new Date(dateStr) : null;
    if (!date) return;

    projects.push({ fullName: `${org}/${repo}`, name: repo, date });

    const author = c.author?.login || c.commit?.author?.name || "unknown";
    const avatar = c.author?.avatar_url;
    contributorsRaw.push({ login: author, date, avatarUrl: avatarOf(author, avatar) });

    if (!contribToProjects.has(author)) contribToProjects.set(author, new Set());
    contribToProjects.get(author)!.add(repo);

    commitsRaw.push({ sha: c.sha, repo, message: c.commit?.message || "", date, url: c.html_url, author });
  });

  if (perRepoCommitList > 0) {
    const more = await Promise.allSettled(selected.slice(0, 4).map((repo) => fetchRepoRecentCommits(org, repo, perRepoCommitList)));
    more.forEach((r, idx) => {
      if (r.status !== "fulfilled") return;
      const repo = selected[idx];
      r.value.forEach((c) => {
        const dateStr = c.commit?.author?.date;
        const date = dateStr ? new Date(dateStr) : null;
        if (!date) return;
        commitsRaw.push({
          sha: c.sha,
          repo,
          message: c.commit?.message || "",
          date,
          url: c.html_url,
          author: c.author?.login || c.commit?.author?.name || "unknown",
        });
      });
    });
  }

  const contributors = uniq(contributorsRaw.sort(byDateDesc((x) => x.date)), (x) => x.login).slice(0, 4);
  const projectsSorted = projects.sort(byDateDesc((x) => x.date)).slice(0, repoLimit);
  const commits = uniq(commitsRaw.sort(byDateDesc((x) => x.date)), (x) => x.sha).slice(0, 10);
  const commitDates = commits.map((c) => c.date).sort((a, b) => b.getTime() - a.getTime());

  return {
    mode: "api-repos",
    contributors,
    projects: projectsSorted,
    commitDates,
    commits,
    contributorProjects: Object.fromEntries(
      Array.from(contribToProjects.entries()).map(([k, v]) => [k, Array.from(v)])
    ),
  };
}

import contributorsJson from "../static/data/contributors.json";
import projectMappingJson from "../static/data/project-repo-mapping.json";

function fromLocalJson(): HybridResult {
  const contribData = contributorsJson as Record<string, { projects: Record<string, string[]> }>;
  const byProject = new Map<string, { last: Date | null; contributors: Set<string> }>();
  const lastByContributor = new Map<string, Date | null>();
  const contribToProjects = new Map<string, Set<string>>();
  const allDates: Date[] = [];

  for (const [name, info] of Object.entries(contribData)) {
    let lastC: Date | null = null;
    for (const [projectName, dates] of Object.entries(info.projects || {})) {
      if (!Array.isArray(dates)) continue;

      if (!contribToProjects.has(name)) contribToProjects.set(name, new Set());
      contribToProjects.get(name)!.add(projectName);

      for (const d of dates) {
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) continue;
        allDates.push(dt);
        lastC = !lastC || lastC < dt ? dt : lastC;

        const cur = byProject.get(projectName) || { last: null, contributors: new Set<string>() };
        cur.last = !cur.last || cur.last < dt ? dt : cur.last;
        cur.contributors.add(name);
        byProject.set(projectName, cur);
      }
    }
    lastByContributor.set(name, lastC);
  }

  const contributors = Array.from(lastByContributor.entries())
    .filter(([, d]) => !!d)
    .map(([login, date]) => ({
      login,
      date: date!,
      avatarUrl: avatarOf(login),
    }))
    .sort(byDateDesc((x) => x.date))
    .slice(0, 4);

  const projects = Array.from(byProject.entries())
    .filter(([, v]) => !!v.last)
    .map(([projName, v]) => ({ fullName: projName, name: projName, date: v.last! }))
    .sort(byDateDesc((x) => x.date))
    .slice(0, 6);

  const commitDates = allDates.sort((a, b) => b.getTime() - a.getTime());

  return {
    mode: "local-json",
    contributors,
    projects,
    commitDates,
    contributorProjects: Object.fromEntries(
      Array.from(contribToProjects.entries()).map(([k, v]) => [k, Array.from(v)])
    ),
  };
}

export async function fetchHybridActivity(
  org: string,
  options?: { repoLimit?: number; perRepoCommitList?: number }
): Promise<HybridResult> {
  const repoLimit = options?.repoLimit ?? 8;
  const perRepoCommitList = options?.perRepoCommitList ?? 0;

  if (perRepoCommitList > 0) {
    try {
      return await recentFromRepos(org, repoLimit, perRepoCommitList);
    } catch {
      try {
        return await recentFromOrgEvents(org, repoLimit);
      } catch {
        return fromLocalJson();
      }
    }
  }

  try {
    return await recentFromOrgEvents(org, repoLimit);
  } catch {
    try {
      return await recentFromRepos(org, repoLimit, perRepoCommitList);
    } catch {
      return fromLocalJson();
    }
  }
}

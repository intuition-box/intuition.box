/**
 * Docusaurus plugin that fetches GitHub org data at build time.
 *
 * Exposes two datasets via globalData:
 *   - counters: { projects, contributors, commits, fetchedAt }
 *   - activity: { contributors, projects, commits, contributorProjects }
 *
 * Zero client-side API calls. Data refreshes on every build/start.
 */

const GH_API = 'https://api.github.com';

function getHeaders() {
  const headers = { Accept: 'application/vnd.github+json' };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// ── Helpers ──────────────────────────────────────────────────────────

async function fetchJSON(url) {
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}

// ── Repos ────────────────────────────────────────────────────────────

async function fetchOrgRepos(org) {
  const repos = await fetchJSON(
    `${GH_API}/orgs/${org}/repos?per_page=100&type=public&sort=pushed`,
  );
  return repos.filter((r) => !r.private && !r.archived);
}

// ── Events → contributors, commits, project activity ─────────────────

async function fetchOrgEvents(org) {
  return fetchJSON(`${GH_API}/orgs/${org}/events?per_page=100`);
}

// ── Recent commits for a single repo ─────────────────────────────────

async function fetchRepoCommits(org, repo, limit = 3) {
  return fetchJSON(
    `${GH_API}/repos/${org}/${repo}/commits?per_page=${limit}`,
  );
}

// ── Main data builder ────────────────────────────────────────────────

async function fetchOrgData(org, { repoLimit = 8, perRepoCommits = 2 } = {}) {
  let repoList = [];
  let events = [];

  // Fetch repos and events in parallel
  const [reposResult, eventsResult] = await Promise.allSettled([
    fetchOrgRepos(org),
    fetchOrgEvents(org),
  ]);

  if (reposResult.status === 'fulfilled') repoList = reposResult.value;
  if (eventsResult.status === 'fulfilled') events = eventsResult.value;

  // ── Counters ──

  const pushEvents = events.filter((e) => e.type === 'PushEvent');
  const uniqueLogins = new Set();
  let totalCommits = 0;

  for (const ev of events) {
    const login = ev.actor?.login?.toLowerCase();
    if (login) uniqueLogins.add(login);
  }

  for (const ev of pushEvents) {
    if (typeof ev.payload?.size === 'number') {
      totalCommits += ev.payload.size;
    } else if (Array.isArray(ev.payload?.commits)) {
      totalCommits += ev.payload.commits.length;
    } else {
      totalCommits += 1;
    }
  }

  const counters = {
    projects: repoList.length,
    contributors: uniqueLogins.size,
    commits: totalCommits,
    fetchedAt: new Date().toISOString(),
  };

  // ── Activity (for Galaxy) ──

  // Contributors with last activity date
  const contribByLast = new Map();
  const contribToProjects = new Map();
  const projectByLast = new Map();

  for (const ev of pushEvents) {
    const login = ev.actor?.login;
    const avatar = ev.actor?.avatar_url;
    const when = ev.created_at ? new Date(ev.created_at) : null;
    const repoFull = ev.repo?.name;
    if (!login || !when || Number.isNaN(when.getTime())) continue;

    const prev = contribByLast.get(login);
    if (!prev || prev.date < when) {
      contribByLast.set(login, { login, date: when.toISOString(), avatarUrl: avatar || `https://github.com/${login}.png?size=80` });
    }

    if (repoFull) {
      const repoName = repoFull.split('/')[1] || repoFull;
      const pv = projectByLast.get(repoFull);
      if (!pv || pv < when) projectByLast.set(repoFull, when);

      if (!contribToProjects.has(login)) contribToProjects.set(login, new Set());
      contribToProjects.get(login).add(repoName);
    }
  }

  const contributors = Array.from(contribByLast.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const projects = Array.from(projectByLast.entries())
    .map(([fullName, date]) => ({
      fullName,
      name: fullName.split('/')[1] || fullName,
      date: date.toISOString(),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, repoLimit);

  // Fetch recent commits per top repo (in parallel)
  const topRepos = repoList.slice(0, Math.min(4, repoLimit)).map((r) => r.name);
  const commitResults = await Promise.allSettled(
    topRepos.map((repo) => fetchRepoCommits(org, repo, perRepoCommits)),
  );

  const recentCommits = [];
  commitResults.forEach((result, idx) => {
    if (result.status !== 'fulfilled') return;
    const repo = topRepos[idx];
    for (const c of result.value) {
      const dateStr = c.commit?.author?.date;
      if (!dateStr) continue;
      recentCommits.push({
        sha: c.sha,
        repo,
        message: c.commit?.message || '',
        date: dateStr,
        url: c.html_url,
        author: c.author?.login || c.commit?.author?.name || 'unknown',
      });
    }
  });

  // Dedupe by sha, sort by date desc
  const seenSha = new Set();
  const commits = recentCommits
    .filter((c) => {
      if (seenSha.has(c.sha)) return false;
      seenSha.add(c.sha);
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const contributorProjects = Object.fromEntries(
    Array.from(contribToProjects.entries()).map(([k, v]) => [k, Array.from(v)]),
  );

  const activity = {
    contributors,
    projects,
    commits,
    contributorProjects,
  };

  return { counters, activity };
}

// ── Plugin ───────────────────────────────────────────────────────────

module.exports = function pluginGitHubStats(_context, options) {
  const org = options?.org ?? 'intuition-box';

  return {
    name: 'github-stats',

    async loadContent() {
      try {
        return await fetchOrgData(org);
      } catch {
        // If GitHub is completely down, return empty data
        return {
          counters: { projects: 0, contributors: 0, commits: 0, fetchedAt: new Date().toISOString() },
          activity: { contributors: [], projects: [], commits: [], contributorProjects: {} },
        };
      }
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};

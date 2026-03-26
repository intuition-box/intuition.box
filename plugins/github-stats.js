/**
 * Docusaurus plugin that fetches GitHub org stats at build time.
 * Exposes the data via globalData so components can read it without
 * making client-side API calls.
 */

const GH_API = 'https://api.github.com';
const HEADERS = { Accept: 'application/vnd.github+json' };

async function fetchOrgStats(org) {
  let projects = 0;
  let contributors = 0;
  let commits = 0;

  // 1) Count public repos
  try {
    const res = await fetch(
      `${GH_API}/orgs/${org}/repos?per_page=100&type=public&sort=pushed`,
      { headers: HEADERS },
    );
    if (res.ok) {
      const repos = await res.json();
      projects = repos.filter((r) => !r.private && !r.archived).length;
    }
  } catch {
    // Swallow — falls back to 0
  }

  // 2) Contributors + commits from org events
  try {
    const res = await fetch(
      `${GH_API}/orgs/${org}/events?per_page=100`,
      { headers: HEADERS },
    );
    if (res.ok) {
      const events = await res.json();
      const logins = new Set();

      for (const ev of events) {
        const login = ev.actor?.login?.toLowerCase();
        if (login) logins.add(login);

        if (ev.type === 'PushEvent') {
          if (typeof ev.payload?.size === 'number') {
            commits += ev.payload.size;
          } else if (Array.isArray(ev.payload?.commits)) {
            commits += ev.payload.commits.length;
          } else {
            commits += 1;
          }
        }
      }
      contributors = logins.size;
    }
  } catch {
    // Swallow
  }

  return {
    projects,
    contributors,
    commits,
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = function pluginGitHubStats(_context, options) {
  const org = options?.org ?? 'intuition-box';

  return {
    name: 'github-stats',

    async loadContent() {
      return fetchOrgStats(org);
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};

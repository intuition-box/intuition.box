export interface OrgCounters {
  projects: number;
  contributors: number;
  commits: number;
  fetchedAt: string;
}

export interface Contributor {
  login: string;
  date: string;
  avatarUrl: string;
}

export interface ProjectActivity {
  fullName: string;
  name: string;
  date: string;
}

export interface CommitItem {
  sha: string;
  repo: string;
  message: string;
  date: string;
  url: string;
  author: string;
}

export interface ActivityData {
  contributors: Contributor[];
  projects: ProjectActivity[];
  commits: CommitItem[];
  contributorProjects: Record<string, string[]>;
}

export interface GitHubData {
  counters: OrgCounters;
  activity: ActivityData;
}

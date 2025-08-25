export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repositories: string[]; // Array of repo names
}

export interface RepoAssignment {
  projectId: string;
  repoName: string;
}

export interface AppState {
  repositories: GitHubRepo[];
  projects: Project[];
  assignments: RepoAssignment[];
  loading: boolean;
  error: string | null;
}

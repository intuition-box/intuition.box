/** Client-facing display types for GitHub components */

export interface ContributorDisplay {
  id: string;
  summary: string;
  projects: Array<{ id: string; name: string; url: string; color: string }>;
  avatarUrl: string;
  profileUrl: string;
}

export interface ProjectDisplay {
  id: string;
  title: string;
  color: string;
  date: string;
  url: string;
  participants: Array<{ name: string; color: string; avatarUrl?: string }>;
}

export interface CommitDisplay {
  id: string;
  name: string;
  url: string;
  color: string;
  date: string;
}

export interface OrbitItem {
  id: string;
  type: 'commit' | 'project';
  label: string;
  url: string;
  color: string;
  date: string;
}

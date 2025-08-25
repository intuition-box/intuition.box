export interface Contributor {
  id: string;
  name: string;
  github: string;
  discord: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  githubUrl?: string;
}

export interface Week {
  id: string; // ISO date for Monday (e.g. "2024-11-04")
  startDate: Date;
  endDate: Date;
  label: string; // "Mon N → Sun N"
  monthLabel: string; // "November 2024"
}

export interface WeekGroup {
  monthLabel: string;
  weeks: Week[];
}

export interface ProjectAssignment {
  [weekId: string]: boolean; // true if assigned to this week
}

export interface ContributorAssignment {
  projects: {
    [projectName: string]: string[]; // array of week IDs
  };
}

export interface Assignments {
  [githubUsername: string]: ContributorAssignment;
}

export interface AppState {
  contributors: Contributor[];
  projects: Project[];
  weeks: Week[];
  weekGroups: WeekGroup[];
  assignments: Assignments;
}

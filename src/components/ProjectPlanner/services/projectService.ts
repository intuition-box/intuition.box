import { Project, Assignments } from '../types';

export interface ProjectMappingData {
  projects: {
    id: string;
    name: string;
    description: string;
    repositories: string[];
  }[];
  lastUpdated?: string;
}

export interface ContributorData {
  [contributorId: string]: {
    projects: {
      [projectName: string]: string[]; // Array of week dates
    };
  };
}

export const loadProjectsFromJson = async (): Promise<Project[]> => {
  try {
    const projectResponse = await fetch('/data/project-repo-mapping.json');
    if (!projectResponse.ok) {
      throw new Error(`Failed to load projects: ${projectResponse.status}`);
    }
    const projectData: ProjectMappingData = await projectResponse.json();

    // Load contributor assignments
    try {
      const contributorResponse = await fetch('/data/contributors.json');
      if (!contributorResponse.ok) {
        // No contributor data — continue with empty
      }
    } catch {
      // Swallow — contributor data is optional
    }

    const projects: Project[] = projectData.projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description
    }));

    return projects;
  } catch {
    // Fallback to static data
    const { projects: staticProjects } = await import('../data');
    return staticProjects;
  }
};

export const loadContributorAssignments = async (): Promise<ContributorData> => {
  try {
    const response = await fetch('/data/contributors.json');

    if (!response.ok) {
      return {};
    }

    const data: ContributorData = await response.json();
    return data;
  } catch {
    return {};
  }
};

export const convertContributorDataToAssignments = (contributorData: ContributorData): Assignments => {
  const assignments: Assignments = {};

  Object.entries(contributorData).forEach(([contributorId, contributorInfo]) => {
    if (!assignments[contributorId]) {
      assignments[contributorId] = { projects: {} };
    }

    Object.entries(contributorInfo.projects).forEach(([projectName, weekDates]) => {
      const weekArray = Array.isArray(weekDates) ? weekDates : [];
      assignments[contributorId].projects[projectName] = weekArray;
    });
  });

  return assignments;
};

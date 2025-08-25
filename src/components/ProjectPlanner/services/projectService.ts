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
    console.log('🔄 Loading projects from project-repo-mapping.json...');
    
    // Load project definitions
    const projectResponse = await fetch('/data/project-repo-mapping.json');
    if (!projectResponse.ok) {
      throw new Error(`Failed to load projects: ${projectResponse.status}`);
    }
    const projectData: ProjectMappingData = await projectResponse.json();
    
    console.log(`✅ Loaded ${projectData.projects.length} projects from repo mapping`);
    
    // Load contributor assignments
    console.log('🔄 Loading contributor assignments from contributors.json...');
    let contributorData: ContributorData = {};
    
    try {
      const contributorResponse = await fetch('/data/contributors.json');
      if (contributorResponse.ok) {
        contributorData = await contributorResponse.json();
        console.log(`✅ Loaded contributor data for ${Object.keys(contributorData).length} contributors`);
        console.log('Contributors with assignments:', Object.keys(contributorData));
      } else {
        console.log('⚠️ No contributor data found, starting with empty assignments');
      }
    } catch (contributorError) {
      console.log('⚠️ Could not load contributor data:', contributorError);
    }
    
    // Convert the repo mapping format to ProjectPlanner format
    const projects: Project[] = projectData.projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description
    }));
    
    console.log('📊 Final project list:', projects.map(p => p.name));
    
    return projects;
  } catch (error) {
    console.error('❌ Error loading projects from JSON:', error);
    
    // Fallback to static data
    console.log('🔄 Falling back to static project data...');
    const { projects: staticProjects } = await import('../data');
    return staticProjects;
  }
};

export const loadContributorAssignments = async (): Promise<ContributorData> => {
  try {
    console.log('🔄 Loading contributor assignments...');
    const response = await fetch('/data/contributors.json');
    
    if (!response.ok) {
      console.log('⚠️ No contributor assignments found');
      return {};
    }
    
    const data: ContributorData = await response.json();
    console.log(`✅ Loaded assignments for ${Object.keys(data).length} contributors`);
    
    return data;
  } catch (error) {
    console.error('❌ Error loading contributor assignments:', error);
    return {};
  }
};

export const convertContributorDataToAssignments = (contributorData: ContributorData): Assignments => {
  console.log('🔄 Converting contributor data to assignments format...');
  const assignments: Assignments = {};
  
  Object.entries(contributorData).forEach(([contributorId, contributorInfo]) => {
    console.log(`Processing contributor: ${contributorId}`);
    
    // Initialize contributor if not exists
    if (!assignments[contributorId]) {
      assignments[contributorId] = { projects: {} };
    }
    
    // Process each project for this contributor
    Object.entries(contributorInfo.projects).forEach(([projectName, weekDates]) => {
      console.log(`  Project: ${projectName}, Weeks: ${weekDates?.length || 0}`);
      
      // Ensure weekDates is an array and add it directly (not nested in weeks object)
      const weekArray = Array.isArray(weekDates) ? weekDates : [];
      assignments[contributorId].projects[projectName] = weekArray;
    });
  });
  
  console.log(`✅ Converted assignments for ${Object.keys(assignments).length} contributors`);
  console.log('Final assignments structure:', assignments);
  
  return assignments;
};

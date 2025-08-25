import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { DragOverlay } from '@dnd-kit/core';
import { GitHubService } from './services/githubService';
import { RepoCard } from './RepoCard';
import { ProjectCard } from './ProjectCard';
import { AppState, GitHubRepo, Project } from './types';
import styles from './RepoManager.module.css';

// Sample projects - you can modify these or load from a file
const sampleProjects: Project[] = [
  {
    id: 'graph',
    name: 'Graph',
    description: 'Graph API implementation',
    repositories: []
  },
  {
    id: 'api-mock',
    name: 'API Mock',
    description: 'Mock API for development',
    repositories: []
  },
  {
    id: 'ia-assistant',
    name: 'IA Assistant',
    description: 'AI-powered assistant',
    repositories: []
  },
  {
    id: 'extension',
    name: 'Extension',
    description: 'Browser extension',
    repositories: []
  },
  {
    id: 'plebs',
    name: 'Plebs',
    description: 'Personality insights platform',
    repositories: []
  },
  {
    id: 'sofia',
    name: 'Sofia',
    description: 'Sofia platform',
    repositories: []
  },
  {
    id: 'build-proof',
    name: 'BuildProof',
    description: 'Build verification system',
    repositories: []
  },
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Workflow automation',
    repositories: []
  },
  {
    id: 'banner',
    name: 'Banner',
    description: 'Banner management system',
    repositories: []
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Card management system',
    repositories: []
  },
  {
    id: 'dice',
    name: 'Dice',
    description: 'Dice application',
    repositories: []
  },
  {
    id: 'flyer',
    name: 'Flyer',
    description: 'Flyer management system',
    repositories: []
  },
  {
    id: 'intudex',
    name: 'Intudex',
    description: 'DEX and Staking Platform for INTUIT tokens on Intuition blockchain',
    repositories: []
  },
  {
    id: 'intuition-box',
    name: 'Intuition Box',
    description: 'Main intuition.box platform',
    repositories: []
  },
  {
    id: 'intuitpark',
    name: 'Intuitpark',
    description: 'Intuitpark platform',
    repositories: []
  },
  {
    id: 'km',
    name: 'KM',
    description: 'Knowledge management platform for 0xIntuition',
    repositories: []
  },
  {
    id: 'nft',
    name: 'NFT',
    description: 'NFT management system',
    repositories: []
  },
  {
    id: 'orbit-of-nonsense',
    name: 'Orbit of Nonsense',
    description: 'Orbit of Nonsense platform',
    repositories: []
  },
  {
    id: 'pfp',
    name: 'PFP',
    description: 'Profile picture management',
    repositories: []
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Get a Pulse for the Ethereum Application roadmap',
    repositories: []
  },
  {
    id: 'pulse-demo-ux',
    name: 'Pulse Demo UX',
    description: 'Pulse demo user experience',
    repositories: []
  },
  {
    id: 'quiz',
    name: 'Quiz',
    description: 'Quiz application',
    repositories: []
  },
  {
    id: 'values',
    name: 'Values',
    description: 'A blueprint to let the community of any organization define its values',
    repositories: []
  }
];


export const RepoManager: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    repositories: [],
    projects: sampleProjects,
    assignments: [],
    loading: true,
    error: null
  });

  const [activeItem, setActiveItem] = useState<{ type: string; data: any } | null>(null);
  const [repoSearchTerm, setRepoSearchTerm] = useState('');
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isCreateProjectMode, setIsCreateProjectMode] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        loadRepositories(),
        loadProjectRepoMappings()
      ]);
    };
    
    initializeData();
  }, []);

  const loadRepositories = async () => {
    try {
      setAppState(prev => ({ ...prev, loading: true, error: null }));
      const repos = await GitHubService.getOrganizationRepos();
      setAppState(prev => ({ ...prev, repositories: repos, loading: false }));
    } catch (error) {
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load repositories' 
      }));
    }
  };

  const loadProjectRepoMappings = async () => {
    try {
      const response = await fetch('/data/project-repo-mapping.json');
      if (!response.ok) {
        console.log('No existing project-repo mappings found, using default projects');
        return;
      }
      
      const mappingData = await response.json();
      if (mappingData.projects && Array.isArray(mappingData.projects)) {
        setAppState(prev => ({
          ...prev,
          projects: mappingData.projects
        }));
        console.log('Loaded existing project-repo mappings:', mappingData.projects.length, 'projects');
      }
    } catch (error) {
      console.log('Failed to load project-repo mappings, using default projects:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem({
      type: active.data.current?.type || 'unknown',
      data: active.data.current,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Repository dropped on project
    if (activeData?.type === 'repository' && overData?.type === 'project') {
      const repo = activeData.repository as GitHubRepo;
      const project = overData.project as Project;

      setAppState(prev => {
        const updatedProjects = prev.projects.map(p => {
          if (p.id === project.id) {
            // Check if repo is already assigned
            if (p.repositories.includes(repo.name)) {
              return p; // Already assigned
            }
            return {
              ...p,
              repositories: [...p.repositories, repo.name]
            };
          }
          return p;
        });

        return {
          ...prev,
          projects: updatedProjects
        };
      });
    }

  };

  const removeRepoFromProject = (projectId: string, repoName: string) => {
    setAppState(prev => {
      const updatedProjects = prev.projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            repositories: p.repositories.filter(r => r !== repoName)
          };
        }
        return p;
      });

      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  const createNewProject = () => {
    if (!newProjectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    // Use exact name for consistency with repo-based project creation
    const projectName = newProjectName.trim();
    const existingProject = appState.projects.find(p => p.name === projectName);

    if (existingProject) {
      alert(`A project with the name "${projectName}" already exists`);
      return;
    }

    const newProject: Project = {
      id: projectName, // Use exact name as ID to match repo-based creation
      name: projectName,
      description: newProjectDescription.trim() || `Project for ${projectName}`,
      repositories: []
    };

    setAppState(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));

    // Reset form
    setNewProjectName('');
    setNewProjectDescription('');
    setIsCreateProjectMode(false);
  };

  const createProjectFromRepo = (repo: GitHubRepo) => {
    console.log('=== Starting createProjectFromRepo ===');
    console.log('Original repo name:', repo.name);

    // Create a human-readable project name from the repo name
    const transformedName = repo.name.replace(/[-_]/g, ' ');
    console.log('After replacing hyphens/underscores:', transformedName);

    const projectName = transformedName.replace(/\b\w/g, l => l.toUpperCase());
    console.log('After title case transformation:', projectName);

    const projectId = projectName;
    console.log('Project ID:', projectId);

    // List all existing project names for debugging
    console.log('All existing project names:', appState.projects.map(p => p.name));

    const existingProject = appState.projects.find(p => p.name === projectName);
    console.log('Matching existing project:', existingProject?.name);

    if (existingProject) {
      console.log('✅ Found existing project with exact name match, assigning repo to it');
      setAppState(prev => {
        const updatedProjects = prev.projects.map(p => {
          if (p.name === projectName) {
            if (p.repositories.includes(repo.name)) {
              console.log('⚠️ Repo already assigned to this project');
              return p;
            }
            console.log('📦 Assigning repo to existing project');
            return {
              ...p,
              repositories: [...p.repositories, repo.name]
            };
          }
          return p;
        });

        return {
          ...prev,
          projects: updatedProjects
        };
      });
    } else {
      console.log('🆕 Creating new project with human-readable name');
      const newProject: Project = {
        id: projectId,
        name: projectName,
        description: repo.description || `Project for ${repo.name}`,
        repositories: [repo.name]
      };

      setAppState(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
    }
    console.log('=== Finished createProjectFromRepo ===');
  };

  const copyProjectRepoMapping = async () => {
    try {
      const mappingData = {
        projects: appState.projects.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          repositories: project.repositories
        })),
        lastUpdated: new Date().toISOString()
      };

      const dataStr = JSON.stringify(mappingData, null, 2);
      await navigator.clipboard.writeText(dataStr);

      // Show success message
      alert('Project-Repository mapping copied to clipboard! You can now paste it into /static/data/project-repo-mapping.json');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);

      // Fallback for older browsers
      try {
        const mappingData = {
          projects: appState.projects.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description,
            repositories: project.repositories
          })),
          lastUpdated: new Date().toISOString()
        };
        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(mappingData, null, 2);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Project-Repository mapping copied to clipboard! You can now paste it into /static/data/project-repo-mapping.json');
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
        alert('Failed to copy to clipboard. Please try again.');
      }
    }
  };

  const renderDragOverlay = () => {
    if (!activeItem) return null;

    if (activeItem.type === 'repository') {
      const repo = activeItem.data.repository as GitHubRepo;
      return (
        <div className={styles.dragOverlay}>
          Repository: {repo.name}
        </div>
      );
    }

    return null;
  };

  if (appState.loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading repositories from GitHub...</p>
      </div>
    );
  }

  if (appState.error) {
    return (
      <div className={styles.error}>
        <h3>Error loading repositories</h3>
        <p>{appState.error}</p>
        <button onClick={loadRepositories} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.repoManager}>
        <div className={styles.header}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {appState.repositories.filter(repo => 
                  !appState.projects.some(project => 
                    project.repositories.includes(repo.name)
                  )
                ).length}
              </span>
              <span className={styles.statLabel}>Available Repositories</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {appState.repositories.filter(repo => 
                  appState.projects.some(project => 
                    project.repositories.includes(repo.name)
                  )
                ).length}
              </span>
              <span className={styles.statLabel}>Assigned Repositories</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{appState.projects.length}</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button onClick={copyProjectRepoMapping} className={styles.exportButton}>
              📋 Copy Mapping
            </button>
            <button onClick={loadProjectRepoMappings} className={styles.reloadMappingsButton}>
              🔄 Reload Mappings
            </button>
            <button onClick={loadRepositories} className={styles.refreshButton}>
              Refresh Repositories
            </button>
          </div>
        </div>

        <div className={styles.mainContent}>
           <div className={styles.repositoriesSection}>
             <h2>Available Repositories</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search repositories..."
                value={repoSearchTerm}
                onChange={(e) => setRepoSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.repositoriesGrid}>
              {appState.repositories
                .filter(repo => !appState.projects.some(project => 
                  project.repositories.includes(repo.name)
                ))
                .filter(repo => 
                  repo.name.toLowerCase().includes(repoSearchTerm.toLowerCase()) ||
                  (repo.description && repo.description.toLowerCase().includes(repoSearchTerm.toLowerCase())) ||
                  repo.language?.toLowerCase().includes(repoSearchTerm.toLowerCase()) ||
                  repo.topics.some(topic => topic.toLowerCase().includes(repoSearchTerm.toLowerCase()))
                )
                .map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repository={repo}
                    onWrapInProject={createProjectFromRepo}
                  />
                ))}
              {appState.repositories
                .filter(repo => !appState.projects.some(project => 
                  project.repositories.includes(repo.name)
                ))
                .filter(repo => 
                  repo.name.toLowerCase().includes(repoSearchTerm.toLowerCase()) ||
                  (repo.description && repo.description.toLowerCase().includes(repoSearchTerm.toLowerCase())) ||
                  repo.language?.toLowerCase().includes(repoSearchTerm.toLowerCase()) ||
                  repo.topics.some(topic => topic.toLowerCase().includes(repoSearchTerm.toLowerCase()))
                ).length === 0 && (
                  <div className={styles.emptyReposMessage}>
                    {repoSearchTerm ? (
                      <>
                        <p>🔍 No repositories found matching "{repoSearchTerm}"</p>
                        <p>Try adjusting your search terms</p>
                      </>
                    ) : (
                      <>
                        <p>🎉 All repositories have been assigned to projects!</p>
                        <p>You can remove repositories from projects to make them available again.</p>
                      </>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className={styles.projectsSection}>
            <div className={styles.projectCreationSection}>
              <div className={styles.createProjectHeader}>
                <h3>Create New Project</h3>
                <button
                  onClick={() => setIsCreateProjectMode(!isCreateProjectMode)}
                  className={styles.toggleCreateModeButton}
                >
                  {isCreateProjectMode ? 'Cancel' : 'Create Project'}
                </button>
              </div>

              {isCreateProjectMode ? (
                <div className={styles.createProjectForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="projectName" className={styles.formLabel}>
                      Project Name
                    </label>
                    <input
                      id="projectName"
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className={styles.formInput}
                      onKeyPress={(e) => e.key === 'Enter' && createNewProject()}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="projectDescription" className={styles.formLabel}>
                      Description (optional)
                    </label>
                    <input
                      id="projectDescription"
                      type="text"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      className={styles.formInput}
                      onKeyPress={(e) => e.key === 'Enter' && createNewProject()}
                    />
                  </div>
                  <button
                    onClick={createNewProject}
                    className={styles.createProjectButton}
                    disabled={!newProjectName.trim()}
                  >
                    Create Project
                  </button>
                </div>
              ) : null}
            </div>

            <h2>Projects & Assigned Repositories</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearchTerm}
                onChange={(e) => setProjectSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.projectsGrid}>
              {appState.projects
                .filter(project => 
                  project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                  project.description.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                  project.id.toLowerCase().includes(projectSearchTerm.toLowerCase())
                )
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    repositories={appState.repositories}
                    onRemoveRepo={removeRepoFromProject}
                  />
                ))}
              {appState.projects
                .filter(project => 
                  project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                  project.description.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                  project.id.toLowerCase().includes(projectSearchTerm.toLowerCase())
                ).length === 0 && (
                  <div className={styles.emptyProjectsMessage}>
                    <p>🔍 No projects found matching "{projectSearchTerm}"</p>
                    <p>Try adjusting your search terms</p>
                  </div>
                )}
            </div>
          </div>
        </div>

        <DragOverlay>
          {renderDragOverlay()}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core';
import { WeeksBar } from './WeeksBar';
import { ProjectsList } from './ProjectsList';
import { ContributorsGrid } from './ContributorsGrid';
import { contributors, generateWeeks, groupWeeksByMonth } from './data';
import { loadAssignments, saveAssignments, exportAssignments, copyAssignmentsToClipboard, loadFromJsonFile, loadFullAppStateFromJson } from './localStorage';
import { loadProjectsFromJson, loadContributorAssignments, convertContributorDataToAssignments } from './services/projectService';
import { AppState, Assignments, Week, Project } from './types';
import styles from './ProjectPlanner.module.css';

export const ProjectPlanner: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const weeks = generateWeeks();
    const weekGroups = groupWeeksByMonth(weeks);
    
    return {
      contributors,
      projects: [], // Will be loaded from JSON
      weeks,
      weekGroups,
      assignments: {},
    };
  });

  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Load projects and assignments on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingProjects(true);
        
        // Load projects from repo mapping JSON
        const projectsFromJson = await loadProjectsFromJson();
        
        // Load assignments - priority order:
        // 1. localStorage (user's current session)
        // 2. contributors.json (saved assignments)
        // 3. empty assignments
        let finalAssignments = loadAssignments();
        
        if (Object.keys(finalAssignments).length === 0) {
          console.log('localStorage is empty, loading from contributors.json...');
          
          // Load contributor data and convert to assignments format
          const contributorData = await loadContributorAssignments();
          if (Object.keys(contributorData).length > 0) {
            finalAssignments = convertContributorDataToAssignments(contributorData);
            console.log('✅ Using assignments from contributors.json');
          } else {
            console.log('⚠️ No contributor data found, starting with empty assignments');
            finalAssignments = {};
          }
        } else {
          console.log('✅ Using assignments from localStorage');
        }
        
        setAppState(prev => ({
          ...prev,
          projects: projectsFromJson,
          assignments: finalAssignments,
        }));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    
    loadData();
  }, []);

  const [activeItem, setActiveItem] = useState<{ type: string; data: any } | null>(null);

  // Save to localStorage whenever assignments change
  useEffect(() => {
    saveAssignments(appState.assignments);
  }, [appState.assignments]);

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

    // console.log('Drag ended:', {
    //   activeId: active.id,
    //   activeType: activeData?.type,
    //   overId: over.id,
    //   overType: overData?.type,
    //   activeData,
    //   overData
    // });

    // Project dropped on contributor
    if (activeData?.type === 'project' && overData?.type === 'contributor') {
      const project = activeData.project as Project;
      const contributor = overData.contributor;
      
      // console.log('Project drop detected:', {
      //   projectName: project.name,
      //   contributorName: contributor.name,
      //   contributorGithub: contributor.github,
      //   contributorId: contributor.id
      // });
      
      setAppState(prev => {
        // Get existing contributor assignments or create new structure
        const existingContributor = prev.assignments[contributor.github] || { projects: {} };
        
        // Check if project is already assigned to avoid duplicates
        if (existingContributor.projects[project.name]) {
          console.log(`Project "${project.name}" is already assigned to ${contributor.name}`);
          return prev; // Don't add duplicate
        }
        
        return {
          ...prev,
          assignments: {
            ...prev.assignments,
            [contributor.github]: {
              projects: {
                ...existingContributor.projects,
                [project.name]: [], // Start with empty weeks array
              },
            },
          },
        };
      });
    }

    // Week dropped on project chip
    if (activeData?.type === 'week' && overData?.type === 'project-chip') {
      const week = activeData.week as Week;
      const { contributorId, projectName } = overData;
      
      // Find contributor by ID to get their github username
      const contributor = contributors.find(c => c.id === contributorId);
      if (!contributor) {
        console.error('Contributor not found for ID:', contributorId);
        return;
      }

      setAppState(prev => {
        const existingContributor = prev.assignments[contributor.github] || { projects: {} };
        const currentWeeks = existingContributor.projects[projectName] || [];
        
        // Deduplicate weeks
        if (currentWeeks.includes(week.id)) {
          console.log(`Week "${week.label}" is already assigned to project "${projectName}"`);
          return prev;
        }

        return {
          ...prev,
          assignments: {
            ...prev.assignments,
            [contributor.github]: {
              projects: {
                ...existingContributor.projects,
                [projectName]: [...currentWeeks, week.id].sort(),
              },
            },
          },
        };
      });
    }
  };

  const handleRemoveProject = (contributorId: string, projectName: string) => {
    const contributor = contributors.find(c => c.id === contributorId);
    if (!contributor) return;

    setAppState(prev => {
      const newProjects = { ...prev.assignments[contributor.github]?.projects };
      delete newProjects[projectName];

      return {
        ...prev,
        assignments: {
          ...prev.assignments,
          [contributor.github]: {
            ...prev.assignments[contributor.github],
            projects: newProjects,
          },
        },
      };
    });
  };

  const renderDragOverlay = () => {
    if (!activeItem) return null;

    if (activeItem.type === 'project') {
      const project = activeItem.data.project as Project;
      return (
        <div className={styles.dragOverlay}>
          Project: {project.name}
        </div>
      );
    }

    if (activeItem.type === 'week') {
      const week = activeItem.data.week as Week;
      return (
        <div className={styles.dragOverlay}>
          {week.label}
        </div>
      );
    }

    return null;
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.projectPlanner}>
        <WeeksBar weekGroups={appState.weekGroups} />
        
        {/* Debug Panel - temporary */}
        <div style={{ background: '#f0f0f0', padding: '1rem', margin: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <strong>Debug Info:</strong>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => exportAssignments(appState.assignments)}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Export JSON
              </button>
              <button 
                onClick={async () => {
                  const success = await copyAssignmentsToClipboard(appState.assignments);
                  if (success) {
                    alert('Assignments copied to clipboard!');
                  } else {
                    alert('Failed to copy to clipboard');
                  }
                }}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Copy JSON
              </button>
              <button 
                onClick={async () => {
                  const jsonData = await loadFullAppStateFromJson();
                  setAppState(prev => ({
                    ...prev,
                    // Only update assignments, keep existing contributors and projects
                    assignments: jsonData.assignments,
                  }));
                }}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Load from JSON
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('intuition-box-assignments');
                  window.location.reload();
                }}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear Storage & Reload
              </button>
            </div>
          </div>
          Total assignments: {Object.keys(appState.assignments).length}
          <br />
          {Object.entries(appState.assignments).map(([github, data]) => (
            <div key={github}>
              {github}: {Object.keys(data.projects || {}).length} projects ({Object.keys(data.projects || {}).join(', ')})
            </div>
          ))}
          <br />
          <strong>Raw assignments JSON:</strong>
          <pre style={{ fontSize: '0.75rem', background: 'white', padding: '0.5rem', borderRadius: '4px', overflow: 'auto', maxHeight: '200px' }}>
            {JSON.stringify(appState.assignments, null, 2)}
          </pre>
        </div>
        
        <div className={styles.mainContent}>
          <div className={styles.mainGrid}>
            <ProjectsList 
              projects={appState.projects} 
              isLoading={isLoadingProjects}
            />
            <ContributorsGrid
              contributors={appState.contributors}
              assignments={appState.assignments}
              onRemoveProject={handleRemoveProject}
            />
          </div>
        </div>

        <DragOverlay>
          {renderDragOverlay()}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

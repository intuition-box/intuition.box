import React, { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Project } from './types';
import styles from './ProjectPlanner.module.css';

interface ProjectsListProps {
  projects: Project[];
  isLoading?: boolean;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [projects, searchTerm]);

  return (
    <div className={styles.projectsColumn}>
      <div className={styles.projectsHeader}>
        <h3 className={styles.projectsTitle}>Projects</h3>
        <p className={styles.projectsSubtitle}>Drag projects to contributors</p>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.projectsContainer}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading projects from JSON...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className={styles.noResults}>
            {searchTerm ? `No projects found matching "${searchTerm}"` : 'No projects available'}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id,
    data: {
      type: 'project',
      project,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${styles.projectCard} ${isDragging ? styles.dragging : ''}`}
    >
      <div className={styles.projectName}>{project.name}</div>
      {project.description && (
        <div className={styles.projectDescription}>{project.description}</div>
      )}
      <div className={styles.dragHint}>drag →</div>
    </div>
  );
};

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { GitHubRepo, Project } from './types';
import styles from './RepoManager.module.css';

interface ProjectCardProps {
  project: Project;
  repositories: GitHubRepo[];
  onRemoveRepo: (projectId: string, repoName: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  repositories, 
  onRemoveRepo 
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `project-${project.id}`,
    data: {
      type: 'project',
      project,
    },
  });

  const assignedRepos = repositories.filter(repo => 
    project.repositories.includes(repo.name)
  );

  return (
    <div
      ref={setNodeRef}
      className={`${styles.projectCard} ${isOver ? styles.dragOver : ''}`}
    >
      <div className={styles.projectHeader}>
        <h3 className={styles.projectName}>{project.name}</h3>
        <span className={styles.repoCount}>
          {project.repositories.length} repos
        </span>
      </div>

      <p className={styles.projectDescription}>{project.description}</p>

      <div className={styles.assignedRepos}>
        {assignedRepos.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No repositories assigned</p>
            <p className={styles.dropHint}>Drop repositories here</p>
          </div>
        ) : (
          <div className={styles.repoList}>
            {assignedRepos.map((repo) => (
              <div key={repo.id} className={styles.assignedRepo}>
                <div className={styles.repoInfo}>
                  <span className={styles.repoName}>{repo.name}</span>
                  {repo.language && (
                    <span className={styles.repoLanguage}>{repo.language}</span>
                  )}
                </div>
                <button
                  onClick={() => onRemoveRepo(project.id, repo.name)}
                  className={styles.removeRepo}
                  title="Remove repository"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOver && (
        <div className={styles.dropOverlay}>
          Drop repository here to assign
        </div>
      )}
    </div>
  );
};

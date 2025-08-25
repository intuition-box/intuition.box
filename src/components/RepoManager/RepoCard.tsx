import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GitHubRepo } from './types';
import styles from './RepoManager.module.css';

interface RepoCardProps {
  repository: GitHubRepo;
  onWrapInProject?: (repo: GitHubRepo) => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repository, onWrapInProject }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `repo-${repository.id}`,
    data: {
      type: 'repository',
      repository,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${styles.repoCard} ${isDragging ? styles.dragging : ''}`}
    >
      <div 
        className={styles.dragArea}
        {...listeners}
      >
        <div className={styles.repoHeader}>
          <h3 className={styles.repoName}>{repository.name}</h3>
          <div className={styles.repoMeta}>
            {repository.private && <span className={styles.privateBadge}>Private</span>}
            {repository.language && (
              <span className={styles.languageBadge}>{repository.language}</span>
            )}
          </div>
        </div>

        {repository.description && (
          <p className={styles.repoDescription}>{repository.description}</p>
        )}

        <div className={styles.repoStats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>⭐</span>
            <span>{repository.stargazers_count}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>🍴</span>
            <span>{repository.forks_count}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📅</span>
            <span>{formatDate(repository.updated_at)}</span>
          </div>
        </div>

        {repository.topics.length > 0 && (
          <div className={styles.repoTopics}>
            {repository.topics.slice(0, 3).map((topic) => (
              <span key={topic} className={styles.topic}>
                {topic}
              </span>
            ))}
            {repository.topics.length > 3 && (
              <span className={styles.topicMore}>+{repository.topics.length - 3}</span>
            )}
          </div>
        )}

        <div className={styles.dragHint}>
          Drag to assign to a project
        </div>
      </div>

      <div className={styles.repoActions}>
        {onWrapInProject && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('Button clicked for repo:', repository.name);
              onWrapInProject(repository);
            }}
            className={styles.wrapInProjectButton}
          >
            📦 Wrap in Project
          </button>
        )}
        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.repoLink}
          onClick={(e) => e.stopPropagation()}
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};

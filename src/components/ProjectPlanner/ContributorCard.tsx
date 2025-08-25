import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Contributor, Assignments } from './types';
import { ProjectChip } from './ProjectChip';
import styles from './ProjectPlanner.module.css';

interface ContributorCardProps {
  contributor: Contributor;
  assignments: Assignments;
  onRemoveProject: (contributorId: string, projectName: string) => void;
}

export const ContributorCard: React.FC<ContributorCardProps> = ({
  contributor,
  assignments,
  onRemoveProject,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `contributor-${contributor.id}`,
    data: {
      type: 'contributor',
      contributor,
    },
  });

  const contributorAssignments = assignments[contributor.github] || { projects: {} };
  const assignedProjects = Object.keys(contributorAssignments.projects);

  return (
    <div
      ref={setNodeRef}
      className={`${styles.contributorCard} ${isOver ? styles.dragOver : ''}`}
    >
      <div className={styles.contributorHeader}>
        <div className={styles.contributorInfo}>
          <h4 className={styles.contributorName}>{contributor.name}</h4>
          <div className={styles.contributorMeta}>
            <span className={styles.discord}>@{contributor.discord}</span>
          </div>
        </div>
        <a
          href={`https://github.com/${contributor.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubButton}
        >
          GitHub
        </a>
      </div>

      <div className={styles.projectsContainer}>
        {assignedProjects.map((projectName) => {
          // Ensure we pass a valid array to ProjectChip
          const weekIds = contributorAssignments.projects[projectName];
          const safeWeekIds = Array.isArray(weekIds) ? weekIds : [];
          
          return (
            <ProjectChip
              key={projectName}
              projectName={projectName}
              weekIds={safeWeekIds}
              contributorId={contributor.id}
              onRemove={() => onRemoveProject(contributor.id, projectName)}
            />
          );
        })}
        
        {/* Always show a drop zone for adding more projects */}
        <div className={styles.addProjectZone}>
          {assignedProjects.length === 0 ? (
            <span>Drop projects here</span>
          ) : (
            <span>+ Drop more projects</span>
          )}
        </div>
      </div>
    </div>
  );
};

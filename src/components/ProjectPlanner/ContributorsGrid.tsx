import React, { useState, useMemo } from 'react';
import { Contributor, Assignments } from './types';
import { ContributorCard } from './ContributorCard';
import styles from './ProjectPlanner.module.css';

interface ContributorsGridProps {
  contributors: Contributor[];
  assignments: Assignments;
  onRemoveProject: (contributorId: string, projectName: string) => void;
}

export const ContributorsGrid: React.FC<ContributorsGridProps> = ({
  contributors,
  assignments,
  onRemoveProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredContributors = useMemo(() => {
    if (!searchTerm.trim()) return contributors;
    return contributors.filter(contributor => 
      contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.github.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.discord.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contributors, searchTerm]);

  return (
    <div className={styles.contributorsGrid}>
      <div className={styles.contributorsHeader}>
        <h3 className={styles.contributorsTitle}>Contributors</h3>
        <p className={styles.contributorsSubtitle}>
          {filteredContributors.length} of {contributors.length} contributors • Drag projects and weeks to assign
        </p>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search contributors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.contributorsContainer}>
        {filteredContributors.length === 0 ? (
          <div className={styles.noResults}>
            No contributors found matching "{searchTerm}"
          </div>
        ) : (
          filteredContributors.map((contributor) => (
            <ContributorCard
              key={contributor.id}
              contributor={contributor}
              assignments={assignments}
              onRemoveProject={onRemoveProject}
            />
          ))
        )}
      </div>
    </div>
  );
};

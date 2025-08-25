import React from 'react';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { Week } from './types';
import styles from './ProjectPlanner.module.css';

// Helper function to group weeks by month
const groupWeeksByMonth = (weekIds: string[]): { [monthKey: string]: string[] } => {
  const groups: { [monthKey: string]: string[] } = {};
  
  weekIds.forEach(weekId => {
    const date = new Date(weekId);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(weekId);
  });
  
  // Sort weeks within each month
  Object.keys(groups).forEach(monthKey => {
    groups[monthKey].sort();
  });
  
  return groups;
};

interface ProjectChipProps {
  projectName: string;
  weekIds: string[];
  contributorId: string;
  onRemove: () => void;
}

export const ProjectChip: React.FC<ProjectChipProps> = ({
  projectName,
  weekIds,
  contributorId,
  onRemove,
}) => {
  // Ensure weekIds is always an array
  const safeWeekIds = Array.isArray(weekIds) ? weekIds : [];
  const [isDraggingWeek, setIsDraggingWeek] = React.useState(false);
  
  useDndMonitor({
    onDragStart: (event) => {
      const activeData = event.active.data.current;
      setIsDraggingWeek(activeData?.type === 'week');
    },
    onDragEnd: () => {
      setIsDraggingWeek(false);
    },
  });

  const { isOver, setNodeRef } = useDroppable({
    id: `project-${contributorId}-${projectName}`,
    data: {
      type: 'project-chip',
      contributorId,
      projectName,
    },
    disabled: !isDraggingWeek, // Only accept drops when dragging a week
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.projectChip} ${isOver ? styles.dragOver : ''}`}
    >
      <div className={styles.projectChipHeader}>
        <span className={styles.projectChipName}>{projectName}</span>
        <div className={styles.projectChipActions}>
          <span className={styles.weekCount}>
            {safeWeekIds.length} week{safeWeekIds.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onRemove}
            className={styles.removeButton}
            title="Remove project"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className={styles.weekTags}>
        {safeWeekIds.length === 0 ? (
          <div className={styles.dropHint}>Drop weeks here</div>
        ) : (
          <div className={styles.monthGrid}>
            {Object.entries(groupWeeksByMonth(safeWeekIds)).map(([monthKey, monthWeekIds]) => (
              <MonthGroup 
                key={monthKey} 
                monthKey={monthKey} 
                weekIds={monthWeekIds} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface MonthGroupProps {
  monthKey: string;
  weekIds: string[];
}

const MonthGroup: React.FC<MonthGroupProps> = ({ monthKey, weekIds }) => {
  const [year, month] = monthKey.split('-');
  const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
  
  return (
    <div className={styles.monthGroup}>
      <div className={styles.monthLabel}>{monthName}</div>
      <div className={styles.weekNumbers}>
        {weekIds.map((weekId, index) => (
          <WeekNumber key={weekId} weekId={weekId} weekNumber={index + 1} />
        ))}
      </div>
    </div>
  );
};

interface WeekNumberProps {
  weekId: string;
  weekNumber: number;
}

const WeekNumber: React.FC<WeekNumberProps> = ({ weekId, weekNumber }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  const date = new Date(weekId);
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 6);
  
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return (
    <div 
      className={styles.weekNumber}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      #{weekNumber}
      {showTooltip && (
        <div className={styles.weekTooltip}>
          <div>{formatDate(startDate)} - {formatDate(endDate)}</div>
          <div className={styles.weekTooltipYear}>{startDate.getFullYear()}</div>
        </div>
      )}
    </div>
  );
};

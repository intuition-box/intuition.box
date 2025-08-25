import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { WeekGroup, Week } from './types';
import styles from './ProjectPlanner.module.css';

interface WeeksBarProps {
  weekGroups: WeekGroup[];
}

export const WeeksBar: React.FC<WeeksBarProps> = ({ weekGroups }) => {
  return (
    <div className={styles.weeksBar}>
      <div className={styles.weeksContainer}>
        <h3 className={styles.weeksTitle}>Development Weeks</h3>
        <div className={styles.weeksScroll}>
          {weekGroups.map((group) => (
            <div key={group.monthLabel} className={styles.monthGroup}>
              <div className={styles.monthLabel}>{group.monthLabel}</div>
              <div className={styles.weeksInMonth}>
                {group.weeks.map((week) => (
                  <WeekChip key={week.id} week={week} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface WeekChipProps {
  week: Week;
}

const WeekChip: React.FC<WeekChipProps> = ({ week }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: week.id,
    data: {
      type: 'week',
      week,
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
      className={`${styles.weekChip} ${isDragging ? styles.dragging : ''}`}
    >
      <div className={styles.weekLabel}>{week.label}</div>
      <div className={styles.weekDate}>{week.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
    </div>
  );
};

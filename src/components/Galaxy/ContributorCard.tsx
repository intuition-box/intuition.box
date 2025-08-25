import React from "react";
import styles from "./Galaxy.module.css";

export type ContributorCardProps = {
  id: string;
  summary: string;
  style?: React.CSSProperties;
};

export default function ContributorCard({ id, summary, style }: ContributorCardProps) {
  return (
    <div className={`${styles.dotbox}`} style={style}>
      <h3 className={styles.dotboxTitle}>{id}</h3>
      <div className={styles.dotboxContent}>
        <p className={styles.dotboxSummary}>{summary}</p>

        {/* LEFT: Projects */}
        <div className={styles.dotboxMetrics}>
          <div className={styles.metricsBlock}>
            <div className={styles.metricsTitle}>projects</div>
            <div className={styles.metricsRow}>
              <div className={styles.stack}>
                <div className={`${styles.badge} ${styles.badgeProject}`} />
                <div className={`${styles.badge} ${styles.badgeProject}`} />
              </div>
              <span className={styles.metricsPlus}>+9</span>
            </div>
          </div>
          
          {/* RIGHT: Contributors */}
          <div className={styles.metricsBlock}>
            <div className={styles.metricsTitle}>contributors</div>
            <div className={styles.metricsRow}>
              <div className={styles.stack}>
                <div className={`${styles.badge} ${styles.badgeContrib}`} />
                <div className={`${styles.badge} ${styles.badgeContrib}`} />
                <div className={`${styles.badge} ${styles.badgeContrib}`} />
              </div>
              <span className={styles.metricsPlus}>+7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

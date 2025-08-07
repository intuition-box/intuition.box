import React from "react";
import styles from "./SciFiPanel.module.css";

type SciFiPanelProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const SciFiPanel: React.FC<SciFiPanelProps> = ({ children, className = "", style }) => (
  <div className={`${styles.panel} ${className}`} style={style}>
    <svg className={styles.bgShape} viewBox="0 0 420 200" preserveAspectRatio="none">
      <polygon
        points="20,0 400,0 420,20 420,180 400,200 20,200 0,180 0,20"
        fill="rgba(30,60,120,0.14)" /* glass */
        stroke="#49e6fa88"
        strokeWidth="3"
        />
    </svg>
    <div className={styles.content}>
      {children}
    </div>
  </div>
);

export default SciFiPanel;

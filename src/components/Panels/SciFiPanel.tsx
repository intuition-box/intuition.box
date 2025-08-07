import React from "react";
import styles from "./SciFiPanel.module.css";

type SciFiPanelProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "small" | "large";
  light?: boolean;
};

const SciFiPanel: React.FC<SciFiPanelProps> = ({ children, className = "", style, variant = 'default' }) => (
  <div className={`${styles.panel} ${styles[variant]}`} style={style}>
    <svg className={styles.bgShape} viewBox="0 0 420 210" preserveAspectRatio="none">
        <polygon points="
          0,0
          420,0
          420,170
          370,200
          245,200
          230,180
          190,180
          175,200
          50,200
          0,170
        " ><div></div></polygon>
    </svg>
    <div className={styles.content}>
      {children}
    </div>
  </div>
);

export default SciFiPanel;

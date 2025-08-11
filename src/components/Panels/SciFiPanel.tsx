import React from "react";
import styles from "./SciFiPanel.module.css";

type SciFiPanelProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "small" | "large";
  halo?: boolean;
};

const SciFiPanel: React.FC<SciFiPanelProps> = ({ children, className = "", style, variant = 'default', halo = false }) => (
  <div className={`${styles.panel} ${styles[variant]}`} style={style} data-halo={halo ? "true" : "false"}>
    {halo === true && <div className={styles.halo} aria-hidden="true" />}
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
        " ></polygon>
    </svg>
    <div className={styles.content}>
      {children}
    </div>
  </div>
);

export default SciFiPanel;

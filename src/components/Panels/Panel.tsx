import React from "react";
import styles from "./Panel.module.css";

type PanelProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "small" | "large";
};

const Panel: React.FC<PanelProps> = ({ children, className = "", style, variant = "default" }) => {
  return (
    <div
      className={`${styles.panel} ${styles[variant]} ${className}`.trim()}
      style={style}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Panel;
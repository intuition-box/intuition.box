import React from "react";
import styles from "./Galaxy.module.css";

type Props = { title?: string };

const GalaxyBackground: React.FC<Props> = ({ title = "INTUITION.BOX" }) => {

  return (
    <>
      <div
        className={styles.galaxyBg}
        aria-hidden
      />
      <div className={styles.centralCircle}>
        <h2>{title}</h2>
      </div>
    </>
  );
};

export default GalaxyBackground;

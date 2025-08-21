import React from "react";
import styles from "./Galaxy.module.css";
import { useColorMode } from "@docusaurus/theme-common";

type Props = { title?: string };

const GalaxyBackground: React.FC<Props> = ({ title = "FABLAB.BOX" }) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <div
        className={styles.galaxyBg}
        data-theme-mode={colorMode}
        aria-hidden
      />
      <div className={styles.centralCircle}>
        <h2>{title}</h2>
      </div>
    </>
  );
};

export default GalaxyBackground;

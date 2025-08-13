import React from "react";
import styles from "./Galaxy.module.css";

export type Contributor = { id: string; name: string; color?: string };

const getStyle = (i: number, total: number, color?: string): React.CSSProperties => {
  const duration = 85, radius = 300, delay = -(duration / total) * i;
  return {
    ["--orbit-radius" as any]: `${radius}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    backgroundColor: color || undefined,
  } as React.CSSProperties;
};

const pause = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget as HTMLElement;
  el.style.animationPlayState = "paused";
  (el.style as any).webkitAnimationPlayState = "paused";
};
const resume = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget as HTMLElement;
  el.style.animationPlayState = "running";
  (el.style as any).webkitAnimationPlayState = "running";
};

export default function ContributorsOrbit({ contributors }: { contributors: Contributor[] }) {
  return (
    <div className={styles.orbit}>
      {contributors.map((c, i) => (
        <div
          key={c.id}
          className={`${styles.contributor} cursor-target`}
          style={getStyle(i, contributors.length, c.color)}
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {c.name}
        </div>
      ))}
    </div>
  );
}

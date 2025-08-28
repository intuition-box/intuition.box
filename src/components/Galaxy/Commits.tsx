import React from "react";
import styles from "./Galaxy.module.css";

export type Commit = { id: string; name: string; url: string; color?: string };

const getStyle = (i: number, total: number, color?: string): React.CSSProperties => {
  const duration = 85;
  const delay = -(duration / total) * i;
  return {
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

export default function CommitsOrbit({ commits }: { commits: Commit[] }) {
  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className={styles.orbit}>
      {commits.map((c, i) => (
        <div
          key={c.id}
          className={styles.commit}
          style={getStyle(i, commits.length, c.color)}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onClick={() => open(c.url)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(c.url); }
          }}
          role="link"
          tabIndex={0}
          aria-label="Open commit on GitHub"
          title="Open commit on GitHub"
        >
          {c.name}
        </div>
      ))}
    </div>
  );
}

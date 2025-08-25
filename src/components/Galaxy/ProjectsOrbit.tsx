import React from "react";
import styles from "./Galaxy.module.css";

export type Project = {
  id: string;
  title: string;
  desc: string;
  color?: string;
  date: string;
  url?: string;
  category: string;
  participants: { name: string; color?: string; avatarUrl?: string }[];
};

const getStyle = (i: number, total: number, color?: string): React.CSSProperties => {
  const duration = 70;
  const radius = 420;
  const delay = -(duration / total) * i;
  return {
    ["--orbit-radius" as any]: `${radius}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    backgroundColor: color || undefined,
  } as React.CSSProperties;
};

const pause = (el: HTMLElement) => { el.style.animationPlayState = "paused"; (el.style as any).webkitAnimationPlayState = "paused"; };
const resume = (el: HTMLElement) => { el.style.animationPlayState = "running"; (el.style as any).webkitAnimationPlayState = "running"; };

export default function ProjectsOrbit({ projects }: { projects: Project[] }) {
  return (
    <div className={styles.orbitProjects}>
      {projects.map((p, i) => (
        <div
          key={p.id}
          data-role="project"
          className={`${styles.project} cursor-target`}
          style={getStyle(i, projects.length, p.color)}
          onMouseEnter={(e) => {
            pause(e.currentTarget as HTMLElement);
            window.dispatchEvent(new CustomEvent("ib:project-hover", {
              detail: { id: p.id, name: p.title, x: e.clientX, y: e.clientY }
            }));
          }}
          onMouseLeave={(e) => {
            resume(e.currentTarget as HTMLElement);
            window.dispatchEvent(new CustomEvent("ib:project-leave", { detail: { id: p.id } }));
          }}
          onClick={(e) => {
            window.dispatchEvent(new CustomEvent("ib:project-hover", {
              detail: { id: p.id, name: p.title, x: (e as any).clientX ?? 0, y: (e as any).clientY ?? 0 }
            }));
          }}
        />
      ))}
    </div>
  );
}

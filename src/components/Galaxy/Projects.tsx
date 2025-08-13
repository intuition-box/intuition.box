import React, { useRef, useState } from "react";
import styles from "./Galaxy.module.css";

export type Project = {
  id: string; title: string; desc: string; color?: string;
  date: string; category: string; progress: number;
  participants: { name: string; color: string }[];
};

const getStyle = (i: number, total: number, color?: string): React.CSSProperties => {
  const duration = 70, radius = 420, delay = -(duration / total) * i;
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

export default function ProjectsWithCard({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);

  const cancelHide = () => { if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; } };
  const scheduleHide = (ms = 250) => {
    cancelHide();
    hideTimer.current = window.setTimeout(() => setSelected(null), ms);
  };

  return (
    <>
      <div className={styles.orbitProjects}>
        {projects.map((p, i) => (
          <div
            key={p.id}
            data-role="project"
            className={`${styles.project} cursor-target`}
            style={getStyle(i, projects.length, p.color)}
            onMouseEnter={(e) => { cancelHide(); pause(e); setSelected(p); setPos({ x: e.clientX + 12, y: e.clientY + 12 }); }}
            onMouseMove={(e) => { if (selected?.id === p.id) setPos({ x: e.clientX + 20, y: e.clientY + 20 }); }}
            onMouseLeave={(e) => {
              resume(e);
              const next = (e.relatedTarget ?? null);
              if (cardRef.current && next && next instanceof Node && cardRef.current.contains(next)) { cancelHide(); return; }
              scheduleHide(250);
            }}
          />
        ))}
      </div>

      {selected && (
        <div
          ref={cardRef}
          className={`${styles.projectCard} cursor-target`}
          style={{
            left: pos.x, top: pos.y,
            background: `radial-gradient(ellipse at right top, ${selected.color}80 0%, #151419 45%, #151419 100%)`,
            pointerEvents: "auto",
          }}
          onMouseEnter={cancelHide}
          onMouseLeave={(e) => {
            const nextEl = (e.relatedTarget ?? null);
            if (nextEl && nextEl instanceof Element && (nextEl as Element).closest('[data-role="project"]')) { cancelHide(); return; }
            scheduleHide(220);
          }}
        >
          <div className={styles.projectCardHeader}>
            <div className={styles.projectDate}>{selected.date}</div>
            <svg className={styles.projectIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={styles.projectCardBody}>
            <h3>{selected.title}</h3>
            <p>{selected.desc}</p>
            <div className={styles.projectProgress}>
              <span>Progress</span>
              <div className={styles.projectProgressBar}>
                <div className={styles.projectProgressBarFill} style={{ width: `${selected.progress}%`, background: selected.color }} />
              </div>
              <span>{selected.progress}%</span>
            </div>
          </div>
          <div className={styles.projectCardFooter}>
            <ul>
              {selected.participants.map((p, idx) => (
                <li key={idx}><span style={{ backgroundColor: p.color }}>{p.name}</span></li>
              ))}
              <li>
                <div className={styles.projectBtnAdd} style={{ background: selected.color }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                  </svg>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

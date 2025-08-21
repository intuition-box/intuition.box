import React, { useEffect, useRef, useState } from "react";
import styles from "./Galaxy.module.css";
import MobileBottomSheet from "./MobileBottomSheet";

export type Project = {
  id: string;
  title: string;
  desc: string;
  color?: string;
  date: string;
  category: string;
  progress: number;
  participants: { name: string; color: string }[];
};

const getStyle = (
  i: number,
  total: number,
  color?: string
): React.CSSProperties => {
  const duration = 70,
    radius = 420,
    delay = -(duration / total) * i;
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

export default function ProjectsWithCard({
  projects,
}: {
  projects: Project[];
}) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mm = window.matchMedia("(pointer: coarse), (max-width: 640px)");
    const update = () => setIsMobile(mm.matches);
    update();
    mm.addEventListener?.("change", update);
    (mm as any).addListener?.(update); // compat
    return () => {
      mm.removeEventListener?.("change", update);
      (mm as any).removeListener?.(update);
    };
  }, []);

  const cancelHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };
  const scheduleHide = (ms = 400) => {
    cancelHide();
    hideTimer.current = setTimeout(() => setSelected(null), ms);
  };

  const updatePosition = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    const cardWidth = card?.offsetWidth ?? 320;
    const cardHeight = card?.offsetHeight ?? 230;

    const margin = 12;
    const minX = margin,
      minY = margin;
    const maxX = window.innerWidth - cardWidth - margin;
    const maxY = window.innerHeight - cardHeight - margin;

    setPos({
      x: Math.max(minX, Math.min(clientX + 20, maxX)),
      y: Math.max(minY, Math.min(clientY + 20, maxY)),
    });
  };

  function ProjectDetailsContent({
    p,
    onClose,
  }: {
    p: Project;
    onClose?: () => void;
  }) {
    return (
      <>
        {/* Header identique */}
        <div className={styles.projectCardHeader}>
          <div className={styles.projectDate}>Last update</div>
          {onClose ? (
            <button
              className={styles.sheetClose}
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          ) : (
            <svg
              className={styles.projectIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <div className={styles.projectCardBody}>
          <h3 className={styles.projectTitle}>{p.title}</h3>
          <h4 className={styles.projectSection}>Description</h4>
          <h4 className={styles.projectSection}>Progress</h4>
          <div className={styles.projectProgress}>
            <div className={styles.projectProgressBar}>
              <div
                className={styles.projectProgressBarFill}
                style={{ width: `${p.progress}%`, background: p.color }}
              />
            </div>
            <span>{p.progress}%</span>
          </div>
        </div>

        <div className={styles.projectCardFooter}>
          <ul>
            {p.participants.map((pt, idx) => (
              <li key={idx}>
                <span style={{ backgroundColor: pt.color }}>{pt.name}</span>
              </li>
            ))}
            <li>
              <div
                className={styles.projectBtnAdd}
                style={{ background: p.color }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.orbitProjects}>
        {projects.map((p, i) => (
          <div
            key={p.id}
            data-role="project"
            className={`${styles.project} cursor-target`}
            style={getStyle(i, projects.length, p.color)}
            onMouseEnter={(e) => {
              if (isMobile) return;
              cancelHide();
              pause(e);
              setSelected(p);
              updatePosition(e.clientX, e.clientY);
            }}
            onMouseLeave={(e) => {
              if (isMobile) return;
              resume(e);
              const next = e.relatedTarget ?? null;
              if (
                cardRef.current &&
                next &&
                next instanceof Node &&
                cardRef.current.contains(next)
              ) {
                cancelHide();
                return;
              }
              scheduleHide(400);
            }}
            onClick={() => {
              if (!isMobile) return;
              setSelected(p);
            }}
          />
        ))}
      </div>

      {!isMobile && selected && (
        <div
          ref={cardRef}
          className={styles.projectCard}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            background: `radial-gradient(ellipse at right top, ${selected.color}80 0%, #151419 45%, #151419 100%)`,
            pointerEvents: "auto",
          }}
          onMouseEnter={cancelHide}
          onMouseLeave={(e) => {
            const nextEl = e.relatedTarget ?? null;
            if (
              nextEl &&
              nextEl instanceof Element &&
              (nextEl as Element).closest('[data-role="project"]')
            ) {
              cancelHide();
              return;
            }
            scheduleHide(220);
          }}
        >
          <ProjectDetailsContent p={selected} />
        </div>
      )}

      {isMobile && (
        <MobileBottomSheet
          open={!!selected}
          onClose={() => setSelected(null)}
          borderColor={selected?.color ?? "#333"}
          minimal // cf. étape 2
        >
          {selected && (
            <ProjectDetailsContent
              p={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </MobileBottomSheet>
      )}
    </>
  );
}

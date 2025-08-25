import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Galaxy.module.css";
import MobileBottomSheet from "./MobileBottomSheet";
import type { Project } from "./ProjectsOrbit";

/* --- helpers --- */
const norm = (s: string) => String(s).toLowerCase().replace(/\.git$/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const keyify = (s: string) => norm(s).replace(/\s+/g, "-");
const lastSegment = (s: string) => (String(s).split("/").pop() || s);

export default function ProjectCard({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const byId = useMemo(() => {
    const m = new Map<string, Project>();
    projects.forEach(p => m.set(String(p.id).toLowerCase(), p));
    return m;
  }, [projects]);

  const list = useMemo(() => projects.map(p => ({
    p, n: norm(p.title), k: keyify(p.title), nNoSpace: norm(p.title).replace(/\s+/g, "")
  })), [projects]);

  const resolveProject = (detail: any): Project | null => {
    const id = detail?.id ? String(detail.id).toLowerCase() : "";
    if (id && byId.has(id)) return byId.get(id)!;
    const raw = detail?.name ? String(detail.name) : "";
    if (!raw) return null;
    const seg = lastSegment(raw);
    const candidates = [norm(raw), keyify(raw), norm(seg), keyify(seg), norm(raw).replace(/\s+/g, "")];
    for (const cand of candidates) {
      const hit = list.find(x => x.n === cand || x.k === cand || x.nNoSpace === cand);
      if (hit) return hit.p;
    }
    const target = norm(seg);
    const scored: Array<{ p: Project; s: number; d: number }> = [];
    for (const x of list) {
      if (x.n === target) scored.push({ p: x.p, s: 100, d: 0 });
      else if (x.n.startsWith(target)) scored.push({ p: x.p, s: 80, d: Math.abs(x.n.length - target.length) });
      else if (x.n.includes(target))   scored.push({ p: x.p, s: 60, d: Math.abs(x.n.length - target.length) });
    }
    scored.sort((a,b)=> (b.s-a.s) || (a.d-b.d));
    return scored[0]?.p ?? null;
  };

  const cancelHide = () => { if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; } };
  const scheduleHide = (ms = 260) => { cancelHide(); hideTimer.current = setTimeout(() => setSelected(null), ms); };

  const updatePosition = (x: number, y: number) => {
    const card = cardRef.current;
    const w = card?.offsetWidth ?? 320;
    const h = card?.offsetHeight ?? 220;
    const m = 12;
    setPos({
      x: Math.max(m, Math.min((x || 0) + 20, window.innerWidth - w - m)),
      y: Math.max(m, Math.min((y || 0) + 20, window.innerHeight - h - m)),
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mm = window.matchMedia("(pointer: coarse), (max-width: 640px)");
    const update = () => setIsMobile(mm.matches);
    update(); mm.addEventListener?.("change", update); (mm as any).addListener?.(update);
    return () => { mm.removeEventListener?.("change", update); (mm as any).removeListener?.(update); };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHover = (ev: Event) => {
      const { id, name, x, y } = (ev as CustomEvent).detail || {};
      const p = resolveProject({ id, name });
      if (!p) return;
      cancelHide();
      setSelected(p);
      updatePosition(Number(x) || 0, Number(y) || 0);
    };
    const onLeave = () => scheduleHide(240);

    window.addEventListener("ib:project-hover", onHover as EventListener);
    window.addEventListener("ib:project-leave", onLeave as EventListener);
    return () => {
      window.removeEventListener("ib:project-hover", onHover as EventListener);
      window.removeEventListener("ib:project-leave", onLeave as EventListener);
    };
  }, [list, byId]);

  function ProjectDetailsContent({ p }: { p: Project }) {
    const lastUpdate = new Date(p.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    return (
      <>
        {/* HEADER */}
        <div className={styles.projectCardHeader}>
          <div className={styles.projectDate}>{lastUpdate}</div>
          {p.url && (
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              className={styles.projectExternal} aria-label="Open GitHub project" title="Open on GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h5V3H5c-1.1 0-2 .9-2 2v14c0 
                  1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5h-2v5H5V5z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>

        {/* BODY */}
        <div className={styles.projectCardBody}>
          <h3 className={styles.projectTitle}>{p.title}</h3>
        </div>

        {/* FOOTER */}
        <div className={styles.projectCardFooter}>
          <ul className={styles.participantsStack}>
            {p.participants.map((pt, idx) => (
              <li key={idx} title={pt.name}>
                <img
                  src={(pt.avatarUrl && pt.avatarUrl !== "") ? pt.avatarUrl : `https://github.com/${pt.name}.png?size=56`}
                  alt={pt.name}
                  className={styles.participantAvatar}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  return (
    <>
      {!isMobile && selected && (
        <div
          ref={cardRef}
          className={styles.projectCard}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            background: `radial-gradient(ellipse at right top, ${selected.color ?? "#5ec2e7"}80 0%, #151419 45%, #151419 100%)`,
            pointerEvents: "auto",
          }}
          onMouseEnter={cancelHide}
          onMouseLeave={() => scheduleHide(200)}
        >
          <ProjectDetailsContent p={selected} />
        </div>
      )}

      {isMobile && (
        <MobileBottomSheet
          open={!!selected}
          onClose={() => setSelected(null)}
          borderColor={selected?.color ?? "#333"}
          minimal
        >
          {selected && <ProjectDetailsContent p={selected} />}
        </MobileBottomSheet>
      )}
    </>
  );
}

import React, { useEffect, useRef, useState } from "react";
import styles from "./Galaxy.module.css";

type MiniProj = string | { id: string; name: string; url?: string };

export default function ContributorCard({
  title,
  summary,
  projects = [],
  avatarUrl,
  profileUrl,
  style,
}: {
  title: string;
  summary: string;
  projects?: MiniProj[];
  avatarUrl?: string;
  profileUrl?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const expanded = hover || focused;

  const expRef = useRef<HTMLDivElement>(null);
  const [expMax, setExpMax] = useState(0);
  const recalc = () => {
    if (expRef.current) setExpMax(expRef.current.scrollHeight);
  };
  useEffect(() => {
    recalc();
  }, [projects]);
  useEffect(() => {
    const ro = new ResizeObserver(recalc);
    if (expRef.current) ro.observe(expRef.current);
    return () => ro.disconnect();
  }, []);

  const emitHover = (proj: MiniProj, e: React.MouseEvent) => {
    const detail =
      typeof proj === "string"
        ? { name: proj }
        : { id: proj.id, name: proj.name, url: proj.url };
    window.dispatchEvent(
      new CustomEvent("ib:project-hover", {
        detail: { ...detail, x: e.clientX, y: e.clientY },
      })
    );
  };
  const emitLeaveList = () => {
    window.dispatchEvent(
      new CustomEvent("ib:project-leave", { detail: { name: "__list__" } })
    );
  };

  return (
    <div
      className={styles.contribCard}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setFocused(false);
      }}
      aria-expanded={expanded}
    >
      <div
        className={styles.cardHeaderClickable}
        onClick={() => {
          if (profileUrl) window.open(profileUrl, "_blank");
        }}
        role="link"
        aria-label={`Open ${title} GitHub profile`}
      >
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={`${title} avatar`}
            width={28}
            height={28}
            className={styles.cardAvatar}
            loading="lazy"
          />
        )}
        <h3 className={styles.contribCardTitle}>{title}</h3>
      </div>

      <p className={`${styles.contribCardSummary} ${styles.summaryCompact}`}>
        {summary}
      </p>

      <div
        className={`${styles.contribExpander} ${
          expanded ? styles.contribExpanderOpen : ""
        }`}
        style={{ maxHeight: expanded ? expMax : 0 }}
      >
        <div className={styles.contribExpanderInner} ref={expRef}>
          <div className={styles.cardDivider} />
          <div className={styles.metricsTitle}>Projects</div>
          {projects?.length ? (
            <ul className={styles.projectsGrid} onMouseLeave={emitLeaveList}>
              {projects.slice(0, 8).map((p, i) => {
                const key =
                  typeof p === "string"
                    ? `${p}-${i}`
                    : p.id || `${p.name}-${i}`;
                const label = typeof p === "string" ? p : p.name;
                const url = typeof p === "string" ? undefined : p.url;

                const handleEnter = (
                  e: React.MouseEvent | React.FocusEvent
                ) => {
                  // Unifie hover & focus clavier
                  const clientX = (e as any).clientX ?? 0;
                  const clientY = (e as any).clientY ?? 0;
                  const payload =
                    typeof p === "string"
                      ? { name: p }
                      : { id: p.id, name: p.name, url: p.url };
                  window.dispatchEvent(
                    new CustomEvent("ib:project-hover", {
                      detail: { ...payload, x: clientX, y: clientY },
                    })
                  );
                };

                return (
                  <li key={key} className={styles.projectItem}>
                    <span className={styles.projSquare} aria-hidden="true" />

                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                        onMouseEnter={handleEnter}
                        onFocus={handleEnter}
                        aria-label={`Open ${label} repository on GitHub`}
                      >
                        <span className={styles.projectName}>{label}</span>
                      </a>
                    ) : (
                      <span
                        className={styles.projectName}
                        onMouseEnter={(e) => emitHover(p, e)}
                        onFocus={(e) => handleEnter(e)}
                        tabIndex={0}
                        role="link"
                        aria-disabled="true"
                        title="No repository URL"
                      >
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.muted}>No recent project found</p>
          )}
        </div>
      </div>
    </div>
  );
}

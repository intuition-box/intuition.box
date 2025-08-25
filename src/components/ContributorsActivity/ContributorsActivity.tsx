import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { contributors as staticContributors } from '../ProjectPlanner/data';
import { loadProjectsFromJson, loadContributorAssignments, convertContributorDataToAssignments } from '../ProjectPlanner/services/projectService';
import styles from './ContributorsActivity.module.css';

interface Contributor {
  id: string;
  name: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  contributorId: string;
  projectId: string;
  type: 'commit' | 'issue' | 'review' | 'assignment';
  date: Date;
}

export const ContributorsActivity: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allActivity, setAllActivity] = useState<Activity[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load projects from JSON
        const projectsFromJson = await loadProjectsFromJson();
        const mappedProjects = projectsFromJson.map(p => ({ id: p.id, name: p.name }));
        
        // Load contributor assignments
        const contributorData = await loadContributorAssignments();
        const assignments = convertContributorDataToAssignments(contributorData);
        
        // Create contributor list with colors
        const contributorColors = [
          "from-sky-500 to-cyan-500",
          "from-fuchsia-500 to-violet-500", 
          "from-emerald-500 to-teal-500",
          "from-orange-500 to-red-500",
          "from-indigo-500 to-purple-500",
          "from-green-500 to-emerald-500",
          "from-pink-500 to-rose-500",
          "from-yellow-500 to-orange-500",
          "from-teal-500 to-cyan-500",
          "from-violet-500 to-purple-500"
        ];

        const mappedContributors = staticContributors.map((c, index) => ({
          id: c.github, // Use github username as ID for consistency
          name: c.name,
          color: contributorColors[index % contributorColors.length]
        }));

        // Generate activity events from assignments
        const activities: Activity[] = [];
        let activityId = 1;

        Object.entries(assignments).forEach(([contributorGithub, contributorAssignment]) => {
          Object.entries(contributorAssignment.projects).forEach(([projectName, weekDates]) => {
            // Find the project ID by name
            const project = mappedProjects.find(p => p.name === projectName);
            if (!project || !Array.isArray(weekDates)) return;

            weekDates.forEach(weekDate => {
              const date = new Date(weekDate);
              if (!isNaN(date.getTime())) {
                activities.push({
                  id: `a${activityId++}`,
                  contributorId: contributorGithub,
                  projectId: project.id,
                  type: 'assignment',
                  date: date
                });
              }
            });
          });
        });

        setProjects(mappedProjects);
        setContributors(mappedContributors);
        setAllActivity(activities);
        
      } catch (error) {
        console.error('Error loading contributor activity data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  /** Timeline / filter state */
  const [mode, setMode] = useState("lastActivity");
  const [customFrom, setCustomFrom] = useState(isoDate(daysAgo(30)));
  const [customTo, setCustomTo] = useState(isoDate(new Date()));

  const latestActivityDate = useMemo(
    () => allActivity.length > 0 ? new Date(Math.max(...allActivity.map((a) => a.date.getTime()))) : new Date(),
    [allActivity]
  );

  const { start, end } = useMemo(
    () => selectRange(mode, customFrom, customTo, latestActivityDate),
    [mode, customFrom, customTo, latestActivityDate]
  );

  // Filtered activity in the selected time window
  const activity = useMemo(
    () => allActivity.filter((a) => a.date >= start && a.date <= end),
    [allActivity, start, end]
  );

  // Aggregate counts per contributor and per project
  const countsByContributor = useMemo(() => countBy(activity, "contributorId"), [activity]);
  const countsByProject = useMemo(() => countBy(activity, "projectId"), [activity]);

  // Edges present in the selected window
  const edges = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const a of activity) {
      const key = `${a.contributorId}-${a.projectId}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ contributorId: a.contributorId, projectId: a.projectId });
      }
    }
    return out;
  }, [activity]);

  /** Layout refs for drawing connector lines with an SVG overlay */
  const containerRef = useRef<HTMLDivElement>(null);
  const contributorRefs = useRef(new Map<string, HTMLElement>());
  const projectRefs = useRef(new Map<string, HTMLElement>());

  const setContributorRef = (id: string) => (el: HTMLElement | null) => { 
    if (el) contributorRefs.current.set(id, el); 
  };
  const setProjectRef = (id: string) => (el: HTMLElement | null) => { 
    if (el) projectRefs.current.set(id, el); 
  };

  const [lines, setLines] = useState<Array<{a: {x: number, y: number}, b: {x: number, y: number}, key: string}>>([]);

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const newLines = edges.map(({ contributorId, projectId }) => {
        const cEl = contributorRefs.current.get(contributorId);
        const pEl = projectRefs.current.get(projectId);
        if (!cEl || !pEl) return null;
        const a = centerOf(cEl, cRect);
        const b = centerOf(pEl, cRect);
        return { a, b, key: `${contributorId}-${projectId}` };
      }).filter(Boolean);
      setLines(newLines);
    }

    recompute();
    window.addEventListener("resize", recompute);
    const id = setInterval(recompute, 300);
    return () => { window.removeEventListener("resize", recompute); clearInterval(id); };
  }, [edges, mode, customFrom, customTo]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading contributor activity data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header / Timeline */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.timelineCard}>
            <div className={styles.timelineHeader}>
              <h2 className={styles.timelineTitle}>Time line</h2>
              <span className={styles.timelineRange}>
                {start.toLocaleDateString()} → {end.toLocaleDateString()}
              </span>
            </div>
            <div className={styles.filterButtons}>
              <FilterButton active={mode === "lastActivity"} onClick={() => setMode("lastActivity")}>
                Last activity
              </FilterButton>
              <FilterButton active={mode === "lastWeek"} onClick={() => setMode("lastWeek")}>
                Last week
              </FilterButton>
              <FilterButton active={mode === "lastMonth"} onClick={() => setMode("lastMonth")}>
                Last month
              </FilterButton>
              <FilterButton active={mode === "last6Months"} onClick={() => setMode("last6Months")}>
                6 months
              </FilterButton>
              <FilterButton active={mode === "thisYear"} onClick={() => setMode("thisYear")}>
                This year
              </FilterButton>
              <FilterButton active={mode === "custom"} onClick={() => setMode("custom")}>
                Custom date
              </FilterButton>
            </div>
            {mode === "custom" && (
              <div className={styles.customDateInputs}>
                <label className={styles.dateLabel}>
                  From
                  <input 
                    type="date" 
                    className={styles.dateInput}
                    value={customFrom} 
                    onChange={(e) => setCustomFrom(e.target.value)} 
                  />
                </label>
                <label className={styles.dateLabel}>
                  To
                  <input 
                    type="date" 
                    className={styles.dateInput}
                    value={customTo} 
                    onChange={(e) => setCustomTo(e.target.value)} 
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body with connectors overlay */}
      <div ref={containerRef} className={styles.bodyContainer}>
        {/* SVG connectors */}
        <svg className={styles.connectorsSvg} width="100%" height="100%">
          {lines.map(({ a, b, key }) => (
            <Connector key={key} a={a} b={b} />
          ))}
        </svg>

        {/* Contributors row */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Contributors last activity</h3>
          <div className={styles.contributorsGrid}>
            {contributors
              .filter((c) => (countsByContributor[c.id] ?? 0) > 0)
              .map((c) => (
                <div
                  key={c.id}
                  ref={setContributorRef(c.id)}
                  className={styles.contributorCard}
                >
                  <div className={`${styles.contributorBadge} ${styles[c.color.replace(/from-|to-|-/g, '')]}`}>
                    {c.name}
                  </div>
                  <div className={styles.contributorStats}>
                    <div>
                      <div className={styles.statNumber}>{countsByContributor[c.id] ?? 0}</div>
                      <div className={styles.statLabel}>activities</div>
                    </div>
                    <div className={styles.statRange}>in range</div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Projects grid */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Projects last activity</h3>
          <div className={styles.projectsGrid}>
            {projects
              .filter((p) => (countsByProject[p.id] ?? 0) > 0)
              .map((p) => (
                <div 
                  key={p.id} 
                  ref={setProjectRef(p.id)}
                  className={styles.projectCard}
                >
                  <div className={styles.projectName}>{p.name}</div>
                  <div className={styles.projectCount}>{countsByProject[p.id] ?? 0}</div>
                  <div className={styles.projectLabel}>commits / events</div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

/* -------------------- UI Pieces -------------------- */
interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.filterButton} ${active ? styles.filterButtonActive : ''}`}
    >
      {children}
    </button>
  );
}

interface ConnectorProps {
  a: { x: number; y: number };
  b: { x: number; y: number };
}

function Connector({ a, b }: ConnectorProps) {
  // Draw a soft cubic path with a glow
  const path = `M ${a.x},${a.y} C ${a.x + 120},${a.y} ${b.x - 120},${b.y} ${b.x},${b.y}`;
  return (
    <g>
      <path d={path} strokeWidth={8} stroke="rgba(56,189,248,0.12)" fill="none" />
      <path d={path} strokeWidth={2.5} stroke="rgba(125,211,252,0.9)" fill="none" />
    </g>
  );
}

/* -------------------- Utils -------------------- */
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function isoDate(d: Date): string {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
}

function selectRange(mode: string, fromISO: string, toISO: string, latestActivityDate: Date) {
  const now = new Date();
  let start: Date, end: Date;
  switch (mode) {
    case "thisYear":
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
      break;
    case "lastMonth": {
      const m = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start = m;
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      break;
    }
    case "last6Months": {
      start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      end = now;
      break;
    }
    case "lastWeek":
      start = daysAgo(7);
      end = now;
      break;
    case "lastActivity": {
      const latest = latestActivityDate instanceof Date ? latestActivityDate : now;
      start = new Date(latest.getTime() - 14 * 24 * 60 * 60 * 1000); // 14-day window ending at latest
      end = latest;
      break;
    }
    case "custom":
    default:
      start = new Date(fromISO);
      end = new Date(toISO);
  }
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function countBy(rows: any[], key: string) {
  const out: Record<string, number> = {};
  for (const r of rows) out[r[key]] = (out[r[key]] || 0) + 1;
  return out;
}

function centerOf(el: HTMLElement, containerRect: DOMRect) {
  const r = el.getBoundingClientRect();
  return { 
    x: r.left - containerRect.left + r.width / 2, 
    y: r.top - containerRect.top + r.height / 2 
  };
}

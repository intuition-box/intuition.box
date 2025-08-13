import React, { useRef, useEffect, useState } from 'react';
import GalaxyBackground from './GalaxyBackground';
import styles from './Galaxy.module.css';
import { useColorMode } from '@docusaurus/theme-common';
import TargetCursor from '../TextAnimations/TargetCursor/TargetCursor';

// Interfaces
interface BoxConfig {
  id: string;
  // title: string;
  summary: string;
}
interface Project {
  id: string;
  title: string;
  desc: string;
  color?: string;
}
interface Contributor {
  id: string;
  name: string;
  color?: string;
}
interface ProjectFull extends Project {
  date: string;
  category: string;
  progress: number;
  participants: { name: string; color: string }[];
}

// const boxes: BoxConfig[] = [
//   { id: 'thp.box', title: 'The Hacking Project', summary: 'Learn to code by building projects' },
//   { id: 'gnosis.box', title: 'Gnosis Platform', summary: 'Decentralized knowledge sharing' },
//   { id: 'intuition.box', title: 'Intuition Engine', summary: 'AI-driven insights and recommendations' },
//   { id: 'colony.box', title: 'Colony', summary: 'Collaborative project management and governance' },
// ];

const boxes: BoxConfig[] = [
  { id: 'thp.box', summary: 'Learn to code by building projects' },
  { id: 'gnosis.box', summary: 'Decentralized knowledge sharing' },
  { id: 'intuition.box', summary: 'AI-driven insights and recommendations' },
  { id: 'colony.box', summary: 'Collaborative project management and governance' },
];

const contributors: Contributor[] = [
  { id: 'contrib1', name: 'AB', color: '#ffb4b4' },
  { id: 'contrib2', name: 'CD', color: '#a7d8ff' },
  { id: 'contrib3', name: 'EF', color: '#c7a7ff' },
  { id: 'contrib4', name: 'GH', color: '#94e2c4' },
  { id: 'contrib5', name: 'IJ', color: '#ffe4a7' },
  { id: 'contrib6', name: 'KL', color: '#ffa7d6' },
  { id: 'contrib7', name: 'MN', color: '#aef3e3' },
  { id: 'contrib8', name: 'OP', color: '#ffc7a7' },
];

const projects: ProjectFull[] = [
  { id: 'project1', title: 'Projet 1', desc: 'Description', date: 'Last update', category: 'Category', progress: 90, color: '#01c3a8', participants: [{ name: 'JP', color: '#ffb4b4' }, { name: 'MS', color: '#a7d8ff' }] },
  { id: 'project2', title: 'Projet 2', desc: 'Description', date: 'Last update', category: 'Category', progress: 30, color: '#ffb741', participants: [{ name: 'AH', color: '#94e2c4' }, { name: 'SD', color: '#ffa7d6' }] },
  { id: 'project3', title: 'Project 3', desc: 'Description', date: 'Last update', category: 'Category', progress: 50, color: '#a63d2a', participants: [{ name: 'VT', color: '#ffe4a7' }, { name: 'XR', color: '#aef3e3' }] },
  { id: 'project4', title: 'Projet 4', desc: 'Description', date: 'Last update', category: 'Category', progress: 20, color: '#1890ff', participants: [{ name: 'YP', color: '#ffc7a7' }, { name: 'LK', color: '#c7a7ff' }] },
];

const Galaxy: React.FC = () => {
  const [cursorActive, setCursorActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);

  const cancelHideCard = () => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const scheduleHideCard = (delay = 250) => {
    cancelHideCard();
    hideTimer.current = window.setTimeout(() => {
      setSelectedProject(null);
    }, delay);
  };
  useEffect(() => () => cancelHideCard(), []);

  // GALAXY UI INTERACTIF
  const [selectedProject, setSelectedProject] = useState<ProjectFull | null>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const getBoxStyle = (index: number): React.CSSProperties => {
    const diamondAngles = [-90, 0, 180, 90];
    const angleDeg = diamondAngles[index % diamondAngles.length];
    const angle = (angleDeg * Math.PI) / 180;
    const rx = 350;
    const ry = 280;
    const x = rx * Math.cos(angle);
    const y = ry * Math.sin(angle);
    return { transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` };
  };

  const getContributorStyle = (index: number): React.CSSProperties => {
    const duration = 85;
    const radius = 300;
    const delay = -(duration / contributors.length) * index;
    return {
      '--orbit-radius': `${radius}px`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      backgroundColor: contributors[index].color || undefined,
    } as React.CSSProperties;
  };

  const getProjectStyle = (index: number): React.CSSProperties => {
    const duration = 70;
    const radius = 420;
    const delay = -(duration / projects.length) * index;
    return {
      '--orbit-radius': `${radius}px`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      backgroundColor: projects[index].color || undefined,
    } as React.CSSProperties;
  };

  const pauseOrbit = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.animationPlayState = 'paused';
    el.style.webkitAnimationPlayState = 'paused';
  };
  const resumeOrbit = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.animationPlayState = 'running';
    el.style.webkitAnimationPlayState = 'running';
  };

  return (
    <div
      className={`${styles.galaxyWrapper} galaxy-scope ${cursorActive ? styles.cursorActive : ''}`}
      onMouseEnter={() => setCursorActive(true)}
      onMouseLeave={() => setCursorActive(false)}
    >
    {/* Three.js galaxy background */}
    <GalaxyBackground title="FABLAB.BOX" />

      {/* Cards .box */}
      <div className={styles.boxesContainer}>
        {boxes.map((box, index) => (
          <div
            key={box.id}
            className={`${styles.dotbox} cursor-target`}
            style={getBoxStyle(index)}
          >
            <h3 className={styles.dotboxTitle}>{box.id}</h3>
            <div className={styles.dotboxContent}>
              {/* <div className={styles.dotboxSubtitle}>{box.title}</div> */}
              <p className={styles.dotboxSummary}>{box.summary}</p>
              
              {/* LEFT: Projects */}
              <div className={styles.dotboxMetrics}>
                <div className={styles.metricsBlock}>
                  <div className={styles.metricsTitle}>projects</div>
                  <div className={styles.metricsRow}>
                    <div className={styles.stack}>
                      <div className={`${styles.badge} ${styles.badgeProject}`} />
                      <div className={`${styles.badge} ${styles.badgeProject}`} />
                    </div>
                    <span className={styles.metricsPlus}>+9</span>
                  </div>
                </div>

                {/* RIGHT: Contributors */}
                <div className={styles.metricsBlock}>
                  <div className={styles.metricsTitle}>contributors</div>
                  <div className={styles.metricsRow}>
                    <div className={styles.stack}>
                      <div className={`${styles.badge} ${styles.badgeContrib}`} />
                      <div className={`${styles.badge} ${styles.badgeContrib}`} />
                      <div className={`${styles.badge} ${styles.badgeContrib}`} />
                    </div>
                    <span className={styles.metricsPlus}>+7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contributors orbit */}
      <div className={styles.orbit}>
        {contributors.map((contrib, index) => (
          <div
            key={contrib.id}
            className={`${styles.contributor} cursor-target`}
            style={getContributorStyle(index)}
            onMouseEnter={pauseOrbit}
            onMouseLeave={resumeOrbit}
          >
            {contrib.name}
          </div>
        ))}
      </div>

      {/* Projects orbit */}
      <div className={styles.orbitProjects}>
        {projects.map((proj, index) => (
          <div
            key={proj.id}
            data-role="project" 
            className={`${styles.project} cursor-target`}
            style={getProjectStyle(index)}
            onMouseEnter={(e) => {
              cancelHideCard();
              pauseOrbit(e);
              setSelectedProject(proj);
              setCardPos({ x: e.clientX + 12, y: e.clientY + 12 });
            }}
            onMouseLeave={(e) => {
              resumeOrbit(e);
              const next = e.relatedTarget as Node | null;
              if (cardRef.current && next && cardRef.current.contains(next)) {
                cancelHideCard();
                return;
              }
              scheduleHideCard(250);
            }}
            onMouseMove={(e) => {
              if (selectedProject?.id === proj.id) {
                setCardPos({ x: e.clientX + 20, y: e.clientY + 20 });
              }
            }}
          />
        ))}
      </div>

      {/* Project popup */}
      {selectedProject && (
        <div
          ref={cardRef}
          className={`${styles.projectCard} cursor-target`}
          style={{
            left: cardPos.x,
            top: cardPos.y,
            background: `radial-gradient(ellipse at right top, ${selectedProject.color}80 0%, #151419 45%, #151419 100%)`,
            pointerEvents: 'auto',
          }}
          onMouseEnter={cancelHideCard}
          onMouseLeave={(e) => {
            const nextEl = e.relatedTarget as Element | null;
            if (nextEl && nextEl.closest('[data-role="project"]')) {
              cancelHideCard();
              return;
            }
            scheduleHideCard(220);
          }}
        >
          <div className={styles.projectCardHeader}>
            <div className={styles.projectDate}>{selectedProject.date}</div>
            <svg className={styles.projectIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={styles.projectCardBody}>
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.desc}</p>
            <div className={styles.projectProgress}>
              <span>Progress</span>
              <div className={styles.projectProgressBar}>
                <div className={styles.projectProgressBarFill} style={{ width: `${selectedProject.progress}%`, background: selectedProject.color }} />
              </div>
              <span>{selectedProject.progress}%</span>
            </div>
          </div>
          <div className={styles.projectCardFooter}>
            <ul>
              {selectedProject.participants.map((p, idx) => (
                <li key={idx}><span style={{ backgroundColor: p.color }}>{p.name}</span></li>
              ))}
              <li>
                <div className={styles.projectBtnAdd} style={{ background: selectedProject.color }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                  </svg>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {cursorActive && (
        <TargetCursor targetSelector=".galaxy-scope .cursor-target" spinDuration={5} hideDefaultCursor={false} />
      )}
    </div>
  );
};

export default Galaxy;

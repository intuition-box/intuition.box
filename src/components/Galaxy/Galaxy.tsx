import React, { useRef, useEffect, useState, MouseEvent } from 'react';
import * as THREE from 'three';
import styles from './Galaxy.module.css';
import { useColorMode } from '@docusaurus/theme-common';
import TargetCursor from '../TextAnimations/TargetCursor/TargetCursor';

// Interfaces
interface BoxConfig {
  id: string;
  title: string;
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

const boxes: BoxConfig[] = [
  {
    id: 'thp.box',
    title: 'The Hacking Project',
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dui arcu, bibendum eu nulla sed, imperdiet condimentum ligula. Cras at lobortis lacus.",
  },
  {
    id: 'gnosis.box',
    title: 'Gnosis Platform',
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dui arcu, bibendum eu nulla sed, imperdiet condimentum ligula. Cras at lobortis lacus.",
  },
  {
    id: 'intuition.box',
    title: 'Intuition Engine',
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dui arcu, bibendum eu nulla sed, imperdiet condimentum ligula. Cras at lobortis lacus.",
  },
  {
    id: 'new.box',
    title: 'New Box',
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dui arcu, bibendum eu nulla sed, imperdiet condimentum ligula. Cras at lobortis lacus.",
  },
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
  {
    id: 'project1',
    title: 'Projet 1',
    desc: 'Description',
    date: 'Last update',
    category: 'Category',
    progress: 90,
    color: '#01c3a8',
    participants: [
      { name: 'JP', color: '#ffb4b4' },
      { name: 'MS', color: '#a7d8ff' },
    ],
  },
  {
    id: 'project2',
    title: 'Projet 2',
    desc: 'Description',
    date: 'Last update',
    category: 'Category',
    progress: 30,
    color: '#ffb741',
    participants: [
      { name: 'AH', color: '#94e2c4' },
      { name: 'SD', color: '#ffa7d6' },
    ],
  },
  {
    id: 'project3',
    title: 'Project 3',
    desc: 'Description',
    date: 'Last update',
    category: 'Category',
    progress: 50,
    color: '#a63d2a',
    participants: [
      { name: 'VT', color: '#ffe4a7' },
      { name: 'XR', color: '#aef3e3' },
    ],
  },
  {
    id: 'project4',
    title: 'Projet 4',
    desc: 'Description',
    date: 'Last update',
    category: 'Category',
    progress: 20,
    color: '#1890ff',
    participants: [
      { name: 'YP', color: '#ffc7a7' },
      { name: 'LK', color: '#c7a7ff' },
    ],
  },
];

const Galaxy: React.FC = () => {
  const [cursorActive, setCursorActive] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const container = bgRef.current;
    if (!container) return;

    // Three.js: Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 15, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Star field
    const starGroup = new THREE.Group();
    scene.add(starGroup);
    const starCount = 4000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const colorInside = colorMode === 'light'
      ? new THREE.Color(0x181822)
      : new THREE.Color(0xffffff);

    const colorOutside = colorMode === 'light'
      ? new THREE.Color(0x0a0a19)
      : new THREE.Color(0x8888ff);

    const branchCount = 5;
    const maxRadius = 8;
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * maxRadius;
      const branch = i % branchCount;
      const baseAngle = (branch / branchCount) * Math.PI * 2;
      const spinAngle = radius * 0.5;
      const randomOffset = (Math.random() - 0.5) * 0.4;
      const angle = baseAngle + spinAngle + randomOffset;
      starPositions[i3] = Math.sin(angle) * radius + (Math.random() - 0.5);
      starPositions[i3 + 1] = (Math.random() - 0.5) * 0.5;
      starPositions[i3 + 2] = Math.cos(angle) * radius + (Math.random() - 0.5);
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / maxRadius);
      starColors[i3] = mixedColor.r;
      starColors[i3 + 1] = mixedColor.g;
      starColors[i3 + 2] = mixedColor.b;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    starGroup.add(starField);

    function animate() {
      rafId.current = requestAnimationFrame(animate);
      starGroup.rotation.y += 0.0005;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
      container.removeChild(renderer.domElement);
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [colorMode]);

  // GALAXY UI INTERACTIF
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectFull | null>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleBoxEnter = (_index: number) => {};
  const handleBoxLeave = () => {};

  const handleProjectClick = (e: MouseEvent<HTMLDivElement>, project: ProjectFull) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
    setCardPos({ x: e.clientX + 20, y: e.clientY + 20 });
  };

  useEffect(() => {
    const handleDocClick = () => setSelectedProject(null);
    if (selectedProject) {
      document.addEventListener('click', handleDocClick);
    }
    return () => document.removeEventListener('click', handleDocClick);
  }, [selectedProject]);

  const getBoxStyle = (index: number): React.CSSProperties => {
    const diamondAngles = [-90, 0, 180, 90];
    const angleDeg = diamondAngles[index % diamondAngles.length];
    const angle = (angleDeg * Math.PI) / 180;
    const rx = 350;
    const ry = 280;
    const x = rx * Math.cos(angle);
    const y = ry * Math.sin(angle);
    return {
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
    };
  };

  const getContributorStyle = (index: number): React.CSSProperties => {
    const duration = 60;
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
    const duration = 50;
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
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Central circle */}
      <div className={styles.centralCircle}>
        <h2>FABLAB.BOX</h2>
      </div>

      {/* Diamond cards */}
      <div className={styles.boxesContainer}>
        {boxes.map((box, index) => (
          <div
            key={box.id}
            className={`${styles.diamondCard} cursor-target`}
            style={getBoxStyle(index)}
            onMouseEnter={() => handleBoxEnter(index)}
            onMouseLeave={handleBoxLeave}
          >
            <h3 className={styles.diamondCardTitle}>{box.id}</h3>
            <div className={styles.diamondCardContent}>
              <div className={styles.boxSubtitle}>{box.title}</div>
              <p className={styles.boxSummary}>{box.summary}</p>
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
            className={`${styles.project} cursor-target`}
            style={getProjectStyle(index)}
            onMouseEnter={pauseOrbit}
            onMouseLeave={resumeOrbit}
            onClick={(e) => handleProjectClick(e, proj)}
          />
        ))}
      </div>

      {/* Project popup */}
      {selectedProject && (
        <div
          className={`${styles.taskCard} cursor-target`}
          style={{
            left: cardPos.x,
            top: cardPos.y,
            background: 'radial-gradient(ellipse at right top, ' + selectedProject.color + '80 0%, #151419 45%, #151419 100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.taskCardHeader}>
            <div className={styles.taskDate}>{selectedProject.date}</div>
            <svg
              className={styles.taskIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className={styles.taskCardBody}>
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.desc}</p>
            <div className={styles.taskProgress}>
              <span>Progress</span>
              <div className={styles.taskProgressBar}>
                <div
                  className={styles.taskProgressBarFill}
                  style={{ width: `${selectedProject.progress}%`, background: selectedProject.color }}
                />
              </div>
              <span>{selectedProject.progress}%</span>
            </div>
          </div>
          <div className={styles.taskCardFooter}>
            <ul>
              {selectedProject.participants.map((p, idx) => (
                <li key={idx}>
                  <span style={{ backgroundColor: p.color }}>{p.name}</span>
                </li>
              ))}
              <li>
                <div className={styles.taskBtnAdd} style={{ background: selectedProject.color }}>
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
        </div>
      )}

      {cursorActive && (
        <TargetCursor
          targetSelector=".galaxy-scope .cursor-target"
          spinDuration={5}
          hideDefaultCursor={false}
        />
      )}
    </div>
  );
};

export default Galaxy;

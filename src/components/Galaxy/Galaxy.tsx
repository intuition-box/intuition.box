import React, { useRef, useEffect, useState } from 'react';
import GalaxyBackground from './GalaxyBackground';
import styles from './Galaxy.module.css';
import TargetCursor from '../TextAnimations/TargetCursor/TargetCursor';
import BoxCards from './BoxCards';
import ContributorsOrbit from "./Contributors";
import ProjectsWithCard from "./Projects";
import { useIsMobile } from "../../hooks/useAutoGrid";

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
  const isMobile = useIsMobile();

  return (
    <div
      className={`${styles.galaxyWrapper} galaxy-scope ${cursorActive ? styles.cursorActive : ''}`}
      onMouseEnter={() => { if (!isMobile) setCursorActive(true); }}
      onMouseLeave={() => { if (!isMobile) setCursorActive(false); }}
    >

    <GalaxyBackground title="FABLAB.BOX" />
    <BoxCards items={boxes} />
    <ContributorsOrbit contributors={contributors} />
    <ProjectsWithCard projects={projects} />

      {!isMobile && cursorActive && (
        <TargetCursor targetSelector=".galaxy-scope .cursor-target" spinDuration={5} hideDefaultCursor={false} />
      )}
    </div>
  );
};

export default Galaxy;

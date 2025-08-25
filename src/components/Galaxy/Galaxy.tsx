import React, { useRef, useEffect, useState } from 'react';
import GalaxyBackground from './GalaxyBackground';
import styles from './Galaxy.module.css';
import ContributorCards from './ContributorCards';
import CommitsOrbit from "./Commits";
import ProjectsWithCard from "./Projects";
import { useIsMobile } from "../../hooks/useAutoGrid";

// Interfaces
interface Contributor {
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
interface Commit {
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

const contrib: Contributor[] = [
  { id: 'contrib1', summary: 'Learn to code by building projects' },
  { id: 'contrib2', summary: 'Decentralized knowledge sharing' },
  { id: 'contrib3', summary: 'AI-driven insights and recommendations' },
  { id: 'contrib4', summary: 'Collaborative project management and governance' },
];

const commits: Commit[] = [
  { id: 'commit1', name: 'C1', color: '#ffb4b4' },
  { id: 'commit2', name: 'C2', color: '#a7d8ff' },
  { id: 'commit3', name: 'C3', color: '#c7a7ff' },
  { id: 'commit4', name: 'C4', color: '#94e2c4' },
  { id: 'commit5', name: 'C5', color: '#ffe4a7' },
  { id: 'commit6', name: 'C6', color: '#ffa7d6' },
  { id: 'commit7', name: 'C7', color: '#aef3e3' },
  { id: 'commit8', name: 'C8', color: '#ffc7a7' },
];

const projects: ProjectFull[] = [
  { id: 'project1', title: 'Projet 1', desc: 'Description', date: 'Last update', category: 'Category', progress: 90, color: '#01c3a8', participants: [{ name: 'JP', color: '#ffb4b4' }, { name: 'MS', color: '#a7d8ff' }] },
  { id: 'project2', title: 'Projet 2', desc: 'Description', date: 'Last update', category: 'Category', progress: 30, color: '#ffb741', participants: [{ name: 'AH', color: '#94e2c4' }, { name: 'SD', color: '#ffa7d6' }] },
  { id: 'project3', title: 'Project 3', desc: 'Description', date: 'Last update', category: 'Category', progress: 50, color: '#a63d2a', participants: [{ name: 'VT', color: '#ffe4a7' }, { name: 'XR', color: '#aef3e3' }] },
  { id: 'project4', title: 'Projet 4', desc: 'Description', date: 'Last update', category: 'Category', progress: 20, color: '#1890ff', participants: [{ name: 'YP', color: '#ffc7a7' }, { name: 'LK', color: '#c7a7ff' }] },
];

const Galaxy: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`${styles.galaxyWrapper} galaxy-scope`}>

    <GalaxyBackground title="INTUITION.BOX" />
    <ContributorCards items={contrib} />
    <CommitsOrbit commits={commits} />
    <ProjectsWithCard projects={projects} />

    </div>
  );
};

export default Galaxy;

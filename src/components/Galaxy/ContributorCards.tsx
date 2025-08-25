import React from "react";
import styles from "./Galaxy.module.css";
import ContributorCard from "./ContributorCard";

export type ContributorItem = {
  id: string;
  summary: string;
  projects?: (string | { id: string; name: string; url?: string })[];
  avatarUrl?: string;
  onClick?: () => void;
  profileUrl?: string;
};

export type ContributorCardsProps = {
  items: ContributorItem[];
  getStyle?: (index: number) => React.CSSProperties;
};

const defaultGetStyle = (index: number): React.CSSProperties => {
  const diamondAngles = [-90, 0, 180, 90];
  const angleDeg = diamondAngles[index % diamondAngles.length];
  const angle = (angleDeg * Math.PI) / 180;
  const rx = 350, ry = 280;
  return { transform: `translate(-50%, -50%) translate(${rx * Math.cos(angle)}px, ${ry * Math.sin(angle)}px)` };
};

export default function ContributorCards({ items, getStyle = defaultGetStyle }: ContributorCardsProps) {
  return (
    <div className={styles.boxesContainer}>
      {items.map((b, i) => (
        <ContributorCard
          key={b.id}
          title={b.id}
          summary={b.summary}
          projects={b.projects}
          avatarUrl={b.avatarUrl}
          profileUrl={b.profileUrl}
          onClick={b.onClick}
          style={getStyle(i)}
        />
      ))}
    </div>
  );
}

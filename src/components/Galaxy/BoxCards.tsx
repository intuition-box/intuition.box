import React from "react";
import styles from "./Galaxy.module.css";
import BoxCard from "./BoxCard";

export type BoxItem = { id: string; summary: string };

export type BoxCardsProps = {
  items: BoxItem[];
  getStyle?: (index: number) => React.CSSProperties;
};

const defaultGetStyle = (index: number): React.CSSProperties => {
  const diamondAngles = [-90, 0, 180, 90];
  const angleDeg = diamondAngles[index % diamondAngles.length];
  const angle = (angleDeg * Math.PI) / 180;
  const rx = 350, ry = 280;
  const x = rx * Math.cos(angle);
  const y = ry * Math.sin(angle);
  return { transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` };
};

export default function BoxCards({ items, getStyle = defaultGetStyle }: BoxCardsProps) {
  return (
    <div className={styles.boxesContainer}>
      {items.map((b, i) => (
        <BoxCard key={b.id} id={b.id} summary={b.summary} style={getStyle(i)} />
      ))}
    </div>
  );
}

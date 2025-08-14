import React from "react";
import SciFiPanel from "./SciFiPanel";
import styles from "./OffersPanel.module.css";
import { useAutoGrid } from "../../hooks/useAutoGrid";

type OfferItem = { id: string; title: string; desc?: string; href?: string; icon?: React.ReactNode; };

export default function OffersPanel() {
  const items: OfferItem[] = [
    { id:"forum", title:"Forum : discourse", desc:"Lorem ipsum", href:"#", icon:<>💬</> },
    { id:"email", title:"email : …..", desc:"Lorem ipsum", href:"#", icon:<>📧</> },
    { id:"design", title:"Design : penpot", desc:"Lorem ipsum", href:"#", icon:<>🎨</> },
    { id:"processes", title:"processes : templates", desc:"Lorem ipsum", href:"#", icon:<>📄</> },
    { id:"mindmap", title:"mindmap : excalidraw", desc:"Lorem ipsum", href:"#", icon:<>🗺️</> },
    { id:"values", title:"org values", desc:"Lorem ipsum", href:"#", icon:<>🌱</> },
    { id:"voting", title:"voting", desc:"Lorem ipsum", href:"#", icon:<>🗳️</> },
    { id:"finance", title:"finance", desc:"Lorem ipsum", href:"#", icon:<>💰</> },
  ];

  const layout = useAutoGrid(items, { rows: 3, step: 2, minPerItem: 4, autoTall: true, tallRows: 2 });

  return (
    <SciFiPanel variant="large">
      <header className={styles.header}>
        <h2 className={styles.h2}>WHAT FABLAB OFFERS ?</h2>
        <p className={styles.subtitle}>Short description</p>
      </header>

      <div className={styles.grid}>
        {layout.map(({ data, style, isGhost }, i) => {
          const it = data as OfferItem;
          const Tag: any = !isGhost && it.href ? "a" : "div";
          return (
            <Tag key={isGhost ? `ghost-${i}` : it.id}
                 className={`${styles.card} ${isGhost ? styles.ghost : ""}`}
                 style={style}
                 href={!isGhost ? it.href : undefined}
                 target={!isGhost && it.href?.startsWith("http") ? "_blank" : undefined}
                 rel={!isGhost && it.href?.startsWith("http") ? "noreferrer" : undefined}>
              {!isGhost && (
                <div className={styles.inner}>
                  {it.icon && <div className={styles.icon}>{it.icon}</div>}
                  <h3 className={styles.title}>{it.title}</h3>
                  {it.desc && <p className={styles.desc}>{it.desc}</p>}
                </div>
              )}
            </Tag>
          );
        })}
      </div>
    </SciFiPanel>
  );
}

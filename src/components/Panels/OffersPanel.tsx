import React, { useEffect, useMemo, useRef, useState } from "react";
import Panel from "./Panel";
import styles from "./OffersPanel.module.css";
import { useAutoGrid, useIsMobile } from "../../hooks/useAutoGrid";

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

  const isMobile = useIsMobile();
  const layout = useAutoGrid(items, { rows: 3, step: 2, minPerItem: 4, autoTall: true, tallRows: 2 });

// mobile
  const visibleItems = useMemo(() => items, [items]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const scrollEndTO = useRef<number | null>(null);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, visibleItems.length - 1));
    const child = el.children.item(clamped) as HTMLElement | null;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setIndex(clamped);
  };

  const snapToClosest = () => {
    const el = trackRef.current; if (!el) return;
    const tr = el.getBoundingClientRect();
    const center = tr.left + tr.width / 2;
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const r = (el.children[i] as HTMLElement).getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    setIndex(best);
    const child = el.children.item(best) as HTMLElement | null;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const onTrackScroll = () => {
    const el = trackRef.current; if (!el) return;
    const tr = el.getBoundingClientRect();
    const center = tr.left + tr.width / 2;
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const r = (el.children[i] as HTMLElement).getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    setIndex(best);

    if (scrollEndTO.current) window.clearTimeout(scrollEndTO.current);
    scrollEndTO.current = window.setTimeout(snapToClosest, 80);
  };

  useEffect(() => {
    if (!isMobile) return;
    requestAnimationFrame(() => scrollTo(0));
  }, [isMobile]);

  const onMoveTilt = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;

    const tilt = 5;
    const rx = (ny - 0.5) * -2 * tilt;
    const ry = (nx - 0.5) *  2 * tilt;

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${nx}`);
    el.style.setProperty("--my", `${ny}`);
  };

  const onLeaveTilt = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  };

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <h2 className={styles.h2}>WHAT INTUITION.BOX OFFERS ?</h2>
        <p className={styles.subtitle}>Short description</p>
      </header>

      {!isMobile && (
        <div className={styles.grid}>
          {layout.map(({ data, style, isGhost }, i) => {
            const it = data as OfferItem;
            const Tag: any = !isGhost && it.href ? "a" : "div";
            return (
              <Tag key={isGhost ? `ghost-${i}` : it.id}
                className={`${styles.card} ${isGhost ? styles.ghost : styles.glassTiltSoft}`}
                style={style}
                href={!isGhost ? it.href : undefined}
                target={!isGhost && it.href?.startsWith("http") ? "_blank" : undefined}
                rel={!isGhost && it.href?.startsWith("http") ? "noreferrer" : undefined}
                onMouseMove={!isGhost ? onMoveTilt : undefined}
                onMouseLeave={!isGhost ? onLeaveTilt : undefined}
              >
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
      )}

      {isMobile && (
        <div className={styles.carousel} aria-roledescription="carousel">
          <div
            className={styles.track}
            ref={trackRef}
            onScroll={onTrackScroll}
            tabIndex={0}
            aria-label="Offers Carousel"
          >
            {visibleItems.map((it) => {
              const Tag: any = it.href ? "a" : "div";
              return (
                <Tag key={it.id}
                  className={`${styles.card} ${styles.slide}`}
                  href={it.href}
                  target={it.href?.startsWith("http") ? "_blank" : undefined}
                  rel={it.href?.startsWith("http") ? "noreferrer" : undefined}
                >
                  <div className={styles.inner}>
                    {it.icon && <div className={styles.icon}>{it.icon}</div>}
                    <h3 className={styles.title}>{it.title}</h3>
                    {it.desc && <p className={styles.desc}>{it.desc}</p>}
                  </div>
                </Tag>
              );
            })}
          </div>

          <div className={styles.controls}>
            <button className={styles.navBtn} onClick={() => scrollTo(index - 1)} aria-label="Previous">‹</button>
            <div className={styles.dots} role="tablist" aria-label="Slides">
              {visibleItems.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                  aria-selected={i === index}
                  role="tab"
                  onClick={() => scrollTo(i)}
                />
              ))}
            </div>
            <button className={styles.navBtn} onClick={() => scrollTo(index + 1)} aria-label="Next">›</button>
          </div>
        </div>
      )}
    </section>
  );
}

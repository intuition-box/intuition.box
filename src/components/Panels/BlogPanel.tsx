import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
import styles from "./BlogPanel.module.css";
import Panel from "./Panel";
import { useIsMobile } from "../../hooks/useAutoGrid";

import blogList from "@site/.docusaurus/docusaurus-plugin-content-blog/default/blog-post-list-prop-default.json";

type Post = {
  title: string;
  href: string;
  date: string;
  description?: string;
  readingTime?: number | { minutes?: number; words?: number };
  image?: string;
};

const RAW: any[] = Array.isArray((blogList as any).blogPosts)
  ? (blogList as any).blogPosts
  : Array.isArray((blogList as any).items)
  ? (blogList as any).items.map((it: any) => it?.content?.metadata ?? it?.metadata ?? it)
  : [];

const POSTS: Post[] = RAW
  .filter((m: any) => m?.permalink && m?.date)
  .map((m: any) => ({
    title: m.title,
    href: m.permalink,
    date: m.date,
    description: m.description,
    readingTime: m.readingTime,
    image: m.image || m.frontMatter?.image,
  }));

function getRecent(limit = 3, onlyYear?: number) {
  let list = POSTS;
  if (onlyYear) list = list.filter((p) => new Date(p.date).getFullYear() === onlyYear);
  return list.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, limit);
}

function fmtReading(rt: Post["readingTime"]) {
  if (typeof rt === "number") return Math.ceil(rt);
  if (rt && typeof rt.minutes === "number") return Math.ceil(rt.minutes);
  return undefined;
}

export default function BlogPanel({
  limit = 3,
  blogBasePath = "/blog",
  onlyYear,
  className,
}: {
  limit?: number;
  blogBasePath?: string;
  onlyYear?: number;
  className?: string;
}) {
  const { i18n } = useDocusaurusContext();
  const posts = getRecent(limit, onlyYear);
  const isMobile = useIsMobile();

  const visible = useMemo(() => posts, [posts]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const scrollEndTO = useRef<number | null>(null);

  const whenFmt = (d: string) =>
    new Intl.DateTimeFormat(i18n?.currentLocale || "fr-FR", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(d));

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, visible.length - 1));
    const child = el.children.item(clamped) as HTMLElement | null;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setIndex(clamped);
  };

  const snapToClosest = () => {
    const el = trackRef.current;
    if (!el) return;
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
    if (scrollEndTO.current) window.clearTimeout(scrollEndTO.current);
    scrollEndTO.current = window.setTimeout(snapToClosest, 80);
  };

  useEffect(() => {
    if (!isMobile) return;
    requestAnimationFrame(() => scrollTo(0));
  }, [isMobile]);

  return (
    <Panel variant="large">
      <section className={clsx(styles.panel, className)}>
        <header className={styles.header}>
          <h2 className={styles.title}>LAST NEWS</h2>
        </header>

        {!isMobile && (
          <div className={styles.grid}>
            {posts.length === 0 ? (
              <article className={styles.card}>
                <div className={clsx(styles.media, styles.mediaPlaceholder)} />
                <div className={styles.body}>
                  <h3 className={styles.postTitle}>No article</h3>
                  <p className={styles.desc}>Add an article in <code>/blog</code>.</p>
                </div>
              </article>
            ) : (
              posts.map((p) => {
                const reading = fmtReading(p.readingTime);
                return (
                  <article key={p.href} className={styles.card}>
                    {/* overlay link ok sur desktop */}
                    <Link to={p.href} className={styles.cardLink} aria-label={p.title} />
                    {p.image ? (
                      <div className={styles.media} style={{ backgroundImage: `url(${p.image})` }} />
                    ) : (
                      <div className={clsx(styles.media, styles.mediaPlaceholder)} />
                    )}
                    <div className={styles.body}>
                      <h3 className={styles.postTitle}><Link to={p.href}>{p.title}</Link></h3>
                      <div className={styles.meta}>
                        <time className={styles.date}>{whenFmt(p.date)}</time>
                        {typeof reading === "number" && (
                          <>
                            <span className={styles.dot} aria-hidden>•</span>
                            <span className={styles.reading}>{reading} min</span>
                          </>
                        )}
                      </div>
                      {p.description && <p className={styles.desc}>{p.description}</p>}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

        {isMobile && (
          <div className={styles.carousel} aria-roledescription="carousel">
            <div
              className={styles.track}
              ref={trackRef}
              onScroll={onTrackScroll}
              tabIndex={0}
              aria-label="Blog Carousel"
            >
              {visible.map((p) => {
                const reading = fmtReading(p.readingTime);
                return (
                  <article key={p.href} className={`${styles.card} ${styles.slide}`}>
                    {/* pas d’overlay .cardLink pour laisser le swipe */}
                    {p.image ? (
                      <div className={styles.media} style={{ backgroundImage: `url(${p.image})` }} />
                    ) : (
                      <div className={clsx(styles.media, styles.mediaPlaceholder)} />
                    )}
                    <div className={styles.body}>
                      <h3 className={styles.postTitle}><Link to={p.href}>{p.title}</Link></h3>
                      <div className={styles.meta}>
                        <time className={styles.date}>{whenFmt(p.date)}</time>
                        {typeof reading === "number" && (
                          <>
                            <span className={styles.dot} aria-hidden>•</span>
                            <span className={styles.reading}>{reading} min</span>
                          </>
                        )}
                      </div>
                      {p.description && <p className={styles.desc}>{p.description}</p>}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className={styles.controls}>
              <button className={styles.navBtn} onClick={() => scrollTo(index - 1)} aria-label="Previous">‹</button>
              <div className={styles.dots} role="tablist" aria-label="Slides">
                {visible.map((_, i) => (
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

        <div className={styles.actions}>
          <Link className={styles.seeAll} to={blogBasePath}>SEE ALL</Link>
        </div>
      </section>
    </Panel>
  );
}

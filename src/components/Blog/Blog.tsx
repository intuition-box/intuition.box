import React, {useEffect, useMemo, useRef, useState, useCallback} from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
import styles from "./Blog.module.css";
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

function getRecent(limit = 10, onlyYear?: number) {
  let list = POSTS;
  if (onlyYear) list = list.filter((p) => new Date(p.date).getFullYear() === onlyYear);
  return list.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, limit);
}

function fmtReading(rt: Post["readingTime"]) {
  if (typeof rt === "number") return Math.ceil(rt);
  if (rt && typeof rt.minutes === "number") return Math.ceil(rt.minutes);
  return undefined;
}

function InfiniteLooper({ posts, whenFmt }: { posts: Post[]; whenFmt: (d: string) => string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const maxBoost = 2.6;
  const speedRef = useRef(0);
  const targetSpeedRef = useRef(0);
  const offsetRef = useRef(0);

  const getSetWidth = useCallback(() => setRef.current?.scrollWidth ?? 0, []);

  const tick = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.1;

    const w = getSetWidth();
    if (w > 0) {
      offsetRef.current += speedRef.current;
      if (offsetRef.current >= w) offsetRef.current -= w;
      else if (offsetRef.current < 0) offsetRef.current += w;

      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [getSetWidth]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    const onResize = () => {};
    window.addEventListener("resize", onResize);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [tick]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const vw = Math.max(1, window.innerWidth);
      let ratio = (e.clientX / vw) * 2 - 1; // -1..1
      const dead = 0.06;
      if (Math.abs(ratio) < dead) ratio = 0;
      const curved = Math.sign(ratio) * Math.pow(Math.abs(ratio), 0.9);
      targetSpeedRef.current = curved * maxBoost;
    };
    const onMouseLeave = () => (targetSpeedRef.current = 0);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      className={styles.loopContainer}
      ref={containerRef}
      aria-roledescription="carousel"
    >
      <div className={styles.loopTrack} ref={trackRef}>
        <div className={styles.loopSet} ref={setRef}>
          {posts.map((p) => {
            const reading = fmtReading(p.readingTime);
            return (
              <article
                key={"a-" + p.href}
                className={clsx(styles.card, styles.loopCard)}
              >
                <Link
                  to={p.href}
                  className={styles.cardLink}
                  aria-label={p.title}
                />
                {p.image ? (
                  <div
                    className={styles.media}
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                ) : (
                  <div
                    className={clsx(styles.media, styles.mediaPlaceholder)}
                  />
                )}
                <div className={styles.body}>
                  <h3 className={styles.postTitle}>
                    <Link to={p.href}>{p.title}</Link>
                  </h3>
                  <div className={styles.meta}>
                    <time className={styles.date}>{whenFmt(p.date)}</time>
                    {typeof reading === "number" && (
                      <>
                        <span className={styles.dot} aria-hidden>
                          •
                        </span>
                        <span className={styles.reading}>{reading} min</span>
                      </>
                    )}
                  </div>
                  {p.description && (
                    <p className={styles.desc}>{p.description}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.loopSet} aria-hidden>
          {posts.map((p) => {
            const reading = fmtReading(p.readingTime);
            return (
              <article
                key={"b-" + p.href}
                className={clsx(styles.card, styles.loopCard)}
              >
                <Link
                  to={p.href}
                  className={styles.cardLink}
                  aria-label={p.title}
                />
                {p.image ? (
                  <div
                    className={styles.media}
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                ) : (
                  <div
                    className={clsx(styles.media, styles.mediaPlaceholder)}
                  />
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
      </div>
    </div>
  );
}

function MobileCarousel({ posts, whenFmt }: { posts: Post[]; whenFmt: (d: string) => string }) {
  const visible = useMemo(() => posts, [posts]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, visible.length - 1));
    const child = el.children.item(clamped) as HTMLElement | null;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setIndex(clamped);
  };

  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;

    const tr = el.getBoundingClientRect();
    const center = tr.left + tr.width / 2;
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const r = (el.children[i] as HTMLElement).getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) { best = i; bestDist = d; }
    }
    setIndex(best);
  };

  return (
    <div className={styles.carousel} aria-roledescription="carousel">
      <div
        className={styles.track}
        ref={trackRef}
        onScroll={onTrackScroll}
        tabIndex={0}
        aria-label="Blog posts carousel"
      >
        {visible.map((p) => (
          <article key={p.href} className={clsx(styles.card, styles.slide)}>
            <Link to={p.href} className={styles.cardLink} aria-label={p.title} />
            {p.image ? (
              <Link to={p.href} aria-label={p.title}>
                <div className={styles.media} style={{ backgroundImage: `url(${p.image})` }} />
              </Link>
            ) : (
              <div className={clsx(styles.media, styles.mediaPlaceholder)} />
            )}
            <div className={styles.body}>
              <h3 className={styles.postTitle}><Link to={p.href}>{p.title}</Link></h3>
              <div className={styles.meta}>
                <time className={styles.date}>{whenFmt(p.date)}</time>
                {typeof fmtReading(p.readingTime) === "number" && (
                  <>
                    <span className={styles.dot} aria-hidden>•</span>
                    <span className={styles.reading}>{fmtReading(p.readingTime)} min</span>
                  </>
                )}
              </div>
              {p.description && <p className={styles.desc}>{p.description}</p>}
            </div>
          </article>
        ))}
      </div>

      <div className={styles.controls}>
        <button className={styles.navBtn} onClick={() => scrollTo(index - 1)} aria-label="Previous">‹</button>
        <div className={styles.dots} role="tablist" aria-label="Slides">
          {visible.map((_, i) => (
            <button
              key={i}
              className={clsx(styles.dot, i === index && styles.dotActive)}
              aria-selected={i === index}
              role="tab"
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <button className={styles.navBtn} onClick={() => scrollTo(index + 1)} aria-label="Next">›</button>
      </div>
    </div>
  );
}

export default function Blog({
  limit = 10,
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

  const whenFmt = (d: string) =>
    new Intl.DateTimeFormat(i18n?.currentLocale || "fr-FR", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(d));

  return (
    <section className={clsx(styles.panel, className)}>
      <header className={styles.header}>
        <h2 className={styles.title}>LAST NEWS</h2>
      </header>

      {!isMobile && (
        <>
          <div className={styles.motionPrefersReduced}>
            <div className={styles.grid}>
              {posts.map((p) => {
                const reading = fmtReading(p.readingTime);
                return (
                  <article key={p.href} className={styles.card}>
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
              })}
            </div>
          </div>

          <InfiniteLooper posts={posts} whenFmt={whenFmt} />
        </>
      )}

      {isMobile && <MobileCarousel posts={posts} whenFmt={whenFmt} />}

      <div className={styles.actions}>
        <Link className={styles.seeAll} to={blogBasePath}>SEE ALL</Link>
      </div>
    </section>
  );
}

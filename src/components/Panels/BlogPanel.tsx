// src/components/Panels/BlogPanel.tsx
import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
import styles from "./BlogPanel.module.css";
import SciFiPanel from "./SciFiPanel";

// import docusaurus json file for blog posts
import blogList from "@site/.docusaurus/docusaurus-plugin-content-blog/default/blog-post-list-prop-default.json";

type Post = {
  title: string;
  href: string;
  date: string;
  description?: string;
  readingTime?: number;
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
  if (onlyYear) list = list.filter(p => new Date(p.date).getFullYear() === onlyYear);
  return list
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
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

  return (
    <SciFiPanel variant="large">
      <section className={clsx(styles.panel, className)}>
        <header className={styles.header}>
          <h2 className={styles.title}>LAST NEWS</h2>
        </header>

        <div className={styles.grid}>
          {posts.length === 0 ? (
            <article className={styles.card}>
              <div className={clsx(styles.media, styles.mediaPlaceholder)} />
              <div className={styles.body}>
                <h3 className={styles.postTitle}>Aucun article</h3>
                <p className={styles.desc}>
                  Ajoute des fichiers dans <code>/blog</code>.
                </p>
              </div>
            </article>
          ) : (
            posts.map((p) => {
              const when = new Intl.DateTimeFormat(i18n?.currentLocale || "fr-FR", {
                year: "numeric", month: "short", day: "2-digit",
              }).format(new Date(p.date));

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
                      <time className={styles.date}>{when}</time>
                      {typeof p.readingTime === "number" && (
                        <>
                          <span className={styles.dot} aria-hidden>•</span>
                          <span className={styles.reading}>{Math.ceil(p.readingTime)} min</span>
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
        <div className={styles.actions}>
          <Link className={styles.seeAll} to={blogBasePath}>SEE ALL</Link>
        </div>
      </section>
    </SciFiPanel>
  );
}

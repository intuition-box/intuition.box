import React from "react";
import styles from "./Events.module.css";

export type EventItem = {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  imageUrl: string;
  href?: string;
  ctaLabel?: string;
};

function formatDateRange(dateISO: string, endISO?: string) {
  const d = new Date(dateISO);
  const day = d.getUTCDate().toString();
  const weekday = d.toLocaleDateString(undefined, { weekday: "short" });
  const month = d.toLocaleDateString(undefined, { month: "short" });

  let range: string | undefined;

  if (endISO) {
    const e = new Date(endISO);
    const endDay = e.getUTCDate().toString();
    const endMonth = e.toLocaleDateString(undefined, { month: "short" });

    range =
      month === endMonth
        ? `${day}–${endDay} ${month}`
        : `${day} ${month} – ${endDay} ${endMonth}`;
  }

  return { day, weekday, month, range };
}

export default function EventCard({
  item,
  onClick,
}: {
  item: EventItem;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const { day, weekday, month, range } = formatDateRange(item.date, item.endDate);
  const isPast = new Date(item.endDate ?? item.date).getTime() < Date.now();
  const ctaText = item.ctaLabel ?? "Register";

  const CardTag = item.href ? ("a" as const) : ("div" as const);
  const tagProps = item.href
    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <CardTag
      className={styles.card}
      style={{ ["--bg-url" as any]: `url("${item.imageUrl}")` }}
      {...tagProps}
      onClick={onClick}
      aria-label={item.title}
    >
      <div className={styles.overlay} />

      {!isPast ? (
        <div className={styles.datePill} aria-hidden="true">
          <div className={styles.weekday}>{weekday}</div>
          <div className={styles.day}>{range ? range : day}</div>
          {!range && <div className={styles.month}>{month}</div>}
        </div>
      ) : (
        <div className={`${styles.datePill} ${styles.pastBadge}`} aria-hidden="true">
          <div className={styles.weekday}>REPLAY</div>
        </div>
      )}

      <div className={styles.info} role="img" aria-label="More info">i</div>

      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        {!isPast && (
          <div className={styles.ctaRow}>
            <span className={styles.cta}>{ctaText}</span>
          </div>
        )}
      </div>
    </CardTag>
  );
}

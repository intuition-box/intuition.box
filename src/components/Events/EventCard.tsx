import React from "react";
import styles from "./Events.module.css";

type Weekday =
  | "monday" | "tuesday" | "wednesday" | "thursday"
  | "friday" | "saturday" | "sunday";
export type Recurrence =
  | { kind: "daily" }
  | { kind: "weekly"; byweekday?: Weekday[] }
  | { kind: "monthly"; bymonthday?: number }
  | { kind: "custom"; label: string };

export type EventItem = {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  imageUrl: string;
  href?: string;
  ctaLabel?: string;
  recurrence?: Recurrence;
};

function formatDateRange(dateISO: string, endISO?: string) {
  const d = new Date(dateISO);
  const day = d.getUTCDate().toString();
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const month = d.toLocaleDateString("en-US", { month: "short" });

  let range: string | undefined;
  if (endISO) {
    const e = new Date(endISO);
    const endDay = e.getUTCDate().toString();
    const endMonth = e.toLocaleDateString("en-US", { month: "short" });
    range =
      month === endMonth
        ? `${day}–${endDay} ${month}`
        : `${day} ${month} – ${endDay} ${endMonth}`;
  }
  return { day, weekday, month, range };
}

function recurrenceLabel(r?: Recurrence): string | null {
  if (!r) return null;
  const cap = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);
  switch (r.kind) {
    case "daily":   return "Daily";
    case "weekly":  return !r.byweekday?.length
      ? "Weekly"
      : r.byweekday.length === 1
        ? `Every ${cap(r.byweekday[0])}`
        : `Weekly (${r.byweekday.map(cap).join(", ")})`;
    case "monthly": return r.bymonthday ? `Monthly (day ${r.bymonthday})` : "Monthly";
    case "custom":  return r.label;
    default:        return null;
  }
}

function formatTooltipDate(dateISO: string) {
  return new Date(dateISO).toLocaleString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", "")
    .replace(" ", " ")
    .replace(" AM", "")
    .replace(" PM", "");
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

  const tooltipText = isPast
    ? formatTooltipDate(item.date)
    : recurrenceLabel(item.recurrence);

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

      <div className={styles.infoWrap}>
        <div className={styles.info} role="img" aria-label="More info" tabIndex={0}>i</div>
        {tooltipText && (
          <div className={styles.infoTip} role="tooltip">
            {tooltipText}
          </div>
        )}
      </div>

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

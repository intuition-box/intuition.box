import React, { useMemo, useRef, useState } from "react";
import styles from "./Events.module.css";
import EventCard, { EventItem } from "./EventCard";
import Panel from "../Panels/Panel";
import { useIsMobile } from "../../hooks/useAutoGrid";

export default function EventGrid({
  events,
  title = "CALENDAR",
}: {
  events: EventItem[];
  title?: string;
}) {
  const now = Date.now();
  const isMobile = useIsMobile();

  const upcomingAll = useMemo(
    () =>
      events
        .filter((e) => new Date(e.date).getTime() >= now)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [events, now]
  );

  const pastAll = useMemo(
    () =>
      events
        .filter((e) => new Date(e.date).getTime() < now)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [events, now]
  );

  const upcoming = isMobile ? upcomingAll : upcomingAll.slice(0, 3);
  const past = isMobile ? pastAll : pastAll.slice(0, 3);

  return (
    <Panel variant="large">
      <h2>{title}</h2>

      <section className={styles.wrap}>
        {upcoming.length > 0 && (
          <section className={`${styles.section} ${styles.upcoming}`}>
            <h3 className={styles.sectionTitle}>Upcoming</h3>
            {!isMobile ? (
              <div className={styles.grid}>
                {upcoming.map(ev => <EventCard key={ev.id} item={ev} />)}
              </div>
            ) : (
              <RowCarousel items={upcoming} ariaLabel="Upcoming events" />
            )}
          </section>
        )}

        {past.length > 0 && (
          <div className={styles.sectionDivider} aria-hidden />
        )}

        {past.length > 0 && (
          <section className={`${styles.section} ${styles.replay}`}>
            <h3 className={styles.sectionTitle}>Past Events</h3>

            {!isMobile ? (
              <div className={styles.grid}>
                {past.map((ev) => (
                  <EventCard key={ev.id} item={ev} />
                ))}
              </div>
            ) : (
              <RowCarousel items={past} ariaLabel="Past events" />
            )}
          </section>
        )}
      </section>
    </Panel>
  );
}

function RowCarousel({
  items,
  ariaLabel,
}: {
  items: EventItem[];
  ariaLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, items.length - 1));
    const child = el.children.item(clamped) as HTMLElement | null;
    if (child) {
      child.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
    setIndex(clamped);
  };

  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;

    const tr = el.getBoundingClientRect();
    const center = tr.left + tr.width / 2;
    let best = 0;
    let bestDist = Infinity;

    for (let i = 0; i < el.children.length; i++) {
      const r = (el.children[i] as HTMLElement).getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) {
        best = i;
        bestDist = d;
      }
    }
    setIndex(best);
  };

  if (items.length === 0) return null;

  return (
    <div className={styles.rowCarousel} aria-roledescription="carousel">
      <div
        className={styles.rowTrack}
        ref={trackRef}
        onScroll={onTrackScroll}
        tabIndex={0}
        aria-label={ariaLabel}
      >
        {items.map((ev) => (
          <div key={ev.id} className={styles.rowSlide}>
            <EventCard item={ev} />
          </div>
        ))}
      </div>

      <div className={styles.rowControls}>
        <button
          className={styles.rowNavBtn}
          onClick={() => scrollTo(index - 1)}
          aria-label="Previous"
        >
          ‹
        </button>

        <div className={styles.rowDots} role="tablist" aria-label="Slides">
          {items.map((_, i) => (
            <button
              key={i}
              className={`${styles.rowDot} ${i === index ? styles.rowDotActive : ""}`}
              aria-selected={i === index}
              role="tab"
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>

        <button
          className={styles.rowNavBtn}
          onClick={() => scrollTo(index + 1)}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}

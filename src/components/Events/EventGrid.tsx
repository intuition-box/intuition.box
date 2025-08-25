import React from "react";
import styles from "./Events.module.css";
import EventCard, { EventItem } from "./EventCard";
import Panel from "../Panels/Panel";

export default function EventGrid({
  events,
  title = "CALENDAR",
}: {
  events: EventItem[];
  title?: string;
}) {
  const now = Date.now();

  const upcoming = events
    .filter(e => new Date(e.date).getTime() >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 3);

  const past = events
    .filter(e => new Date(e.date).getTime() < now)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3);

  return (
    <Panel variant="large">
      <h2>{title}</h2>

      <section className={styles.wrap}>
        {upcoming.length > 0 && (
          <section className={`${styles.section} ${styles.upcoming}`}>
            <div className={styles.grid}>
              {upcoming.map(ev => <EventCard key={ev.id} item={ev} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <>
            <div className={styles.sectionDivider} aria-hidden />
            <section className={`${styles.section} ${styles.replay}`}>
              <h3 className={styles.sectionTitle}>Past Events</h3>
              <div className={styles.grid}>
                {past.map(ev => <EventCard key={ev.id} item={ev} />)}
              </div>
            </section>
          </>
        )}

      </section>
    </Panel>
  );
}

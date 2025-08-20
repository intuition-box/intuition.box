import React from "react";
import styles from "./Events.module.css";
import EventCard, { EventItem } from "./EventCard";
import SciFiPanel from "../Panels/SciFiPanel";

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
    <SciFiPanel variant="large">
      <h2>{title}</h2>

      <section className={styles.wrap}>
        {upcoming.length > 0 && (
          <>
            <h3>UPCOMING</h3>
            <div className={styles.grid}>
              {upcoming.map(ev => <EventCard key={ev.id} item={ev} />)}
            </div>
          </>
        )}

        {past.length > 0 && (
          <>
            <h3>REPLAY</h3>
            <div className={styles.grid}>
              {past.map(ev => <EventCard key={ev.id} item={ev} />)}
            </div>
          </>
        )}

        <div className={styles.tailSpacer} aria-hidden />
      </section>
    </SciFiPanel>
  );
}

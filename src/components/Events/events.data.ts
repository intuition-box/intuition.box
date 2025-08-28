import { EventItem } from "./EventCard";

export const EVENTS: EventItem[] = [
  // ===== Upcoming (>= today) =====
  {
    id: "intui-2025-09-06",
    title: "Intuition Conference",
    date: "2025-09-06T18:30:00Z",
    imageUrl: "/img/events/conf.jpg",
    href: "/",
    recurrence: { kind: "monthly", bymonthday: 6 },
  },
  {
    id: "sp-2025-10-10",
    title: "Game Dev Meetup",
    date: "2025-10-10T18:00:00Z",
    imageUrl: "/img/events/meet.jpg",
    href: "/",
    recurrence: { kind: "weekly", byweekday: ["wednesday"] },
  },
  {
    id: "web3-2025-11-15",
    title: "Web 3 Conference",
    date: "2025-11-15T17:00:00Z",
    imageUrl: "/img/events/conf.jpg",
    href: "/",
    recurrence: { kind: "custom", label: "Every 2 weeks" },
  },
  {
    id: "web3-2025-01-21",
    title: "Web 3 Conference",
    date: "2025-01-21T17:00:00Z",
    imageUrl: "/img/events/conf.jpg",
    href: "/",
  },
  {
    id: "intui-2025-02-06",
    title: "Intuition Conference",
    date: "2025-02-06T18:30:00Z",
    imageUrl: "/img/events/conf.jpg",
    href: "/",
  },
  {
    id: "sp-2025-02-10",
    title: "Game Dev Meetup",
    date: "2025-02-10T18:00:00Z",
    imageUrl: "/img/events/meet.jpg",
    href: "/",
  },
];

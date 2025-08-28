import React, { useEffect, useMemo, useState } from "react";
import styles from "./Galaxy.module.css";
import ContributorCard from "./ContributorCard";

export type ContributorItem = {
  id: string;
  summary: string;
  projects?: (string | { id: string; name: string; url?: string })[];
  avatarUrl?: string;
  onClick?: () => void;
  profileUrl?: string;
};

export type ContributorCardsProps = {
  items: ContributorItem[];
  getStyle?: (index: number) => React.CSSProperties;
  onAvatarOpen?: (c: ContributorItem) => void;
};

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setM(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    (mq as any).addListener?.(update);
    return () => {
      mq.removeEventListener?.("change", update);
      (mq as any).removeListener?.(update);
    };
  }, []);
  return m;
}

function useGalaxyBox() {
  const [box, setBox] = useState({ vw: 0, gh: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.querySelector(".galaxy-scope") as HTMLElement | null;
    const compute = () => {
      const vw = window.innerWidth;
      const rect = el?.getBoundingClientRect();
      const gh = rect?.height ?? 0;
      setBox({ vw, gh });
    };
    compute();
    window.addEventListener("resize", compute);
    const ro = el ? new ResizeObserver(compute) : null;
    if (el && ro) ro.observe(el);
    return () => {
      window.removeEventListener("resize", compute);
      ro?.disconnect();
    };
  }, []);
  return box;
}

function useRespContribOrbit() {
  const [r, setR] = useState({ rx: 350, ry: 280 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mLandscapeLow = window.matchMedia("(max-height: 540px) and (orientation: landscape)");

    const compute = () => {
      const w = window.innerWidth;

      let rx = 350, ry = 280;
      if (w <= 360 || mLandscapeLow.matches) { rx = 206; ry = 178; }
      else if (w <= 420)                     { rx = 220; ry = 190; }
      else if (w <= 640)                     { rx = 236; ry = 205; }

      const scope = document.querySelector(".galaxy-scope") as HTMLElement | null;
      const gh = scope?.getBoundingClientRect().height ?? window.innerHeight;

      const CARD_H = 96;
      const MARGIN = 18;
      const maxRy = Math.max(140, (gh / 2) - (CARD_H / 2) - MARGIN);

      ry = Math.min(ry, maxRy);

      setR({ rx, ry });
    };

    compute();
    window.addEventListener("resize", compute);
    mLandscapeLow.addEventListener?.("change", compute);
    (mLandscapeLow as any).addListener?.(compute);

    return () => {
      window.removeEventListener("resize", compute);
      mLandscapeLow.removeEventListener?.("change", compute);
      (mLandscapeLow as any).removeListener?.(compute);
    };
  }, []);

  return r;
}

function useSafeAvatarOrbit(avatarSize = 44, pad = 12) {
  const { vw, gh } = useGalaxyBox();
  const base = useMemo(() => {
    const w = vw;
    if (w <= 360) return { rx: 180, ry: 150 };
    if (w <= 420) return { rx: 195, ry: 165 };
    if (w <= 640) return { rx: 210, ry: 180 };
    return { rx: 240, ry: 200 };
  }, [vw]);
  const maxRx = Math.max(0, vw / 2 - avatarSize / 2 - pad);
  const maxRy = Math.max(0, gh / 2 - avatarSize / 2 - pad);
  return { rx: Math.min(base.rx, maxRx), ry: Math.min(base.ry, maxRy) };
}

const styleAtAngle = (angleDeg: number, rx: number, ry: number): React.CSSProperties => {
  const a = (angleDeg * Math.PI) / 180;
  const x = rx * Math.cos(a);
  const y = ry * Math.sin(a);
  return { transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` };
};

const defaultCardStyle = (index: number, rx: number, ry: number): React.CSSProperties => {
  const diamondAngles = [-90, 0, 180, 90];
  return styleAtAngle(diamondAngles[index % diamondAngles.length], rx, ry);
};

export default function ContributorCards({ items, getStyle, onAvatarOpen }: ContributorCardsProps) {
  const isMobile = useIsMobile();

  // Desktop cards
  const { rx, ry } = useRespContribOrbit();
  const cardStyleFn = useMemo(
    () => (getStyle ? getStyle : (i: number) => defaultCardStyle(i, rx, ry)),
    [getStyle, rx, ry]
  );

  // Mobile avatars
  const { rx: arx, ry: ary } = useSafeAvatarOrbit(44, 12);
  const avatarStyleFn = useMemo(() => {
  const angles = [-90, 0, 180, 90];
  return (i: number) => {
    const a = (angles[i % angles.length] * Math.PI) / 180;
    const x = (arx * 0.90) * Math.cos(a);
    const y = ary * Math.sin(a);
    return { transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` };
  };
}, [arx, ary]);

  return (
    <div className={styles.boxesContainer}>
      {isMobile ? (
        // mobile
        items.slice(0, 4).map((c, i) => (
          <button
            key={c.id}
            className={styles.contribAvatarBtn}
            style={avatarStyleFn(i)}
            onClick={() => onAvatarOpen?.(c)}
            aria-label={`Open ${c.id} details`}
            title={c.id}
          >
            {c.avatarUrl ? (
              <img src={c.avatarUrl} alt="" loading="lazy" />
            ) : (
              <span className={styles.contribAvatarFallback}>
                {c.id?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </button>
        ))
      ) : (
        // desktop
        items.slice(0, 4).map((b, i) => (
          <ContributorCard
            key={b.id}
            title={b.id}
            summary={b.summary}
            projects={b.projects}
            avatarUrl={b.avatarUrl}
            profileUrl={b.profileUrl}
            onClick={b.onClick}
            style={cardStyleFn(i)}
          />
        ))
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";

type Cols = 12 | 8 | 4;
function useBreakpointCols(): Cols {
  const [cols, setCols] = useState<Cols>(12);
  useEffect(() => {
    if (typeof window === "undefined") return; // guard for SSR

    const lg = window.matchMedia("(max-width: 1024px)");
    const sm = window.matchMedia("(max-width: 640px)");

    const update = () => { setCols(sm.matches ? 4 : lg.matches ? 8 : 12); }; // pick 12/8/4 by breakpoint

    update(); // init once
    lg.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => { lg.removeEventListener("change", update); sm.removeEventListener("change", update); };
  }, []);
  return cols;
}

export type AutoGridOut<T> = { data: T; style: React.CSSProperties; isGhost?: boolean };

type Opts = {
  rows?: number; step?: number; minPerItem?: number;
  autoTall?: boolean; tallRows?: number; tallWidth?: number;
};

export function useAutoGrid<T>(items: T[], opts?: Opts): AutoGridOut<T>[] {
  const totalCols = useBreakpointCols();
  const { rows = 3, step = 2, minPerItem = 4, autoTall = true, tallRows = 2, tallWidth } = opts ?? {};

  return useMemo(() => {
    const N = items.length;
    if (N === 0) return []; // nothing to place

    // Mobile: simple vertical stack (no complex layout)
    if (totalCols === 4) {
      return items.map((data, i) => ({ data, style: { gridColumn: "1 / span 4", gridRow: `${i + 1} / span 1` } }));
    }

    type Seg = { s: number; e: number };
    const segLen = (sg: Seg) => sg.e - sg.s;
    const STEP = Math.max(1, step);
    const MIN = Math.max(minPerItem, STEP);
    const toStep = (v: number) => STEP * Math.floor(v / STEP);
    const TALL_W = Math.max(MIN, Math.min(totalCols - MIN, tallWidth ?? toStep(totalCols / 3))); // ~1/3 by default

    const consume = (segs: Seg[], s: number, e: number) => {
      for (let i = 0; i < segs.length; ) {
        const g = segs[i];
        if (e <= g.s) break;
        if (s >= g.e) { i++; continue; }
        const L: Seg = { s: g.s, e: Math.max(g.s, Math.min(s, g.e)) };
        const R: Seg = { s: Math.max(g.s, Math.min(e, g.e)), e: g.e };
        const parts: Seg[] = [];
        if (segLen(L) > 0) parts.push(L);
        if (segLen(R) > 0) parts.push(R);
        segs.splice(i, 1, ...parts);
        if (!parts.length) continue;
        i++;
      }
    };

    const allocInRow = (segs: Seg[], want: number): { start: number; width: number } | null => {
      for (let w = want; w >= MIN; w -= STEP) {
        for (const g of segs) if (segLen(g) >= w) { const s = g.s; consume(segs, s, s + w); return { start: s, width: w }; }
      }
      let best: Seg | null = null;
      for (const g of segs) if (!best || segLen(g) > segLen(best)) best = g;
      if (best && segLen(best) > 0) { const s = best.s, w = segLen(best); consume(segs, s, s + w); return { start: s, width: w }; }
      return null;
    };

    // allocate a tall slot by finding an intersection between row r and r+1
    const allocTall = (rA: Seg[], rB: Seg[], want: number) => {
      for (let w = want; w >= MIN; w -= STEP) {
        for (const a of rA) for (const b of rB) {
          const s = Math.max(a.s, b.s), e = Math.min(a.e, b.e);
          if (e - s >= w) { consume(rA, s, s + w); consume(rB, s, s + w); return { start: s, width: w }; }
        }
      }
      return null;
    };

    const maxPerRow = Math.max(1, Math.floor(totalCols / MIN));
    let effRows = Math.max(1, Math.min(rows, N));
    while (N > effRows * maxPerRow) effRows++;

    const base = Math.floor(N / effRows), extra = N % effRows;
    const counts = Array.from({ length: effRows }, (_, i) => base + (i < extra ? 1 : 0));
    const rowsOfItems: T[][] = []; { let i = 0; for (const c of counts) { rowsOfItems.push(items.slice(i, i + c)); i += c; } }

    // initialize free segments per row (full width)
    const free: Seg[][] = Array.from({ length: effRows }, () => [{ s: 1, e: totalCols + 1 }]);

    // decide which rows get a tall card (at most one per row, skip last row)
    const tallPlan = new Array(effRows).fill(false) as boolean[];
    if (autoTall && effRows > 1) for (let r = 0; r < Math.min(tallRows, effRows - 1); r++) if ((rowsOfItems[r]?.length ?? 0) >= 2) tallPlan[r] = true;

    const out: AutoGridOut<T>[] = [];

    for (let r = 0; r < effRows; r++) {
      let line = rowsOfItems[r] ?? [];
      let cursor = 0;

      // create a new row on the fly if we run out of space (spillover)
      const ensureNextRow = () => {
        if (r + 1 >= effRows) {
          effRows++;
          free[r + 1] = [{ s: 1, e: totalCols + 1 }];
          rowsOfItems[r + 1] = rowsOfItems[r + 1] ?? [];
        }
      };

      // place one tall card if planned for this row
      if (tallPlan[r]) {
        ensureNextRow();
        const slot = allocTall(free[r], free[r + 1], TALL_W);
        if (slot && cursor < line.length) {
          out.push({ data: line[cursor++], style: { gridRow: `${r + 1} / span 2`, gridColumn: `${slot.start} / span ${slot.width}` } });
        }
      }

      // place remaining items left-to-right using contiguous slots
      while (cursor < line.length) {
        const freeCols = free[r].reduce((a, g) => a + (g.e - g.s), 0); // remaining columns in this row
        if (freeCols <= 0) {
          ensureNextRow(); // push leftovers to next row if no space left
          rowsOfItems[r + 1] = line.slice(cursor).concat(rowsOfItems[r + 1]);
          cursor = line.length;
          break;
        }
        const remaining = line.length - cursor;
        const target = Math.max(MIN, toStep(freeCols / remaining));
        const slot = allocInRow(free[r], target);
        if (!slot) {
          ensureNextRow();
          rowsOfItems[r + 1] = line.slice(cursor).concat(rowsOfItems[r + 1]);
          cursor = line.length;
          break;
        }
        out.push({ data: line[cursor++], style: { gridRow: `${r + 1} / span 1`, gridColumn: `${slot.start} / span ${slot.width}` } });
      }
    }

    // fill any leftover segments with invisible ghosts to keep a perfect rectangle
    for (let r = 0; r < effRows; r++) for (const g of free[r]) {
      const w = g.e - g.s; if (w > 0) out.push({ data: {} as T, isGhost: true, style: { gridRow: `${r + 1} / span 1`, gridColumn: `${g.s} / span ${w}` } });
    }

    return out;
  }, [items, rows, step, minPerItem, autoTall, tallRows, tallWidth, totalCols]);
}

"use client";

import { ECLIPSES, fmtDate, fmtTime, nextEclipse } from "@/lib/eclipse";
import { useNow } from "@/lib/stores";

export function EclipseTable() {
  const now = useNow();
  const next = now === null ? undefined : nextEclipse(now);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm tabular-nums [&_td]:border-b [&_td]:border-line [&_td]:px-1.5 [&_td]:py-[0.4375rem] [&_td]:align-top [&_th]:border-b [&_th]:border-line [&_th]:px-1.5 [&_th]:py-[0.4375rem] [&_th]:text-left [&_th]:text-[0.8125rem] [&_th]:font-medium [&_th]:text-muted">
        <thead>
          <tr>
            <th>日期</th>
            <th>食甚（台灣時間）</th>
            <th>類型</th>
            <th>台灣</th>
          </tr>
        </thead>
        <tbody>
          {ECLIPSES.map((e) => (
            <tr
              key={e.t}
              className={e === next ? "font-bold text-kasaya" : now !== null && e.t < now ? "text-muted line-through" : ""}
            >
              <td>{fmtDate(e.t)}</td>
              <td>{fmtTime(e.t)}</td>
              <td>{e.type}</td>
              <td>{e.vis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

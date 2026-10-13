"use client";

import { useRef, useState } from "react";

// 「磕頭」朱印：每點一下飄出一個 +1
export function KowtowSeal() {
  const [pops, setPops] = useState<{ id: number; x: number }[]>([]);
  const nextId = useRef(0);

  const tap = () => {
    const id = nextId.current++;
    // 左右稍微錯開，連點時不會疊在同一處
    const x = Math.round((Math.random() - 0.5) * 24);
    setPops((p) => [...p, { id, x }]);
  };

  return (
    <button
      type="button"
      onClick={tap}
      aria-label="磕頭"
      className="relative cursor-pointer select-none [-webkit-tap-highlight-color:transparent]"
    >
      <span className="grid rotate-3 place-items-center rounded-md border-2 border-kasaya px-1.5 py-2 font-display text-lg leading-[1.15] font-bold text-kasaya opacity-85 transition-transform [writing-mode:vertical-rl] active:scale-90">
        磕頭
      </span>
      {pops.map((p) => (
        <span
          key={p.id}
          aria-hidden
          onAnimationEnd={() => setPops((all) => all.filter((q) => q.id !== p.id))}
          className="pointer-events-none absolute top-0 left-1/2 animate-[float-up_0.9s_ease-out_forwards] font-display text-lg font-bold whitespace-nowrap text-kasaya"
          style={{ marginLeft: p.x }}
        >
          +1
        </span>
      ))}
    </button>
  );
}

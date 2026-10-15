"use client";

import { useRef, useState } from "react";

let ctx: AudioContext | null = null;

// 木魚「叩」一聲：短促的中空音，音高略往下掉、很快衰減
function knock() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(720, t);
  osc.frequency.exponentialRampToValueAtTime(520, t + 0.08);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.6, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.25);
}

// 「磕頭」朱印：每點一下敲一聲木魚、飄出一個 +1
export function KowtowSeal({ large = false, onTap }: { large?: boolean; onTap?: () => void }) {
  const [pops, setPops] = useState<{ id: number; x: number }[]>([]);
  const nextId = useRef(0);

  const tap = () => {
    knock();
    onTap?.();
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
      <span className={`grid rotate-3 place-items-center border-kasaya font-display leading-[1.15] font-bold text-kasaya opacity-85 transition-transform [writing-mode:vertical-rl] active:scale-90 ${
        large ? "rounded-lg border-[3px] px-3 py-4 text-4xl" : "rounded-md border-2 px-1.5 py-2 text-lg"
      }`}>
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

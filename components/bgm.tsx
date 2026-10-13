"use client";

import { useEffect, useRef } from "react";
import { getBgm, pauseBgm, playBgm, registerBgm, useBgm } from "@/lib/bgm";
import { PlayIcon } from "./video";

const STATUS = {
  idle: "點畫面任一處開始播放",
  playing: "播放中 · 開始念經後自動停止",
  paused: "已暫停",
  stopped: "已開始念經，音樂已停止",
};

// 念經前的背景音樂：打開頁面就播，瀏覽器擋自動播放時，等第一次點擊畫面再播
export function Bgm() {
  const ref = useRef<HTMLAudioElement>(null);
  const state = useBgm();

  useEffect(() => {
    registerBgm(ref.current);
    if (ref.current) ref.current.volume = 0.6;
    const start = (e: Event) => {
      // 第一下就是在開始念經（播影片、念咒），就不用先響一下音樂
      if ((e.target as Element | null)?.closest?.("[data-chant]")) return;
      if (getBgm() === "idle") playBgm().catch(() => {});
    };
    playBgm().catch(() => {
      window.addEventListener("pointerdown", start, { once: true, capture: true });
      window.addEventListener("keydown", start, { once: true, capture: true });
    });
    return () => {
      registerBgm(null);
      window.removeEventListener("pointerdown", start, { capture: true });
      window.removeEventListener("keydown", start, { capture: true });
    };
  }, []);

  const playing = state === "playing";
  return (
    <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-line px-4 py-3">
      <audio ref={ref} src="/audio/tara-21-praises.mp3" loop preload="auto" />
      <button
        type="button"
        onClick={() => (playing ? pauseBgm() : playBgm().catch(() => {}))}
        aria-label={playing ? "暫停背景音樂" : "播放背景音樂"}
        className="grid size-10 flex-none cursor-pointer place-items-center rounded-full bg-kasaya text-paper transition-opacity hover:opacity-90"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <PlayIcon className="ml-0.5 size-4" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[0.8125rem] tracking-widest text-muted">念經前 · 背景音樂</div>
        <div className="truncate font-display text-[1.0625rem]">聖救度佛母二十一種禮讚經</div>
        <div className="text-xs text-muted">{STATUS[state]}</div>
      </div>
      {playing && (
        // 播放中的小音柱
        <div className="flex h-5 flex-none items-end gap-[0.1875rem]" aria-hidden>
          {[0, 0.2, 0.4].map((d) => (
            <span key={d} className="w-[0.1875rem] animate-pulse rounded-full bg-gold" style={{ height: `${60 + d * 80}%`, animationDelay: `${d}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}

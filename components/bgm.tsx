"use client";

import { useEffect, useRef } from "react";
import { getBgm, pauseBgm, playBgm, registerBgm, setBgmVolume, useBgm, useBgmVolume } from "@/lib/bgm";
import { PlayIcon } from "./video";

const STATUS = {
  idle: "點畫面任一處開始播放",
  playing: "播放中 · 開始念經後自動停止",
  paused: "已暫停",
  stopped: "已開始念經，音樂已停止",
};

// 播放／暫停圓鈕
export function BgmPlayButton({ small }: { small?: boolean }) {
  const playing = useBgm() === "playing";
  return (
    <button
      type="button"
      onClick={() => (playing ? pauseBgm() : playBgm().catch(() => {}))}
      aria-label={playing ? "暫停背景音樂" : "播放背景音樂"}
      className={`grid flex-none cursor-pointer place-items-center rounded-full bg-kasaya text-paper transition-opacity hover:opacity-90 ${small ? "size-8" : "size-10"}`}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" className={small ? "size-3.5" : "size-4"} fill="currentColor" aria-hidden>
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <PlayIcon className={`ml-0.5 ${small ? "size-3.5" : "size-4"}`} />
      )}
    </button>
  );
}

// 音量：喇叭圖示可一鍵靜音／恢復，旁邊拉桿調大小
const lastVolume = { v: 0.6 };
export function BgmVolume({ className = "" }: { className?: string }) {
  const volume = useBgmVolume();
  const muted = volume === 0;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => {
          if (muted) setBgmVolume(lastVolume.v || 0.6);
          else { lastVolume.v = volume; setBgmVolume(0); }
        }}
        aria-label={muted ? "取消靜音" : "靜音"}
        className="grid size-7 flex-none cursor-pointer place-items-center rounded-full text-muted hover:text-kasaya"
      >
        <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" fill="currentColor" stroke="none" />
          {muted ? (
            <path d="M16 9.5l5 5M21 9.5l-5 5" />
          ) : (
            <>
              <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />
              {volume > 0.5 && <path d="M18 7a7 7 0 0 1 0 10" />}
            </>
          )}
        </svg>
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(volume * 100)}
        onChange={(e) => setBgmVolume(Number(e.target.value) / 100)}
        aria-label="背景音樂音量"
        className="h-1.5 w-full min-w-0 cursor-pointer accent-[var(--kasaya)]"
      />
      <span className="w-7 flex-none text-right text-xs text-muted tabular-nums">{Math.round(volume * 100)}</span>
    </div>
  );
}

// 念經前的背景音樂：打開頁面就播，瀏覽器擋自動播放時，等第一次點擊畫面再播
export function Bgm() {
  const ref = useRef<HTMLAudioElement>(null);
  const state = useBgm();

  useEffect(() => {
    registerBgm(ref.current);
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

  return (
    <div id="bgm" className="mt-6 scroll-mt-6 rounded-xl border border-dashed border-line px-4 py-3">
      <audio ref={ref} src="/audio/tara-21-praises.mp3" loop preload="auto" />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <BgmPlayButton />
        <div className="min-w-0 flex-1">
          <div className="text-[0.8125rem] tracking-widest text-muted">念經前 · 背景音樂</div>
          <div className="truncate font-display text-[1.0625rem]">聖救度佛母二十一種禮讚經</div>
          <div className="text-xs text-muted">{STATUS[state]}</div>
        </div>
        {state === "playing" && (
          // 播放中的小音柱
          <div className="flex h-5 flex-none items-end gap-[0.1875rem]" aria-hidden>
            {[0, 0.2, 0.4].map((d) => (
              <span key={d} className="w-[0.1875rem] animate-pulse rounded-full bg-gold" style={{ height: `${60 + d * 80}%`, animationDelay: `${d}s` }} />
            ))}
          </div>
        )}
        {/* 電腦、平板放在文字右邊；手機寬度不夠就換到下一行 */}
        <BgmVolume className="w-40 flex-none max-sm:w-full max-sm:pl-[3.25rem]" />
      </div>
    </div>
  );
}

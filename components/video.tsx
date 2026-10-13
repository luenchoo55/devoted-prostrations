"use client";

import { useSyncExternalStore } from "react";
import { stopBgm } from "@/lib/bgm";
import { toEmbed } from "@/lib/youtube";
import { card } from "./ui";

// 同一時間只播一支：開新的會把舊的收起來
let playing: string | null = null;
const listeners = new Set<() => void>();
const setPlaying = (key: string | null) => {
  if (key) stopBgm();
  playing = key;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};

export function useVideo(key: string) {
  const open = useSyncExternalStore(subscribe, () => playing === key, () => false);
  return { open, toggle: () => setPlaying(open ? null : key), show: () => setPlaying(key) };
}

export function PlayIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

// 嵌入的播放器，下方保留「在 YouTube 開啟」以防萬一
export function Player({ href, title }: { href: string; title: string }) {
  return (
    <div className="grid gap-1.5">
      <iframe
        src={toEmbed(href)}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded-lg border-0 bg-black"
      />
      <a href={href} target="_blank" rel="noopener" className="justify-self-end text-[13px] text-muted">
        在 YouTube 開啟 ↗
      </a>
    </div>
  );
}

// 一列「標題 + 播放」，點了在下方展開播放器
export function VideoRow({ href, label, videoKey }: { href: string; label: string; videoKey?: string }) {
  const { open, toggle } = useVideo(videoKey ?? href);
  return (
    <div className={`${card} mt-2 overflow-hidden`}>
      <button
        type="button"
        aria-expanded={open}
        data-chant
        onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-gold-soft/40"
      >
        <span className="min-w-0">{label}</span>
        <span className="flex flex-none items-center gap-1 text-[13px] font-bold text-kasaya">
          {open ? "收起 ▴" : <><PlayIcon className="size-3" />播放</>}
        </span>
      </button>
      {open && (
        <div className="border-t border-line p-3">
          <Player href={href} title={label} />
        </div>
      )}
    </div>
  );
}

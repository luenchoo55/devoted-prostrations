"use client";

import { useSyncExternalStore } from "react";

// 背景音樂狀態：idle 還沒開始（瀏覽器擋自動播放時）、stopped 因開始念經而自動停止
export type BgmState = "idle" | "playing" | "paused" | "stopped";

let audio: HTMLAudioElement | null = null;
let state: BgmState = "idle";
const listeners = new Set<() => void>();
const set = (s: BgmState) => {
  state = s;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};

export const useBgm = () => useSyncExternalStore(subscribe, () => state, () => "idle" as BgmState);
export const getBgm = () => state;
export const registerBgm = (el: HTMLAudioElement | null) => {
  audio = el;
  if (el) el.volume = getVolume();
};

// 音量 0～1，記在 localStorage，下次打開沿用
const VOLUME_KEY = "tmg-bgm-volume";
let volume: number | undefined;
const getVolume = () => {
  if (volume === undefined) {
    let v = NaN;
    try { v = Number(localStorage.getItem(VOLUME_KEY) ?? NaN); } catch {}
    volume = Number.isFinite(v) && v >= 0 && v <= 1 ? v : 0.6;
  }
  return volume;
};
export const useBgmVolume = () => useSyncExternalStore(subscribe, getVolume, () => 0.6);
export function setBgmVolume(v: number) {
  volume = Math.min(1, Math.max(0, v));
  if (audio) audio.volume = volume;
  try { localStorage.setItem(VOLUME_KEY, String(volume)); } catch {}
  listeners.forEach((l) => l());
}

export function playBgm() {
  if (!audio) return Promise.reject();
  return audio.play().then(() => set("playing"));
}

export function pauseBgm() {
  audio?.pause();
  set("paused");
}

// 開始念經（播影片、念咒計數）時呼叫；之後不會再自動播放
export function stopBgm() {
  if (state !== "playing" && state !== "idle") return;
  audio?.pause();
  set("stopped");
}

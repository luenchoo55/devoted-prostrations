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

// 音量 0～1，每次打開都從 5 開始，不記住上次調的大小
export const DEFAULT_VOLUME = 0.05;
let volume = DEFAULT_VOLUME;
const getVolume = () => volume;
export const useBgmVolume = () => useSyncExternalStore(subscribe, getVolume, () => DEFAULT_VOLUME);
export function setBgmVolume(v: number) {
  volume = Math.min(1, Math.max(0, v));
  if (audio) audio.volume = volume;
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

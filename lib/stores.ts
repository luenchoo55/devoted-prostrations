"use client";

import { useSyncExternalStore } from "react";
import { stopBgm } from "./bgm";
import { MANTRA_TIMES, VAJRA_TIMES, type StepId } from "./ritual";

// 存在 localStorage 的小型 store；伺服器端與 hydration 時一律用 serverValue，避免畫面不一致
function persisted<T>(key: string, load: (raw: unknown) => T, serverValue: T) {
  let value: T | undefined;
  const listeners = new Set<() => void>();
  const get = () => {
    if (value === undefined) {
      let raw: unknown = null;
      try { raw = JSON.parse(localStorage.getItem(key) ?? "null"); } catch {}
      value = load(raw);
    }
    return value;
  };
  const set = (next: T) => {
    value = next;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => { listeners.delete(l); };
  };
  const use = () => useSyncExternalStore(subscribe, get, () => serverValue);
  return { get, set, use };
}

// 今日進度：換日自動歸零。offering：今天有無供品，null 表示還沒問
export type Counter = "mantra" | "vajrasattva";
type Ritual = { day: string; done: StepId[]; counts: Record<Counter, number>; offering: boolean | null };
const today = () => new Date().toDateString();
const fresh = (offering: boolean | null = null): Ritual => ({
  day: today(), done: [], counts: { mantra: 0, vajrasattva: 0 }, offering,
});

const ritual = persisted<Ritual>(
  "tmg-ritual",
  (raw) => {
    const r = raw as Ritual | null;
    return r && r.day === today() && r.counts ? r : fresh();
  },
  // 伺服器端當作已回答「無供品」，詢問彈窗只在瀏覽器出現
  { day: "", done: [], counts: { mantra: 0, vajrasattva: 0 }, offering: false },
);

export const useRitual = ritual.use;

const current = () => {
  const s = ritual.get();
  return s.day === today() ? s : fresh();
};

export function toggleStep(id: StepId) {
  const s = current();
  ritual.set({ ...s, done: s.done.includes(id) ? s.done.filter((x) => x !== id) : [...s.done, id] });
}

export const COUNTER_TIMES: Record<Counter, number> = { mantra: MANTRA_TIMES, vajrasattva: VAJRA_TIMES };

// 念滿遍數即自動勾選該步驟；圓滿後再點一次清空重來（同時取消勾選）
export function tapCounter(id: Counter) {
  stopBgm();
  const s = current();
  if (s.counts[id] >= COUNTER_TIMES[id]) {
    ritual.set({ ...s, counts: { ...s.counts, [id]: 0 }, done: s.done.filter((x) => x !== id) });
    return;
  }
  const n = s.counts[id] + 1;
  const done = n === COUNTER_TIMES[id] && !s.done.includes(id) ? [...s.done, id] : s.done;
  ritual.set({ ...s, counts: { ...s.counts, [id]: n }, done });
}

export function setOffering(offering: boolean) {
  const s = current();
  ritual.set({ ...s, offering, done: offering ? s.done : s.done.filter((x) => x !== "vajrasattva") });
}

// 重新開始保留今天的供品回答
export const resetRitual = () => ritual.set(fresh(current().offering));

// 大悲咒讀音標示
export type DabeiMode = "py" | "zy" | "ro" | "none";
const MODES: DabeiMode[] = ["py", "zy", "ro", "none"];
const dabeiMode = persisted<DabeiMode>(
  "tmg-dabei-mode",
  (raw) => (MODES.includes(raw as DabeiMode) ? (raw as DabeiMode) : "py"),
  "py",
);
export const useDabeiMode = dabeiMode.use;
export const setDabeiMode = dabeiMode.set;

// 開頁時間：只在瀏覽器取一次，伺服器端為 null
let openedAt: number | undefined;
const noop = () => () => {};
export const useNow = () => useSyncExternalStore(noop, () => (openedAt ??= Date.now()), () => null);

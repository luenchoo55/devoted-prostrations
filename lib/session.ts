// 每週三晚上 7:30（台灣時間）共修
const TW = 8 * 3600e3;
const WEEK = 7 * 864e5;
const DURATION = 2 * 3600e3; // 開始後兩小時內算「進行中」

export const SESSION_LABEL = "每週三 晚上 7:30";

// 回傳下一次（或正在進行的）共修開始時間
export function nextSession(now: number) {
  const tw = new Date(now + TW);
  const daysToWed = (3 - tw.getUTCDay() + 7) % 7;
  let start = Date.UTC(tw.getUTCFullYear(), tw.getUTCMonth(), tw.getUTCDate() + daysToWed, 19, 30) - TW;
  if (start + DURATION <= now) start += WEEK;
  return { start, live: start <= now };
}

export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

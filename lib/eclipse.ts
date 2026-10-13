// 月食：食甚時間（台灣時間 UTC+8），依 NASA 月食表換算
export type Eclipse = { t: number; type: string; vis: string };

export const ECLIPSES: Eclipse[] = [
  ["2027-02-21T07:13", "半影月食", "月落前可見初段"],
  ["2027-07-19T00:03", "半影月食", "可見"],
  ["2027-08-17T15:14", "半影月食", "白天，看不到"],
  ["2028-01-12T12:13", "月偏食", "白天，看不到"],
  ["2028-07-07T02:20", "月偏食", "可見"],
  ["2029-01-01T00:52", "月全食", "可見"],
  ["2029-06-26T11:22", "月全食", "白天，看不到"],
  ["2029-12-21T06:42", "月全食", "月落前可見"],
  ["2030-06-16T02:33", "月偏食", "可見"],
  ["2030-12-10T06:28", "半影月食", "月落前可見"],
].map(([t, type, vis]) => ({ t: new Date(t + ":00+08:00").getTime(), type, vis }));

const TW = 8 * 3600e3;
const DAY = 864e5;
const WD = "日一二三四五六";

// 食甚後 6 小時內仍算「這一次」
export const nextEclipse = (now: number) => ECLIPSES.find((e) => e.t > now - 6 * 3600e3);

export function daysTo(e: Eclipse, now: number) {
  const a = new Date(now + TW), b = new Date(e.t + TW);
  const da = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const db = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.round((db - da) / DAY);
}

export function fmtDate(t: number, weekday = true) {
  const x = new Date(t + TW);
  const d = `${x.getUTCFullYear()}/${x.getUTCMonth() + 1}/${x.getUTCDate()}`;
  return weekday ? `${d}（${WD[x.getUTCDay()]}）` : d;
}

export function fmtTime(t: number) {
  const x = new Date(t + TW);
  return `${String(x.getUTCHours()).padStart(2, "0")}:${String(x.getUTCMinutes()).padStart(2, "0")}`;
}

import { ECLIPSES } from "./eclipse";

// 歲時節令（台灣日期）。農曆節日與冬至、夏至由 lunar-javascript 產生，
// 已與台灣行事曆（如 2027 春節 2/6）及天文演算法核對；閏月不重複過節，小月的三十日改在廿九
export type EventKind = "lunar-eclipse" | "solar-eclipse" | "solar-term" | "new-year" | "buddhist" | "tensha";
export type CalEvent = { date: string; name: string; kind: EventKind };

const FESTIVALS: [string, string, EventKind][] = [
  ["2026-01-05", "阿彌陀佛聖誕", "buddhist"],
  ["2026-01-26", "釋迦牟尼佛成道日（臘八）", "buddhist"],
  ["2026-02-17", "農曆新年 · 彌勒菩薩聖誕", "new-year"],
  ["2026-03-26", "釋迦牟尼佛出家日", "buddhist"],
  ["2026-04-02", "釋迦牟尼佛涅槃日", "buddhist"],
  ["2026-04-06", "觀世音菩薩聖誕", "buddhist"],
  ["2026-04-08", "普賢菩薩聖誕", "buddhist"],
  ["2026-05-20", "文殊菩薩聖誕", "buddhist"],
  ["2026-05-24", "釋迦牟尼佛聖誕（浴佛節）", "buddhist"],
  ["2026-06-21", "夏至", "solar-term"],
  ["2026-08-01", "觀世音菩薩成道日", "buddhist"],
  ["2026-08-27", "盂蘭盆節", "buddhist"],
  ["2026-09-10", "地藏菩薩聖誕", "buddhist"],
  ["2026-10-28", "觀世音菩薩出家日", "buddhist"],
  ["2026-11-08", "藥師佛聖誕", "buddhist"],
  ["2026-12-22", "冬至", "solar-term"],
  ["2026-12-25", "阿彌陀佛聖誕", "buddhist"],
  ["2027-01-15", "釋迦牟尼佛成道日（臘八）", "buddhist"],
  ["2027-02-06", "農曆新年 · 彌勒菩薩聖誕", "new-year"],
  ["2027-03-15", "釋迦牟尼佛出家日", "buddhist"],
  ["2027-03-22", "釋迦牟尼佛涅槃日", "buddhist"],
  ["2027-03-26", "觀世音菩薩聖誕", "buddhist"],
  ["2027-03-28", "普賢菩薩聖誕", "buddhist"],
  ["2027-05-09", "文殊菩薩聖誕", "buddhist"],
  ["2027-05-13", "釋迦牟尼佛聖誕（浴佛節）", "buddhist"],
  ["2027-06-21", "夏至", "solar-term"],
  ["2027-07-22", "觀世音菩薩成道日", "buddhist"],
  ["2027-08-16", "盂蘭盆節", "buddhist"],
  ["2027-08-31", "地藏菩薩聖誕", "buddhist"],
  ["2027-10-18", "觀世音菩薩出家日", "buddhist"],
  ["2027-10-28", "藥師佛聖誕", "buddhist"],
  ["2027-12-14", "阿彌陀佛聖誕", "buddhist"],
  ["2027-12-22", "冬至", "solar-term"],
  ["2028-01-04", "釋迦牟尼佛成道日（臘八）", "buddhist"],
  ["2028-01-26", "農曆新年 · 彌勒菩薩聖誕", "new-year"],
  ["2028-03-03", "釋迦牟尼佛出家日", "buddhist"],
  ["2028-03-10", "釋迦牟尼佛涅槃日", "buddhist"],
  ["2028-03-14", "觀世音菩薩聖誕", "buddhist"],
  ["2028-03-16", "普賢菩薩聖誕", "buddhist"],
  ["2028-04-28", "文殊菩薩聖誕", "buddhist"],
  ["2028-05-02", "釋迦牟尼佛聖誕（浴佛節）", "buddhist"],
  ["2028-06-21", "夏至", "solar-term"],
  ["2028-08-09", "觀世音菩薩成道日", "buddhist"],
  ["2028-09-03", "盂蘭盆節", "buddhist"],
  ["2028-09-18", "地藏菩薩聖誕", "buddhist"],
  ["2028-11-05", "觀世音菩薩出家日", "buddhist"],
  ["2028-11-15", "藥師佛聖誕", "buddhist"],
  ["2028-12-21", "冬至", "solar-term"],
  ["2029-01-01", "阿彌陀佛聖誕", "buddhist"],
  ["2029-01-22", "釋迦牟尼佛成道日（臘八）", "buddhist"],
  ["2029-02-13", "農曆新年 · 彌勒菩薩聖誕", "new-year"],
  ["2029-03-22", "釋迦牟尼佛出家日", "buddhist"],
  ["2029-03-29", "釋迦牟尼佛涅槃日", "buddhist"],
  ["2029-04-02", "觀世音菩薩聖誕", "buddhist"],
  ["2029-04-04", "普賢菩薩聖誕", "buddhist"],
  ["2029-05-16", "文殊菩薩聖誕", "buddhist"],
  ["2029-05-20", "釋迦牟尼佛聖誕（浴佛節）", "buddhist"],
  ["2029-06-21", "夏至", "solar-term"],
  ["2029-07-29", "觀世音菩薩成道日", "buddhist"],
  ["2029-08-24", "盂蘭盆節", "buddhist"],
  ["2029-09-07", "地藏菩薩聖誕", "buddhist"],
  ["2029-10-26", "觀世音菩薩出家日", "buddhist"],
  ["2029-11-05", "藥師佛聖誕", "buddhist"],
  ["2029-12-21", "阿彌陀佛聖誕", "buddhist"],
  ["2029-12-21", "冬至", "solar-term"],
  ["2030-01-11", "釋迦牟尼佛成道日（臘八）", "buddhist"],
  ["2030-02-03", "農曆新年 · 彌勒菩薩聖誕", "new-year"],
  ["2030-03-11", "釋迦牟尼佛出家日", "buddhist"],
  ["2030-03-18", "釋迦牟尼佛涅槃日", "buddhist"],
  ["2030-03-22", "觀世音菩薩聖誕", "buddhist"],
  ["2030-03-24", "普賢菩薩聖誕", "buddhist"],
  ["2030-05-05", "文殊菩薩聖誕", "buddhist"],
  ["2030-05-09", "釋迦牟尼佛聖誕（浴佛節）", "buddhist"],
  ["2030-06-21", "夏至", "solar-term"],
  ["2030-07-19", "觀世音菩薩成道日", "buddhist"],
  ["2030-08-13", "盂蘭盆節", "buddhist"],
  ["2030-08-28", "地藏菩薩聖誕", "buddhist"],
  ["2030-10-15", "觀世音菩薩出家日", "buddhist"],
  ["2030-10-26", "藥師佛聖誕", "buddhist"],
  ["2030-12-11", "阿彌陀佛聖誕", "buddhist"],
  ["2030-12-22", "冬至", "solar-term"],
  ["2031-01-01", "釋迦牟尼佛成道日（臘八）", "buddhist"],
  ["2031-01-23", "農曆新年 · 彌勒菩薩聖誕", "new-year"],
  ["2031-02-28", "釋迦牟尼佛出家日", "buddhist"],
  ["2031-03-07", "釋迦牟尼佛涅槃日", "buddhist"],
  ["2031-03-11", "觀世音菩薩聖誕", "buddhist"],
  ["2031-03-13", "普賢菩薩聖誕", "buddhist"],
  ["2031-05-24", "文殊菩薩聖誕", "buddhist"],
  ["2031-05-28", "釋迦牟尼佛聖誕（浴佛節）", "buddhist"],
  ["2031-06-21", "夏至", "solar-term"],
  ["2031-08-06", "觀世音菩薩成道日", "buddhist"],
  ["2031-09-01", "盂蘭盆節", "buddhist"],
  ["2031-09-16", "地藏菩薩聖誕", "buddhist"],
  ["2031-11-03", "觀世音菩薩出家日", "buddhist"],
  ["2031-11-14", "藥師佛聖誕", "buddhist"],
  ["2031-12-22", "冬至", "solar-term"],
  ["2031-12-30", "阿彌陀佛聖誕", "buddhist"],
];

// 日食食甚時間（世界時，依 NASA 日食表），換成台灣日期
const SOLAR_ECLIPSE_UT = [
  "2027-02-06T15:59Z", "2027-08-02T10:06Z", "2028-01-26T15:08Z", "2028-07-22T02:55Z", "2029-01-14T17:12Z",
  "2029-06-12T04:05Z", "2029-07-11T15:36Z", "2029-12-05T15:02Z", "2030-06-01T06:28Z", "2030-11-25T06:50Z",
];

// 天赦日：春戊寅、夏甲午、秋戊申、冬甲子，四季以立春、立夏、立秋、立冬當天起算；由 lunar-javascript 產生，
// 2026、2027 已與台灣農民曆核對
const TENSHA = [
  "2026-03-05", "2026-05-04", "2026-05-20", "2026-07-19", "2026-10-01", "2026-12-16",
  "2027-02-28", "2027-04-29", "2027-05-15", "2027-07-14", "2027-09-26", "2027-12-11",
  "2028-02-23", "2028-04-23", "2028-05-09", "2028-07-08", "2028-09-20", "2028-12-05",
  "2029-02-17", "2029-04-18", "2029-07-03", "2029-09-15", "2029-11-30",
  "2030-01-29", "2030-02-12", "2030-04-13", "2030-06-28", "2030-09-10", "2030-11-25",
  "2031-01-24", "2031-02-07", "2031-04-08", "2031-06-23", "2031-09-05", "2031-11-04", "2031-11-20",
];

const TW = 8 * 3600e3;
export const twDate = (t: number) => new Date(t + TW).toISOString().slice(0, 10);

const EVENTS: CalEvent[] = [
  ...FESTIVALS.map(([date, name, kind]) => ({ date, name, kind })),
  ...TENSHA.map((date) => ({ date, name: "天赦日", kind: "tensha" as const })),
  ...ECLIPSES.map((e) => ({ date: twDate(e.t), name: e.type, kind: "lunar-eclipse" as const })),
  ...SOLAR_ECLIPSE_UT.map((u) => ({ date: twDate(Date.parse(u)), name: "日食", kind: "solar-eclipse" as const })),
].sort((a, b) => a.date.localeCompare(b.date));

export const KIND_LABEL: Record<EventKind, string> = {
  "lunar-eclipse": "月食",
  "solar-eclipse": "日食",
  "solar-term": "節氣",
  "new-year": "年節",
  buddhist: "佛教節日",
  tensha: "吉日 · 宜懺悔、行善、發願",
};

// 願文說「或於日月蝕時日……或於冬夏至年節」，這幾類特別適合念誦
export const PRAYER_KINDS: EventKind[] = ["lunar-eclipse", "solar-eclipse", "solar-term", "new-year"];

// 今天（台灣日期）是否為宜誦願文的日子
export const isPrayerDay = (now: number) => {
  const today = twDate(now);
  return EVENTS.some((e) => e.date === today && PRAYER_KINDS.includes(e.kind));
};

// 今天（台灣日期）以後的節令，含今天
export const upcomingEvents = (now: number, n = 8) => {
  const today = twDate(now);
  return EVENTS.filter((e) => e.date >= today).slice(0, n);
};

export function daysUntil(date: string, now: number) {
  return Math.round((Date.parse(date + "T00:00:00Z") - Date.parse(twDate(now) + "T00:00:00Z")) / 864e5);
}

// 下一個天赦日（含今天）
export const nextTensha = (now: number) => TENSHA.find((d) => d >= twDate(now));

// 按鈕上用的短名稱：去掉括號與「·」之後的補充
export const shortName = (e: CalEvent) => e.name.replace(/（.*?）/g, "").split(" · ")[0];

// 月食：食甚時間（台灣時間 UTC+8），依 NASA 月食表換算
export type Eclipse = { t: number; type: string; vis: string };

export const ECLIPSES: Eclipse[] = [
  ["2027-02-21T07:13", "半影月食", "清晨月落前可見初段，不易察覺"],
  ["2027-07-19T00:03", "半影月食", "可見，不易察覺"],
  ["2027-08-17T15:14", "半影月食", "白天，看不到"],
  ["2028-01-12T12:13", "月偏食", "白天，看不到"],
  ["2028-07-07T02:20", "月偏食", "可見"],
  ["2029-01-01T00:52", "月全食", "全程可見"],
  ["2029-06-26T11:22", "月全食", "白天，看不到"],
  ["2029-12-21T06:42", "月全食", "清晨月落前可見偏食與全食初段"],
  ["2030-06-16T02:33", "月偏食", "全程可見"],
  ["2030-12-10T06:28", "半影月食", "清晨月落前可見，不易察覺"],
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

// 日食：依 NASA 日食表（Espenak），日期為世界時；各地看到的情形差異很大，只列主要可見地區
export const SOLAR_ECLIPSES: [string, string, string][] = [
  ["2027/2/6", "日環食", "南美洲、南極、非洲西部與南部（環食帶：智利、阿根廷）"],
  ["2027/8/2", "日全食", "非洲、歐洲、中東、亞洲西部與南部（全食帶：西班牙、北非、埃及、沙烏地阿拉伯）"],
  ["2028/1/26", "日環食", "美洲、歐洲西部、非洲西北部（環食帶：厄瓜多、巴西、西班牙、葡萄牙）"],
  ["2028/7/22", "日全食", "東南亞、印尼、澳洲、紐西蘭（全食帶：澳洲、紐西蘭）"],
  ["2029/1/14", "日偏食", "北美洲、中美洲"],
  ["2029/6/12", "日偏食", "北極、斯堪地那維亞、阿拉斯加、亞洲北部、加拿大北部"],
  ["2029/7/11", "日偏食", "智利南部、阿根廷南部"],
  ["2029/12/5", "日偏食", "阿根廷南部、智利南部、南極"],
  ["2030/6/1", "日環食", "歐洲、北非、中東、亞洲、北極（環食帶：希臘、土耳其、俄羅斯、中國北方、日本）"],
  ["2030/11/25", "日全食", "非洲南部、南印度洋、印尼、澳洲、南極（全食帶：波札那、南非、澳洲）"],
];

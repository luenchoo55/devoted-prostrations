"use client";

import type { ReactNode } from "react";
import { isPrayerDay } from "@/lib/calendar";
import { useNow } from "@/lib/stores";

// 只在日月食、冬夏至、年節當天（台灣日期）顯示
export function PrayerDayOnly({ children }: { children: ReactNode }) {
  const now = useNow();
  return now !== null && isPrayerDay(now) ? children : null;
}

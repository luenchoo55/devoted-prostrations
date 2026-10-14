"use client";

import { useSyncExternalStore } from "react";

// 目前捲到的步驟：最後一個標頭已越過畫面約 40% 高度的那一步
function read() {
  const line = window.innerHeight * 0.4;
  let id = "";
  for (const el of document.querySelectorAll<HTMLElement>("li[id^='step-']")) {
    if (el.getBoundingClientRect().top <= line) id = el.id.slice(5);
  }
  return id;
}

function subscribe(l: () => void) {
  window.addEventListener("scroll", l, { passive: true });
  window.addEventListener("resize", l);
  return () => {
    window.removeEventListener("scroll", l);
    window.removeEventListener("resize", l);
  };
}

export const useActiveStep = () => useSyncExternalStore(subscribe, read, () => "");

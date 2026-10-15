// 儀軌步驟 id，順序即頁面上的順序；vajrasattva 只在有供品的日子出現
export const STEP_IDS = ["lamp", "cundi", "mantra", "refuge1", "prelude", "vajrasattva", "sutras", "dedicate", "refuge2"] as const;
export type StepId = (typeof STEP_IDS)[number];

export const activeSteps = (offering: boolean | null) =>
  STEP_IDS.filter((id) => id !== "vajrasattva" || offering === true);

// 目錄用的簡短名稱
export const STEP_LABELS: Record<StepId, string> = {
  lamp: "頂禮點燈",
  cundi: "準提佛母祈禱文",
  mantra: "功德倍增咒",
  refuge1: "皈依頂禮",
  prelude: "誦經前準備",
  vajrasattva: "金剛薩埵百字明咒",
  sutras: "誦經",
  dedicate: "迴向",
  refuge2: "皈依頂禮",
};

export const MANTRA_TIMES = 7;
export const VAJRA_TIMES = 3;

export const LINKS = {
  diamond: "https://www.youtube.com/watch?v=ATOWBwCcXgk",
  pumen: "https://www.youtube.com/watch?v=tukLNS8vUYU&t=1s",
  b88: "https://www.youtube.com/watch?v=LDffkmSgUm8&t=1277s",
  pxw: "https://www.youtube.com/watch?v=vSFUBm_OPas&list=PLaqdrgQrv8XidPc7rIoNXs7hH8_Wq_JAd",
};

// 準提佛母祈禱文，依月份播放
export const CUNDI_MONTHS: [string, string][] = [
  ["一月", "https://www.youtube.com/watch?v=AqqDCPGi0Fk&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=4"],
  ["二月", "https://www.youtube.com/watch?v=_69Jjo1anbA&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=3"],
  ["三月", "https://www.youtube.com/watch?v=_Vj5LThnb5Q&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=2"],
  ["四月", "https://www.youtube.com/watch?v=thhY57Ytfj8&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=1"],
  ["五月", "https://www.youtube.com/watch?v=qHbqLkaxQCA&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=14"],
  ["六月", "https://www.youtube.com/watch?v=oAjqrqtlg8c&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=13"],
  ["七月", "https://www.youtube.com/watch?v=dYqY2zMI4EQ&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=12"],
  ["八月", "https://www.youtube.com/watch?v=qr9UsCPuazk&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=11"],
  ["九月", "https://www.youtube.com/watch?v=MOW-yLko1A0&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=10"],
  ["十月", "https://www.youtube.com/watch?v=ikL9v3JLmSE&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=9"],
  ["十一月", "https://www.youtube.com/watch?v=n347-kVEKmE&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=6"],
  ["十二月", "https://www.youtube.com/watch?v=jbWFQmvARSQ&list=PLCLnygUHBzokRY5_1xvas6D6srMjLsBkf&index=5"],
];

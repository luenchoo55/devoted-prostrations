// 把一般的 YouTube 網址轉成嵌入網址，保留開始秒數與播放清單
export function toEmbed(href: string) {
  const u = new URL(href);
  const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v");
  const q = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });
  const t = u.searchParams.get("t");
  if (t && t !== "1s") q.set("start", t.replace(/s$/, ""));
  const list = u.searchParams.get("list");
  if (list) q.set("list", list);
  return `https://www.youtube-nocookie.com/embed/${id}?${q}`;
}

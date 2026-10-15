"use client";

// 經文卷底部的收合：關上外層 <details>，再捲回它的標題
export function ScrollCollapse() {
  return (
    <button
      type="button"
      onClick={(e) => {
        const details = e.currentTarget.closest("details");
        if (!details) return;
        details.open = false;
        details.scrollIntoView({ block: "start", behavior: "smooth" });
      }}
      className="mt-4 w-full cursor-pointer rounded-full border border-line py-2 text-sm text-muted hover:border-gold"
    >
      收合 ▴
    </button>
  );
}

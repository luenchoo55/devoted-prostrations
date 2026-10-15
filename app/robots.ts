import type { MetadataRoute } from "next";

// 私人網站：禁止所有搜尋引擎爬取
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}

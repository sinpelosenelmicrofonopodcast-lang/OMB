import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/admin/", "/login"] }],
    sitemap: "https://www.ombautosalesandservices.com/sitemap.xml",
    host: "https://www.ombautosalesandservices.com"
  };
}

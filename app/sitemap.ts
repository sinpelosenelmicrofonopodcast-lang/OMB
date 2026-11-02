import type { MetadataRoute } from "next";
import { getInventory } from "@/lib/db/vehicles";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = "https://www.ombautosalesandservices.com";
  const pages = ["", "/inventory", "/about", "/contact"].map((path) => ({
    url: `${origin}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/inventory" ? 0.9 : 0.6
  }));

  try {
    const { vehicles } = await getInventory({ status: "available" });
    return [
      ...pages,
      ...vehicles.filter((vehicle) => Boolean(vehicle.slug)).map((vehicle) => ({
        url: `${origin}/inventory/${encodeURIComponent(vehicle.slug)}`,
        lastModified: vehicle.updated_at ? new Date(vehicle.updated_at) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8
      }))
    ];
  } catch {
    return pages;
  }
}

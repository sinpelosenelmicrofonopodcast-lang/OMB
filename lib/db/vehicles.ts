import { createClient } from "@/lib/supabase/server";
import type { Vehicle } from "@/lib/db/types";

export type InventorySort = "price_asc" | "price_desc" | "newest";

export type InventoryFilters = {
  search?: string;
  make?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: "available" | "pending" | "sold" | "all";
  sort?: InventorySort;
  includeUnpublished?: boolean;
};

export async function getFeaturedVehicles(limit = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("featured", true)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getInventory(filters: InventoryFilters = {}) {
  const supabase = await createClient();
  let query = supabase.from("vehicles").select("*", { count: "exact" });

  if (!filters.includeUnpublished) {
    query = query.eq("published", true);
  }

  if (filters.make) {
    query = query.eq("make", filters.make);
  }

  if (filters.year) {
    query = query.eq("year", filters.year);
  }

  if (filters.minPrice != null) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice != null) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.search) {
    const normalized = filters.search.trim().replaceAll(",", " ");
    if (normalized) {
      query = query.or(
        `title.ilike.%${normalized}%,make.ilike.%${normalized}%,model.ilike.%${normalized}%,trim.ilike.%${normalized}%`
      );
    }
  }

  const sort = filters.sort ?? "newest";
  if (sort === "price_asc") {
    query = query.order("price", { ascending: true, nullsFirst: false });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    vehicles: (data ?? []) as Vehicle[],
    count: count ?? 0
  };
}

export async function getVehicleBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getVehicleById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPublicVehicleById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getVehicleMakes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("vehicles").select("make").eq("published", true);

  if (error) throw error;

  const makes = new Set<string>();
  for (const row of data ?? []) {
    if (row.make) makes.add(row.make);
  }

  return Array.from(makes).sort((a, b) => a.localeCompare(b));
}

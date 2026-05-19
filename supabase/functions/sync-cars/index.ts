import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

type SheetRow = Record<string, unknown>;

type CarRecord = {
  vin: string;
  title: string;
  slug: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  mileage?: number;
  price?: number;
  color?: string;
  transmission?: string;
  fuel_type?: string;
  description?: string;
  highlights?: string[];
  main_image_url?: string;
  gallery_urls?: string[];
  status?: "coming_soon" | "available" | "sold" | "pending";
  featured?: boolean;
  updated_at?: string;
};

type SyncSummary = {
  fetched: number;
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
  invalid: number;
  errors: string[];
};

const defaultSheetUrl = "https://opensheet.elk.sh/17bgEZiVZHAkOO_PBKntKQ45uVvU6FicgSzHNrFOzTOE/INVENTARIO";
const allowedStatuses = new Set(["coming_soon", "available", "sold"]);
const allowedTables = new Set(["cars", "vehicles"]);

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const sheetUrl = Deno.env.get("SYNC_CARS_SHEET_URL") ?? defaultSheetUrl;
const targetTable = Deno.env.get("SYNC_CARS_TABLE") ?? "cars";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

Deno.serve(async () => {
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ ok: false, message: "Missing Supabase Edge Function secrets." }, 500);
  }

  if (!allowedTables.has(targetTable)) {
    return json({ ok: false, message: `Invalid SYNC_CARS_TABLE: ${targetTable}` }, 500);
  }

  const startedAt = new Date().toISOString();
  const summary: SyncSummary = {
    fetched: 0,
    processed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    invalid: 0,
    errors: []
  };

  try {
    const rows = await fetchSheetRows();
    summary.fetched = rows.length;
    const recordsByVin = new Map<string, { record: CarRecord; rowNumber: number }>();

    for (const [index, row] of rows.entries()) {
      try {
        const transformed = transformRow(row);

        if (!transformed) {
          summary.invalid += 1;
          continue;
        }

        recordsByVin.set(transformed.vin, { record: transformed, rowNumber: index + 2 });
      } catch (error) {
        summary.errors.push(`Row ${index + 2}: ${messageFromError(error)}`);
      }
    }

    for (const { record, rowNumber } of recordsByVin.values()) {
      try {
        const result = await retry(() => syncRecord(record), 2);
        summary.processed += 1;

        if (result === "inserted") summary.inserted += 1;
        if (result === "updated") summary.updated += 1;
        if (result === "skipped") summary.skipped += 1;
      } catch (error) {
        summary.errors.push(`Row ${rowNumber}: ${messageFromError(error)}`);
      }
    }

    const status = summary.errors.length ? "error" : "success";
    await writeLog(status, buildLogMessage(summary, startedAt));

    return json({
      ok: summary.errors.length === 0,
      status,
      targetTable,
      summary
    });
  } catch (error) {
    const message = `Sync failed: ${messageFromError(error)}`;
    await writeLog("error", message);
    return json({ ok: false, status: "error", message, summary }, 500);
  }
});

async function fetchSheetRows() {
  const response = await retry(() => fetch(sheetUrl), 3);

  if (!response.ok) {
    throw new Error(`Google Sheet fetch failed with ${response.status}`);
  }

  const body = await response.json();

  if (!Array.isArray(body)) {
    throw new Error("Google Sheet JSON response is not an array.");
  }

  return body as SheetRow[];
}

async function syncRecord(record: CarRecord): Promise<"inserted" | "updated" | "skipped"> {
  const { data: existing, error: selectError } = await supabase
    .from(targetTable)
    .select("*")
    .eq("vin", record.vin)
    .maybeSingle();

  if (selectError) throw selectError;

  if (!existing) {
    const insertPayload = removeUndefined(record);
    const { error } = await supabase.from(targetTable).insert(insertPayload);
    if (error) throw error;
    return "inserted";
  }

  const changed = buildChangedPayload(existing, record);

  if (Object.keys(changed).length === 0) {
    return "skipped";
  }

  const { error } = await supabase.from(targetTable).update(changed).eq("vin", record.vin);
  if (error) throw error;

  return "updated";
}

function transformRow(row: SheetRow): CarRecord | null {
  const vin = cleanText(row.vin).toUpperCase();
  const make = cleanText(row.make);
  const model = cleanText(row.model);
  const year = parseNumber(row.year);

  if (!vin || !make || !model || !year) return null;

  const title = `${year} ${make} ${model}`;
  const images = parseImages(row.images);
  const status = normalizeStatus(row.status);
  const highlights = parseList(row.highlights ?? row.features);

  return removeUndefined({
    vin,
    title,
    slug: slugify(title),
    year,
    make,
    model,
    trim: cleanText(row.condition) || undefined,
    mileage: parseNumber(row.mileage),
    price: parseNumber(row.price),
    color: cleanText(row.color) || undefined,
    drivetrain: cleanText(row.drivetrain) || undefined,
    transmission: cleanText(row.transmission) || undefined,
    fuel_type: cleanText(row.fuel_type ?? row.fuel) || undefined,
    description: cleanText(row.description) || undefined,
    highlights: highlights.length ? highlights : undefined,
    main_image_url: images[0],
    gallery_urls: images.length ? images.slice(1) : undefined,
    status: targetTable === "vehicles" && status === "coming_soon" ? "pending" : status,
    featured: parseBoolean(row.featured),
    updated_at: parseDate(row.updated_at) ?? parseDate(row.date_added)
  });
}

function buildChangedPayload(existing: Record<string, unknown>, next: CarRecord) {
  const changed: Record<string, unknown> = {};
  const cleanNext = removeUndefined(next) as Record<string, unknown>;

  for (const [key, value] of Object.entries(cleanNext)) {
    if (key === "vin" || key === "updated_at") continue;
    if (value === null || value === undefined) continue;

    if (targetTable === "vehicles" && key === "main_image_url") {
      if (!existing.main_image_url && value) changed[key] = value;
      continue;
    }

    if (targetTable === "vehicles" && key === "gallery_urls") {
      const existingArray = Array.isArray(existing.gallery_urls) ? existing.gallery_urls : [];
      const nextArray = Array.isArray(value) ? value : [];
      const merged = Array.from(new Set([...existingArray, ...nextArray]));
      if (merged.length > existingArray.length) changed[key] = merged;
      continue;
    }

    if (Array.isArray(value)) {
      const existingArray = Array.isArray(existing[key]) ? existing[key] : [];
      if (JSON.stringify(existingArray) !== JSON.stringify(value)) changed[key] = value;
      continue;
    }

    if (existing[key] !== value) {
      changed[key] = value;
    }
  }

  return changed;
}

function normalizeStatus(value: unknown): "coming_soon" | "available" | "sold" {
  const normalized = cleanText(value).toLowerCase().replaceAll(" ", "_").replaceAll("-", "_");
  if (allowedStatuses.has(normalized)) return normalized as "coming_soon" | "available" | "sold";
  if (normalized === "pending" || normalized === "cooming_soon") return "coming_soon";
  return "available";
}

function parseImages(value: unknown) {
  return parseList(value)
    .map(normalizeImageUrl);
}

function parseList(value: unknown) {
  return cleanText(value)
    .split(/[\n,|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeImageUrl(value: string) {
  const driveMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=w1200`;
  }

  return value;
}

function parseBoolean(value: unknown) {
  const normalized = cleanText(value).toLowerCase();
  return ["true", "yes", "y", "1", "featured"].includes(normalized);
}

function parseNumber(value: unknown) {
  const cleaned = cleanText(value).replace(/[^\d.]/g, "");
  if (!cleaned) return undefined;

  const number = Number(cleaned);
  return Number.isFinite(number) ? Math.round(number) : undefined;
}

function parseDate(value: unknown) {
  const text = cleanText(value);
  if (!text) return undefined;

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function cleanText(value: unknown) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? String(value).trim()
    : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function removeUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null)) as T;
}

async function retry<T>(operation: () => Promise<T>, attempts: number) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  throw lastError;
}

async function writeLog(status: "success" | "error", message: string) {
  const { error } = await supabase.from("sync_logs").insert({ status, message });
  if (error) console.error("Unable to write sync log:", error);
}

function buildLogMessage(summary: SyncSummary, startedAt: string) {
  const parts = [
    `sync-cars started_at=${startedAt}`,
    `fetched=${summary.fetched}`,
    `processed=${summary.processed}`,
    `inserted=${summary.inserted}`,
    `updated=${summary.updated}`,
    `skipped=${summary.skipped}`,
    `invalid=${summary.invalid}`,
    `errors=${summary.errors.length}`
  ];

  if (summary.errors.length) {
    parts.push(`error_details=${summary.errors.slice(0, 5).join(" | ")}`);
  }

  return parts.join(" ");
}

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

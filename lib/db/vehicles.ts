import type { Vehicle } from "@/lib/db/types";
import { createSign } from "node:crypto";

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

const sheetId = process.env.HGM_OMB_SHEET_ID || "1xDYHxFXDJUie89Zgao1ETWrpJg0eY8ByFsO4lVHiNmY";
const photoById: Record<string, string> = {
  "omb-1": "/vehicles/subaru.jpg",
  "omb-2": "/vehicles/acura-rdx.jpg",
  "omb-3": "/vehicles/porsche-cayenne.jpg",
  "omb-4": "/vehicles/ford-mustang.jpg",
  "omb-5": "/vehicles/kia-soul.jpg",
  "omb-6": "/vehicles/honda-civic.jpg"
};

// A snapshot of the six rows in HGM Group's INVENTARIO sheet.
// This keeps the catalog usable if Google Sheets is temporarily unavailable.
const snapshot: string[][] = [
  ["ID","Title","Make","Model","Year","Color","Price USD","Status","Published","Description","Photo filename","Photo Drive URL","Contact phone","Location","Featured"],
  ["omb-1","Subaru WRX STI","Subaru","WRX STI","","Gray","","available","TRUE","Gray Subaru WRX STI. For mileage, features, price and availability, please call 254-393-5554 or visit OMB Auto Sales in Killeen, Texas.","Subaru.png","","254-393-5554","Killeen, Texas","TRUE"],
  ["omb-2","Acura RDX","Acura","RDX","","Silver","","available","TRUE","Silver Acura RDX SUV. For mileage, features, price and availability, please call 254-393-5554 or visit OMB Auto Sales in Killeen, Texas.","RDX.png","","254-393-5554","Killeen, Texas","FALSE"],
  ["omb-3","Porsche Cayenne","Porsche","Cayenne","","White","","available","TRUE","White Porsche Cayenne SUV. For mileage, features, price and availability, please call 254-393-5554 or visit OMB Auto Sales in Killeen, Texas.","Porsche.png","","254-393-5554","Killeen, Texas","FALSE"],
  ["omb-4","Ford Mustang","Ford","Mustang","","Yellow","","available","TRUE","Yellow Ford Mustang coupe. For mileage, features, price and availability, please call 254-393-5554 or visit OMB Auto Sales in Killeen, Texas.","Mustang.png","","254-393-5554","Killeen, Texas","FALSE"],
  ["omb-5","Kia Soul","Kia","Soul","","Gray","","available","TRUE","Gray Kia Soul crossover. For mileage, features, price and availability, please call 254-393-5554 or visit OMB Auto Sales in Killeen, Texas.","Soul.png","","254-393-5554","Killeen, Texas","FALSE"],
  ["omb-6","2015 Honda Civic","Honda","Civic","2015","White","8995","available","TRUE","White 2015 Honda Civic sedan priced at $8,995. For mileage, features and availability, please call 254-393-5554 or visit OMB Auto Sales in Killeen, Texas.","HONDA CIVIC 2015 8995(1).png","","254-393-5554","Killeen, Texas","FALSE"]
];

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], item = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { item += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && ch === ",") {
      row.push(item); item = "";
    } else if (!quoted && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(item); rows.push(row); row = []; item = "";
    } else item += ch;
  }
  if (item || row.length) { row.push(item); rows.push(row); }
  return rows;
}

function jwtPart(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

async function getServiceAccountToken(): Promise<string | null> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) return null;
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) as { client_email: string; private_key: string };
  const now = Math.floor(Date.now() / 1000);
  const payload = jwtPart({ iss: key.client_email, scope: "https://www.googleapis.com/auth/spreadsheets.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3000 });
  const unsigned = jwtPart({ alg: "RS256", typ: "JWT" }) + "." + payload;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = unsigned + "." + signer.sign(key.private_key).toString("base64url");
  const body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion });
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new Error("Google service-account authorization failed.");
  const json = await response.json() as { access_token: string };
  return json.access_token;
}

async function loadRows(): Promise<string[][]> {
  try {
    const token = await getServiceAccountToken();
    if (token) {
      const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + encodeURIComponent(sheetId) + '/values/INVENTARIO!A1:O1000';
      const response = await fetch(url, { headers: { Authorization: 'Bearer ' + token }, cache: "no-store", signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error("Unable to read HGM inventory sheet.");
      const data = await response.json() as { values?: unknown[][] };
      if (!data.values?.length) return [];
      return data.values.map(r => r.map(c => c == null ? "" : String(c)));
    }
    const url = 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(sheetId) + '/gviz/tq?tqx=out:csv&sheet=INVENTARIO';
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error("HGM sheet not publicly readable.");
    const csv = await response.text();
    if (csv.trimStart().startsWith("<")) throw new Error("HGM sheet requires authentication.");
    const rows = parseCsv(csv);
    if (rows[0]?.[0] !== "ID") throw new Error("Unexpected spreadsheet data.");
    return rows;
  } catch (error) {
    console.warn("HGM inventory live read unavailable; serving verified six-vehicle snapshot.", error instanceof Error ? error.message : "unknown error");
    return snapshot;
  }
}

function optionalNumber(value: string | undefined): number | null {
  if (!value || !value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function allVehicles(): Promise<Vehicle[]> {
  const rows = await loadRows();
  if (!rows.length || rows[0]?.[0] !== "ID") return [];
  const headers = rows[0];
  const column = (row: string[], name: string): string => row[headers.indexOf(name)] || "";
  const timestamp = "2026-11-05T00:00:00.000Z";
  return rows.slice(1).filter(r => r[0]).map((r): Vehicle => {
    const id = column(r, "ID").trim();
    const title = column(r, "Title").trim();
    const statusValue = column(r, "Status");
    const status: Vehicle["status"] = statusValue === "sold" || statusValue === "pending" ? statusValue : "available";
    const slug = (title || id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    // Original photo assets are hosted on OMB's website, not private Google Drive links.
    const mainPhoto = photoById[id] || null;
    return {
      id, slug, title, make: column(r, "Make") || null, model: column(r, "Model") || null,
      year: optionalNumber(column(r, "Year")), color: column(r, "Color") || null,
      price: optionalNumber(column(r, "Price USD")), status,
      published: column(r, "Published").toLowerCase() === "true",
      featured: column(r, "Featured").toLowerCase() === "true",
      description: column(r, "Description") || null, main_image_url: mainPhoto,
      gallery_urls: [], highlights: [], specs: {}, mileage: null, vin: null,
      trim: null, drivetrain: null, transmission: null, fuel_type: null,
      created_at: timestamp, updated_at: timestamp
    };
  });
}

export async function getInventory(filters: InventoryFilters = {}) {
  let vehicles = await allVehicles();
  if (!filters.includeUnpublished) vehicles = vehicles.filter(v => v.published);
  if (filters.make) vehicles = vehicles.filter(v => v.make === filters.make);
  if (filters.year != null) vehicles = vehicles.filter(v => v.year === filters.year);
  if (filters.minPrice != null) vehicles = vehicles.filter(v => v.price != null && v.price >= filters.minPrice!);
  if (filters.maxPrice != null) vehicles = vehicles.filter(v => v.price != null && v.price <= filters.maxPrice!);
  if (filters.status && filters.status !== "all") vehicles = vehicles.filter(v => v.status === filters.status);
  if (filters.search) {
    const s = filters.search.trim().toLowerCase();
    vehicles = vehicles.filter(v => [v.title, v.make, v.model].some(x => x?.toLowerCase().includes(s)));
  }
  if (filters.sort === "price_asc") vehicles.sort((a,b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (filters.sort === "price_desc") vehicles.sort((a,b) => (b.price ?? -1) - (a.price ?? -1));
  return { vehicles, count: vehicles.length };
}
export async function getFeaturedVehicles(limit = 3) {
  const vehicles = (await getInventory({ status: "available" })).vehicles;
  const featured = vehicles.filter(v => v.featured);
  return [...featured, ...vehicles.filter(v => !v.featured)].slice(0, limit);
}
export async function getVehicleBySlug(slug: string) { return (await allVehicles()).find(v => v.published && v.slug === slug) ?? null; }
export async function getVehicleById(id: string) { return (await allVehicles()).find(v => v.id === id) ?? null; }
export async function getPublicVehicleById(id: string) { return (await allVehicles()).find(v => v.id === id && v.published) ?? null; }
export async function getVehicleMakes() {
  const vehicles = (await getInventory()).vehicles;
  return Array.from(new Set(vehicles.map(v => v.make).filter((x): x is string => Boolean(x)))).sort();
}

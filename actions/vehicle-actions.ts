"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Json } from "@/lib/db/types";
import { parseLineList, safeJsonParse, slugify } from "@/lib/utils";
import {
  ensureAdmin,
  getBoolean,
  getOptionalNumber,
  getOptionalText,
  getText,
  normalizeErrorMessage,
  rethrowIfRedirectError,
  sanitizeFileName
} from "@/actions/_helpers";

const BUCKET_NAME = "vehicle-images";
const VEHICLE_STATUSES = new Set(["available", "pending", "sold"]);

type VehicleFormPayload = {
  title: string;
  status: "available" | "pending" | "sold";
  featured: boolean;
  published: boolean;
  slugInput: string;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  mileage: number | null;
  price: number | null;
  vin: string | null;
  color: string | null;
  drivetrain: string | null;
  transmission: string | null;
  fuelType: string | null;
  description: string | null;
  highlights: string[];
  mainImageUrl: string | null;
  manualGalleryUrls: string[];
  specs: Json;
};

function parseVehiclePayload(formData: FormData): VehicleFormPayload {
  const title = getText(formData, "title");
  if (!title) {
    throw new Error("Vehicle title is required.");
  }

  const statusRaw = getText(formData, "status");
  const status = VEHICLE_STATUSES.has(statusRaw)
    ? (statusRaw as VehicleFormPayload["status"])
    : "available";

  return {
    title,
    status,
    featured: getBoolean(formData, "featured"),
    published: getBoolean(formData, "published"),
    slugInput: getText(formData, "slug"),
    year: getOptionalNumber(formData, "year"),
    make: getOptionalText(formData, "make"),
    model: getOptionalText(formData, "model"),
    trim: getOptionalText(formData, "trim"),
    mileage: getOptionalNumber(formData, "mileage"),
    price: getOptionalNumber(formData, "price"),
    vin: getOptionalText(formData, "vin"),
    color: getOptionalText(formData, "color"),
    drivetrain: getOptionalText(formData, "drivetrain"),
    transmission: getOptionalText(formData, "transmission"),
    fuelType: getOptionalText(formData, "fuel_type"),
    description: getOptionalText(formData, "description"),
    highlights: parseLineList(getText(formData, "highlights_text")),
    mainImageUrl: getOptionalText(formData, "main_image_url"),
    manualGalleryUrls: parseLineList(getText(formData, "gallery_urls_text")),
    specs: safeJsonParse<Json>(getText(formData, "specs_json"), {})
  };
}

async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof ensureAdmin>>["supabase"],
  desiredSlug: string,
  excludeVehicleId?: string
) {
  const base = desiredSlug || `vehicle-${crypto.randomUUID().slice(0, 8)}`;
  let candidate = base;
  let iteration = 1;

  while (true) {
    let query = supabase.from("vehicles").select("id").eq("slug", candidate);

    if (excludeVehicleId) {
      query = query.neq("id", excludeVehicleId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return candidate;

    candidate = `${base}-${iteration}`;
    iteration += 1;
  }
}

async function uploadVehicleImage(
  supabase: Awaited<ReturnType<typeof ensureAdmin>>["supabase"],
  vehicleId: string,
  file: File,
  prefix: string
) {
  const timestamp = Date.now();
  const fileName = sanitizeFileName(file.name || `${prefix}.jpg`);
  const path = `vehicles/${vehicleId}/${prefix}-${timestamp}-${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) return value;
  return null;
}

function getFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

function revalidateVehiclePaths(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  if (slug) {
    revalidatePath(`/inventory/${slug}`);
  }
}

export async function createVehicleAction(formData: FormData) {
  try {
    const { supabase } = await ensureAdmin();
    const payload = parseVehiclePayload(formData);
    const vehicleId = crypto.randomUUID();

    const requestedSlug = slugify(payload.slugInput || payload.title);
    const fallbackSlug = `${slugify(payload.title) || "vehicle"}-${vehicleId.slice(0, 6)}`;
    const slug = await ensureUniqueSlug(supabase, requestedSlug || fallbackSlug);

    const mainUpload = getFile(formData, "main_image");
    const galleryUploads = getFiles(formData, "gallery_images");

    const uploadedMainUrl = mainUpload ? await uploadVehicleImage(supabase, vehicleId, mainUpload, "main") : null;
    const uploadedGalleryUrls = await Promise.all(
      galleryUploads.map((file, index) => uploadVehicleImage(supabase, vehicleId, file, `gallery-${index + 1}`))
    );

    const galleryUrls = Array.from(new Set([...payload.manualGalleryUrls, ...uploadedGalleryUrls]));

    const { error } = await supabase.from("vehicles").insert({
      id: vehicleId,
      title: payload.title,
      slug,
      status: payload.status,
      featured: payload.featured,
      published: payload.published,
      year: payload.year,
      make: payload.make,
      model: payload.model,
      trim: payload.trim,
      mileage: payload.mileage,
      price: payload.price,
      vin: payload.vin,
      color: payload.color,
      drivetrain: payload.drivetrain,
      transmission: payload.transmission,
      fuel_type: payload.fuelType,
      description: payload.description,
      highlights: payload.highlights,
      main_image_url: uploadedMainUrl ?? payload.mainImageUrl,
      gallery_urls: galleryUrls,
      specs: payload.specs
    });

    if (error) throw error;

    revalidateVehiclePaths(slug);
    redirect("/admin/inventory?message=Vehicle%20created");
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(`/admin/inventory/new?message=${encodeURIComponent(normalizeErrorMessage(error, "Failed to create vehicle."))}`);
  }
}

export async function updateVehicleAction(formData: FormData) {
  const vehicleId = getText(formData, "id");
  if (!vehicleId) {
    redirect("/admin/inventory?message=Missing%20vehicle%20id");
  }

  try {
    const { supabase } = await ensureAdmin();
    const payload = parseVehiclePayload(formData);
    const existingSlug = getText(formData, "existing_slug");

    const slugBase = slugify(payload.slugInput || existingSlug || payload.title) || `${slugify(payload.title) || "vehicle"}-${vehicleId.slice(0, 6)}`;
    const slug = await ensureUniqueSlug(supabase, slugBase, vehicleId);

    const mainUpload = getFile(formData, "main_image");
    const galleryUploads = getFiles(formData, "gallery_images");

    const uploadedMainUrl = mainUpload ? await uploadVehicleImage(supabase, vehicleId, mainUpload, "main") : null;
    const uploadedGalleryUrls = await Promise.all(
      galleryUploads.map((file, index) => uploadVehicleImage(supabase, vehicleId, file, `gallery-${index + 1}`))
    );

    const galleryUrls = Array.from(new Set([...payload.manualGalleryUrls, ...uploadedGalleryUrls]));

    const { error } = await supabase
      .from("vehicles")
      .update({
        title: payload.title,
        slug,
        status: payload.status,
        featured: payload.featured,
        published: payload.published,
        year: payload.year,
        make: payload.make,
        model: payload.model,
        trim: payload.trim,
        mileage: payload.mileage,
        price: payload.price,
        vin: payload.vin,
        color: payload.color,
        drivetrain: payload.drivetrain,
        transmission: payload.transmission,
        fuel_type: payload.fuelType,
        description: payload.description,
        highlights: payload.highlights,
        main_image_url: uploadedMainUrl ?? payload.mainImageUrl,
        gallery_urls: galleryUrls,
        specs: payload.specs
      })
      .eq("id", vehicleId);

    if (error) throw error;

    revalidateVehiclePaths(slug);
    redirect(`/admin/inventory/${vehicleId}/edit?message=${encodeURIComponent("Vehicle updated")}`);
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(
      `/admin/inventory/${vehicleId}/edit?message=${encodeURIComponent(normalizeErrorMessage(error, "Failed to update vehicle."))}`
    );
  }
}

export async function toggleVehicleFeaturedAction(formData: FormData) {
  const id = getText(formData, "id");
  const nextValue = getBoolean(formData, "next_featured");

  const { supabase } = await ensureAdmin();
  const { error } = await supabase.from("vehicles").update({ featured: nextValue }).eq("id", id);
  if (error) throw error;

  revalidateVehiclePaths();
  redirect("/admin/inventory?message=Updated%20featured%20status");
}

export async function toggleVehiclePublishedAction(formData: FormData) {
  const id = getText(formData, "id");
  const nextValue = getBoolean(formData, "next_published");

  const { supabase } = await ensureAdmin();
  const { error } = await supabase.from("vehicles").update({ published: nextValue }).eq("id", id);
  if (error) throw error;

  revalidateVehiclePaths();
  redirect("/admin/inventory?message=Updated%20publish%20status");
}

export async function markVehicleSoldAction(formData: FormData) {
  const id = getText(formData, "id");

  const { supabase } = await ensureAdmin();
  const { error } = await supabase.from("vehicles").update({ status: "sold" }).eq("id", id);
  if (error) throw error;

  revalidateVehiclePaths();
  redirect("/admin/inventory?message=Vehicle%20marked%20sold");
}

export async function deleteVehicleAction(formData: FormData) {
  const id = getText(formData, "id");
  const slug = getText(formData, "slug");

  const { supabase } = await ensureAdmin();

  const { data: files } = await supabase.storage.from(BUCKET_NAME).list(`vehicles/${id}`);
  if (files && files.length) {
    const paths = files.map((file) => `vehicles/${id}/${file.name}`);
    await supabase.storage.from(BUCKET_NAME).remove(paths);
  }

  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;

  revalidateVehiclePaths(slug);
  redirect("/admin/inventory?message=Vehicle%20deleted");
}

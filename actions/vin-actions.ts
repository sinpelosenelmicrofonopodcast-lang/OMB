"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Json } from "@/lib/db/types";
import { ensureAdmin, getText, normalizeErrorMessage, rethrowIfRedirectError } from "@/actions/_helpers";
import { isValidVin, normalizeVin } from "@/lib/vin";

type VinDecodeResult = {
  ErrorCode?: string;
  ErrorText?: string;
  Make?: string;
  Model?: string;
  ModelYear?: string;
  Trim?: string;
};

function resolveReturnTo(value: string) {
  if (value.startsWith("/admin")) return value;
  return "/admin/inventory";
}

function withMessage(path: string, message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}message=${encodeURIComponent(message)}`;
}

function toPositiveInt(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.trunc(parsed);
}

function mergeSpecs(current: Json, nextValue: Json): Json {
  if (current && typeof current === "object" && !Array.isArray(current)) {
    return {
      ...current,
      vin_decoder: nextValue
    };
  }

  return { vin_decoder: nextValue };
}

async function decodeVinWithNhtsa(vin: string): Promise<VinDecodeResult | null> {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(vin)}?format=json`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("VIN verification service unavailable.");
  }

  const payload = (await response.json()) as { Results?: VinDecodeResult[] };
  return payload.Results?.[0] ?? null;
}

export async function verifyVehicleVinAction(formData: FormData) {
  const returnTo = resolveReturnTo(getText(formData, "return_to") || "/admin/inventory");
  const vehicleId = getText(formData, "id");
  const vinRaw = getText(formData, "vin");
  const vin = normalizeVin(vinRaw);

  if (!vehicleId) {
    redirect(withMessage(returnTo, "Missing vehicle id"));
  }

  if (!vin) {
    redirect(withMessage(returnTo, "VIN is required."));
  }

  if (!isValidVin(vin)) {
    redirect(withMessage(returnTo, "VIN format is invalid. VIN must be 17 characters (no I, O, Q)."));
  }

  try {
    const { supabase } = await ensureAdmin();

    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id,slug,vin,make,model,year,specs")
      .eq("id", vehicleId)
      .maybeSingle();

    if (vehicleError) throw vehicleError;
    if (!vehicle) {
      redirect(withMessage(returnTo, "Vehicle not found."));
    }

    const decoded = await decodeVinWithNhtsa(vin);

    if (!decoded) {
      redirect(withMessage(returnTo, "VIN check could not decode this VIN."));
    }

    const decodedMake = decoded.Make?.trim() || null;
    const decodedModel = decoded.Model?.trim() || null;
    const decodedYear = toPositiveInt(decoded.ModelYear?.trim());
    const decodedTrim = decoded.Trim?.trim() || null;

    const decoderSummary: Json = {
      source: "NHTSA vPIC",
      checked_at: new Date().toISOString(),
      vin,
      error_code: decoded.ErrorCode ?? null,
      error_text: decoded.ErrorText ?? null,
      make: decodedMake,
      model: decodedModel,
      year: decodedYear,
      trim: decodedTrim
    };

    const { error: updateError } = await supabase
      .from("vehicles")
      .update({
        vin,
        make: vehicle.make || decodedMake,
        model: vehicle.model || decodedModel,
        year: vehicle.year || decodedYear,
        specs: mergeSpecs(vehicle.specs, decoderSummary)
      })
      .eq("id", vehicleId);

    if (updateError) throw updateError;

    revalidatePath("/");
    revalidatePath("/inventory");
    revalidatePath(`/admin/inventory/${vehicleId}/edit`);
    revalidatePath("/admin/inventory");
    if (vehicle.slug) {
      revalidatePath(`/inventory/${vehicle.slug}`);
    }

    redirect(withMessage(returnTo, "VIN verified with NHTSA and saved."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(withMessage(returnTo, normalizeErrorMessage(error, "Failed to verify VIN.")));
  }
}

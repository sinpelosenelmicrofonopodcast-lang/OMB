import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeFileName } from "@/actions/_helpers";

const BUCKET_NAME = "vehicle-images";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_IMAGE_SIZE_BYTES = 12 * 1024 * 1024;

type SignedUploadRequest = {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  vehicleId?: string;
  prefix?: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as SignedUploadRequest | null;
  const fileName = sanitizeFileName(body?.fileName || "vehicle-image.jpg") || "vehicle-image.jpg";
  const fileType = body?.fileType || "";
  const fileSize = body?.fileSize ?? 0;
  const vehicleId = body?.vehicleId || "";
  const prefix = sanitizeFileName(body?.prefix || "image") || "image";

  if (!isUuid(vehicleId)) {
    return NextResponse.json({ message: "Missing vehicle image folder." }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.has(fileType)) {
    return NextResponse.json(
      { message: "Please upload JPG, PNG, WebP, or AVIF images." },
      { status: 400 }
    );
  }

  if (!fileSize || fileSize > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { message: "Each vehicle image must be 12 MB or smaller." },
      { status: 400 }
    );
  }

  const path = `vehicles/${vehicleId}/${prefix}-${Date.now()}-${fileName}`;
  const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return NextResponse.json({
    path,
    token: data.token,
    publicUrl: publicUrlData.publicUrl
  });
}

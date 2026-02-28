import { NextResponse } from "next/server";
import { parseLocale } from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/server";
import { generateVehicleSheetPdf } from "@/lib/pdf/vehicle-sheet";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Missing vehicle id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ message: "Unable to validate profile" }, { status: 500 });
  }

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (vehicleError) {
    return NextResponse.json({ message: "Unable to load vehicle" }, { status: 500 });
  }

  if (!vehicle) {
    return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
  }

  const { data: settings } = await supabase
    .from("site_settings")
    .select("business_name,address,phone")
    .eq("id", 1)
    .maybeSingle();

  const locale = parseLocale(new URL(request.url).searchParams.get("lang"));
  const pdf = await generateVehicleSheetPdf(vehicle, settings ?? {}, { locale });
  const body = new ArrayBuffer(pdf.bytes.length);
  new Uint8Array(body).set(pdf.bytes);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.filename}"`,
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

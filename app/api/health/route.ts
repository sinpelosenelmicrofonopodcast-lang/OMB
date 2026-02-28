import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    env: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    database: false
  };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("site_settings").select("id").eq("id", 1).maybeSingle();
    checks.database = !error;
  } catch {
    checks.database = false;
  }

  const ok = checks.env && checks.database;

  return NextResponse.json(
    {
      status: ok ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks
    },
    { status: ok ? 200 : 503 }
  );
}

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Behind a reverse proxy request.nextUrl.origin is the internal address, so prefer the public one.
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  return NextResponse.redirect(new URL("/", site), { status: 303 });
}

import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVER_URL } from "./config";

// Full-access client for trusted server code (the Stripe webhook). Never import it in client components.
export function createAdminClient() {
  return createClient(SUPABASE_SERVER_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

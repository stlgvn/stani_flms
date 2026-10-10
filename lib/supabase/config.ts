// Server code may reach Supabase over an internal address (inside Docker: http://api-gw:8000),
// while the browser uses the public one. A fixed cookie name keeps the session readable on both sides,
// because by default the cookie name is derived from the Supabase URL.
export const SUPABASE_SERVER_URL = process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const AUTH_COOKIE = { name: "sb-uniq-auth" };

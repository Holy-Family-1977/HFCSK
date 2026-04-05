import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

export function getEnv() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return { supabaseUrl, anonKey, serviceRoleKey };
}

/** User-scoped client (RLS applies). Pass the incoming Authorization header value. */
export function userClient(authHeader: string | null): SupabaseClient {
  const { supabaseUrl, anonKey } = getEnv();
  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

/** Service role — only for trusted server-side work (signed URLs, auth admin API). */
export function serviceClient(): SupabaseClient {
  const { supabaseUrl, serviceRoleKey } = getEnv();
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Public / anon RLS (e.g. enabled announcements). */
export function anonClient(): SupabaseClient {
  const { supabaseUrl, anonKey } = getEnv();
  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

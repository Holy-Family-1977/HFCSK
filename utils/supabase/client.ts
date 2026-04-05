import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicKey } from "@/lib/supabase/env";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function createClient() {
  const key = getSupabasePublicKey();
  if (!supabaseUrl || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or Supabase anon/publishable key",
    );
  }
  return createBrowserClient(supabaseUrl, key);
}

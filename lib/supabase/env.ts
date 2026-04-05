/**
 * Public Supabase key for browser / middleware / server client.
 * Prefer the legacy **anon** JWT (`eyJhbGci...`) from Project Settings → API.
 * If login fails with the newer `sb_publishable_...` key, set NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getSupabasePublicKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ||
    ""
  );
}

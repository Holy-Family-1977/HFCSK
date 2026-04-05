import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabasePublicKey } from "@/lib/supabase/env";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Refreshes the Auth session in middleware so Server Components receive up-to-date cookies.
 * Do not add logic between createServerClient and getUser() (Supabase recommendation).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const key = getSupabasePublicKey();
  if (!supabaseUrl || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();

  return supabaseResponse;
}

import { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type AppRole = "super_admin" | "admin";

export async function getProfileRole(
  sb: SupabaseClient,
  userId: string,
): Promise<AppRole | null> {
  const { data, error } = await sb
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data?.role) return null;
  return data.role as AppRole;
}

export async function requireStaff(
  sb: SupabaseClient,
  userId: string,
): Promise<AppRole> {
  const role = await getProfileRole(sb, userId);
  if (role === "admin" || role === "super_admin") return role;
  throw new Error("FORBIDDEN");
}

export async function requireSuperAdmin(
  sb: SupabaseClient,
  userId: string,
): Promise<void> {
  const role = await getProfileRole(sb, userId);
  if (role !== "super_admin") throw new Error("FORBIDDEN");
}

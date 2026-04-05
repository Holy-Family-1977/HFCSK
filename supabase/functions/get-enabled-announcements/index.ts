import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors";
import { anonClient, getEnv } from "../_shared/clients";

/** Public: only rows with is_enabled = true (RLS-enforced). */
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const sb = anonClient();
  const { data, error } = await sb
    .from("announcements")
    .select("id, title, description, image_path, is_enabled, created_at")
    .eq("is_enabled", true)
    .order("created_at", { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const { supabaseUrl } = getEnv();
  const base = `${supabaseUrl}/storage/v1/object/public/announcement-images`;

  const announcements = (data ?? []).map((row) => ({
    ...row,
    image_url: row.image_path ? `${base}/${row.image_path}` : null,
  }));

  return jsonResponse({ announcements });
});

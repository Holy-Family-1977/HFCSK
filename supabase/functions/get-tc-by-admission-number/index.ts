import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors";
import { serviceClient } from "../_shared/clients";

/** Public endpoint: returns student_name + short-lived signed URL (inline PDF). No storage path exposed. */
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: { admission_number?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const raw = String(body.admission_number ?? "").trim();
  const admission_number = raw.toLowerCase();

  if (!admission_number) {
    return jsonResponse({ error: "admission_number is required" }, 400);
  }

  const admin = serviceClient();

  const { data: row, error: qErr } = await admin
    .from("transfer_certificates")
    .select("student_name, file_path")
    .eq("admission_number", admission_number)
    .maybeSingle();

  if (qErr) {
    return jsonResponse({ error: "Lookup failed" }, 500);
  }
  if (!row) {
    return jsonResponse({ error: "Not found" }, 404);
  }

  // Omit `download` filename so Storage does not force Content-Disposition: attachment
  const { data: signed, error: sErr } = await admin.storage
    .from("tc-files")
    .createSignedUrl(row.file_path, 60);

  if (sErr || !signed?.signedUrl) {
    return jsonResponse({ error: "Could not create signed URL" }, 500);
  }

  return jsonResponse({
    student_name: row.student_name,
    signed_url: signed.signedUrl,
    expires_in_seconds: 60,
  });
});

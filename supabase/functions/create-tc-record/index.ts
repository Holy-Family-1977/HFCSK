import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors";
import { userClient } from "../_shared/clients";
import { requireStaff } from "../_shared/roles";
import { isPdfMagicBytes, MAX_PDF_BYTES } from "../_shared/pdf";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const sb = userClient(authHeader);
  const { data: userData, error: userErr } = await sb.auth.getUser();
  if (userErr || !userData.user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    await requireStaff(sb, userData.user.id);
  } catch {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonResponse({ error: "Expected multipart/form-data" }, 400);
  }

  const studentName = String(form.get("student_name") ?? "").trim();
  const admissionNumber = String(form.get("admission_number") ?? "").trim();
  const file = form.get("file");

  if (!studentName || !admissionNumber) {
    return jsonResponse(
      { error: "student_name and admission_number are required" },
      400,
    );
  }

  if (!(file instanceof File)) {
    return jsonResponse({ error: "file is required (PDF)" }, 400);
  }

  if (file.type && file.type !== "application/pdf") {
    return jsonResponse({ error: "Only application/pdf is allowed" }, 400);
  }

  if (file.size > MAX_PDF_BYTES) {
    return jsonResponse(
      { error: `File too large (max ${MAX_PDF_BYTES} bytes)` },
      400,
    );
  }

  const buf = new Uint8Array(await file.arrayBuffer());
  if (!isPdfMagicBytes(buf)) {
    return jsonResponse({ error: "File content is not a valid PDF" }, 400);
  }

  const objectPath = `tc/${crypto.randomUUID()}.pdf`;

  const { error: upErr } = await sb.storage
    .from("tc-files")
    .upload(objectPath, buf, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (upErr) {
    return jsonResponse({ error: upErr.message }, 400);
  }

  const { data: row, error: insErr } = await sb
    .from("transfer_certificates")
    .insert({
      student_name: studentName,
      admission_number: admissionNumber,
      file_path: objectPath,
    })
    .select("id, student_name, admission_number, created_at")
    .single();

  if (insErr) {
    await sb.storage.from("tc-files").remove([objectPath]);
    return jsonResponse({ error: insErr.message }, 400);
  }

  return jsonResponse({ record: row });
});

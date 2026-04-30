import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors";
import { userClient } from "../_shared/clients";
import { requireStaff } from "../_shared/roles";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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

  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const id = form.get("id") ? String(form.get("id")).trim() : null;
  const isEnabledRaw = form.get("is_enabled");
  const image = form.get("image");

  if (!title || !description) {
    return jsonResponse({ error: "title and description are required" }, 400);
  }

  let is_enabled = true;
  if (typeof isEnabledRaw === "string") {
    is_enabled = ["1", "true", "yes", "on"].includes(
      isEnabledRaw.toLowerCase(),
    );
  } else if (typeof isEnabledRaw === "boolean") {
    is_enabled = isEnabledRaw;
  }

  let image_path: string | null | undefined = undefined;

  if (image instanceof File && image.size > 0) {
    if (image.size > MAX_IMAGE_BYTES) {
      return jsonResponse(
        { error: `Image too large (max ${MAX_IMAGE_BYTES} bytes)` },
        400,
      );
    }
    const mime = image.type || "application/octet-stream";
    if (!ALLOWED_IMAGE.has(mime)) {
      return jsonResponse({ error: "Unsupported image type" }, 400);
    }
    const ext = mime === "image/jpeg"
      ? "jpg"
      : mime.split("/")[1] ?? "bin";
    const objectPath = `announcements/${crypto.randomUUID()}.${ext}`;
    const buf = new Uint8Array(await image.arrayBuffer());
    const { error: upErr } = await sb.storage
      .from("announcement-images")
      .upload(objectPath, buf, {
        contentType: mime,
        upsert: false,
      });
    if (upErr) {
      return jsonResponse({ error: upErr.message }, 400);
    }
    image_path = objectPath;
  }

  if (id) {
    const patch: Record<string, unknown> = {
      title,
      description,
      is_enabled,
    };
    if (image_path !== undefined) patch.image_path = image_path;

    const { data: row, error: upErr } = await sb
      .from("announcements")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (upErr) {
      return jsonResponse({ error: upErr.message }, 400);
    }
    return jsonResponse({ record: row });
  }

  const insert: Record<string, unknown> = {
    title,
    description,
    is_enabled,
  };
  if (image_path !== undefined) insert.image_path = image_path;

  const { data: row, error: insErr } = await sb
    .from("announcements")
    .insert(insert)
    .select()
    .single();

  if (insErr) {
    return jsonResponse({ error: insErr.message }, 400);
  }
  return jsonResponse({ record: row });
});

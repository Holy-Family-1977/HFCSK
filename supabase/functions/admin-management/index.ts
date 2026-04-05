import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors";
import { serviceClient, userClient } from "../_shared/clients";
import { requireSuperAdmin } from "../_shared/roles";

type Action =
  | "add_admin"
  | "remove_admin"
  | "set_role";

interface Body {
  action?: Action;
  email?: string;
  password?: string;
  user_id?: string;
  role?: "admin" | "super_admin";
}

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

  const sbUser = userClient(authHeader);
  const { data: userData, error: userErr } = await sbUser.auth.getUser();
  if (userErr || !userData.user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    await requireSuperAdmin(sbUser, userData.user.id);
  } catch {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const admin = serviceClient();
  const action = body.action;

  if (action === "add_admin") {
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email) {
      return jsonResponse({ error: "email is required" }, 400);
    }
    const password = body.password
      ? String(body.password)
      : crypto.randomUUID() + "Aa1!";

    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (cErr || !created.user) {
      return jsonResponse(
        { error: cErr?.message ?? "Could not create user" },
        400,
      );
    }

    const { error: pErr } = await admin.from("profiles").insert({
      id: created.user.id,
      email,
      role: "admin",
    });

    if (pErr) {
      await admin.auth.admin.deleteUser(created.user.id);
      return jsonResponse({ error: pErr.message }, 400);
    }

    return jsonResponse({
      user_id: created.user.id,
      email,
      role: "admin",
      note: body.password ? undefined : "password was auto-generated; use reset flow",
    });
  }

  if (action === "remove_admin") {
    const uid = String(body.user_id ?? "").trim();
    if (!uid) {
      return jsonResponse({ error: "user_id is required" }, 400);
    }

    const { data: target, error: tErr } = await admin
      .from("profiles")
      .select("role")
      .eq("id", uid)
      .maybeSingle();

    if (tErr || !target) {
      return jsonResponse({ error: "User not found" }, 404);
    }
    if (target.role === "super_admin") {
      return jsonResponse(
        { error: "Cannot remove super_admin via this action" },
        400,
      );
    }

    const { error: dErr } = await admin.auth.admin.deleteUser(uid);
    if (dErr) {
      return jsonResponse({ error: dErr.message }, 400);
    }
    return jsonResponse({ ok: true, removed_user_id: uid });
  }

  if (action === "set_role") {
    const uid = String(body.user_id ?? "").trim();
    const role = body.role;
    if (!uid) {
      return jsonResponse({ error: "user_id is required" }, 400);
    }
    if (role !== "admin" && role !== "super_admin") {
      return jsonResponse({ error: "role must be admin or super_admin" }, 400);
    }

    const { data: target, error: tErr } = await admin
      .from("profiles")
      .select("role, email")
      .eq("id", uid)
      .maybeSingle();

    if (tErr || !target) {
      return jsonResponse({ error: "User not found" }, 404);
    }

    if (target.role === "super_admin" && role === "admin") {
      return jsonResponse(
        {
          error:
            "Cannot demote super_admin here; promote another user to super_admin first (handover), then remove or demote",
        },
        400,
      );
    }

    if (role === "super_admin") {
      const { data: currentSuper } = await admin
        .from("profiles")
        .select("id")
        .eq("role", "super_admin")
        .maybeSingle();

      if (currentSuper && currentSuper.id !== uid) {
        const { error: demoteErr } = await admin
          .from("profiles")
          .update({ role: "admin" })
          .eq("id", currentSuper.id);
        if (demoteErr) {
          return jsonResponse({ error: demoteErr.message }, 400);
        }
      }
    }

    const { error: uErr } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", uid);

    if (uErr) {
      return jsonResponse({ error: uErr.message }, 400);
    }

    return jsonResponse({ ok: true, user_id: uid, role });
  }

  return jsonResponse(
    { error: "Unknown action (add_admin | remove_admin | set_role)" },
    400,
  );
});

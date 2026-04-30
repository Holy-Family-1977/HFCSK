# School TC & Announcements — Supabase Backend

This folder contains a production-oriented **PostgreSQL schema**, **RLS**, **Storage** policies, and **Edge Functions** for Transfer Certificates and Announcements.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- A Supabase project

## 1. Configure the project

1. Copy `config.toml` and set `project_id` to your project reference.
2. Link and push:

```bash
cd supabase
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Or run `migrations/20250404000000_school_tc_announcements.sql` in the **SQL Editor** (postgres role).

## 2. Seed the single `super_admin`

See `seed-super-admin.sql`. Only **one** `super_admin` row is allowed (enforced by a partial unique index).

## 3. Deploy Edge Functions

```bash
npx supabase functions deploy create-tc-record
npx supabase functions deploy get-tc-by-admission-number
npx supabase functions deploy create-or-update-announcement
npx supabase functions deploy get-enabled-announcements
npxsupabase functions deploy admin-management
```

Secrets `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically in hosted Edge Functions.

## 4. Example API usage

Replace `PROJECT_REF` and `ANON_KEY`. Function URLs:

`https://PROJECT_REF.supabase.co/functions/v1/<function-name>`

### Public — lookup TC (returns short-lived signed URL, no storage path)

```bash
curl -s -X POST \
  "https://PROJECT_REF.supabase.co/functions/v1/get-tc-by-admission-number" \
  -H "Authorization: Bearer ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"admission_number\":\"ABC123\"}"
```

Response shape:

```json
{
  "student_name": "Jane Doe",
  "signed_url": "https://...",
  "expires_in_seconds": 60
```

Use `signed_url` in an `<iframe src="...">` for viewing. Refresh before expiry if needed.

### Public — enabled announcements

```bash
curl -s "https://PROJECT_REF.supabase.co/functions/v1/get-enabled-announcements" \
  -H "Authorization: Bearer ANON_KEY"
```

### Admin — create TC (multipart PDF, max 5MB)

```bash
curl -s -X POST \
  "https://PROJECT_REF.supabase.co/functions/v1/create-tc-record" \
  -H "Authorization: Bearer ADMIN_USER_JWT" \
  -F "student_name=Jane Doe" \
  -F "admission_number=ABC123" \
  -F "file=@/path/to/tc.pdf;type=application/pdf"
```

### Admin — create or update announcement (multipart)

Create:

```bash
curl -s -X POST \
  "https://PROJECT_REF.supabase.co/functions/v1/create-or-update-announcement" \
  -H "Authorization: Bearer ADMIN_USER_JWT" \
  -F "title=Admissions open" \
  -F "description=Details here" \
  -F "is_enabled=true" \
  -F "image=@/path/to/banner.jpg;type=image/jpeg"
```

Update (optional new image):

```bash
curl -s -X POST \
  "https://PROJECT_REF.supabase.co/functions/v1/create-or-update-announcement" \
  -H "Authorization: Bearer ADMIN_USER_JWT" \
  -F "id=EXISTING_ANNOUNCEMENT_UUID" \
  -F "title=Updated title" \
  -F "description=Updated body" \
  -F "is_enabled=false" \
  -F "image=@/path/to/new.jpg;type=image/jpeg"
```

### Super admin — admin management

Add admin (creates Auth user + `profiles` row):

```bash
curl -s -X POST \
  "https://PROJECT_REF.supabase.co/functions/v1/admin-management" \
  -H "Authorization: Bearer SUPER_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"add_admin\",\"email\":\"admin@school.edu\",\"password\":\"OptionalStrongPassword\"}"
```

Remove admin (deletes Auth user; cascades profile):

```bash
curl -s -X POST \
  "https://PROJECT_REF.supabase.co/functions/v1/admin-management" \
  -H "Authorization: Bearer SUPER_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"remove_admin\",\"user_id\":\"UUID\"}"
```

Change role (`super_admin` promotion hands off from the current super_admin automatically):

```bash
curl -s -X POST \
  "https://PROJECT_REF.supabase.co/functions/v1/admin-management" \
  -H "Authorization: Bearer SUPER_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"set_role\",\"user_id\":\"UUID\",\"role\":\"admin\"}"
```

### Admin dashboard — REST (JWT must be staff)

Totals and lists use the Supabase JS client or REST with the **user’s JWT** (not the anon key):

```ts
const { count } = await supabase
  .from("transfer_certificates")
  .select("*", { count: "exact", head: true });

const { data: rows } = await supabase
  .from("transfer_certificates")
  .select("id, student_name, admission_number, created_at")
  .order("created_at", { ascending: false });
```

`file_path` is readable by admins via RLS for management; never expose it on the public site.

## 5. Security practices

- **Secrets**: Never embed the **service role** key in the browser. Edge Functions that need elevated access run on the server only.
- **Public TC**: The `anon` role has **no** `SELECT` on `transfer_certificates`; only the `get-tc-by-admission-number` function (service role) issues **signed URLs** with a **60s** TTL. Do not return raw `file_path` to public clients.
- **PDFs**: Bucket `tc-files` is **private**; validate **magic bytes** (`%PDF-`) and **MIME** type in Edge Functions; size cap **5MB** (aligned with bucket limit).
- **Announcements**: Public reads go through RLS (`is_enabled = true`) or the public Edge Function; staff use JWT for CRUD.
- **Profiles**: Only `super_admin` may insert/update/delete rows in `profiles` (admins cannot change roles).
- **CORS**: Functions return permissive CORS headers for browser calls; tighten `Access-Control-Allow-Origin` to your site origin in production if you do not need `*`.
- **Rate limiting**: Add **Cloudflare**, **API Gateway**, or Supabase **WAF** rules in front of public Edge Functions to mitigate abuse on TC lookup.
- **Audit**: Log admin actions (optional) via triggers or application-level logging.

## Legacy frontend note

The app previously used `tc_records` and public bucket `tc-images`. After migrating to this backend, point the UI to:

- TC search: `get-tc-by-admission-number` + iframe `signed_url`
- Announcements: `get-enabled-announcements` or direct `from('announcements').select()` with anon key for enabled rows only

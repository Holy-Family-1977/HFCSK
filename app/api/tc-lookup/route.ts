import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Public TC lookup: returns student_name + short-lived signed URL for the PDF.
 * Uses the service role only on the server (same behavior as the Edge Function).
 */
export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        error:
          'TC lookup is not configured. Add SUPABASE_SERVICE_ROLE_KEY to the server environment (Project Settings → API → service_role — never expose to the browser).',
      },
      { status: 503 },
    )
  }

  let body: { admission_number?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const admission_number = String(body.admission_number ?? '')
    .trim()
    .toLowerCase()

  if (!admission_number) {
    return NextResponse.json(
      { error: 'admission_number is required' },
      { status: 400 },
    )
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: row, error: qErr } = await admin
    .from('transfer_certificates')
    .select('student_name, file_path')
    .eq('admission_number', admission_number)
    .maybeSingle()

  if (qErr) {
    console.error('[tc-lookup]', qErr)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }

  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: signed, error: sErr } = await admin.storage
    .from('tc-files')
    .createSignedUrl(row.file_path, 60)

  if (sErr || !signed?.signedUrl) {
    console.error('[tc-lookup] signed URL', sErr)
    return NextResponse.json(
      { error: 'Could not create signed URL' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    student_name: row.student_name,
    signed_url: signed.signedUrl,
    expires_in_seconds: 60,
  })
}

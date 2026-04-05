import { NextResponse } from 'next/server'
import { announcementImagePublicUrl } from '@/lib/supabase/announcement-urls'
import { getSupabasePublicKey } from '@/lib/supabase/env'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = getSupabasePublicKey()

/** Public: latest enabled announcement (for popup / demos). Uses anon RLS. */
export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(null, { status: 200 })
    }

    const qs = new URLSearchParams({
      select: 'id,title,description,image_path,is_enabled,created_at',
      is_enabled: 'eq.true',
      order: 'created_at.desc',
      limit: '1',
    })

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/announcements?${qs.toString()}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json(null, { status: 200 })
    }

    const rows = await response.json()
    const row = Array.isArray(rows) ? rows[0] : null
    if (!row) {
      return NextResponse.json(null, { status: 200 })
    }

    return NextResponse.json(
      {
        id: row.id,
        title: row.title,
        description: row.description,
        image_url: row.image_path
          ? announcementImagePublicUrl(row.image_path)
          : null,
        is_enabled: row.is_enabled,
        created_at: row.created_at,
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(null, { status: 200 })
  }
}

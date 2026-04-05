import { NextResponse } from 'next/server'
import { getSupabasePublicKey } from '@/lib/supabase/env'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = getSupabasePublicKey()

export async function GET() {
  try {
    console.log('[v0] Fetching TC records from Supabase REST API...')

    // Use direct REST API instead of client library to avoid JSON parsing issues
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/transfer_certificates?order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY!,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    )

    console.log('[v0] Supabase response status:', response.status)

    // If table doesn't exist (404) or any error, just return empty array
    if (!response.ok) {
      console.log('[v0] Response not OK, returning empty array')
      return NextResponse.json([], { status: 200 })
    }

    // Get response text first to check if it's valid JSON
    const responseText = await response.text()
    
    if (!responseText) {
      console.log('[v0] Empty response from Supabase')
      return NextResponse.json([], { status: 200 })
    }

    // Check if response is HTML (error page) or JSON
    if (responseText.startsWith('<') || responseText.includes('Invalid request')) {
      console.log('[v0] Received non-JSON response (likely error page)')
      return NextResponse.json([], { status: 200 })
    }

    try {
      const data = JSON.parse(responseText)
      console.log('[v0] Fetched TC records:', Array.isArray(data) ? data.length : 0)
      return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 })
    } catch (parseError) {
      console.log('[v0] Could not parse response as JSON, returning empty array')
      return NextResponse.json([], { status: 200 })
    }
  } catch (error) {
    console.log('[v0] Returning empty array due to error')
    return NextResponse.json([], { status: 200 })
  }
}

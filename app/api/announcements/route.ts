import { NextResponse } from 'next/server';
import { supabase } from 'path/to/supabase'; // Declare the supabase variable here

// Demo announcement - shown by default
const DEMO_ANNOUNCEMENT = {
  id: 'demo-1',
  title: 'Admissions Started',
  description: 'Join Holy Family Convent Sr. Sec. School - where knowledge meets character. Applications are now open for all classes.',
  image_url: '/school-logo.png',
  is_enabled: true,
};

export async function GET() {
  try {
    console.log('[v0] Fetching announcements...');
    
    // For now, return the demo announcement
    // Later, you can add Supabase integration here
    console.log('[v0] Returning demo announcement');
    return NextResponse.json(DEMO_ANNOUNCEMENT, { status: 200 });
  } catch (error) {
    console.error('[v0] API error:', String(error));
    return NextResponse.json(DEMO_ANNOUNCEMENT, { status: 200 });
  }
}

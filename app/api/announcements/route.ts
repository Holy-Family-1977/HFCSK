import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    console.log('[v0] Fetching announcements from Supabase...');
    
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_enabled', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('[v0] Supabase error:', error.message);
      // Return empty response if table doesn't exist or no data found
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.log('[v0] Announcements table not found, returning null');
        return NextResponse.json(null, { status: 200 });
      }
      return NextResponse.json(null, { status: 200 });
    }

    if (!data) {
      console.log('[v0] No enabled announcements found');
      return NextResponse.json(null, { status: 200 });
    }

    console.log('[v0] Returning announcement:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[v0] API error:', error);
    // Return null instead of error to allow graceful degradation
    return NextResponse.json(null, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, image_url, is_enabled } = body;

    const { data, error } = await supabase
      .from('announcements')
      .insert([
        {
          title,
          description,
          image_url,
          is_enabled: is_enabled || true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[v0] Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create announcement' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, is_enabled } = body;

    const { data, error } = await supabase
      .from('announcements')
      .update({ is_enabled })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[v0] Supabase update error:', error);
      return NextResponse.json(
        { error: 'Failed to update announcement' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[v0] Supabase delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete announcement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

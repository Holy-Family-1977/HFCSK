import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/utils/supabase/server'

type Action = 'add_admin' | 'remove_admin' | 'set_role'

interface Body {
  action?: Action
  email?: string
  password?: string
  user_id?: string
  role?: 'admin' | 'super_admin'
}

/**
 * Super-admin staff CRUD. Runs on Vercel/Node with the service role (server-only).
 * Does not depend on deploying the Supabase Edge Function of the same name.
 */
export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: prof } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (prof?.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json(
      {
        error:
          'Server misconfigured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel.',
      },
      { status: 503 },
    )
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const action = body.action

  if (action === 'add_admin') {
    const email = String(body.email ?? '').trim().toLowerCase()
    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }
    const password = body.password
      ? String(body.password)
      : `${crypto.randomUUID()}Aa1!`

    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (cErr || !created.user) {
      return NextResponse.json(
        { error: cErr?.message ?? 'Could not create user' },
        { status: 400 },
      )
    }

    const { error: pErr } = await admin.from('profiles').insert({
      id: created.user.id,
      email,
      role: 'admin',
    })

    if (pErr) {
      await admin.auth.admin.deleteUser(created.user.id)
      return NextResponse.json({ error: pErr.message }, { status: 400 })
    }

    return NextResponse.json({
      user_id: created.user.id,
      email,
      role: 'admin',
      note: body.password
        ? undefined
        : 'password was auto-generated; use reset flow',
    })
  }

  if (action === 'remove_admin') {
    const uid = String(body.user_id ?? '').trim()
    if (!uid) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const { data: target, error: tErr } = await admin
      .from('profiles')
      .select('role')
      .eq('id', uid)
      .maybeSingle()

    if (tErr || !target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (target.role === 'super_admin') {
      return NextResponse.json(
        { error: 'Cannot remove super_admin via this action' },
        { status: 400 },
      )
    }

    const { error: dErr } = await admin.auth.admin.deleteUser(uid)
    if (dErr) {
      return NextResponse.json({ error: dErr.message }, { status: 400 })
    }
    return NextResponse.json({ ok: true, removed_user_id: uid })
  }

  if (action === 'set_role') {
    const uid = String(body.user_id ?? '').trim()
    const role = body.role
    if (!uid) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json(
        { error: 'role must be admin or super_admin' },
        { status: 400 },
      )
    }

    const { data: target, error: tErr } = await admin
      .from('profiles')
      .select('role, email')
      .eq('id', uid)
      .maybeSingle()

    if (tErr || !target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (target.role === 'super_admin' && role === 'admin') {
      return NextResponse.json(
        {
          error:
            'Cannot demote super_admin here; promote another user to super_admin first (handover), then remove or demote',
        },
        { status: 400 },
      )
    }

    if (role === 'super_admin') {
      const { data: currentSuper } = await admin
        .from('profiles')
        .select('id')
        .eq('role', 'super_admin')
        .maybeSingle()

      if (currentSuper && currentSuper.id !== uid) {
        const { error: demoteErr } = await admin
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', currentSuper.id)
        if (demoteErr) {
          return NextResponse.json({ error: demoteErr.message }, { status: 400 })
        }
      }
    }

    const { error: uErr } = await admin
      .from('profiles')
      .update({ role })
      .eq('id', uid)

    if (uErr) {
      return NextResponse.json({ error: uErr.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, user_id: uid, role })
  }

  return NextResponse.json(
    { error: 'Unknown action (add_admin | remove_admin | set_role)' },
    { status: 400 },
  )
}

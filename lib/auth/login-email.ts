/**
 * Maps the legacy "Admin" username to the real Supabase Auth email.
 * After a password change, the same "Admin" username still works because
 * we always send the password the user typed to `signInWithPassword` with this email.
 */
export function resolveLoginEmail(username: string): {
  email: string
  error?: string
} {
  const u = username.trim()
  if (!u) {
    return { email: '', error: 'Enter a username or email' }
  }
  const mapped = process.env.NEXT_PUBLIC_ADMIN_MAPPED_EMAIL?.trim()
  if (u.toLowerCase() === 'admin') {
    if (!mapped) {
      return {
        email: '',
        error:
          'Server is not configured: set NEXT_PUBLIC_ADMIN_MAPPED_EMAIL to your Supabase admin user email.',
      }
    }
    return { email: mapped }
  }
  if (u.includes('@')) {
    return { email: u.toLowerCase() }
  }
  return {
    email: '',
    error: 'Use username Admin or your full email address',
  }
}

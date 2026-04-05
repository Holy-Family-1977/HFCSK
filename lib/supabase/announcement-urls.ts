/** Public bucket URL for announcement images stored as `image_path` in DB. */
export function announcementImagePublicUrl(
  imagePath: string | null | undefined,
): string {
  if (!imagePath) return ''
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? ''
  return `${base}/storage/v1/object/public/announcement-images/${imagePath}`
}

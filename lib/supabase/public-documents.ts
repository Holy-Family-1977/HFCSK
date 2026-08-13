import { storagePublicUrl } from './cms'

export interface PublicDisclosureDocument {
  id: string
  section: 'mandatory' | 'documents_info'
  sl_no: number
  document_name: string
  file_path: string
  created_at?: string
  updated_at?: string
}

export function getDocumentUrl(filePath: string): string {
  if (!filePath) return ''
  // If it's a relative path in public directory (e.g., /PMD/...) or external URL, return as is
  if (filePath.startsWith('/') || filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath
  }
  // Otherwise resolve from Supabase storage bucket 'public-documents'
  return storagePublicUrl('public-documents', filePath)
}

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { announcementImagePublicUrl } from '@/lib/supabase/announcement-urls'

interface AnnouncementRow {
  id: string
  title: string
  description: string
  image_path: string | null
  is_enabled: boolean
  created_at: string
}

export default function AdminAnnouncements() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_enabled: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchAnnouncements()
    }
    run()
  }, [router])

  const fetchAnnouncements = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        setAnnouncements([])
      } else {
        setAnnouncements((data as AnnouncementRow[]) ?? [])
      }
    } catch (e) {
      console.error(e)
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      let imagePath: string | null = null

      if (imageFile) {
        const mime = imageFile.type || 'image/jpeg'
        const ext =
          mime === 'image/png'
            ? 'png'
            : mime === 'image/webp'
              ? 'webp'
              : mime === 'image/gif'
                ? 'gif'
                : 'jpg'
        const objectPath = `announcements/${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('announcement-images')
          .upload(objectPath, imageFile, { contentType: mime, upsert: false })
        if (upErr) {
          alert(upErr.message)
          setSaving(false)
          return
        }
        imagePath = objectPath
      }

      const { error } = await supabase.from('announcements').insert({
        title: formData.title,
        description: formData.description,
        is_enabled: formData.is_enabled,
        image_path: imagePath,
      })

      if (error) {
        alert(error.message)
      } else {
        setFormData({ title: '', description: '', is_enabled: true })
        setImageFile(null)
        fetchAnnouncements()
      }
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) {
        alert(error.message)
      } else {
        fetchAnnouncements()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('announcements')
        .update({ is_enabled: !currentStatus })
        .eq('id', id)
      if (error) {
        alert(error.message)
      } else {
        fetchAnnouncements()
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Announcements</h1>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Announcement</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            placeholder="Title (e.g., Admissions Started)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded-lg"
            rows={4}
            required
          />
          <div>
            <label className="text-sm font-medium">Image (optional)</label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_enabled}
              onChange={(e) =>
                setFormData({ ...formData, is_enabled: e.target.checked })
              }
            />
            <span>Enable this announcement</span>
          </label>
          <Button type="submit" className="bg-blue-600 text-white" disabled={saving}>
            {saving ? 'Saving…' : 'Create'}
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet</p>
        ) : (
          announcements.map((announcement) => {
            const imageUrl = announcement.image_path
              ? announcementImagePublicUrl(announcement.image_path)
              : null
            return (
              <Card key={announcement.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={announcement.title}
                      className="w-32 h-32 object-cover rounded"
                    />
                  ) : null}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{announcement.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={announcement.is_enabled}
                          onChange={() =>
                            handleToggle(announcement.id, announcement.is_enabled)
                          }
                        />
                        <span
                          className={
                            announcement.is_enabled ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {announcement.is_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Trash2, Edit2, Save, X } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  description: string
  image_url: string
  is_enabled: boolean
  created_at: string
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    is_enabled: true,
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements')
      const data = await res.json()
      setAnnouncements(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormData({ title: '', description: '', image_url: '', is_enabled: true })
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/announcements?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: !currentStatus }),
      })
      if (res.ok) {
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Error updating announcement:', error)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Announcements</h1>

      {/* Create Form */}
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
          />
          <Input
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_enabled}
              onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
            />
            <span>Enable this announcement</span>
          </label>
          <Button type="submit" className="bg-blue-600 text-white">Create</Button>
        </form>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet</p>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                {announcement.image_url && (
                  <img src={announcement.image_url || "/placeholder.svg"} alt={announcement.title} className="w-32 h-32 object-cover rounded" />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{announcement.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={announcement.is_enabled}
                        onChange={() => handleToggle(announcement.id, announcement.is_enabled)}
                      />
                      <span className={announcement.is_enabled ? 'text-green-600' : 'text-red-600'}>
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
          ))
        )}
      </div>
    </div>
  )
}

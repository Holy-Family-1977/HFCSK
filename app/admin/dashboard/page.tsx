'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, LogOut, FileText, Upload, X, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface TCRecord {
  id: string
  name: string
  admission_number: string
  tc_image_url: string
  created_at: string
}

interface CBSCDocument {
  id: string
  name: string
  url: string
  uploadedAt: string
}

interface AnnouncementData {
  id: string
  title: string
  description: string
  image_url: string
  is_enabled: boolean
}

export default function AdminDashboard() {
  const [tcRecords, setTcRecords] = useState<TCRecord[]>([])
  const [cbscDocuments, setCbscDocuments] = useState<CBSCDocument[]>([])
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)
  const [activeTab, setActiveTab] = useState<'tc' | 'cbsc' | 'popup'>('tc')
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TCRecord | null>(null)
  const [formData, setFormData] = useState({ name: '', admission_number: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [newDocName, setNewDocName] = useState('')
  const [newDocFile, setNewDocFile] = useState<File | null>(null)
  const [announcementData, setAnnouncementData] = useState({
    title: 'Admissions Started',
    description: 'Join Holy Family Convent Sr. Sec. School - where knowledge meets character. Applications are now open for all classes.',
    image_url: '/school-logo.png',
    is_enabled: true
  })
  const [selectedAnnounceFile, setSelectedAnnounceFile] = useState<File | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const adminSession = localStorage.getItem('adminSession')
    if (!adminSession) {
      router.push('/admin/login')
      return
    }
    
    fetchTCRecords()
    fetchAnnouncement()
    fetchCBSCDocuments()
  }, [router])

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncement(data)
        setAnnouncementData(data)
      }
    } catch (err) {
      console.error('Error fetching announcement:', err)
    }
  }

  const fetchCBSCDocuments = async () => {
    // Mock data for now - can be replaced with API call
    setCbscDocuments([])
  }

  const fetchTCRecords = async () => {
    try {
      console.log('[v0] Fetching TC records from API...')
      const response = await fetch('/api/tc-records')
      
      if (!response.ok) {
        console.error('[v0] API error:', response.status)
        setTcRecords([])
        return
      }

      const data = await response.json()
      console.log('[v0] Fetched TC records:', data)
      setTcRecords(data || [])
    } catch (err) {
      console.error('[v0] Error fetching TC records:', err)
      setTcRecords([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = announcementData.image_url

      if (selectedAnnounceFile) {
        const formData = new FormData()
        formData.append('file', selectedAnnounceFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        }
      }

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: announcementData.title,
          description: announcementData.description,
          image_url: imageUrl,
          is_enabled: announcementData.is_enabled
        })
      })

      if (response.ok) {
        alert('Announcement updated successfully!')
        setSelectedAnnounceFile(null)
        fetchAnnouncement()
      }
    } catch (err) {
      console.error('Error updating announcement:', err)
      alert('Failed to update announcement')
    } finally {
      setUploading(false)
    }
  }

  const handleAddCBSCDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDocName || !newDocFile) {
      alert('Please fill all fields')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', newDocFile)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json()
        const newDoc: CBSCDocument = {
          id: Math.random().toString(),
          name: newDocName,
          url: uploadData.url,
          uploadedAt: new Date().toISOString().split('T')[0]
        }
        setCbscDocuments([newDoc, ...cbscDocuments])
        setNewDocName('')
        setNewDocFile(null)
      }
    } catch (err) {
      console.error('Error uploading document:', err)
      alert('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteCBSCDocument = (id: string) => {
    if (confirm('Are you sure?')) {
      setCbscDocuments(cbscDocuments.filter(doc => doc.id !== id))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('tc-images')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        return null
      }

      return fileName
    } catch (err) {
      console.error('Error uploading image:', err)
      return null
    }
  }

  const handleCreateTC = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Please select an image file')
      return
    }

    setUploading(true)
    
    try {
      const imageUrl = await uploadImage(selectedFile)
      if (!imageUrl) {
        alert('Failed to upload image')
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('tc_records')
        .insert([
          {
            name: formData.name,
            admission_number: formData.admission_number,
            tc_image_url: imageUrl
          }
        ])

      if (error) {
        console.error('Error creating TC record:', error)
        alert('Failed to create TC record')
      } else {
        setIsCreateDialogOpen(false)
        setFormData({ name: '', admission_number: '' })
        setSelectedFile(null)
        fetchTCRecords()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred')
    } finally {
      setUploading(false)
    }
  }

  const handleEditTC = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRecord) return

    setUploading(true)
    
    try {
      const supabase = createClient()
      let updateData: any = {
        name: formData.name,
        admission_number: formData.admission_number
      }

      if (selectedFile) {
        const imageUrl = await uploadImage(selectedFile)
        if (imageUrl) {
          updateData.tc_image_url = imageUrl
        }
      }

      const { error } = await supabase
        .from('tc_records')
        .update(updateData)
        .eq('id', editingRecord.id)

      if (error) {
        console.error('Error updating TC record:', error)
        alert('Failed to update TC record')
      } else {
        setIsEditDialogOpen(false)
        setEditingRecord(null)
        setFormData({ name: '', admission_number: '' })
        setSelectedFile(null)
        fetchTCRecords()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteTC = async (id: string) => {
    if (!confirm('Are you sure you want to delete this TC record?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('tc_records')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting TC record:', error)
        alert('Failed to delete TC record')
      } else {
        fetchTCRecords()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred')
    }
  }

  const openEditDialog = (record: TCRecord) => {
    setEditingRecord(record)
    setFormData({ name: record.name, admission_number: record.admission_number })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage school information and documents</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('tc')}
              className={`pb-4 px-2 font-semibold transition-all ${
                activeTab === 'tc'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Transfer Certificate
            </button>
            <button
              onClick={() => setActiveTab('cbsc')}
              className={`pb-4 px-2 font-semibold transition-all ${
                activeTab === 'cbsc'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              CBSC Documents
            </button>
            <button
              onClick={() => setActiveTab('popup')}
              className={`pb-4 px-2 font-semibold transition-all ${
                activeTab === 'popup'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Announcements
            </button>
          </div>
        </div>

        {/* TC Tab Content */}
        {activeTab === 'tc' && (
          <div>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total TC Records</p>
                      <p className="text-2xl font-bold">{tcRecords.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="mb-6">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New TC Record
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New TC Record</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTC} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Student Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission_number">Admission Number</Label>
                      <Input
                        id="admission_number"
                        value={formData.admission_number}
                        onChange={(e) => setFormData({ ...formData, admission_number: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tc_image">TC Image</Label>
                      <Input
                        id="tc_image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={uploading} className="w-full">
                      {uploading ? 'Creating...' : 'Create TC Record'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* TC Records Table */}
            <Card>
              <CardHeader>
                <CardTitle>TC Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Admission Number</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tcRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell>{record.admission_number}</TableCell>
                        <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(record)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTC(record.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit TC Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditTC} className="space-y-4">
                  <div>
                    <Label htmlFor="edit_name">Student Name</Label>
                    <Input
                      id="edit_name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_admission_number">Admission Number</Label>
                    <Input
                      id="edit_admission_number"
                      value={formData.admission_number}
                      onChange={(e) => setFormData({ ...formData, admission_number: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_tc_image">TC Image (optional - leave empty to keep current)</Label>
                    <Input
                      id="edit_tc_image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <Button type="submit" disabled={uploading} className="w-full">
                    {uploading ? 'Updating...' : 'Update TC Record'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* CBS Tab Content */}
        {activeTab === 'cbsc' && (
          <div>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total CBS Documents</p>
                      <p className="text-2xl font-bold">{cbscDocuments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="mb-6">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New CBS Document
              </Button>
            </div>

            {/* CBS Documents Table */}
            <Card>
              <CardHeader>
                <CardTitle>CBS Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Uploaded At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cbscDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCBSCDocument(doc.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Popup Tab Content */}
        {activeTab === 'popup' && (
          <div>
            {/* Announcement Form */}
            <form onSubmit={handleUpdateAnnouncement} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={announcementData.title}
                  onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={announcementData.description}
                  onChange={(e) => setAnnouncementData({ ...announcementData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image</Label>
                <Input
                  id="image_url"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedAnnounceFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <div>
                <Label htmlFor="is_enabled">Enabled</Label>
                <Input
                  id="is_enabled"
                  type="checkbox"
                  checked={announcementData.is_enabled}
                  onChange={(e) => setAnnouncementData({ ...announcementData, is_enabled: e.target.checked })}
                />
              </div>
              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? 'Updating...' : 'Update Announcement'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

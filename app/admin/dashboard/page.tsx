'use client'

import React from "react"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, LogOut, FileText, Upload, X, KeyRound, Users, Images, MonitorPlay } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { announcementImagePublicUrl } from '@/lib/supabase/announcement-urls'
import { invokeAdminManagement } from '@/lib/supabase/admin-management'

interface TCRecord {
  id: string
  student_name: string
  admission_number: string
  file_path: string
  created_at: string
}

interface CBSCDocument {
  id: string
  name: string
  url: string
  uploadedAt: string
}

interface AnnouncementData {
  id?: string
  title: string
  description: string
  /** Public URL for preview (derived from image_path). */
  image_url: string
  is_enabled: boolean
}

interface StaffProfile {
  id: string
  email: string
  role: string
  created_at: string
}

export default function AdminDashboard() {
  const [tcRecords, setTcRecords] = useState<TCRecord[]>([])
  const [cbscDocuments, setCbscDocuments] = useState<CBSCDocument[]>([])
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)
  const [activeTab, setActiveTab] = useState<'tc' | 'cbsc' | 'popup' | 'staff'>('tc')
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TCRecord | null>(null)
  const [formData, setFormData] = useState({
    student_name: '',
    admission_number: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [newDocName, setNewDocName] = useState('')
  const [newDocFile, setNewDocFile] = useState<File | null>(null)
  const [announcementData, setAnnouncementData] = useState<AnnouncementData>({
    id: undefined,
    title: 'Admissions Started',
    description:
      'Join Holy Family Convent Sr. Sec. School - where knowledge meets character. Applications are now open for all classes.',
    image_url: '/school-logo.png',
    is_enabled: true,
  })
  const [selectedAnnounceFile, setSelectedAnnounceFile] = useState<File | null>(null)
  const [staffRole, setStaffRole] = useState<string | null>(null)
  const [staffEmail, setStaffEmail] = useState<string | null>(null)
  const [pwdCurrent, setPwdCurrent] = useState('')
  const [pwdNew, setPwdNew] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdFeedback, setPwdFeedback] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([])
  const [staffLoading, setStaffLoading] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const router = useRouter()

  const fetchStaffProfiles = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false })
    if (error) {
      console.error(error)
      setStaffProfiles([])
      return
    }
    setStaffProfiles((data as StaffProfile[]) ?? [])
  }, [])

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) {
        router.push('/admin/login')
        return
      }
      setStaffEmail(session.user.email ?? null)
      setCurrentUserId(session.user.id)
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()
      setStaffRole(prof?.role ?? null)
      if (prof?.role === 'super_admin') {
        await fetchStaffProfiles()
      }

      await fetchTCRecords()
      await fetchAnnouncement()
      fetchCBSCDocuments()
    }

    init()
    return () => {
      cancelled = true
    }
  }, [router, fetchStaffProfiles])

  const fetchAnnouncement = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error || !data) {
        return
      }

      const imageUrl = data.image_path
        ? announcementImagePublicUrl(data.image_path)
        : '/school-logo.png'

      const mapped: AnnouncementData = {
        id: data.id,
        title: data.title,
        description: data.description,
        image_url: imageUrl,
        is_enabled: data.is_enabled,
      }
      setAnnouncement(mapped)
      setAnnouncementData(mapped)
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
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transfer_certificates')
        .select('id, student_name, admission_number, file_path, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching TC records:', error)
        setTcRecords([])
        return
      }
      setTcRecords((data as TCRecord[]) || [])
    } catch (err) {
      console.error('Error fetching TC records:', err)
      setTcRecords([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const supabase = createClient()
      let imagePath: string | null = null

      if (selectedAnnounceFile) {
        const mime = selectedAnnounceFile.type || 'image/jpeg'
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
          .upload(objectPath, selectedAnnounceFile, {
            contentType: mime,
            upsert: false,
          })
        if (upErr) {
          alert(upErr.message)
          setUploading(false)
          return
        }
        imagePath = objectPath
      }

      const payload: Record<string, unknown> = {
        title: announcementData.title,
        description: announcementData.description,
        is_enabled: announcementData.is_enabled,
      }
      if (imagePath) {
        payload.image_path = imagePath
      }

      if (announcementData.id) {
        const { error } = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', announcementData.id)
        if (error) {
          alert(error.message)
        } else {
          alert('Announcement updated successfully!')
          setSelectedAnnounceFile(null)
          fetchAnnouncement()
        }
      } else {
        const { error } = await supabase.from('announcements').insert({
          ...payload,
          image_path: imagePath ?? null,
        })
        if (error) {
          alert(error.message)
        } else {
          alert('Announcement saved!')
          setSelectedAnnounceFile(null)
          fetchAnnouncement()
        }
      }
    } catch (err) {
      console.error('Error updating announcement:', err)
      alert('Failed to update announcement')
    } finally {
      setUploading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdFeedback(null)

    if (pwdNew.length < 8) {
      setPwdFeedback('New password must be at least 8 characters.')
      return
    }
    if (pwdNew !== pwdConfirm) {
      setPwdFeedback('New password and confirmation do not match.')
      return
    }

    const allowed = staffRole === 'admin' || staffRole === 'super_admin'
    if (!allowed) {
      setPwdFeedback('Only staff accounts can change password here.')
      return
    }

    setPwdLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) {
        setPwdFeedback('No active session.')
        setPwdLoading(false)
        return
      }

      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: pwdCurrent,
      })
      if (signErr) {
        setPwdFeedback('Current password is incorrect.')
        setPwdLoading(false)
        return
      }

      const { error: updErr } = await supabase.auth.updateUser({
        password: pwdNew,
      })
      if (updErr) {
        setPwdFeedback(updErr.message)
      } else {
        setPwdFeedback('Password updated. Use your new password next time you sign in.')
        setPwdCurrent('')
        setPwdNew('')
        setPwdConfirm('')
      }
    } catch {
      setPwdFeedback('Something went wrong.')
    }
    setPwdLoading(false)
  }

  useEffect(() => {
    if (activeTab === 'staff' && staffRole === 'super_admin') {
      void fetchStaffProfiles()
    }
  }, [activeTab, staffRole, fetchStaffProfiles])

  const handleAddStaffAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail.trim()) {
      alert('Email is required')
      return
    }
    setStaffLoading(true)
    const { ok, data } = await invokeAdminManagement({
      action: 'add_admin',
      email: newAdminEmail.trim().toLowerCase(),
      ...(newAdminPassword.trim() ? { password: newAdminPassword.trim() } : {}),
    })
    setStaffLoading(false)
    if (!ok) {
      alert(typeof data.error === 'string' ? data.error : 'Failed to add admin')
      return
    }
    setNewAdminEmail('')
    setNewAdminPassword('')
    setIsAddAdminOpen(false)
    void fetchStaffProfiles()
    alert('Admin user created.')
  }

  const handleRemoveStaffAdmin = async (userId: string) => {
    if (!confirm('Remove this admin? Their account will be deleted.')) return
    setStaffLoading(true)
    const { ok, data } = await invokeAdminManagement({
      action: 'remove_admin',
      user_id: userId,
    })
    setStaffLoading(false)
    if (!ok) {
      alert(typeof data.error === 'string' ? data.error : 'Failed to remove')
      return
    }
    void fetchStaffProfiles()
  }

  const handleSetStaffRole = async (
    userId: string,
    role: 'admin' | 'super_admin',
  ) => {
    const msg =
      role === 'super_admin'
        ? 'Make this user super admin? Your account will become admin.'
        : 'Demote this user to admin only?'
    if (!confirm(msg)) return
    setStaffLoading(true)
    const { ok, data } = await invokeAdminManagement({
      action: 'set_role',
      user_id: userId,
      role,
    })
    setStaffLoading(false)
    if (!ok) {
      alert(typeof data.error === 'string' ? data.error : 'Failed to update role')
      return
    }
    void fetchStaffProfiles()
    window.location.reload()
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
    const file = e.target.files?.[0]
    if (!file) return
    const ok =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf')
    if (!ok) {
      alert('Please choose a PDF file only.')
      e.target.value = ''
      setSelectedFile(null)
      return
    }
    setSelectedFile(file)
  }

  /** Uploads to private bucket `tc-files` (must match Supabase migration). */
  const uploadTcPdf = async (file: File): Promise<string | null> => {
    try {
      const supabase = createClient()
      const path = `tc/${crypto.randomUUID()}.pdf`
      const { error: uploadError } = await supabase.storage
        .from('tc-files')
        .upload(path, file, {
          contentType: 'application/pdf',
          upsert: false,
        })

      if (uploadError) {
        console.error('Error uploading PDF:', uploadError)
        return null
      }

      return path
    } catch (err) {
      console.error('Error uploading PDF:', err)
      return null
    }
  }

  const handleCreateTC = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Please select a PDF file')
      return
    }

    setUploading(true)

    try {
      const filePath = await uploadTcPdf(selectedFile)
      if (!filePath) {
        alert('Failed to upload PDF. Ensure you are signed in as an admin and the tc-files bucket exists.')
        return
      }

      const supabase = createClient()
      const { error } = await supabase.from('transfer_certificates').insert([
        {
          student_name: formData.student_name,
          admission_number: formData.admission_number,
          file_path: filePath,
        },
      ])

      if (error) {
        console.error('Error creating TC record:', error)
        await supabase.storage.from('tc-files').remove([filePath])
        alert(error.message || 'Failed to create TC record')
      } else {
        setIsCreateDialogOpen(false)
        setFormData({ student_name: '', admission_number: '' })
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
      const updateData: {
        student_name: string
        admission_number: string
        file_path?: string
      } = {
        student_name: formData.student_name,
        admission_number: formData.admission_number,
      }

      if (selectedFile) {
        const newPath = await uploadTcPdf(selectedFile)
        if (!newPath) {
          alert('Failed to upload PDF')
          setUploading(false)
          return
        }
        updateData.file_path = newPath
        await supabase.storage
          .from('tc-files')
          .remove([editingRecord.file_path])
      }

      const { error } = await supabase
        .from('transfer_certificates')
        .update(updateData)
        .eq('id', editingRecord.id)

      if (error) {
        console.error('Error updating TC record:', error)
        alert(error.message || 'Failed to update TC record')
      } else {
        setIsEditDialogOpen(false)
        setEditingRecord(null)
        setFormData({ student_name: '', admission_number: '' })
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
      const { data: row, error: fetchErr } = await supabase
        .from('transfer_certificates')
        .select('file_path')
        .eq('id', id)
        .single()

      if (fetchErr) {
        console.error(fetchErr)
        alert('Failed to load record')
        return
      }

      const { error } = await supabase
        .from('transfer_certificates')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting TC record:', error)
        alert('Failed to delete TC record')
        return
      }

      if (row?.file_path) {
        await supabase.storage.from('tc-files').remove([row.file_path])
      }
      fetchTCRecords()
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred')
    }
  }

  const openEditDialog = (record: TCRecord) => {
    setEditingRecord(record)
    setFormData({
      student_name: record.student_name,
      admission_number: record.admission_number,
    })
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

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MonitorPlay className="h-5 w-5 text-blue-600" />
                Hero Slider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Manage homepage slider images, videos, YouTube links, text, and order.</p>
              <Button asChild>
                <Link href="/admin/hero">Manage hero</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Images className="h-5 w-5 text-blue-600" />
                Gallery Albums
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Create albums, upload images, choose covers, delete media, and reorder photos.</p>
              <Button asChild>
                <Link href="/admin/gallery">Manage gallery</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Signed in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="text-gray-500">Email: </span>
                {staffEmail ?? '—'}
              </p>
              <p>
                <span className="text-gray-500">Role: </span>
                {staffRole === 'super_admin'
                  ? 'Super admin'
                  : staffRole === 'admin'
                    ? 'Admin'
                    : staffRole ?? '—'}
              </p>
            </CardContent>
          </Card>

          {(staffRole === 'admin' || staffRole === 'super_admin') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Change password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <Label htmlFor="pwd-current">Current password</Label>
                    <Input
                      id="pwd-current"
                      type="password"
                      value={pwdCurrent}
                      onChange={(e) => setPwdCurrent(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pwd-new">New password</Label>
                    <Input
                      id="pwd-new"
                      type="password"
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pwd-confirm">Confirm new password</Label>
                    <Input
                      id="pwd-confirm"
                      type="password"
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                  </div>
                  {pwdFeedback && (
                    <p className="text-sm text-gray-700">{pwdFeedback}</p>
                  )}
                  <Button type="submit" disabled={pwdLoading} variant="secondary">
                    {pwdLoading ? 'Updating…' : 'Update password'}
                  </Button>
                  <p className="text-xs text-gray-500">
                    After changing your password, sign in with username <strong>Admin</strong> (or your
                    email) and the <strong>new</strong> password.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
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
            {staffRole === 'super_admin' && (
              <button
                type="button"
                onClick={() => setActiveTab('staff')}
                className={`pb-4 px-2 font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'staff'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users className="h-4 w-4" />
                Staff / admins
              </button>
            )}
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
                      <Label htmlFor="student_name">Student Name</Label>
                      <Input
                        id="student_name"
                        value={formData.student_name}
                        onChange={(e) =>
                          setFormData({ ...formData, student_name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission_number">Admission Number</Label>
                      <Input
                        id="admission_number"
                        value={formData.admission_number}
                        onChange={(e) =>
                          setFormData({ ...formData, admission_number: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tc_pdf">TC PDF</Label>
                      <Input
                        id="tc_pdf"
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleFileChange}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">PDF only, max 5 MB (bucket limit).</p>
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
                        <TableCell className="font-medium">{record.student_name}</TableCell>
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
                    <Label htmlFor="edit_student_name">Student Name</Label>
                    <Input
                      id="edit_student_name"
                      value={formData.student_name}
                      onChange={(e) =>
                        setFormData({ ...formData, student_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_admission_number">Admission Number</Label>
                    <Input
                      id="edit_admission_number"
                      value={formData.admission_number}
                      onChange={(e) =>
                        setFormData({ ...formData, admission_number: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_tc_pdf">
                      TC PDF (optional — leave empty to keep current file)
                    </Label>
                    <Input
                      id="edit_tc_pdf"
                      type="file"
                      accept="application/pdf,.pdf"
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

        {activeTab === 'staff' && staffRole === 'super_admin' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Admin accounts</CardTitle>
                <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create admin</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddStaffAdmin} className="space-y-4">
                      <div>
                        <Label htmlFor="staff_email">Email</Label>
                        <Input
                          id="staff_email"
                          type="email"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="staff_password">Password (optional)</Label>
                        <Input
                          id="staff_password"
                          type="password"
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          placeholder="Auto-generated if empty"
                        />
                      </div>
                      <Button type="submit" disabled={staffLoading} className="w-full">
                        {staffLoading ? 'Creating…' : 'Create admin'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Staff changes run on the server via <code className="text-xs bg-gray-100 px-1 rounded">/api/admin-management</code>
                  (Vercel-friendly). Ensure <code className="text-xs bg-gray-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> is set in
                  production.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffProfiles.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.email}</TableCell>
                        <TableCell>
                          {row.role === 'super_admin' ? 'Super admin' : 'Admin'}
                        </TableCell>
                        <TableCell>
                          {new Date(row.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {row.role === 'admin' && (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                disabled={staffLoading}
                                onClick={() => void handleSetStaffRole(row.id, 'super_admin')}
                              >
                                Make super admin
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                disabled={staffLoading || row.id === currentUserId}
                                onClick={() => void handleRemoveStaffAdmin(row.id)}
                              >
                                Remove
                              </Button>
                            </>
                          )}
                          {row.role === 'super_admin' && row.id === currentUserId && (
                            <span className="text-xs text-gray-500">You</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

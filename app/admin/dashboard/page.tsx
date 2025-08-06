'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, LogOut, FileText, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface TCRecord {
  id: string
  name: string
  admission_number: string
  tc_image_url: string
  created_at: string
}

export default function AdminDashboard() {
  const [tcRecords, setTcRecords] = useState<TCRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TCRecord | null>(null)
  const [formData, setFormData] = useState({ name: '', admission_number: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const adminSession = localStorage.getItem('adminSession')
    if (!adminSession) {
      router.push('/admin/login')
      return
    }
    
    fetchTCRecords()
  }, [router])

  const fetchTCRecords = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tc_records')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching TC records:', error)
      } else {
        setTcRecords(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
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
            <p className="text-gray-600">Manage Transfer Certificate records</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

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
    </div>
  )
}

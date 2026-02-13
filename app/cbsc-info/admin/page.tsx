'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, FileText, LogOut, Lock } from 'lucide-react'
import Link from 'next/link'

export default function CBSCAdminPanel() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const adminSession = localStorage.getItem('adminSession')
    if (adminSession === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    // Simple authentication
    if (username === 'Admin' && password === 'Admin1234') {
      localStorage.setItem('adminSession', 'true')
      setIsAuthenticated(true)
    } else {
      setLoginError('Invalid credentials. Use Admin / Admin1234')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    setIsAuthenticated(false)
    setUsername('')
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            </div>
            <p className="text-blue-100 text-center">CBSC Information Management</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return <AdminPanelContent onLogout={handleLogout} />
}

function AdminPanelContent({ onLogout }: { onLogout: () => void }) {
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; url: string; uploadedAt: string }>>([
    {
      id: '1',
      name: 'ADMISSION LETTER - 2025',
      url: 'https://example.com/admission-letter.pdf',
      uploadedAt: '2025-02-10',
    },
    {
      id: '2',
      name: 'RESULT CERTIFICATE - 2024-25',
      url: 'https://example.com/result.pdf',
      uploadedAt: '2025-02-08',
    },
  ])

  const [newDocName, setNewDocName] = useState('')
  const [newDocFile, setNewDocFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDocName || !newDocFile) {
      alert('Please fill in all fields')
      return
    }

    setUploading(true)
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newDoc = {
      id: Math.random().toString(),
      name: newDocName,
      url: `https://example.com/${newDocFile.name}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    }

    setDocuments([newDoc, ...documents])
    setNewDocName('')
    setNewDocFile(null)
    setUploading(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter((doc) => doc.id !== id))
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-blue-100">Upload and manage school documents</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Document
              </h2>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Document Name</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="e.g., Admission Letter 2025"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select PDF File</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setNewDocFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading || !newDocName || !newDocFile}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 hover:shadow-lg"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </div>
          </div>

          {/* Documents List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Uploaded Documents ({documents.length})
                </h2>
              </div>

              <div className="divide-y">
                {documents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No documents uploaded yet</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-6 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-between group"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-red-500" />
                          {doc.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Uploaded: {doc.uploadedAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-95"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-95"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

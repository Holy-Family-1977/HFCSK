'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, FileText, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface TCRecord {
  id: string
  name: string
  admission_number: string
  tc_image_url: string
}

export default function TCPage() {
  const [admissionNumber, setAdmissionNumber] = useState('')
  const [tcRecord, setTcRecord] = useState<TCRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchTC = async () => {
    if (!admissionNumber.trim()) {
      setError('Please enter an admission number')
      return
    }

    setLoading(true)
    setError('')
    setTcRecord(null)

    try {
      const supabase = createClient()
      const { data, error: supabaseError } = await supabase
        .from('tc_records')
        .select('*')
        .eq('admission_number', admissionNumber.trim())
        .single()

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          setError('No Transfer Certificate found for this admission number')
        } else {
          setError('An error occurred while searching. Please try again.')
        }
      } else {
        setTcRecord(data)
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadTC = async () => {
    if (!tcRecord) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase.storage
        .from('tc-images')
        .download(tcRecord.tc_image_url)

      if (error) {
        console.error('Error downloading file:', error)
        return
      }

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = `TC_${tcRecord.admission_number}_${tcRecord.name}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading file:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Admin Sign In */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-end mb-4">
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                <User className="h-4 w-4" />
                <span>Admin Sign In</span>
              </Button>
            </Link>
          </div>
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up animation-delay-200">Transfer Certificate</h1>
          <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-400">
            Enter your admission number to view and download your Transfer Certificate
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up animation-delay-600">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Search Transfer Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter Admission Number"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  className="text-lg py-3 focus:scale-105 transition-transform duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && searchTC()}
                />
              </div>
              <Button 
                onClick={searchTC} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </div>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* TC Display */}
        {tcRecord && (
          <Card className="shadow-lg animate-fade-in-scale">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-center text-2xl text-green-800 animate-pulse">
                Transfer Certificate Found
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-6 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{tcRecord.name}</h3>
                <p className="text-lg text-gray-600">Admission Number: {tcRecord.admission_number}</p>
              </div>
              
              <div className="flex justify-center mb-6 animate-zoom-in animation-delay-300">
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tc-images/${tcRecord.tc_image_url}`}
                    alt={`Transfer Certificate for ${tcRecord.name}`}
                    width={600}
                    height={800}
                    className="max-w-full h-auto rounded hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <div className="text-center animate-fade-in-up animation-delay-600">
                <Button 
                  onClick={downloadTC}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Transfer Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

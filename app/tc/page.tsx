'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, FileText, User } from 'lucide-react'
import Link from 'next/link'

const TcPdfViewer = dynamic(() => import('@/components/tc-pdf-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[320px] text-gray-500">
      Loading certificate viewer…
    </div>
  ),
})

interface TcLookupResult {
  student_name: string
  signed_url: string
  expires_in_seconds: number
}

export default function TCPage() {
  const [admissionNumber, setAdmissionNumber] = useState('')
  const [result, setResult] = useState<TcLookupResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchTC = async () => {
    if (!admissionNumber.trim()) {
      setError('Please enter an admission number')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/tc-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admission_number: admissionNumber.trim().toLowerCase(),
        }),
      })

      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 404) {
          setError('No Transfer Certificate found for this admission number')
        } else if (res.status === 503 && typeof payload.error === 'string') {
          setError(payload.error)
        } else {
          setError(
            typeof payload.error === 'string'
              ? payload.error
              : `Search failed (${res.status}). Please try again.`,
          )
        }
        return
      }

      if (!payload.signed_url || !payload.student_name) {
        setError('Invalid response from server. Please try again.')
        return
      }

      setResult({
        student_name: payload.student_name,
        signed_url: payload.signed_url,
        expires_in_seconds: payload.expires_in_seconds ?? 60,
      })
    } catch (e) {
      console.error(e)
      setError('An error occurred while searching. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
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
            Enter your admission number to view your Transfer Certificate (PDF)
          </p>
        </div>

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
                  onKeyDown={(e) => e.key === 'Enter' && searchTC()}
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

        {result && (
          <Card className="shadow-lg animate-fade-in-scale">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-center text-2xl text-green-800 animate-pulse">
                Transfer Certificate Found
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-6 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{result.student_name}</h3>
                <p className="text-lg text-gray-600">Admission Number: {admissionNumber.trim()}</p>
                <p className="text-sm text-gray-500 mt-2">
                  The preview link expires in about {result.expires_in_seconds} seconds — search again if it stops loading.
                </p>
              </div>

              <div className="flex justify-center mb-6 animate-zoom-in animation-delay-300">
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm w-full max-w-3xl p-2">
                  <TcPdfViewer fileUrl={result.signed_url} />
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 max-w-xl mx-auto">
                The certificate is shown in a secure viewer without the browser PDF toolbar. For
                privacy, avoid sharing your admission number with others.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

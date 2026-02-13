'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function CBSCInfoPage() {
  const [activeTab, setActiveTab] = useState('mandatory')

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">CBSC Information</h1>
          <p className="text-blue-100 text-lg">Official School Documents & Information</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-20 bg-white shadow-md z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('mandatory')}
              className={`py-4 px-6 font-semibold border-b-4 transition-all duration-300 whitespace-nowrap ${
                activeTab === 'mandatory'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Mandatory Public Disclosure
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === 'mandatory' && <MandatoryPublicDisclosure />}
      </div>
    </main>
  )
}

function MandatoryPublicDisclosure() {
  const [viewingPDF, setViewingPDF] = useState<{ name: string; url: string } | null>(null)

  // Static documents pointing to PDFs in the public folder
  const documents = [
    { sl: 1, doc: 'AFFILIATION', url: '/PMD/03 Affiliation 2024.pdf' },
    { sl: 2, doc: 'AFFIDAVIT', url: '/PMD/04 Affidavit for CBSE.pdf' },
    { sl: 3, doc: 'AFFIDAVIT NONPROFIT', url: '/PMD/AFFIDAVIT NONPROFIT-2.pdf' },
    { sl: 4, doc: 'Calendar', url: '/PMD/13 Calendar 2025-26.pdf' },
    { sl: 5, doc: 'BALANCE SHEET', url: '/PMD/05 BALANCE SHEET Sign.pdf' },
    { sl: 6, doc: 'Book List', url: '/PMD/06 Book List (2025-26)-8.pdf' },
    { sl: 7, doc: 'PTA', url: '/PMD/07 PTA (2025-26) Sign.pdf' },
    { sl: 8, doc: 'Results Of Board Examination', url: '/PMD/08 Result of Last Three Years Board Examination Sign.pdf'},
    { sl: 9, doc: 'Society Registration Certificate', url: '/PMD/09 Society Registration Certificate Sign.pdf' },
    { sl: 10, doc: 'RTE MP Recognition', url: '/PMD/10 RTE MP Recognition New [Class NUR to VIII] (01-04-2025 to 31-03-2028)-2.pdf' },
    { sl: 11, doc: 'TC format', url: '/PMD/11 TC format.pdf' },
    { sl: 12, doc: 'BUILDING SAFETY CERTIFICATE', url: '/PMD/12 BUILDING SAFETY CERTIFICATE Sign.pdf' },
    { sl: 13, doc: 'Staff Statement', url: '/PMD/14 Staff Statement (2025-26)-1.pdf' },
    { sl: 14, doc: 'Fee Structure', url: '/PMD/15 Fee Structure - final 2025-26 Sign.pdf' },
    { sl: 15, doc: 'Fire Certificate', url: '/PMD/16 Fire Certificate Sign.pdf' },
    { sl: 16, doc: 'HEALTH AND HYGIENE CERTIFICATE', url: '/PMD/17 HEALTH AND HYGIENE CERTIFICATE Sign.pdf' },
    { sl: 17, doc: 'Governing body', url: '/PMD/18 Governing body Sign.pdf' },
    { sl: 18, doc: 'NOC', url: '/PMD/19 NOC (29-07-2024)-3.pdf' },
    { sl: 19, doc: 'CERTIFICATE OF LAND', url: '/PMD/CERTIFICATE OF LAND 2025.pdf' },
    { sl: 20, doc: 'SMC', url: '/PMD/SMC 2025-26 Sign.pdf' },
    { sl: 21, doc: 'Students Strength List', url: '/PMD/21 Students Strength List 2025-26' },
    { sl: 22, doc: 'Drinking water', url: '/PMD/24 Drinking water Sign.pdf' },
    
    
  ]

  // Sample data - in production, fetch from database
  const generalInfo = [
    { sl: 1, info: 'NAME OF THE SCHOOL', details: 'HOLY FAMILY CONVENT SR. SEC. SCHOOL' },
    { sl: 2, info: 'AFFILIATION NO.', details: 'CBSE: 1030296' },
    { sl: 3, info: 'REGISTRATION NO.', details: 'REG NO: 1030296' },
    { sl: 4, info: 'COMPLETE ADDRESS WITH PIN CODE', details: 'HOLY FAMILY CONVENT SR. SEC. SCHOOL, KHURAI, P.O. KHURAI' },
    { sl: 5, info: 'PRINCIPAL NAME & QUALIFICATION', details: 'SR. BENSY V K' },
  ]

  return (
    <div className="space-y-8">
      {/* General Information Section */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">A. GENERAL INFORMATION</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50 border-b-2 border-blue-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">SL.NO</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">INFORMATION</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {generalInfo.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b transition-colors duration-200 ${
                    idx % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.sl}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{row.info}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Documents Section */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">B. DOCUMENTS AND INFORMATION</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-900">SL.NO</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-900">DOCUMENTS/INFORMATION</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-900">UPLOAD DOCUMENTS</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b transition-colors duration-200 ${
                    idx % 2 === 0 ? 'bg-white hover:bg-indigo-50' : 'bg-indigo-50 hover:bg-indigo-100'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.sl}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{row.doc}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setViewingPDF({ name: row.doc, url: row.url })}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                    >
                      <FileText className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>



      {/* PDF Viewer Modal */}
      {viewingPDF && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setViewingPDF(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
              <h3 className="text-2xl font-bold">{viewingPDF.name}</h3>
              <button
                onClick={() => setViewingPDF(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 h-[calc(90vh-100px)] overflow-auto bg-gray-50">
              {viewingPDF.url.endsWith('.pdf') ? (
                <iframe
                  src={viewingPDF.url}
                  className="w-full h-full border-0"
                  title={viewingPDF.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Unable to preview document</p>
                    <a
                      href={viewingPDF.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                    >
                      Download File
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function X({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

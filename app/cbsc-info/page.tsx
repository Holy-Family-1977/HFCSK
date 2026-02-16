'use client'

import React from "react"
import { useState } from 'react'
import Link from 'next/link'
import { FileText, Play } from 'lucide-react'

export default function MandatoryPublicDisclosurePage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Leaf Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Left side leaves */}
        <div className="absolute top-0 left-0 w-64 h-96 opacity-30">
          <svg viewBox="0 0 200 400" className="w-full h-full">
            <g fill="none" stroke="#9CA3AF" strokeWidth="0.5">
              <path d="M50,150 Q40,120 30,80 Q25,70 20,50" />
              <path d="M60,160 Q50,130 45,90 Q42,75 40,55" />
              <path d="M70,170 Q60,135 55,100 Q50,80 48,60" />
              <path d="M80,175 Q72,140 70,105 Q68,85 65,65" />
            </g>
          </svg>
        </div>
        {/* Right side leaves */}
        <div className="absolute top-0 right-0 w-72 h-96 opacity-30 transform scale-x-[-1]">
          <svg viewBox="0 0 200 400" className="w-full h-full">
            <g fill="none" stroke="#9CA3AF" strokeWidth="0.5">
              <path d="M50,150 Q40,120 30,80 Q25,70 20,50" />
              <path d="M60,160 Q50,130 45,90 Q42,75 40,55" />
              <path d="M70,170 Q60,135 55,100 Q50,80 48,60" />
              <path d="M80,175 Q72,140 70,105 Q68,85 65,65" />
            </g>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">MANDATORY PUBLIC DISCLOSURE</h1>
          <p className="text-blue-100 text-lg">Holy Family Convent Sr. Sec. School, Khurai - Official Information</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-20 bg-white shadow-md z-40 relative">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'general', label: 'A. General Information' },
              { id: 'documents', label: 'B. Documents & Information' },
              { id: 'results', label: 'C. Results & Academics' },
              { id: 'staff', label: 'D. Staff (Teaching)' },
              { id: 'infrastructure', label: 'E. School Infrastructure' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-4 md:px-6 font-semibold border-b-4 transition-all duration-300 whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {activeTab === 'general' && <GeneralInformation />}
        {activeTab === 'documents' && <DocumentsAndInformation />}
        {activeTab === 'results' && <ResultsAndAcademics />}
        {activeTab === 'staff' && <StaffTeaching />}
        {activeTab === 'infrastructure' && <SchoolInfrastructure />}
      </div>
    </main>
  )
}



function GeneralInformation() {
  const [viewingPDF, setViewingPDF] = useState<{ name: string; url: string } | null>(null)

  const generalInfo = [
    { sl: 1, info: 'NAME OF THE SCHOOL', details: 'HOLY FAMILY CONVENT SR. SEC. SCHOOL' },
    { sl: 2, info: 'AFFILIATION NO.', details: 'CBSE: 1030296' },
    { sl: 3, info: 'REGISTRATION NO.', details: 'REG NO: 1030296' },
    { sl: 4, info: 'COMPLETE ADDRESS WITH PIN CODE', details: 'HOLY FAMILY CONVENT SR. SEC. SCHOOL, KHURAI, P.O. KHURAI' },
    { sl: 5, info: 'PRINCIPAL NAME & QUALIFICATION', details: 'SR. BENSY V K (M.A, M.Ed)' },
    { sl: 6, info: 'PHONE NUMBER', details: '+91 89896 62026' },
    { sl: 7, info: 'EMAIL ID', details: 'holyfamilychssk@rediffmail.com' },
  ]

  const mandatoryDocuments = [
    { sl: 1, doc: 'MANDATORY PUBLIC DISCLOSURE (MAIN)', url: '/PMD/mpd.pdf' },
    { sl: 2, doc: 'RTE', url: '/PMD/RTE MP Recognition.pdf' },
    { sl: 3, doc: 'SELF CERTIFICATE', url: '/PMD/Self Certificate.pdf' },
    { sl: 4, doc: 'SCHOOL INFRASTRUCTURE', url: '/PMD/SCHOOL INFRASTRUCTURE.pdf' },
    
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

      {/* Mandatory Public Disclosure Documents */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Mandatory Public Disclosure Documents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-900">SL.NO</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-900">DOCUMENT</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-900">VIEW</th>
              </tr>
            </thead>
            <tbody>
              {mandatoryDocuments.map((row, idx) => (
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
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
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

function DocumentsAndInformation() {
  const [viewingPDF, setViewingPDF] = useState<{ name: string; url: string } | null>(null)

  const documents = [
    { sl: 1, doc: 'Calendar', url: '/PMD/13 Calendar 2025-26.pdf' },
    { sl: 2, doc: 'Book List', url: '/PMD/06 Book List (2025-26)-8.pdf' },
    { sl: 3, doc: 'PTA', url: '/PMD/07 PTA (2025-26) Sign.pdf' },
    { sl: 4, doc: 'RTE MP Recognition', url: '/PMD/10 RTE MP Recognition New [Class NUR to VIII] (01-04-2025 to 31-03-2028)-2.pdf' },
    { sl: 5, doc: 'TC Format', url: '/PMD/11 TC format.pdf' },
    { sl: 6, doc: 'Staff Statement', url: '/PMD/14 Staff Statement (2025-26)-1.pdf' },
    { sl: 7, doc: 'Fee Structure', url: '/PMD/15 Fee Structure - final 2025-26 Sign.pdf' },
    { sl: 8, doc: 'Fire Certificate', url: '/PMD/16 Fire Certificate Sign.pdf' },
    { sl: 9, doc: 'Health & Hygiene Certificate', url: '/PMD/17 HEALTH AND HYGIENE CERTIFICATE Sign.pdf' },
    { sl: 10, doc: 'NOC', url: '/PMD/19 NOC (29-07-2024)-3.pdf' },
    { sl: 11, doc: 'Certificate of Land', url: '/PMD/CERTIFICATE OF LAND 2025.pdf' },
    { sl: 12, doc: 'SMC', url: '/PMD/SMC 2025-26 Sign.pdf' },
    { sl: 13, doc: 'Students Strength List', url: '/PMD/21 Students Strength List 2025-26' },
    { sl: 14, doc: 'Drinking Water', url: '/PMD/24 Drinking water Sign.pdf' },
  ]

  const videos = [
    { sl: 15, title: 'School Virtual Tour', url: 'https://youtube.com/embed/dQw4w9WgXcQ' },
    { sl: 16, title: 'Campus Overview', url: 'https://youtube.com/embed/dQw4w9WgXcQ' },
  ]

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">B. DOCUMENTS AND INFORMATION</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50 border-b-2 border-green-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-900">SL.NO</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-900">DOCUMENTS/INFORMATION</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-900">VIEW</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b transition-colors duration-200 ${
                    idx % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-green-50 hover:bg-green-100'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.sl}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{row.doc}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setViewingPDF({ name: row.doc, url: row.url })}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                    >
                      <FileText className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {videos.map((video) => (
                <tr
                  key={video.sl}
                  className="border-b bg-green-50 hover:bg-green-100 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{video.sl}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{video.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                    >
                      <Play className="w-4 h-4" />
                      Watch
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {viewingPDF && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setViewingPDF(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
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

function ResultsAndAcademics() {
  const classXResults = [
    { sl: 1, year: 2025, registered: 149, passed: 149, percentage: 98.6, remarks: '' },
  ]

  const classXIIResults = [
    { sl: 1, year: 2025, registered: 76, passed: 76, percentage: 100, remarks: '' },
  ]

  return (
    <div className="space-y-8">
      {/* Class X Results */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">C. RESULTS AND ACADEMICS - RESULT CLASS: X</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50 border-b-2 border-purple-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">SL.NO</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">YEAR</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">NO. OF REGISTERED STUDENTS</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">NO. OF STUDENTS PASSED</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">PASS PERCENTAGE</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {classXResults.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b transition-colors duration-200 ${
                    idx % 2 === 0 ? 'bg-white hover:bg-purple-50' : 'bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.sl}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{row.registered}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{row.passed}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{row.percentage}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Class XII Results */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">RESULT CLASS: XII</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50 border-b-2 border-purple-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">SL.NO</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">YEAR</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">NO. OF REGISTERED STUDENTS</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">NO. OF STUDENTS PASSED</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">PASS PERCENTAGE</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {classXIIResults.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b transition-colors duration-200 ${
                    idx % 2 === 0 ? 'bg-white hover:bg-purple-50' : 'bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.sl}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{row.registered}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{row.passed}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{row.percentage}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function StaffTeaching() {
  const staffData = [
    // PGT
    { dept: 'PGT', sn: 1, name: 'Baby C.O. (Sr. Savidha)', designation: 'Manager', qualification: 'M.A., B.Ed.' },
    { dept: 'PGT', sn: 2, name: 'Bensy V K (Sr. Catherine)', designation: 'Principal', qualification: 'M.A, M.Ed.' },
    { dept: 'PGT', sn: 3, name: 'Beena C J (Sr. Beena Jacob)', designation: 'Vice Principal', qualification: 'M.Sc, B.Ed' },
    { dept: 'PGT', sn: 4, name: 'Mr. Mahendra Choudhary', designation: 'PGT', qualification: 'M.Sc.,B.Ed, PGDCA' },
    { dept: 'PGT', sn: 5, name: 'Mr. Vijay Kumar Jain', designation: 'PGT', qualification: 'M.A.,Ph.D, B.Ed' },
    { dept: 'PGT', sn: 6, name: 'Mr. Louis Davis A', designation: 'PGT', qualification: 'M.Ped, M.Phil, PGDY' },
    { dept: 'PGT', sn: 7, name: 'Mrs. Aji James Varghese', designation: 'PGT', qualification: 'MA, B.Ed' },
    { dept: 'PGT', sn: 8, name: 'Saniya T. Jose (Sr. Christel)', designation: 'PGT', qualification: 'M.Com, B.Ed' },
    { dept: 'PGT', sn: 9, name: 'Ms. Anshika Shrivastava', designation: 'PGT', qualification: 'M.Com,B.Ed, PGDCA' },
    { dept: 'PGT', sn: 10, name: 'Mr. Dilip Payra', designation: 'PGT', qualification: 'M.A., B.Ed.' },
    { dept: 'PGT', sn: 11, name: 'Miss Arsha Joshy', designation: 'PGT', qualification: 'M.Sc., B.Ed.' },
    { dept: 'PGT', sn: 12, name: 'Sr. Preema P Y', designation: 'PGT', qualification: 'PhD - AI' },
    { dept: 'PGT', sn: 13, name: 'Mr. Suraj Singh Saini', designation: 'PGT', qualification: 'M.Com, B.ED.,M.A.' },
    { dept: 'PGT', sn: 14, name: 'Mr. Raghuraman T P', designation: 'PGT', qualification: 'M.Sc., B.Ed.' },
    // TGT
    { dept: 'TGT', sn: 1, name: 'Mr. Sanjay Dubey', designation: 'PTI (TGT)', qualification: 'B.A, B.P.Ed' },
    { dept: 'TGT', sn: 2, name: 'Mrs. Sarita Jain', designation: 'TGT', qualification: 'M.A, B.Ed' },
    { dept: 'TGT', sn: 3, name: 'Mrs. Tency Nicodemus', designation: 'TGT', qualification: 'M.A,B.Ed' },
    { dept: 'TGT', sn: 4, name: 'Ms. Ekta Choubey', designation: 'TGT', qualification: 'M.A.,B.Ed' },
    { dept: 'TGT', sn: 5, name: 'Mrs. Akanksha Nema', designation: 'TGT', qualification: 'M.A. B.Ed' },
    { dept: 'TGT', sn: 6, name: 'Mrs. Karuna Parihar', designation: 'TGT', qualification: 'M.A. B.Ed' },
    { dept: 'TGT', sn: 7, name: 'Mrs. Pushpa Devi Chaurasia', designation: 'TGT', qualification: 'M.A. B.Ed' },
    { dept: 'TGT', sn: 8, name: 'Mr. Nitin Pateriya', designation: 'TGT', qualification: 'M.A.' },
    { dept: 'TGT', sn: 9, name: 'Mr. Arvind Khare', designation: 'TGT', qualification: 'M.Sc, B.Ed' },
    { dept: 'TGT', sn: 10, name: 'Mr. Karvesh Kumar', designation: 'TGT', qualification: 'M.Sc, B.Ed' },
    { dept: 'TGT', sn: 11, name: 'Mrs. Abhilasha Dubey', designation: 'TGT', qualification: 'MA, B.Ed' },
    { dept: 'TGT', sn: 12, name: 'Mrs. Deepti John', designation: 'TGT', qualification: 'M.A, B.Ed' },
    { dept: 'TGT', sn: 13, name: 'Mr. Martin Singh', designation: 'TGT', qualification: 'BSc. B.Ed' },
    { dept: 'TGT', sn: 14, name: 'Mr. Krishna Kumar Katare', designation: 'TGT (Music)', qualification: 'M.A.(Music)' },
    { dept: 'TGT', sn: 15, name: 'Mr. Deepak Ekka', designation: 'TGT', qualification: 'B.E., B.Ed.' },
    { dept: 'TGT', sn: 16, name: 'Mr. Ankit Anthony Wadekar', designation: 'TGT', qualification: 'B.Sc.' },
    { dept: 'TGT', sn: 17, name: 'Miss Shailly Richhariya', designation: 'TGT', qualification: 'M.Tech., D.El.Ed.' },
    { dept: 'TGT', sn: 18, name: 'Mr. George Thomas', designation: 'TGT', qualification: 'B.A., B.Ed.' },
    { dept: 'TGT', sn: 19, name: 'Mrs. Aleena M. Mathew', designation: 'TGT', qualification: 'B.A., B.Ed.' },
    { dept: 'TGT', sn: 20, name: 'Mr. Anshuman Singh Rajput', designation: 'TGT', qualification: 'B.A., B.P.Ed.' },
    { dept: 'TGT', sn: 21, name: 'Joti (Sr. Deepika)', designation: 'TGT', qualification: 'B.A., B.Lib.' },
    { dept: 'TGT', sn: 22, name: 'Miss Keerthana Vijay', designation: 'TGT', qualification: 'M.A., B.Ed.' },
    { dept: 'TGT', sn: 23, name: 'Mrs. Vinima Kumar', designation: 'TGT', qualification: 'Post. B.Sc. Nursing' },
    // PRT
    { dept: 'PRT', sn: 1, name: 'Mrs. Vinita Jain', designation: 'PRT', qualification: 'M.A, B.Ed' },
    { dept: 'PRT', sn: 2, name: 'Mrs. Harpreet Chawla', designation: 'PRT', qualification: 'M.Sc.,B.Ed' },
    { dept: 'PRT', sn: 3, name: 'Mrs. Kalpana Mishra', designation: 'PRT', qualification: 'M.A , B.Ed' },
    { dept: 'PRT', sn: 4, name: 'Mrs.Priya Jain', designation: 'PRT', qualification: 'M.Com, B.ED.,M.Lib' },
    { dept: 'PRT', sn: 5, name: 'Mrs. Nisha Kurmi', designation: 'PRT', qualification: 'M.A.,B.P.Ed,B.Ed' },
    { dept: 'PRT', sn: 6, name: 'Mrs. Pravina Shrivastava', designation: 'PRT', qualification: 'M.A, B.Ed' },
    { dept: 'PRT', sn: 7, name: 'Mrs. Jyoti Tiwari', designation: 'PRT', qualification: 'M.A.,B.Ed., B.Lib., PGDCA' },
    { dept: 'PRT', sn: 8, name: 'Mrs. Vandana Thakur', designation: 'PRT', qualification: 'B.Com.,B.Ed, PGDCA' },
    { dept: 'PRT', sn: 9, name: 'Ms. Gargi Badkul', designation: 'PRT', qualification: 'M.BA, B.Ed' },
    { dept: 'PRT', sn: 10, name: 'Mrs. Rashmi Soni', designation: 'PRT', qualification: 'M.A.,B.Ed' },
    { dept: 'PRT', sn: 11, name: 'Ms. Anamika Jain', designation: 'PRT', qualification: 'M.A.,B.Ed' },
    { dept: 'PRT', sn: 12, name: 'Ms. Caroline Grace Santlal', designation: 'PRT', qualification: 'M.Com,B.Ed' },
    { dept: 'PRT', sn: 13, name: 'Mrs. Rachna Ephraim Samuel', designation: 'PRT', qualification: 'M.A,B.Ed' },
    { dept: 'PRT', sn: 14, name: 'Ms. Shashi', designation: 'PRT (Dance)', qualification: 'B.P.A' },
    { dept: 'PRT', sn: 15, name: 'Ms. Nikita Thakur', designation: 'PRT', qualification: 'M.Sc., B.Ed.' },
    { dept: 'PRT', sn: 16, name: 'Miss Ancy', designation: 'PRT (Dance)', qualification: 'B.P.A' },
    { dept: 'PRT', sn: 17, name: 'Miss Shipra Mishra', designation: 'PRT', qualification: 'B.Com,B.Ed' },
    { dept: 'PRT', sn: 18, name: 'Miss Ishita Sundrani', designation: 'PRT', qualification: 'M.Com., B.Ed.' },
    { dept: 'PRT', sn: 19, name: 'Miss Surbhi Jain', designation: 'PRT', qualification: 'M.Com., B.Ed.' },
    { dept: 'PRT', sn: 20, name: 'Mrs. Deepa Sahu', designation: 'PRT', qualification: 'M.A., B.Ed.' },
    { dept: 'PRT', sn: 21, name: 'Miss Tanu Sahu', designation: 'PRT', qualification: 'MBA, B.Ed.' },
    { dept: 'PRT', sn: 22, name: 'Mrs. Shivani Chourasiya', designation: 'PRT', qualification: 'M.A., B.Ed.' },
  ]

  const staffSummary = [
    { sl: 1, info: 'PRINCIPAL', details: 'BENSY V K' },
    { sl: 2, info: 'TOTAL NO. OF TEACHERS', details: '69', children: [
      { info: 'PGT', details: '13' },
      { info: 'TGT', details: '23' },
      { info: 'PRT', details: '22' },
    ]},
    { sl: 3, info: 'TEACHERS SECTION RATIO', details: '1:1.5' },
    { sl: 4, info: 'DETAILS OF SPECIAL EDUCATOR', details: 'NITIN PATERIYA' },
    { sl: 5, info: 'DETAILS OF COUNSELLOR AND WELLNESS TEACHER', details: 'ALEENA M MATHEW' },
  ]

  const departments = ['PGT', 'TGT', 'PRT']

  return (
    <div className="space-y-8">
      {/* Staff Summary Section */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">D. STAFF (TEACHING) - SUMMARY</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-pink-50 border-b-2 border-pink-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-pink-900">SL.NO</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-pink-900">INFORMATION</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-pink-900">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {staffSummary.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr className={`border-b transition-colors duration-200 ${
                    idx % 2 === 0 ? 'bg-white hover:bg-pink-50' : 'bg-pink-50 hover:bg-pink-100'
                  }`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.sl}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{row.info}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.details}</td>
                  </tr>
                  {row.children && row.children.map((child, childIdx) => (
                    <tr key={`child-${idx}-${childIdx}`} className={`border-b transition-colors duration-200 ${
                      (idx + childIdx) % 2 === 0 ? 'bg-pink-50 hover:bg-pink-100' : 'bg-white hover:bg-pink-50'
                    }`}>
                      <td className="px-6 py-4 text-sm text-gray-600"></td>
                      <td className="px-6 py-4 text-sm text-gray-800 pl-12 font-medium">{child.info}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{child.details}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Staff List Section */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">LIST OF TEACHERS</h2>
        </div>
        
        {departments.map(dept => {
          const deptStaff = staffData.filter(s => s.dept === dept)
          const deptColorMap = { 'PGT': 'pink', 'TGT': 'rose', 'PRT': 'fuchsia' }
          const color = deptColorMap[dept as keyof typeof deptColorMap] || 'pink'
          
          return (
            <div key={dept} className="border-b-2 border-pink-100 last:border-b-0">
              <div className={`bg-${color}-100 px-6 py-3`}>
                <h3 className={`text-lg font-bold text-${color}-900`}>{dept}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`bg-${color}-50 border-b border-${color}-200`}>
                      <th className={`px-4 py-3 text-left text-xs font-semibold text-${color}-900`}>S.NO</th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold text-${color}-900`}>NAME</th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold text-${color}-900`}>DESIGNATION</th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold text-${color}-900`}>QUALIFICATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptStaff.map((staff, idx) => (
                      <tr
                        key={`${dept}-${idx}`}
                        className={`border-b transition-colors ${
                          idx % 2 === 0 ? 'bg-white hover:bg-' + color + '-50' : 'bg-' + color + '-50 hover:bg-' + color + '-100'
                        }`}
                      >
                        <td className="px-4 py-3 text-xs font-medium text-gray-900">{staff.sn}</td>
                        <td className="px-4 py-3 text-xs text-gray-800 font-medium">{staff.name}</td>
                        <td className="px-4 py-3 text-xs text-gray-800">{staff.designation}</td>
                        <td className="px-4 py-3 text-xs text-gray-700">{staff.qualification}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function SchoolInfrastructure() {
  const infrastructure = [
    { sl: 1, info: 'TOTAL CAMPUS AREA OF THE SCHOOL (IN SQ MTR)', details: '12150' },
    { sl: 2, info: 'NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)', details: '57 & 3176' },
    { sl: 3, info: 'NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)', details: '6 & 321' },
    { sl: 4, info: 'INTERNET FACILITY', details: 'YES' },
    { sl: 5, info: 'NO. OF GIRLS TOILETS', details: '16' },
    { sl: 6, info: 'NO. OF BOYS TOILETS', details: '25' },
    { sl: 7, info: 'LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING THE INFRASTRUCTURE OF THE SCHOOL', details: 'https://youtu.be/nUulPyn8XuE' },
  ]

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">E. SCHOOL INFRASTRUCTURE</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-50 border-b-2 border-orange-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-orange-900">SL.NO</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-orange-900">INFORMATION</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-orange-900">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {infrastructure.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b transition-colors duration-200 ${
                    idx % 2 === 0 ? 'bg-white hover:bg-orange-50' : 'bg-orange-50 hover:bg-orange-100'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.sl}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.info}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.details.startsWith('http') ? (
                      <a href={item.details} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                        {item.details}
                      </a>
                    ) : (
                      item.details
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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

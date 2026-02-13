'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo and School Name */}
          <Link href="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <Image
              src="/school-logo.png"
              alt="Holy Family School Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800 leading-tight">
                Holy Family Convent Sr. Sec. School Khurai
              </span>
              <span className="text-xs text-gray-600">Affiliated to CBSE No. 1030296</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-orange-500 font-semibold hover:text-orange-600 transition-all duration-300 hover:scale-110">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110">
              About Us
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110">
              Gallery
            </Link>
            <Link href="/cbsc-info" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110">
              CBSC Information
            </Link>
            <Link href="/tc" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110">
              TC
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110">
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden hover:scale-110 transition-transform duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t animate-slide-down">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors hover:translate-x-2 transform duration-300">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 transform duration-300">
                About Us
              </Link>
              <Link href="/gallery" className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 transform duration-300">
                Gallery
              </Link>
              <Link href="/cbsc-info" className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 transform duration-300">
                CBSC Information
              </Link>
              <Link href="/tc" className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 transform duration-300">
                TC
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 transform duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

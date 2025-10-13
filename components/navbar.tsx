'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo and School Name */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform duration-300">
            <Image
              src="/school-logo.png"
              alt="Holy Family School Logo"
              width={40}
              height={40}
              className="rounded-full sm:w-[50px] sm:h-[50px]"
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">
                Holy Family Convent Sr. Sec. School Khurai
              </span>
              <span className="text-[10px] sm:text-xs text-gray-600">Affiliated to CBSE No. 1030296</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/" className="text-orange-500 font-semibold hover:text-orange-600 transition-all duration-300 hover:scale-110">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110">
              About Us
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110">
              Gallery
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
            className="lg:hidden hover:scale-110 transition-transform duration-300 p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
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

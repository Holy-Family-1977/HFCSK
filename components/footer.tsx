import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* School Info */}
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">HF</span>
              </div>
              <span className="text-base sm:text-lg font-bold">Holy Family Convent Sr. Sec. School</span>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              Empowering future leaders through quality education and character development since 1990.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                Home
              </Link>
              <Link href="/about" className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                About Us
              </Link>
              <Link href="/gallery" className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                Gallery
              </Link>
              <Link href="/tc" className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                Transfer Certificate
              </Link>
              <Link href="/contact" className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Get In Touch */}
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start sm:items-center space-x-2 hover:text-blue-400 transition-colors">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-sm sm:text-base text-gray-300">Khurai P.O</span>
              </div>
              <div className="flex items-start sm:items-center space-x-2 hover:text-blue-400 transition-colors">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-sm sm:text-base text-gray-300">08989662026</span>
              </div>
              <div className="flex items-start sm:items-center space-x-2 hover:text-blue-400 transition-colors">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-sm sm:text-base text-gray-300 break-all">holyfamilychssk@rediffmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 sm:pt-8 text-center animate-fade-in">
          <p className="text-xs sm:text-sm text-gray-300">
            © {new Date().getFullYear()} Holy Family Convent Sr. Sec. School, Khurai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

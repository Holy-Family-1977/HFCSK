import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* School Info */}
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">HF</span>
              </div>
              <span className="text-lg font-bold">Holy Family Convent Sr. Sec. School</span>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering future leaders through quality education and character development since 1990.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                Home
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                About Us
              </Link>
              <Link href="/gallery" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                Gallery
              </Link>
              <Link href="/tc" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                Transfer Certificate
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Get In Touch */}
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Khurai P.O</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">08989662026</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">holyfamilychssk@rediffmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center animate-fade-in">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Holy Family Convent Sr. Sec. School, Khurai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

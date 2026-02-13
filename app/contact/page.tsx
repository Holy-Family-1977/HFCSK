import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Get in touch with Holy Family Convent Sr. Sec. School, Khurai
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">
                    Holy Family Convent Sr. Sec. School<br />
                    Khurai, Madhya Pradesh<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+91 XXX XXX XXXX</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">info@hfcschoolkhurai.edu.in</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">School Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 2:00 PM<br />
                    Saturday: 8:00 AM - 12:00 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* School Details */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">School Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-600">CBSE Affiliation</h3>
                <p className="text-gray-600">Affiliation No: 1030296</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-blue-600">School Code</h3>
                <p className="text-gray-600">50264</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-blue-600">Established</h3>
                <p className="text-gray-600">July 2, 1990</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-blue-600">Management</h3>
                <p className="text-gray-600">
                  Sisters of the Congregation of Holy Family<br />
                  Shantidhara Province, New Delhi
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-blue-600">Registration</h3>
                <p className="text-gray-600">Holy Family Society, Khurai</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

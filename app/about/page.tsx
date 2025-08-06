import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">About Holy Family School</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover our mission, vision, and the leadership that guides our educational journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Principal's Desk */}
        <Card className="mb-16 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h2 className="text-3xl font-bold text-center">From Principal's Desk</h2>
          </div>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/3">
                <Image
                  src="/professional-woman-principal.png"
                  alt="Sr. Bensy V K - Principal"
                  width={250}
                  height={300}
                  className="rounded-lg shadow-md mx-auto"
                />
                <div className="text-center mt-4">
                  <h3 className="text-xl font-semibold">Sr. Bensy V K</h3>
                  <p className="text-gray-600">Principal</p>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    As the head of our esteemed institution, I am thrilled to extend my warmest greetings to all students, parents, faculty, and visitors. This platform serves as a window into the heart of our school, providing insights into our mission, vision, values and educational endeavors.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our school is more than just a place of learning; it's a vibrant community where ideas flourish, talents are nurtured, and futures are shaped. We are committed to fostering an environment that promotes academic excellence, personal growth, and character development. Our dedicated team of educators works tirelessly to inspire and empower each student to reach their full potential.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    I encourage you to explore our website to discover the myriad opportunities available at our school. From innovative curriculum offerings to extracurricular activities, we strive to provide a well-rounded educational experience that prepares students for success in an ever-changing world.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    I invite you to connect with us, whether you're a prospective student, a proud parent, or an alumni member. Together, we can continue to uphold the rich traditions and values that define our institution.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Thank you for being a part of Holy Family. I look forward to embarking on this journey of growth and discovery with you.
                  </p>
                  
                  <div className="mt-6">
                    <p className="font-semibold">Warm regards,</p>
                    <p className="font-semibold text-blue-600">Sr. Bensy V K</p>
                    <p className="text-gray-600">Principal</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <h2 className="text-2xl font-bold text-center">Our Mission</h2>
            </div>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">🎯</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                To prepare Holy Family students to be spiritually oriented and academically excellent — by promoting holistic and integral development and also by providing quality education & technological support relevant to all, in particular to the marginalized.
              </p>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
              <h2 className="text-2xl font-bold text-center">Our Vision</h2>
            </div>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">👁️</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                Create a world of enlightened and integrated citizens and mould ideal families by imparting knowledge of God and value-based quality education.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

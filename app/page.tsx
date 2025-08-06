import HeroCarousel from '@/components/hero-carousel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Users, Shield, Monitor, Building, Award, Heart, Star, GraduationCap, Target, Eye, Lightbulb, Trophy, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />
      
      {/* School Introduction with Glassmorphism */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse animation-delay-300"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/30">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Established 1990</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Holy Family Convent Sr. Sec. School, Khurai
            </h2>
            <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed space-y-6">
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
                <p className="animate-fade-in-up animation-delay-200 mb-4">
                  Holy Family Convent Sr. Sec. School, Khurai was established on second July, 1990 by the Sisters of the Congregation of Holy Family who manage and administer over a hundred and fifty institutions in India and abroad.
                </p>
                <p className="animate-fade-in-up animation-delay-400">
                  The School is under the Registered Holy Family Society, Khurai which in turn belongs to Shantidhara Province, New Delhi, of the Congregation of the Holy Family.
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Section with Glassmorphism */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 animate-fade-in-up animation-delay-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">34+</h3>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
            
            <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 animate-fade-in-up animation-delay-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">1000+</h3>
              <p className="text-gray-600">Students</p>
            </div>
            
            <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 animate-fade-in-up animation-delay-400">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">50+</h3>
              <p className="text-gray-600">Faculty Members</p>
            </div>
            
            <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 animate-fade-in-up animation-delay-600">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">100%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
          
          {/* Facilities Cards with Enhanced Design */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="bg-white/30 backdrop-blur-md border border-white/40 text-center p-6 hover:shadow-2xl hover:bg-white/40 transition-all duration-500 hover:-translate-y-3 animate-fade-in-up animation-delay-200 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">School Library</h3>
                <p className="text-gray-600">The School endeavors to maintain a well equipped library with vast collection of books</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/30 backdrop-blur-md border border-white/40 text-center p-6 hover:shadow-2xl hover:bg-white/40 transition-all duration-500 hover:-translate-y-3 animate-fade-in-up animation-delay-300 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Playground</h3>
                <p className="text-gray-600">Holy Family Convent School facilities include a spacious and well maintained Ground</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/30 backdrop-blur-md border border-white/40 text-center p-6 hover:shadow-2xl hover:bg-white/40 transition-all duration-500 hover:-translate-y-3 animate-fade-in-up animation-delay-400 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Safe & Security</h3>
                <p className="text-gray-600">Our facilities are built to the highest standards, ensuring a safe and conducive environment</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/30 backdrop-blur-md border border-white/40 text-center p-6 hover:shadow-2xl hover:bg-white/40 transition-all duration-500 hover:-translate-y-3 animate-fade-in-up animation-delay-600 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Digital Classroom</h3>
                <p className="text-gray-600">A digital classroom that is fully immersed in technology by using Smart Class</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-float animation-delay-300"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-float animation-delay-600"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">Our Mission & Vision</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Guiding principles that shape our educational philosophy and commitment to excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 animate-fade-in-up animation-delay-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-blue-100 leading-relaxed">
                To prepare Holy Family students to be spiritually oriented and academically excellent — by promoting holistic and integral development and also by providing quality education & technological support relevant to all, in particular to the marginalized.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 animate-fade-in-up animation-delay-400">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Create a world of enlightened and integrated citizens and mould ideal families by imparting knowledge of God and value-based quality education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The fundamental principles that guide our educational approach and community life
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-200">
              <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Compassion</h3>
              <p className="text-gray-600">
                Fostering empathy, kindness, and understanding in all our interactions and relationships within the school community.
              </p>
            </div>
            
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-400">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Excellence</h3>
              <p className="text-gray-600">
                Striving for the highest standards in academics, character development, and all aspects of school life.
              </p>
            </div>
            
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-600">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Integrity</h3>
              <p className="text-gray-600">
                Building character through honesty, moral courage, and ethical behavior in all our endeavors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-100 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-purple-100 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Holy Family?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes our school the perfect choice for your child's educational journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-200">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Academic Excellence</h3>
              <p className="text-gray-600">Comprehensive curriculum designed to nurture intellectual growth and critical thinking skills.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-300">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Experienced Faculty</h3>
              <p className="text-gray-600">Dedicated teachers committed to providing personalized attention and guidance to every student.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-400">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Holistic Development</h3>
              <p className="text-gray-600">Focus on spiritual, emotional, and social development alongside academic achievement.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-500">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Modern Infrastructure</h3>
              <p className="text-gray-600">State-of-the-art facilities including smart classrooms and well-equipped laboratories.</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-600">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Safe Environment</h3>
              <p className="text-gray-600">Secure and nurturing environment that promotes learning and personal growth.</p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-700">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Prime Location</h3>
              <p className="text-gray-600">Conveniently located in Khurai with easy accessibility and peaceful surroundings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Glassmorphism */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our School Family
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover the difference that quality education and character development can make in your child's life. Be part of our legacy of excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300">
                  Learn More About Us
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300">
                  Contact Us Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

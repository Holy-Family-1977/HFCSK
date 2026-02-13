import Image from "next/image"
import AboutHero from "@/components/about-hero"
import { Card, CardContent } from "@/components/ui/card"
import AnimateOnScroll from "@/components/animate-on-scroll"
import SetApartCard from "@/components/set-apart-card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero with floating quick actions */}
      <AboutHero />

      {/* Intro: badge + copy + mosaic images */}
      <section className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid gap-10 md:grid-cols-[1.1fr,1fr] items-start">
          {/* Left: Badge + copy */}
          <AnimateOnScroll>
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 mb-5">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-teal-50 border-2 border-teal-600 grid place-content-center text-teal-700 font-extrabold">
                    <span className="text-base leading-tight">
                      Since
                      <br />
                      1990
                    </span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-teal-700 uppercase tracking-wider">
                  Celebrating 35+ Years
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                We nurture every learner to think, act, and grow with purpose
              </h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Holy Family Convent Sr. Sec. School is a vibrant community that blends academic rigor with values-based
                education. Our teachers design meaningful, hands-on learning experiences and cultivate a respectful,
                joyful culture where students support one another.
              </p>
              <p className="mt-3 text-gray-700 leading-relaxed">
                With strong partnerships among students, families, and educators, we prepare young people to lead with
                empathy, curiosity, and integrity. From rich classroom projects to co-curricular programs, our campus
                inspires growth in mind, heart, and spirit.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Right: Mosaic image column */}
          <AnimateOnScroll variant="zoom-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="./MainBensy.JPEG"
                  alt="Principal welcoming students"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image src="/school-activities.png" alt="Collaborative activities" fill className="object-cover" />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image src="/school-sports-day-fun.png" alt="Sports and teamwork" fill className="object-cover" />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* From Principal's Desk (content unchanged) */}
      <section className="container mx-auto px-4 py-10">
        <Card className="overflow-hidden shadow-[0_24px_80px_rgba(2,6,23,0.08)]">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h2 className="text-3xl font-bold text-center">From Principal&apos;s Desk</h2>
          </div>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/3">
                <Image
                  src="./DeskBensy.JPEG"
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
                    As the head of our esteemed institution, I am thrilled to extend my warmest greetings to all
                    students, parents, faculty, and visitors. This platform serves as a window into the heart of our
                    school, providing insights into our mission, vision, values and educational endeavors.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our school is more than just a place of learning; it's a vibrant community where ideas flourish,
                    talents are nurtured, and futures are shaped. We are committed to fostering an environment that
                    promotes academic excellence, personal growth, and character development. Our dedicated team of
                    educators works tirelessly to inspire and empower each student to reach their full potential.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    I encourage you to explore our website to discover the myriad opportunities available at our school.
                    From innovative curriculum offerings to extracurricular activities, we strive to provide a
                    well-rounded educational experience that prepares students for success in an ever-changing world.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    I invite you to connect with us, whether you're a prospective student, a proud parent, or an alumni
                    member. Together, we can continue to uphold the rich traditions and values that define our
                    institution.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Thank you for being a part of Holy Family. I look forward to embarking on this journey of growth and
                    discovery with you.
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
      </section>

      {/* Mission and Vision (content unchanged, updated styling) */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <AnimateOnScroll>
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
                  To prepare Holy Family students to be spiritually oriented and academically excellent — by promoting
                  holistic and integral development and also by providing quality education & technological support
                  relevant to all, in particular to the marginalized.
                </p>
              </CardContent>
            </Card>
          </AnimateOnScroll>

          <AnimateOnScroll delayMs={120}>
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
                  Create a world of enlightened and integrated citizens and mould ideal families by imparting knowledge
                  of God and value-based quality education.
                </p>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      {/* What Sets Us Apart? */}
      <section className="relative bg-[#EAF7F7] py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-8 w-px bg-teal-600 mx-auto mb-3" aria-hidden />
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">What Sets Us Apart?</h3>
          </div>

          <div className="grid gap-12">
            {/* Row 1 */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <AnimateOnScroll variant="fade-up">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/classroom-learning.png"
                    alt="Learner-centered classrooms"
                    width={1000}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </AnimateOnScroll>
              <SetApartCard
                title="Learner-Centered"
                body="Students are given agency and encouragement to explore ideas deeply. Our teachers facilitate inquiry, guide collaboration, and tailor feedback so every student is supported to achieve ambitious goals."
                align="right"
              />
            </div>

            {/* Row 2 */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <SetApartCard
                title="Active Learning"
                body="From labs and makerspaces to performing arts and athletics, learning is dynamic and engaging. We value experimentation, creativity, and reflection as part of everyday practice."
                align="left"
              />
              <AnimateOnScroll variant="fade-up">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/school-activities.png"
                    alt="Active learning experiences"
                    width={1000}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

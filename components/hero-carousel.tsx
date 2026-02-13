"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const slides = [
  {
    image: "/DSC_6546.jpg",
    caption: "Congratulations on Your Remarkable Journey!",
    description: "Celebrating our AISSCE 2024-25 Toppers",
    isAchievement: true,
  },
  {
    image: "/DSC_4868.jpg",
    caption: "Empowering Future Leaders",
    description: "Nurturing young minds to become tomorrow's leaders",
  },
  {
    image: "/DSC_9492.jpg",
    caption: "A Legacy of Excellence in Education",
    description: "Continuing our tradition of academic excellence since 1990",
  },
  {
    image: "/DSC_0877.jpg",
    caption: "Where Knowledge Meets Character",
    description: "Building character alongside academic achievement",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="hero-full relative h-[100svh] min-h-[560px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.isAchievement ? (
            // Achievement Banner Slide
            <div className="relative w-full h-full bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900">
              <Image
                src="/school-activities.jpg"
                alt="Achievement Banner"
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white">
                <p className="text-xl md:text-2xl font-medium italic max-w-4xl">
                  "May the Lord continue to guide your steps and bless you with wisdom, strength, and grace in all that
                  you pursue."
                </p>
              </div>
            </div>
          ) : (
            // Regular Slides
            <>
              {slide.video ? (
                <video
                  src={slide.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.caption}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              )}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 animate-fade-in">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{slide.caption}</h1>
                  <p className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md">{slide.description}</p>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

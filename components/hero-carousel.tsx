"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { HeroSlide, heroMediaUrl, toYoutubeEmbedUrl } from "@/lib/supabase/cms"

const fallbackSlides = [
  {
    id: "fallback-school-activities",
    type: "image",
    image: "/school-activities.JPG",
    caption: "",
    quote: '"May the Lord continue to guide your steps and bless you with wisdom, strength, and grace in all that you pursue."',
    isQuote: true,
  },
  {
    id: "fallback-toppers",
    type: "image",
    image: "./DSC_6546.JPG",
    caption: "Congratulations on Your Remarkable Journey!",
    description: "Celebrating our AISSCE 2024-25 Toppers",
  },
  {
    id: "fallback-leaders",
    type: "image",
    image: "./DSC_4868.JPG",
    caption: "Empowering Future Leaders",
    description: "Nurturing young minds to become tomorrow's leaders",
  },
  {
    id: "fallback-excellence",
    type: "image",
    image: "./DSC_0877.JPG",
    caption: "A Legacy of Excellence in Education",
    description: "Continuing our tradition of academic excellence since 1990",
  },
  {
    id: "fallback-character",
    type: "image",
    image: "./DSC_9492.JPG",
    caption: "Where Knowledge Meets Character",
    description: "Building character alongside academic achievement",
  },
]

type DisplaySlide = {
  id: string
  type: "image" | "video" | "youtube"
  mediaUrl: string
  caption: string
  description: string
  quote?: string
  isQuote?: boolean
}

function mapHeroSlide(slide: HeroSlide): DisplaySlide {
  return {
    id: slide.id,
    type: slide.type,
    mediaUrl: heroMediaUrl(slide),
    caption: slide.title ?? "",
    description: slide.subtitle ?? "",
  }
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<DisplaySlide[]>(
    fallbackSlides.map((slide) => ({
      id: slide.id,
      type: "image",
      mediaUrl: slide.image,
      caption: slide.caption,
      description: slide.description ?? "",
      quote: slide.quote,
      isQuote: slide.isQuote,
    })),
  )

  useEffect(() => {
    let cancelled = false

    const fetchSlides = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("hero_slides")
          .select("id, type, media_url, title, subtitle, order_index, created_at")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: true })

        if (!cancelled && !error && data && data.length > 0) {
          setSlides((data as HeroSlide[]).map(mapHeroSlide))
          setCurrentSlide(0)
        }
      } catch (error) {
        console.error("Failed to fetch hero slides:", error)
      }
    }

    void fetchSlides()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

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
          <div className="relative w-full h-full">
            {/* Full Image Background */}
            {slide.type === "video" ? (
              <video
                src={slide.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : slide.type === "youtube" ? (
              <iframe
                src={toYoutubeEmbedUrl(slide.mediaUrl)}
                title={slide.caption || "Hero video"}
                className="absolute inset-0 w-full h-full object-cover"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Image
                src={slide.mediaUrl || "/placeholder.svg"}
                alt={slide.caption}
                fill
                className="object-cover"
                priority={index === 0}
              />
            )}

            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content - Quote or Caption+Description */}
            {slide.isQuote ? (
              // Quote Slide
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white px-4 md:px-8 w-full max-w-5xl">
                <p className="text-xl md:text-2xl font-medium italic drop-shadow-lg">
                  {slide.quote}
                </p>
              </div>
            ) : (
              // Regular Slide with Caption and Description at Bottom
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 md:px-12 py-8 md:py-12">
                <div className="text-center text-white max-w-4xl mx-auto">
                  <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">{slide.caption}</h1>
                  <p className="text-lg md:text-xl font-medium italic drop-shadow-md">{slide.description}</p>
                </div>
              </div>
            )}
          </div>
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

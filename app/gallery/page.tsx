"use client"

import Image from "next/image"
import { useState } from "react"
import { X } from "lucide-react"

const galleryImages = [
  {
    id: 1,
    src: "/school-activities.png",
    alt: "School Activities",
  },
  {
    id: 2,
    src: "/classroom-learning.png",
    alt: "Smart Classroom Learning",
  },
  {
    id: 3,
    src: "/school-campus.png",
    alt: "School Campus",
  },
  {
    id: 4,
    src: "/school-sports-day-fun.png",
    alt: "Sports Day",
  },
  {
    id: 5,
    src: "/graduation-celebration.png",
    alt: "Graduation Celebration",
  },
  {
    id: 6,
    src: "/achievement-banner.png",
    alt: "Achievement Banner",
  },
  {
    id: 7,
    src: "/school-activities.png",
    alt: "Campus Life",
  },
  {
    id: 8,
    src: "/school-sports-day-fun.png",
    alt: "Sports Event",
  },
  {
    id: 9,
    src: "/classroom-learning.png",
    alt: "Learning Environment",
  },
]

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Gradient Header */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 py-16 md:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4">Gallery</h1>
          <p className="text-white/90 text-lg md:text-xl font-semibold drop-shadow-md">Explore our school's vibrant moments</p>
        </div>
      </div>

      {/* Gallery Grid Section */}
      <div className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
        {/* 3x3 Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-lg font-semibold">View</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-8 h-8 text-white" />
            </button>
            
            <div className="relative w-full h-[80vh] md:max-w-3xl">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation */}
            <div className="mt-6 text-white text-center">
              <p className="text-lg">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

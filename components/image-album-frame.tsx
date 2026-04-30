'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X, Folder } from 'lucide-react'

interface ImageAlbumProps {
  id: string
  primaryImage: {
    src: string
    alt: string
  }
  images: Array<{
    id: string
    src: string
    alt: string
  }>
  title: string
}

export default function ImageAlbumFrame({ id, primaryImage, images, title }: ImageAlbumProps) {
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    setSelectedImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1])
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    setSelectedImage(images[currentIndex === images.length - 1 ? 0 : currentIndex + 1])
  }

  const openAlbum = () => {
    if (images.length === 0) return
    setSelectedImage(images[0])
    setCurrentIndex(0)
  }

  return (
    <>
      <div
        className="relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        onClick={openAlbum}
      >
        <Image
          src={primaryImage.src}
          alt={primaryImage.alt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Folder Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Folder className="w-5 h-5 text-blue-600" />
          <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -translate-y-1 translate-x-1">
            {images.length}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="text-white text-lg font-semibold">View Album ({images.length})</div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-semibold text-sm md:text-base">{title}</p>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            {/* Image */}
            <div className="relative w-full h-[70vh] md:max-w-3xl">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation and Info */}
            <div className="mt-6 text-white text-center w-full max-w-3xl">
              <p className="text-lg mb-4">{selectedImage.alt}</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={goToPrevious}
                  className="px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  ← Previous
                </button>
                <p className="text-sm">
                  {currentIndex + 1} / {images.length}
                </p>
                <button
                  onClick={goToNext}
                  className="px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

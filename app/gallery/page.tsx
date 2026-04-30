"use client"

import { useEffect, useState } from "react"
import ImageAlbumFrame from "@/components/image-album-frame"
import VideoGallery from "@/components/video-gallery"
import { createClient } from "@/lib/supabase"
import { Album, galleryImageUrl } from "@/lib/supabase/cms"

const albumCollections = [
  {
    id: "school-activities",
    title: "School Activities",
    primaryImage: {
      src: "./DSC_1555.JPG",
      alt: "School Activities",
    },
    images: [
      { id: "1", src: "./DSC_1555.JPG", alt: "School Activity 1" },
      { id: "2", src: "./DSC_2532.JPG", alt: "School Activity 2" },
      { id: "3", src: "./DSC_4868.JPG", alt: "School Activity 3" },
    ],
  },
  {
    id: "sports-day",
    title: "Sports Day",
    primaryImage: {
      src: "./DSC_8510.JPG",
      alt: "Sports Day",
    },
    images: [
      { id: "1", src: "./DSC_8510.JPG", alt: "Sports Day 1" },
      { id: "2", src: "./DSC_0407.JPG", alt: "Sports Day 2" },
      { id: "3", src: "./DSC_8969.JPG", alt: "Sports Day 3" },
    ],
  },
  {
    id: "celebrations",
    title: "Celebrations",
    primaryImage: {
      src: "./DSC_1545.JPG",
      alt: "Celebrations",
    },
    images: [
      { id: "1", src: "./DSC_1545.JPG", alt: "Celebration 1" },
      { id: "2", src: "./DSC_9492.JPG", alt: "Celebration 2" },
      { id: "3", src: "./DSC_0771.JPG", alt: "Celebration 3" },
    ],
  },
  {
    id: "campus-life",
    title: "Campus Life",
    primaryImage: {
      src: "./DSC_0771.JPG",
      alt: "Campus Life",
    },
    images: [
      { id: "1", src: "./DSC_0771.JPG", alt: "Campus Life 1" },
      { id: "2", src: "./DSC_0407.JPG", alt: "Campus Life 2" },
      { id: "3", src: "./DSC_1555.JPG", alt: "Campus Life 3" },
    ],
  },
  {
    id: "learning-environment",
    title: "Learning Environment",
    primaryImage: {
      src: "./DSC_2532.JPG",
      alt: "Learning Environment",
    },
    images: [
      { id: "1", src: "./DSC_2532.JPG", alt: "Learning 1" },
      { id: "2", src: "./DSC_4868.JPG", alt: "Learning 2" },
      { id: "3", src: "./DSC_9492.JPG", alt: "Learning 3" },
    ],
  },
  {
    id: "achievements",
    title: "Achievements",
    primaryImage: {
      src: "./DSC_9492.JPG",
      alt: "Achievements",
    },
    images: [
      { id: "1", src: "./DSC_9492.JPG", alt: "Achievement 1" },
      { id: "2", src: "./DSC_8510.JPG", alt: "Achievement 2" },
      { id: "3", src: "./DSC_1545.JPG", alt: "Achievement 3" },
    ],
  },
]

type GalleryAlbum = {
  id: string
  title: string
  primaryImage: {
    src: string
    alt: string
  }
  images: Array<{
    id: string
    src: string
    alt: string
  }>
}

function mapAlbum(album: Album): GalleryAlbum | null {
  const images = (album.album_images ?? [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((image, index) => ({
      id: image.id,
      src: galleryImageUrl(image.image_url),
      alt: `${album.title} ${index + 1}`,
    }))

  const cover = album.cover_image
    ? galleryImageUrl(album.cover_image)
    : images[0]?.src

  if (!cover) return null

  return {
    id: album.id,
    title: album.title,
    primaryImage: {
      src: cover,
      alt: album.title,
    },
    images,
  }
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(albumCollections)

  useEffect(() => {
    let cancelled = false

    const fetchAlbums = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("albums")
          .select(
            "id, title, cover_image, created_at, album_images(id, album_id, image_url, order_index, created_at)",
          )
          .order("created_at", { ascending: false })

        if (!cancelled && !error && data && data.length > 0) {
          const mapped = (data as Album[]).map(mapAlbum).filter(Boolean) as GalleryAlbum[]
          if (mapped.length > 0) {
            setAlbums(mapped)
          }
        }
      } catch (error) {
        console.error("Failed to fetch albums:", error)
      }
    }

    void fetchAlbums()

    return () => {
      cancelled = true
    }
  }, [])

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

      {/* Photo Gallery Grid Section */}
      <div className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Photo Albums</h2>
            <p className="text-center text-gray-600 text-lg">Click on any album to view all photos inside</p>
          </div>
          {/* Album Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {albums.map((album) => (
              <ImageAlbumFrame
                key={album.id}
                id={album.id}
                primaryImage={album.primaryImage}
                images={album.images}
                title={album.title}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Gallery Section */}
      <VideoGallery />
    </div>
  )
}

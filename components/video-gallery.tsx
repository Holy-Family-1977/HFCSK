'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { Play } from 'lucide-react'

const videos = [
  {
    id: 1,
    title: 'School Opening Ceremony',
    thumbnail: './DSC_1555.JPG',
    videoUrl: 'https://youtu.be/nUulPyn8XuE?si=WLaMItfmSyjbzGRC',
  },
  {
    id: 2,
    title: 'Sports Day Highlights',
    thumbnail: './DSC_8510.JPG',
    videoUrl: 'https://youtu.be/XBHZr5Azo4I?si=TSUGLO115E8agDn2',
  },
  {
    id: 3,
    title: 'Kids Day',
    thumbnail: './DSC_4868.JPG',
    videoUrl: 'https://youtu.be/38J89e_7K98?si=wiFX4rvyTIs1dKar',
  },
]

const photoGalleries = [
  {
    id: 1,
    title: 'Classroom Moments',
    images: ['./DSC_2532.JPG', './DSC_1545.JPG'],
  },
  {
    id: 2,
    title: 'School Events',
    images: ['./DSC_9492.JPG', './DSC_0771.JPG'],
  },
  {
    id: 3,
    title: 'Campus Life',
    images: ['./DSC_0407.JPG', './DSC_8969.JPG'],
  },
]

const magazines = [
  {
    id: 1,
    title: 'School Magazine 2024',
    cover: './DSC_1555.JPG',
    pages: 45,
  },
  {
    id: 2,
    title: 'Alumni Newsletter',
    cover: './DSC_4868.JPG',
    pages: 32,
  },
  {
    id: 3,
    title: 'Annual Report',
    cover: './DSC_8510.JPG',
    pages: 60,
  },
]

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0])

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Media Center</h2>
          <p className="text-lg text-gray-600">Explore our videos, photos, and magazines</p>
        </div>

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="videos" className="text-base">Videos</TabsTrigger>
            <TabsTrigger value="photos" className="text-base">Photos</TabsTrigger>
            <TabsTrigger value="magazines" className="text-base">Magazines</TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Video Player */}
              <div className="md:col-span-2">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-4">{selectedVideo.title}</h3>
              </div>

              {/* Video Playlist */}
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-900">Playlist</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedVideo.id === video.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="font-semibold text-sm">{video.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-8">
            <div className="grid gap-8">
              {photoGalleries.map((gallery) => (
                <div key={gallery.id}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{gallery.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.images.map((image, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <Image
                          src={image}
                          alt={`${gallery.title} ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Magazines Tab */}
          <TabsContent value="magazines" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {magazines.map((magazine) => (
                <div key={magazine.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                    <Image
                      src={magazine.cover}
                      alt={magazine.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 rounded-full p-4">
                        <Play className="w-8 h-8 text-blue-600 fill-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{magazine.title}</h3>
                    <p className="text-sm text-gray-600">{magazine.pages} Pages</p>
                    <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                      View Magazine
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

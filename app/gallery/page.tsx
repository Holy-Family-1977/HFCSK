"use client"

import GalleryHero from "@/components/gallery-hero"
import ChromaGrid from "@/components/chroma-grid"

const items = [
  {
    image: "/school-activities.png",
    title: "Activities",
    subtitle: "Clubs, arts, and events",
    handle: "#CampusLife",
    borderColor: "#2563EB",
    gradient: "linear-gradient(165deg, #2563EB, #0B1220)",
    url: "/gallery",
  },
  {
    image: "/classroom-learning.png",
    title: "Smart Classroom",
    subtitle: "Interactive learning spaces",
    handle: "#Learning",
    borderColor: "#1D4ED8",
    gradient: "linear-gradient(180deg, #1D4ED8, #0B1220)",
    url: "/about",
  },
  {
    image: "/school-campus.png",
    title: "Campus",
    subtitle: "Green, modern, inspiring",
    handle: "#OurCampus",
    borderColor: "#0EA5E9",
    gradient: "linear-gradient(145deg, #0EA5E9, #111827)",
    url: "/about",
  },
  {
    image: "/school-sports-day-fun.png",
    title: "Sports Day",
    subtitle: "Spirit and teamwork",
    handle: "#Sports",
    borderColor: "#06B6D4",
    gradient: "linear-gradient(195deg, #06B6D4, #0B1220)",
    url: "/gallery",
  },
  {
    image: "/graduation-celebration.png",
    title: "Graduation",
    subtitle: "Proud achievements",
    handle: "#Milestones",
    borderColor: "#22D3EE",
    gradient: "linear-gradient(225deg, #22D3EE, #0B1220)",
    url: "/gallery",
  },
  {
    image: "/achievement-banner.png",
    title: "AISSCE Toppers",
    subtitle: "Celebrating excellence",
    handle: "#Honors",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6, #0B1220)",
    url: "/gallery",
  },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Animated hero */}
      <GalleryHero />

      {/* Themed grid */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-10">
          <div className="relative h-[68vh] lg:h-[60vh]">
            <ChromaGrid
              items={items}
              radius={320}
              columns={3}
              rows={2}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

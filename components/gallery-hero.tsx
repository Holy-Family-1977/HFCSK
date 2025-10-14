"use client"

import Image from "next/image"
import AnimateOnScroll from "./animate-on-scroll"

export default function GalleryHero() {
  return (
    <section className="relative h-[52vh] min-h-[360px] overflow-hidden bg-white">
      <Image
        src="/school-activities.png"
        alt="Students enjoying activities"
        fill
        priority
        className="object-cover animate-kenburns"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-900/20 to-white/0" />
      {/* Floating stickers */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-8 top-10 h-6 w-6 rounded-full bg-white/60 animate-float-slow" />
        <span className="absolute right-10 top-16 h-4 w-4 rounded-full bg-blue-300/70 animate-float" />
        <span className="absolute left-1/2 bottom-10 h-5 w-5 -translate-x-1/2 rounded-full bg-cyan-300/70 animate-float-slow" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <AnimateOnScroll variant="fade-in">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow">Gallery</h1>
            <p className="mt-3 text-lg md:text-xl max-w-2xl mx-auto drop-shadow">
              Glimpses of learning, teamwork, and joyful celebrations on our campus.
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Soft wave */}
      <svg className="absolute bottom-0 left-0 w-full h-10 text-white" preserveAspectRatio="none" viewBox="0 0 1440 80">
        <path fill="currentColor" d="M0,40 C240,0 480,0 720,40 C960,80 1200,80 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </section>
  )
}

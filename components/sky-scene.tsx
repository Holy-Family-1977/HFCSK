"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import AnimateOnScroll from "./animate-on-scroll"

export default function SkyScene() {
  return (
    <section aria-label="Where Knowledge Meets Character" className="relative overflow-hidden">
      {/* Full-section animated sky background */}
      <BackgroundSky />

      {/* Foreground content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 h-screen flex flex-col items-center justify-end pb-16 md:pb-24">
        <AnimateOnScroll variant="fade-in">
          <div className="mx-auto max-w-3xl glass rounded-3xl p-7 md:p-10 border-white/50 shadow-xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/60 shadow-sm mb-3">
              <span className="text-xs font-semibold tracking-wide text-blue-900 uppercase">
                Where Knowledge Meets Character
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-blue-900 animate-heading-reveal">
              A joyful place to learn, grow, and shine
            </h2>

            <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed mt-4 animate-content-rise">
              A warm and welcoming environment designed for curious minds. We balance energetic, creative learning for
              students with a professional, trustworthy experience for parents and educators.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/about" className="group">
                <Button className="relative bg-blue-700 hover:bg-blue-800 transition-transform duration-300 hover:-translate-y-0.5">
                  <span className="relative z-10">Explore Our Mission</span>
                </Button>
              </Link>
              <Link href="/gallery" className="group">
                <Button
                  variant="outline"
                  className="relative bg-white hover:bg-white border-gray-300 text-gray-900 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">See Campus Life</span>
                </Button>
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Soft bottom wave divider blending to white content below */}
      <svg
        className="pointer-events-none block w-full h-10 text-white -mb-1 relative z-10"
        preserveAspectRatio="none"
        viewBox="0 0 1440 80"
      >
        <path fill="currentColor" d="M0,64 C240,16 480,16 720,64 C960,112 1200,112 1440,64 L1440,80 L0,80 Z" />
      </svg>
    </section>
  )
}

/* ===== Background sky, sun, clouds, birds (cover entire section) ===== */
function BackgroundSky() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Solid sky color */}
      <div className="absolute inset-0 bg-[#EAF4FF]" />

      {/* Sun with glow */}
      <div
        aria-hidden
        className="absolute left-6 md:left-16 top-6 md:top-8 w-28 h-28 md:w-40 md:h-40 rounded-full bg-yellow-300 shadow-[0_0_80px_rgba(250,204,21,0.45)] animate-sun-glow"
      />

      {/* Cloud rows sweeping across with wide loops */}
      <CloudRow className="absolute top-10 left-[-15%] w-[130%] animate-cloud-wide-slow" size="md" />
      <CloudRow className="absolute top-24 left-[-10%] w-[125%] animate-cloud-wide-med" size="sm" />
      <CloudRow className="absolute top-40 left-[-25%] w-[150%] animate-cloud-wide-fast" size="lg" />

      {/* A second band lower for depth */}
      <CloudRow className="absolute bottom-24 left-[-20%] w-[140%] animate-cloud-wide-med" size="md" />
      <CloudRow className="absolute bottom-10 left-[-12%] w-[125%] animate-cloud-wide-slow" size="sm" />

      {/* Birds sweeping across */}
      <BirdSweep className="hidden md:block absolute top-28 left-0 animate-bird-sweep-1" />
      <BirdSweep className="hidden md:block absolute top-44 left-0 animate-bird-sweep-2" />

      {/* Top-to-bottom subtle vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.35),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  )
}

function Cloud({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <div className="relative w-28 h-10 bg-white rounded-full shadow-sm">
        <span className="absolute -top-3 left-3 w-8 h-8 bg-white rounded-full" />
        <span className="absolute -top-4 left-10 w-10 h-10 bg-white rounded-full" />
        <span className="absolute -top-2 left-[72px] w-8 h-8 bg-white rounded-full" />
      </div>
    </div>
  )
}

function CloudRow({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? 0.85 : size === "lg" ? 1.25 : 1
  return (
    <div className={className} style={{ transform: `scale(${scale})` }}>
      <div className="flex items-center justify-between px-6">
        <Cloud />
        <Cloud className="scale-75" />
        <Cloud className="scale-110" />
        <Cloud className="scale-90" />
        <Cloud className="scale-100" />
      </div>
    </div>
  )
}

function BirdSweep({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      {/* minimalist bird "V" */}
      <div className="w-6 h-6 rotate-12">
        <div className="w-6 h-6 relative">
          <span className="absolute inset-0 border-t-2 border-black/25 rounded-full -rotate-12" />
          <span className="absolute inset-0 border-t-2 border-black/25 rounded-full rotate-12" />
        </div>
      </div>
    </div>
  )
}

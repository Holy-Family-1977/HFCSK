"use client"

import type React from "react"

import AnimateOnScroll from "./animate-on-scroll"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"

export default function SkyScene() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.querySelectorAll<HTMLElement>("[data-depth]").forEach((node) => {
      const depth = Number(node.dataset.depth || 0)
      const dx = px * depth * 36
      const dy = py * depth * 18
      node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    })
  }

  const handleMouseLeave = () => {
    const el = sectionRef.current
    if (!el) return
    el.querySelectorAll<HTMLElement>("[data-depth]").forEach((node) => {
      node.style.transform = "translate3d(0,0,0)"
    })
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Welcome band"
      className="relative overflow-hidden"
    >
      {/* Solid sky background */}
      <div className="relative w-full">
        <div className="h-56 md:h-72 lg:h-80 bg-[#EAF4FF]" />

        {/* Solid sun */}
        <div
          aria-hidden
          className="absolute left-6 md:left-16 -top-8 md:-top-10 w-28 h-28 md:w-40 md:h-40 rounded-full bg-yellow-300 shadow-[0_0_80px_rgba(250,204,21,0.45)] animate-sun-glow"
        />

        {/* Animated stars (solid subtle dots drifting diagonally) */}
        <Stars className="absolute inset-0 pointer-events-none" />

        {/* Layered solid clouds with wide sweeps and parallax */}
        <CloudRow className="absolute top-6 left-[-15%] w-[130%] animate-cloud-wide-slow" size="md" depth={0.05} />
        <CloudRow className="absolute top-16 left-[-10%] w-[125%] animate-cloud-wide-med" size="sm" depth={0.08} />
        <CloudRow className="absolute top-[92px] left-[-25%] w-[150%] animate-cloud-wide-fast" size="lg" depth={0.03} />

        {/* Bird sweeps */}
        <BirdSweep className="hidden md:block absolute top-16 left-0 animate-bird-sweep-1" />
        <BirdSweep className="hidden md:block absolute top-28 left-0 animate-bird-sweep-2" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 -mt-12 md:-mt-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: animated media frame (keeps your image) */}
          <AnimateOnScroll variant="fade-in">
            <div
              className="relative rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/70 bg-white/40 backdrop-blur-md"
              data-depth="0.04"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src="/classroom-learning.png"
                  alt="Campus life"
                  fill
                  priority
                  className="object-cover will-change-transform animate-kenburns"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.10)_100%)]" />
              </div>
              {/* subtle gloss */}
              <div className="pointer-events-none absolute -top-32 -left-24 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
            </div>
          </AnimateOnScroll>

          {/* Right: glass content (solid colors, cleaner label) */}
          <AnimateOnScroll variant="fade-in">
            <div className="glass rounded-3xl p-7 md:p-10 border-white/50 shadow-xl relative overflow-hidden">
              {/* Decorative floating blocks (solid) */}
              <div
                className="absolute -right-6 -top-6 w-10 h-10 bg-blue-200/80 rounded-md animate-float-slow"
                data-depth="0.1"
              />
              <div
                className="absolute -left-5 top-3 w-8 h-8 bg-purple-200/80 rounded-md animate-float-slow animation-delay-300"
                data-depth="0.08"
              />

              <div className="flex flex-col gap-3 text-center lg:text-left">
                <div className="inline-flex items-center mx-auto lg:mx-0 gap-2 bg-white/60 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/60 shadow-sm">
                  <span className="text-xs font-semibold tracking-wide text-blue-900 uppercase">
                    Where Knowledge Meets Character
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-blue-900 animate-heading-reveal">
                  A joyful place to learn, grow, and shine
                </h2>

                <p className="max-w-3xl text-gray-700 leading-relaxed mx-auto lg:mx-0 animate-content-rise">
                  A warm and welcoming environment designed for curious minds. We balance energetic, creative learning
                  for students with a professional, trustworthy experience for parents and educators.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
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
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Bottom wave divider */}
      <svg
        className="pointer-events-none block w-full h-10 text-white -mb-1"
        preserveAspectRatio="none"
        viewBox="0 0 1440 80"
      >
        <path fill="currentColor" d="M0,64 C240,16 480,16 720,64 C960,112 1200,112 1440,64 L1440,80 L0,80 Z" />
      </svg>
    </section>
  )
}

/* ====== Decorative elements ====== */

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

function CloudRow({
  className,
  size = "md",
  depth = 0.06,
}: {
  className?: string
  size?: "sm" | "md" | "lg"
  depth?: number
}) {
  const scale = size === "sm" ? 0.85 : size === "lg" ? 1.25 : 1
  return (
    <div className={className} data-depth={depth} style={{ transform: `scale(${scale})` }}>
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
          <span className="absolute inset-0 border-t-2 border-black/30 rounded-full -rotate-12" />
          <span className="absolute inset-0 border-t-2 border-black/30 rounded-full rotate-12" />
        </div>
      </div>
    </div>
  )
}

function Stars({ className = "" }: { className?: string }) {
  // A few drifting dots; solid-color, subtle
  return (
    <div className={className}>
      <span className="absolute left-[10%] top-[20%] w-1 h-1 rounded-full bg-blue-300 animate-star-drift" />
      <span className="absolute left-[40%] top-[35%] w-1 h-1 rounded-full bg-indigo-300 animate-star-drift delay-200" />
      <span className="absolute left-[70%] top-[25%] w-1 h-1 rounded-full bg-cyan-300 animate-star-drift delay-300" />
      <span className="absolute left-[30%] top-[10%] w-1 h-1 rounded-full bg-blue-300 animate-star-drift delay-500" />
      <span className="absolute left-[85%] top-[15%] w-1 h-1 rounded-full bg-indigo-300 animate-star-drift delay-700" />
    </div>
  )
}

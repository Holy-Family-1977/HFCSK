"use client"

import type React from "react"

import Image from "next/image"
import { useCallback, useRef } from "react"
import AnimateOnScroll from "./animate-on-scroll"
import { useScrollParallax } from "@/hooks/use-scroll-parallax"

type Card = {
  src: string
  title: string
  tag?: string
  color: string // solid accent behind the card
}

const CARDS: Card[] = [
  { src: "/school-activities.png", title: "Activities", tag: "FEATURED", color: "#FDE68A" },
  { src: "/school-campus.png", title: "Campus", tag: "EARLY BIRD", color: "#FBCFE8" },
  { src: "/classroom-learning.png", title: "Smart Classroom", tag: "NEW", color: "#BFDBFE" },
]

export default function CampusGrid() {
  return (
    <section aria-label="Glimpses of Campus Life" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimateOnScroll className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Glimpses of Campus Life</h3>
          <p className="text-gray-600 mt-2">Energetic, creative, and collaborative moments</p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-7">
          {CARDS.map((c, i) => (
            <AnimateOnScroll key={c.title} variant="fade-up" delayMs={120 * i}>
              <CampusCard {...c} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

function CampusCard({ src, title, tag, color }: Card) {
  const { ref, style } = useScrollParallax(18)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = wrapperRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateX(${py * -6}deg) rotateY(${px * 6}deg)`
  }, [])

  const onLeave = () => {
    const el = wrapperRef.current
    if (!el) return
    el.style.transform = "rotateX(0) rotateY(0)"
  }

  return (
    <div className="relative">
      {/* Offset solid accent behind */}
      <div
        aria-hidden
        className="absolute -inset-2 rounded-[28px] -z-10"
        style={{ backgroundColor: color, transform: "rotate(-2.5deg)" }}
      />
      {/* Inner card */}
      <div
        ref={wrapperRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="transition-transform duration-200 [transform-style:preserve-3d]"
      >
        <div className="rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200 bg-white">
          <div className="relative aspect-[16/10] will-change-transform" ref={ref as any} style={style}>
            <Image
              src={src || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-[1.03]"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            {/* Corner badges */}
            {tag && (
              <div className="absolute left-3 bottom-3 flex gap-2">
                <span className="px-2 py-1 rounded-full bg-purple-800 text-white text-[10px] font-bold shadow">
                  {tag}
                </span>
              </div>
            )}
          </div>
          <div className="p-5">
            <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          </div>
        </div>
      </div>
    </div>
  )
}

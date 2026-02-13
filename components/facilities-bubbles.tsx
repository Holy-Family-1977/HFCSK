"use client"

import { BookMarked, Shield, Gamepad2, MonitorSmartphone, Flower2, Leaf } from "lucide-react"
import AnimateOnScroll from "./animate-on-scroll"
import { cn } from "@/lib/utils"
import { useScrollParallax } from "@/hooks/use-scroll-parallax"
import { useState } from "react"

type Facility = {
  title: string
  description: string
  color: string
  icon: "book" | "shield" | "play" | "monitor"
}

const facilities: Facility[] = [
  {
    title: "School Library",
    description: "Well-equipped library curated for every learner.",
    color: "#155E75",
    icon: "book",
  },
  {
    title: "Playground",
    description: "Spacious, safe areas for sports and activities.",
    color: "#065F46",
    icon: "play",
  },
  {
    title: "Safe & Security",
    description: "Robust safety protocol and secure campus.",
    color: "#1F2937",
    icon: "shield",
  },
  {
    title: "Digital Classroom",
    description: "Smart-class enabled rooms for immersive learning.",
    color: "#1D4ED8",
    icon: "monitor",
  },
]

function Icon({ name, className }: { name: Facility["icon"]; className?: string }) {
  switch (name) {
    case "book":
      return <BookMarked className={className} />
    case "shield":
      return <Shield className={className} />
    case "play":
      return <Gamepad2 className={className} />
    case "monitor":
      return <MonitorSmartphone className={className} />
  }
}

export default function FacilitiesBubbles() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  return (
    <section
      aria-label="Facilities"
      className="relative py-16 md:py-20 bg-white overflow-hidden"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setMouse({ x, y })
      }}
    >
      {/* Mouse-inverse flowers */}
      <Flower x={mouse.x} y={mouse.y} className="left-6 top-10" scale={1} />
      <Flower x={mouse.x} y={mouse.y} className="right-8 top-20" scale={0.9} delay={150} />
      <Flower x={mouse.x} y={mouse.y} className="left-1/2 -translate-x-1/2 top-8" scale={0.8} delay={300} />

      <div className="container mx-auto px-4">
        <AnimateOnScroll variant="fade-up" className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Facilities that Inspire</h3>
          <p className="text-gray-600 mt-2">Spaces crafted for curiosity, play, and focused learning</p>
        </AnimateOnScroll>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {facilities.map((f, i) => (
            <AnimateOnScroll key={f.title} variant="fade-up" delayMs={120 * i}>
              <FacilityColumn {...f} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

function FacilityColumn({ title, description, color, icon }: Facility) {
  const { ref, style } = useScrollParallax(16)

  return (
    <div
      className={cn(
        "group relative rounded-3xl bg-white border border-gray-200 overflow-hidden",
        "shadow-[0_14px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-shadow",
      )}
    >
      {/* Top media zone replaced by icon with scroll parallax */}
      <div className="h-52 flex items-center justify-center" ref={ref as any} style={style}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-inner"
          style={{ backgroundColor: color }}
        >
          <Icon name={icon} className="w-10 h-10" />
        </div>
      </div>

      {/* Solid lower panel */}
      <div className="px-6 pb-8 pt-5">
        <h4 className="text-xl font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600 mt-1.5">{description}</p>
        <div
          className="mt-4 h-1 w-0 group-hover:w-full transition-all duration-500"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function Flower({
  x,
  y,
  className,
  scale = 1,
  delay = 0,
}: {
  x: number
  y: number
  className?: string
  scale?: number
  delay?: number
}) {
  const invX = -x * 24
  const invY = -y * 24
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute", className)}
      style={{
        transform: `translate(${invX}px, ${invY}px) scale(${scale})`,
        transition: `transform 180ms ease ${delay}ms`,
      }}
    >
      <div className="relative">
        <div className="absolute -left-5 -top-4 w-10 h-10 rounded-full bg-pink-200 blur"></div>
        <Flower2 className="w-7 h-7 text-pink-500" />
        <Leaf className="w-5 h-5 text-emerald-600 absolute -right-3 -bottom-3" />
      </div>
    </div>
  )
}

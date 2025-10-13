"use client"

import { BookMarked, Shield, Gamepad2, MonitorSmartphone, Flower2, Leaf, Sparkles, Star, Zap } from "lucide-react"
import AnimateOnScroll from "./animate-on-scroll"
import { cn } from "@/lib/utils"
import { useScrollParallax } from "@/hooks/use-scroll-parallax"
import { useState, useEffect } from "react"

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
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; left: string; delay: number; duration: number }>>([])

  useEffect(() => {
    const elements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 8
    }))
    setFloatingElements(elements)
  }, [])

  return (
    <section
      aria-label="Facilities"
      className="relative py-16 md:py-24 lg:py-28 bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50 overflow-hidden"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setMouse({ x, y })
      }}
    >
      {/* Floating Bubbles Background */}
      {floatingElements.map((elem) => (
        <div
          key={elem.id}
          className="absolute w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 backdrop-blur-sm animate-float-bubble"
          style={{
            left: elem.left,
            top: `${(elem.id * 8) % 100}%`,
            animationDelay: `${elem.delay}s`,
            animationDuration: `${elem.duration}s`
          }}
        />
      ))}

      {/* Decorative Elements */}
      <Sparkles className="absolute top-12 left-[10%] w-8 h-8 text-yellow-400 animate-pulse" style={{ animationDelay: '0s' }} />
      <Star className="absolute top-20 right-[15%] w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <Zap className="absolute bottom-32 left-[20%] w-10 h-10 text-purple-400 animate-bounce" style={{ animationDelay: '1s' }} />
      <Sparkles className="absolute bottom-20 right-[12%] w-7 h-7 text-blue-400 animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Mouse-inverse flowers */}
      <Flower x={mouse.x} y={mouse.y} className="left-6 top-10 hidden md:block" scale={1} />
      <Flower x={mouse.x} y={mouse.y} className="right-8 top-20 hidden md:block" scale={0.9} delay={150} />
      <Flower x={mouse.x} y={mouse.y} className="left-1/2 -translate-x-1/2 top-8 hidden lg:block" scale={0.8} delay={300} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimateOnScroll variant="fade-up" className="text-center mb-12 md:mb-16">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3">
            Facilities that Inspire
          </h3>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl mt-3 max-w-2xl mx-auto">
            Spaces crafted for curiosity, play, and focused learning
          </p>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {facilities.map((f, i) => (
            <AnimateOnScroll key={f.title} variant="fade-up" delayMs={120 * i}>
              <FacilityColumn {...f} index={i} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

function FacilityColumn({ title, description, color, icon, index }: Facility & { index: number }) {
  const { ref, style } = useScrollParallax(20)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative rounded-3xl bg-white/80 backdrop-blur-md border-2 border-white/50 overflow-hidden",
        "shadow-[0_14px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)]",
        "transition-all duration-500 hover:scale-105 hover:-translate-y-2",
        "before:absolute before:inset-0 before:rounded-3xl before:p-[2px] before:bg-gradient-to-br",
        "before:from-blue-400 before:via-purple-400 before:to-pink-400 before:opacity-0",
        "hover:before:opacity-100 before:transition-opacity before:duration-500"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-pink-100/40 animate-blob-slow" />
      </div>

      {/* Top media zone with animated icon */}
      <div className="h-52 sm:h-56 md:h-52 flex items-center justify-center relative" ref={ref as any} style={style}>
        <div
          className={cn(
            "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-white shadow-lg",
            "transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
            "animate-float-slow"
          )}
          style={{
            backgroundColor: color,
            animationDelay: `${index * 0.2}s`
          }}
        >
          <Icon name={icon} className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-500",
            isHovered && "animate-icon-wiggle"
          )} />
        </div>

        {/* Sparkle effects on hover */}
        {isHovered && (
          <>
            <Sparkles className="absolute top-8 left-8 w-5 h-5 text-yellow-400 animate-ping" />
            <Sparkles className="absolute bottom-8 right-8 w-4 h-4 text-pink-400 animate-ping" style={{ animationDelay: '0.2s' }} />
            <Star className="absolute top-12 right-12 w-4 h-4 text-blue-400 animate-ping" style={{ animationDelay: '0.4s' }} />
          </>
        )}
      </div>

      {/* Content panel */}
      <div className="px-5 sm:px-6 pb-7 sm:pb-8 pt-5 relative">
        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {title}
        </h4>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
        <div
          className="mt-4 h-1 rounded-full w-0 group-hover:w-full transition-all duration-700 shadow-lg"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Bubble decorations */}
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-16 left-4 w-2 h-2 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 right-8 w-2.5 h-2.5 rounded-full bg-white/35 animate-pulse" style={{ animationDelay: '1s' }} />
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
  const invX = -x * 30
  const invY = -y * 30
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute animate-float-slow", className)}
      style={{
        transform: `translate(${invX}px, ${invY}px) scale(${scale})`,
        transition: `transform 200ms ease ${delay}ms`,
      }}
    >
      <div className="relative">
        <div className="absolute -left-6 -top-5 w-12 h-12 rounded-full bg-pink-300/40 blur-md animate-pulse"></div>
        <Flower2 className="w-8 h-8 text-pink-500 animate-pulse" />
        <Leaf className="w-6 h-6 text-emerald-500 absolute -right-3 -bottom-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  )
}

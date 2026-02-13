"use client"

import type React from "react"

import { useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  maxTilt?: number
}

export default function TiltCard({ src, alt, width = 420, height = 280, className, maxTilt = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (py - 0.5) * maxTilt
    const ry = (px - 0.5) * -maxTilt
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "rotateX(0deg) rotateY(0deg)"
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-200 [transform-style:preserve-3d]",
        "hover:shadow-2xl bg-white/70 backdrop-blur border border-white/50",
        className,
      )}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  )
}

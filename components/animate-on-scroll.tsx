"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Variant = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom-in"

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  variant?: Variant
  delayMs?: number
  once?: boolean
}

export default function AnimateOnScroll({
  children,
  className,
  variant = "fade-up",
  delayMs = 0,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const base =
    "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform will-change-opacity"
  const hiddenMap: Record<Variant, string> = {
    "fade-up": "opacity-0 translate-y-8",
    "fade-in": "opacity-0",
    "slide-left": "opacity-0 -translate-x-8",
    "slide-right": "opacity-0 translate-x-8",
    "zoom-in": "opacity-0 scale-95",
  }
  const visibleMap: Record<Variant, string> = {
    "fade-up": "opacity-100 translate-y-0",
    "fade-in": "opacity-100",
    "slide-left": "opacity-100 translate-x-0",
    "slide-right": "opacity-100 translate-x-0",
    "zoom-in": "opacity-100 scale-100",
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(base, visible ? visibleMap[variant] : hiddenMap[variant], className)}
    >
      {children}
    </div>
  )
}

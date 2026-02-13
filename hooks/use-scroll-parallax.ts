"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

export function useScrollParallax(intensity = 22) {
  const ref = useRef<HTMLElement | null>(null)
  const [y, setY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh / 2 - (r.top + r.height / 2)) / (vh / 2)
      setY(progress * intensity)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [intensity])

  return { ref, style: { transform: `translateY(${y}px)` } as React.CSSProperties }
}

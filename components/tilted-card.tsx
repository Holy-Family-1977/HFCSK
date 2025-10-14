"use client"

import type React from "react"
import Image from "next/image"
import { useRef } from "react"
import { cn } from "@/lib/utils"

export interface TiltedCardProps {
  imageSrc: string
  altText: string
  captionText?: string
  containerHeight?: string
  containerWidth?: string
  imageHeight?: string
  imageWidth?: string
  rotateAmplitude?: number
  scaleOnHover?: number
  showMobileWarning?: boolean
  showTooltip?: boolean
  displayOverlayContent?: boolean
  overlayContent?: React.ReactNode
  className?: string
  overlayClassName?: string
}

export default function TiltedCard({
  imageSrc,
  altText,
  captionText,
  containerHeight = "300px",
  containerWidth = "300px",
  imageHeight = "300px",
  imageWidth = "300px",
  rotateAmplitude = 12,
  scaleOnHover = 1.12,
  showMobileWarning = false,
  showTooltip = true,
  displayOverlayContent = true,
  overlayContent,
  className,
  overlayClassName,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const rx = py * -rotateAmplitude
    const ry = px * rotateAmplitude
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scaleOnHover})`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)"
  }

  const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)

  return (
    <div
      className={cn(
        "relative select-none",
        "rounded-3xl bg-white/70 backdrop-blur border border-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.08)]",
        "transition-transform duration-200 [transform-style:preserve-3d]",
        className,
      )}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <div
        ref={ref}
        className="relative w-full h-full rounded-3xl overflow-hidden"
        onMouseMove={isTouch ? undefined : onMove}
        onMouseLeave={isTouch ? undefined : onLeave}
      >
        {/* Media */}
        <div className="absolute inset-0">
          <Image
            src={imageSrc || "/placeholder.svg?height=300&width=300&query=school campus"}
            alt={altText}
            fill
            sizes="(min-width: 1024px) 300px, 45vw"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* Gradient gloss */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_20%,rgba(0,0,0,0.35)_100%)]" />

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute left-3 top-3 z-10">
            <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-gray-800 border border-white/60 shadow-sm">
              Hover to explore
            </span>
          </div>
        )}

        {/* Caption */}
        {captionText && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur px-3 py-1.5 rounded-full border border-white/70 shadow">
              <span className="text-sm font-semibold text-gray-900">{captionText}</span>
            </div>
          </div>
        )}

        {/* Overlay content */}
        {displayOverlayContent && overlayContent && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity",
              overlayClassName,
            )}
          >
            <div className="rounded-2xl bg-white/85 backdrop-blur px-4 py-2 text-sm font-medium text-gray-900 border border-white/70 shadow">
              {overlayContent}
            </div>
          </div>
        )}
      </div>

      {/* Mobile hint */}
      {showMobileWarning && isTouch && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <span className="text-[11px] text-gray-700 bg-white/90 border border-white/70 rounded-full px-2 py-0.5">
            Tap and hold to preview
          </span>
        </div>
      )}
    </div>
  )
}

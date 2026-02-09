"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import ImageLightbox from "./image-lightbox"

type GridItem = {
  image: string
  title: string
  subtitle?: string
  handle?: string
  location?: string
  borderColor?: string
  gradient?: string
  url?: string
}

export default function ChromaGrid({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}: {
  items: GridItem[]
  className?: string
  radius?: number
  columns?: number
  rows?: number
  damping?: number
  fadeOut?: number
  ease?: string
}) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const fadeRef = useRef<HTMLDivElement | null>(null)
  const setX = useRef<((v: number) => void) | null>(null)
  const setY = useRef<((v: number) => void) | null>(null)
  const pos = useRef({ x: 0, y: 0 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    // Setup GSAP quick setters for the mask hotspot
    setX.current = gsap.quickSetter(el, "--x", "px") as any
    setY.current = gsap.quickSetter(el, "--y", "px") as any
    const { width, height } = el.getBoundingClientRect()
    pos.current = { x: width / 2, y: height / 2 }
    setX.current?.(pos.current.x)
    setY.current?.(pos.current.y)
  }, [])

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x)
        setY.current?.(pos.current.y)
      },
      overwrite: true,
    })
  }

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = rootRef.current!.getBoundingClientRect()
    moveTo(e.clientX - r.left, e.clientY - r.top)
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true })
  }

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    })
  }

  const handleCardClick = (item: GridItem) => {
    setSelectedImage({ src: item.image, title: item.title })
    setLightboxOpen(true)
  }

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget as HTMLElement
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty("--mouse-x", `${x}px`)
    card.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          ["--r" as any]: `${radius}px`,
          ["--cols" as any]: columns,
          ["--rows" as any]: rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c)}
          style={
            {
              ["--card-border" as any]: c.borderColor || "transparent",
              ["--card-gradient" as any]: c.gradient || "linear-gradient(145deg, #2563EB, #0B1220)",
              cursor: "pointer",
            } as React.CSSProperties
          }
        >
          <div className="chroma-img-wrapper">
            <img src={c.image || "/placeholder.svg"} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            {c.subtitle && <p className="role">{c.subtitle}</p>}
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />

      <ImageLightbox
        isOpen={lightboxOpen}
        image={selectedImage?.src || ""}
        title={selectedImage?.title || ""}
        onClose={() => setLightboxOpen(false)}
      />

      <style jsx global>{`
        .chroma-grid {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(var(--cols, 3), 320px);
          grid-auto-rows: auto;
          justify-content: center;
          gap: 0.75rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          box-sizing: border-box;

          --x: 50%;
          --y: 50%;
          --r: 220px;
        }

        @media (max-width: 1124px) {
          .chroma-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 320px));
            gap: 0.5rem;
            padding: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .chroma-grid {
            grid-template-columns: 320px;
            gap: 0.75rem;
            padding: 1rem;
          }
        }

        .chroma-card {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 320px;
          height: auto;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #1f2937; /* neutral-800 for theme consistency */
          transition: border-color 0.3s ease;
          background: var(--card-gradient);
          --mouse-x: 50%;
          --mouse-y: 50%;
          --spotlight-color: rgba(255, 255, 255, 0.28);
          box-shadow: 0 16px 40px rgba(2, 6, 23, 0.18); /* subtle shadow */
        }

        .chroma-card:hover {
          border-color: var(--card-border);
        }

        .chroma-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 2;
        }

        .chroma-card:hover::before {
          opacity: 1;
        }

        .chroma-img-wrapper {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 10px;
          box-sizing: border-box;
          background: transparent;
          transition: background 0.3s ease;
        }

        .chroma-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
          display: block;
        }

        .chroma-info {
          position: relative;
          z-index: 1;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
            "Apple Color Emoji", "Segoe UI Emoji";
          display: grid;
          grid-template-columns: 1fr auto;
          row-gap: 0.25rem;
          column-gap: 0.75rem;
        }

        .chroma-info .name {
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        .chroma-info .role,
        .chroma-info .handle {
          color: #e5e7eb; /* gray-200 for readability on gradients */
          font-weight: 500;
        }

        .chroma-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          backdrop-filter: grayscale(0.2) brightness(0.92); /* softened for site theme */
          -webkit-backdrop-filter: grayscale(0.2) brightness(0.92);
          background: rgba(0, 0, 0, 0.001);

          mask-image: radial-gradient(
            circle var(--r) at var(--x) var(--y),
            transparent 0%,
            transparent 15%,
            rgba(0, 0, 0, 0.08) 30%,
            rgba(0, 0, 0, 0.18) 45%,
            rgba(0, 0, 0, 0.3) 60%,
            rgba(0, 0, 0, 0.46) 75%,
            rgba(0, 0, 0, 0.62) 88%,
            white 100%
          );
          -webkit-mask-image: radial-gradient(
            circle var(--r) at var(--x) var(--y),
            transparent 0%,
            transparent 15%,
            rgba(0, 0, 0, 0.08) 30%,
            rgba(0, 0, 0, 0.18) 45%,
            rgba(0, 0, 0, 0.3) 60%,
            rgba(0, 0, 0, 0.46) 75%,
            rgba(0, 0, 0, 0.62) 88%,
            white 100%
          );
        }

        .chroma-fade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 4;
          backdrop-filter: grayscale(0.2) brightness(0.92);
          -webkit-backdrop-filter: grayscale(0.2) brightness(0.92);
          background: rgba(0, 0, 0, 0.001);

          mask-image: radial-gradient(
            circle var(--r) at var(--x) var(--y),
            white 0%,
            white 15%,
            rgba(255, 255, 255, 0.92) 30%,
            rgba(255, 255, 255, 0.84) 45%,
            rgba(255, 255, 255, 0.7) 60%,
            rgba(255, 255, 255, 0.55) 75%,
            rgba(255, 255, 255, 0.36) 88%,
            transparent 100%
          );
          -webkit-mask-image: radial-gradient(
            circle var(--r) at var(--x) var(--y),
            white 0%,
            white 15%,
            rgba(255, 255, 255, 0.92) 30%,
            rgba(255, 255, 255, 0.84) 45%,
            rgba(255, 255, 255, 0.7) 60%,
            rgba(255, 255, 255, 0.55) 75%,
            rgba(255, 255, 255, 0.36) 88%,
            transparent 100%
          );

          opacity: 1;
          transition: opacity 0.25s ease;
        }
      `}</style>
    </div>
  )
}

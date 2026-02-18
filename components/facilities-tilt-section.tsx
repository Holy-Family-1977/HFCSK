"use client"

import TiltedCard from "./tilted-card"
import AnimateOnScroll from "./animate-on-scroll"

type Facility = {
  title: string
  description: string
  image: string
}

const FACILITIES: Facility[] = [
  {
    title: "School Library",
    description: "Well-stocked resources for every learner.",
    image: "./lib.JPG",
  },
  {
    title: "Classroom",
    description: "An engaging space where young minds learn, explore, and grow.",
    image: "./class.JPG",
  },
  {
    title: "Safe & Security",
    description: "Robust safety protocol and secure campus.",
    image: "./security.JPG",
  },
  {
    title: "Playground",
    description: "A lively field for play, teamwork, and joyful energy.",
    image: "./sports.JPG",
  },
]

export default function FacilitiesTiltSection() {
  return (
    <section aria-label="Facilities that Inspire" className="relative py-16 md:py-20 bg-white overflow-hidden">
      {/* Subtle animated flower field background (no flower/star icons used) */}
      <FlowerField />

      <div className="container mx-auto px-4 relative z-10">
        <AnimateOnScroll variant="fade-up" className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Facilities that Inspire</h3>
          <p className="text-gray-600 mt-2">Thoughtfully designed spaces for curiosity, focus, and play</p>
        </AnimateOnScroll>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {FACILITIES.map((f, i) => (
            <AnimateOnScroll key={f.title} variant="fade-up" delayMs={120 * i}>
              <div className="mx-auto" style={{ width: "100%", maxWidth: 360 }}>
                <TiltedCard
                  imageSrc={f.image}
                  altText={f.title}
                  captionText={f.title}
                  containerWidth="100%"
                  containerHeight="300px"
                  imageWidth="100%"
                  imageHeight="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.12}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={<p className="tilted-card-demo-text">{f.description}</p>}
                  className="shadow-[0_18px_50px_rgba(59,130,246,0.15)] border-white/80"
                />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Background flower animation with CSS petals (no icon glyphs) */
function FlowerField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Layer 1 */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={`p1-${i}`}
            className="petal"
            style={{
              left: `${i * 12 + 4}%`,
              top: `${(i % 4) * 18 + 8}%`,
              // Each petal has its own drift vector and timing
              // CSS vars consumed by keyframes in globals.css
              // Slightly varied sizes for depth
              width: `${12 + (i % 3) * 3}px`,
              height: `${18 + (i % 4) * 3}px`,
              animationDuration: `${18 + i * 1.2}s`,
              animationDelay: `${i * 0.6}s`,
              // @ts-ignore CSS custom properties
              ["--dx" as any]: `${40 + i * 10}px`,
              ["--dy" as any]: `${-90 - i * 10}px`,
              opacity: 0.35,
            }}
          />
        ))}
      </div>
      {/* Layer 2 (slower, larger, softer) */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={`p2-${i}`}
            className="petal"
            style={{
              left: `${i * 16 + 6}%`,
              top: `${(i % 3) * 22 + 12}%`,
              width: `${16 + (i % 2) * 4}px`,
              height: `${24 + (i % 3) * 4}px`,
              animationDuration: `${26 + i * 1.6}s`,
              animationDelay: `${i * 0.8}s`,
              // @ts-ignore
              ["--dx" as any]: `${60 + i * 12}px`,
              ["--dy" as any]: `${-120 - i * 14}px`,
              opacity: 0.25,
            }}
          />
        ))}
      </div>
    </div>
  )
}

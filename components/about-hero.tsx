"use client"

import Image from "next/image"
import QuickActions from "./quick-actions"
import AnimateOnScroll from "./animate-on-scroll"

export default function AboutHero() {
  return (
    <section className="relative h-[56vh] min-h-[420px] overflow-hidden">
      <Image
        src="/graduation-celebration.png"
        alt="Holy Family graduates celebrating"
        fill
        priority
        className="object-cover animate-kenburns"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/35" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <AnimateOnScroll variant="fade-in">
          <div className="text-white drop-shadow">
            <h1 className="text-4xl md:text-6xl font-extrabold">About Holy Family</h1>
            <p className="mt-3 text-lg md:text-xl max-w-3xl mx-auto">
              Rooted in values. Driven by curiosity. Building character and excellence since 1990.
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Floating quick actions */}
      <div className="absolute left-1/2 bottom-[-28px] -translate-x-1/2 z-20 w-[92%] max-w-3xl">
        <QuickActions />
      </div>
    </section>
  )
}

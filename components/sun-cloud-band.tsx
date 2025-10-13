"use client"

import { useRef } from "react"

export default function SunCloudBand() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} aria-label="Sun and clouds intro" className="relative overflow-hidden">
      {/* Solid sky */}
      <div className="h-28 md:h-32 bg-[#EAF4FF]" />
      {/* Sun */}
      <div
        aria-hidden
        className="absolute left-8 md:left-16 -top-8 w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-300 shadow-[0_0_80px_rgba(250,204,21,0.45)] animate-sun-glow"
      />
      {/* Clouds */}
      <Cloud className="absolute top-6 left-10 animate-cloud-fast" />
      <Cloud className="absolute top-4 right-12 scale-90 animate-cloud-med" />
      <Cloud className="absolute top-10 left-1/2 -translate-x-1/2 scale-75 animate-cloud-slow" />

      {/* Glass bar */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div className="glass pointer-events-auto rounded-2xl border-white/50 shadow-lg px-5 py-2.5 mb-3 text-sm font-semibold text-blue-900">
          A warm welcome to Holy Family
        </div>
      </div>
    </section>
  )
}

function Cloud({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="relative w-24 h-8 bg-white rounded-full shadow-sm">
        <span className="absolute -top-3 left-2 w-6 h-6 bg-white rounded-full" />
        <span className="absolute -top-4 left-8 w-8 h-8 bg-white rounded-full" />
        <span className="absolute -top-2 left-[60px] w-6 h-6 bg-white rounded-full" />
      </div>
    </div>
  )
}

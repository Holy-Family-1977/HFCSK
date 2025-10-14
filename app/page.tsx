import HeroCarousel from "@/components/hero-carousel"
import SkyScene from "@/components/sky-scene"
import FacilitiesTiltSection from "@/components/facilities-tilt-section"
import CampusGrid from "@/components/campus-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroCarousel />

      {/* Enhanced “Where Knowledge…” band (already improved previously) */}
      <SkyScene />

      {/* Facilities with Tilted Cards and animated flower background */}
      <FacilitiesTiltSection />

      {/* Glimpses of Campus Life like reference with animations */}
      <CampusGrid />
    </div>
  )
}

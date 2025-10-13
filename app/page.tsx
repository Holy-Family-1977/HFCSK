import HeroCarousel from "@/components/hero-carousel"
import SunCloudBand from "@/components/sun-cloud-band"
import SkyScene from "@/components/sky-scene"
import FacilitiesBubbles from "@/components/facilities-bubbles"
import CampusGrid from "@/components/campus-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroCarousel />

      {/* New sun/cloud glass band right below hero */}
      <SunCloudBand />

      {/* Enhanced “Where Knowledge…” band (already improved previously) */}
      <SkyScene />

      {/* Facilities redesigned with icons + parallax + flowers */}
      <FacilitiesBubbles />

      {/* Glimpses of Campus Life like reference with animations */}
      <CampusGrid />
    </div>
  )
}

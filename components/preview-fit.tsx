"use client"

import { useEffect } from "react"

/**
 * Adds a "preview-fit" class to the <html> element when the app is
 * running inside an iframe (like the v0 preview). This lets us tweak
 * large sections (e.g., full-screen hero) so more of the page is
 * visible at a glance in the preview while keeping normal behavior
 * on real pages.
 */
export default function PreviewFit() {
  useEffect(() => {
    const inIframe = typeof window !== "undefined" && window.self !== window.top
    const smallViewport = typeof window !== "undefined" && window.innerHeight < 760
    if (inIframe || smallViewport) {
      document.documentElement.classList.add("preview-fit")
    }

    const onResize = () => {
      if (window.innerHeight < 760) {
        document.documentElement.classList.add("preview-fit")
      } else if (inIframe) {
        // keep it if in iframe
        document.documentElement.classList.add("preview-fit")
      } else {
        document.documentElement.classList.remove("preview-fit")
      }
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      document.documentElement.classList.remove("preview-fit")
    }
  }, [])

  return null
}

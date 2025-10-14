"use client"

import AnimateOnScroll from "./animate-on-scroll"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SetApartCard({
  title,
  body,
  href = "/about",
  align = "right",
}: {
  title: string
  body: string
  href?: string
  align?: "left" | "right"
}) {
  return (
    <AnimateOnScroll variant={align === "right" ? "slide-left" : "slide-right"}>
      <div className="rounded-2xl bg-white shadow-[0_18px_50px_rgba(2,6,23,0.06)] border border-gray-200 p-6 md:p-7 max-w-xl">
        <h4 className="text-xl md:text-2xl font-extrabold text-gray-900">{title}</h4>
        <p className="mt-2 text-gray-600">{body}</p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline"
          aria-label={`Learn more about ${title}`}
        >
          Learn more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </AnimateOnScroll>
  )
}

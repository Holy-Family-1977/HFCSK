import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PreviewFit from "@/components/preview-fit" // Added import

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Holy Family School - Empowering Future Leaders",
  description:
    "A place where knowledge meets character, nurturing students for academic excellence and spiritual growth.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PreviewFit />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

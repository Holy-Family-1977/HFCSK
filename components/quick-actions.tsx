"use client"

import type React from "react"

import Link from "next/link"
import { Building2, BookOpen, ClipboardList, HeartHandshake } from "lucide-react"

type Action = {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const DEFAULT_ACTIONS: Action[] = [
  { label: "Visit", href: "/contact", icon: Building2 },
  { label: "Learn More", href: "./Prospectus.pdf", icon: BookOpen },
  { label: "Apply", href: "/tc", icon: ClipboardList },
  { label: "Giving", href: "/contact", icon: HeartHandshake },
]

export default function QuickActions({
  actions = DEFAULT_ACTIONS,
  className = "",
}: {
  actions?: Action[]
  className?: string
}) {
  return (
    <div
      className={`glass rounded-2xl border border-white/60 shadow-[0_18px_60px_rgba(2,6,23,0.18)] backdrop-blur-md ${className}`}
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-4 divide-x divide-white/40">
        {actions.map((a) => {
          const Icon = a.icon
          return (
            <Link
              key={a.label}
              href={a.href}
              className="group flex flex-col items-center justify-center gap-2 px-6 py-4 text-blue-900 hover:bg-white/70 transition-colors"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 group-hover:bg-blue-600/20">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold">{a.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

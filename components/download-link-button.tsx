"use client"

import type React from "react"

interface DownloadLinkButtonProps {
  title: string
  type: "template" | "bestpractice" | "whitepaper"
  onDownload: (title: string, type: "template" | "bestpractice" | "whitepaper") => void
  children: React.ReactNode
}

export default function DownloadLinkButton({ title, type, onDownload, children }: DownloadLinkButtonProps) {
  return (
    <button
      className="text-gray-600 hover:text-green-600 text-sm font-normal text-left"
      onClick={() => onDownload(title, type)}
    >
      {children}
    </button>
  )
}

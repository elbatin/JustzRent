"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [active, setActive] = useState(0)

  const allImages =
    images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"]

  function prev() {
    setActive((i) => (i === 0 ? allImages.length - 1 : i - 1))
  }

  function next() {
    setActive((i) => (i === allImages.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-muted group">
        <Image
          src={allImages[active]}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                active === i
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${alt} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
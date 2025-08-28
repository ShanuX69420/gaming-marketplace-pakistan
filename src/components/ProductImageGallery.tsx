'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'

interface ProductImageGalleryProps {
  images: string[]
  title: string
}

export default function ProductImageGallery({ images = [], title }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState<number[]>([])

  // Use placeholder if no images
  const displayImages = images.length > 0 ? images : ['/placeholder-product.svg']

  const handleImageError = (index: number) => {
    if (!imageError.includes(index)) {
      setImageError([...imageError, index])
    }
  }

  const getImageSrc = (src: string, index: number) => {
    return imageError.includes(index) ? '/placeholder-product.svg' : src
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => prev === 0 ? displayImages.length - 1 : prev - 1)
  }

  const handleNext = () => {
    setSelectedImage((prev) => prev === displayImages.length - 1 ? 0 : prev + 1)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden relative group">
        <div className="aspect-square bg-gray-100 relative">
          <img
            src={getImageSrc(displayImages[selectedImage], selectedImage)}
            alt={`${title} - Image ${selectedImage + 1}`}
            className="w-full h-full object-cover"
            onError={() => handleImageError(selectedImage)}
          />
          
          {/* Navigation Arrows (only show if multiple images) */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {displayImages.length}
            </div>
          )}
        </div>
      </Card>

      {/* Thumbnail Grid (only show if multiple images) */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === index 
                  ? 'border-primary-500 ring-2 ring-primary-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={getImageSrc(image, index)}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(index)}
              />
              
              {/* Selected overlay */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-primary-500/20"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Zoom hint */}
      <p className="text-sm text-gray-600 text-center">
        {displayImages.length > 1 ? 'Click thumbnails to view different angles' : 'Product image'}
      </p>
    </div>
  )
}
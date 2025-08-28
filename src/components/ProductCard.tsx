'use client'

import Link from 'next/link'
import { Product } from '@/types/product'
import { Card } from '@/components/ui/Card'
import VerificationBadges from '@/components/VerificationBadges'

interface ProductCardProps {
  product: Product
  showSeller?: boolean
}

export default function ProductCard({ product, showSeller = true }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getImageUrl = () => {
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls[0]
    }
    return product.thumbnail_url || '/placeholder-product.svg'
  }

  const getCategoryIcon = () => {
    const categoryIcons: Record<string, string> = {
      game_accounts: '👤',
      in_game_currency: '💰',
      top_ups: '💳',
      boosting_services: '⚡',
      gift_cards: '🎁',
      gaming_hardware: '🎮',
      digital_games: '🎯',
      other: '📦'
    }
    return categoryIcons[product.category] || '📦'
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={getImageUrl()}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-product.svg'
            }}
          />
          
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 backdrop-blur-sm text-xs px-2 py-1 rounded-full font-medium">
              {getCategoryIcon()} {product.category.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Featured badge */}
          {product.is_featured && (
            <div className="absolute top-2 right-2">
              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                ⭐ Featured
              </span>
            </div>
          )}

          {/* Quick delivery badge */}
          {product.is_instant_delivery && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                ⚡ Instant
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Title and description */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Game info */}
          {product.game_title && (
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
              <span>🎮 {product.game_title}</span>
              {product.platform && <span>• {product.platform}</span>}
            </div>
          )}

          {/* Price and negotiable */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            
            {product.is_negotiable && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Negotiable
              </span>
            )}
          </div>

          {/* Seller info */}
          {showSeller && 'seller' in product && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                  {(product as any).seller?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-600">
                  {(product as any).seller?.username || 'User'}
                </span>
                <VerificationBadges 
                  emailVerified={(product as any).seller?.email_verified}
                  phoneVerified={(product as any).seller?.phone_verified}
                  identityVerified={(product as any).seller?.identity_verified}
                  size="xs"
                />
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>⭐</span>
                <span>{(product as any).seller?.seller_rating || 0}/5</span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
            <span>{product.view_count || 0} views</span>
            <span>{product.quantity} available</span>
          </div>
        </div>
      </Link>
    </Card>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ProductService } from '@/lib/products'
import { Product, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '@/types/product'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import VerificationBadges from '@/components/VerificationBadges'
import ProductImageGallery from '@/components/ProductImageGallery'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await ProductService.getProductWithSellerBySlug(slug)
      
      if (error) {
        setError(error)
        return
      }

      if (data) {
        setProduct(data)
        // Increment view count
        ProductService.incrementViewCount(data.id)
      } else {
        setError('Product not found')
      }
    } catch (err) {
      setError('Failed to load product')
      console.error('Product fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getCategoryInfo = () => {
    return PRODUCT_CATEGORIES[product?.category] || PRODUCT_CATEGORIES.other
  }

  const getConditionInfo = () => {
    return PRODUCT_CONDITIONS[product?.condition] || PRODUCT_CONDITIONS.good
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link href="/browse">
                <Button>← Back to Browse</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const categoryInfo = getCategoryInfo()
  const conditionInfo = getConditionInfo()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/browse" className="hover:text-primary-600">Browse</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{categoryInfo.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div>
            <ProductImageGallery 
              images={product.image_urls || []} 
              title={product.title}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Status Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {categoryInfo.icon} {categoryInfo.name}
              </span>
              
              {product.is_featured && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Featured
                </span>
              )}
              
              {product.is_instant_delivery && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  ⚡ Instant Delivery
                </span>
              )}

              {product.condition && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${conditionInfo.color}-100 text-${conditionInfo.color}-700`}>
                  {conditionInfo.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}

              {product.is_negotiable && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  💬 Negotiable
                </span>
              )}
            </div>

            {/* Game Info */}
            {product.game_title && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Game Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Game:</span>
                    <span className="ml-2 font-medium">{product.game_title}</span>
                  </div>
                  
                  {product.platform && (
                    <div>
                      <span className="text-gray-600">Platform:</span>
                      <span className="ml-2 font-medium">{product.platform}</span>
                    </div>
                  )}
                  
                  {product.account_level && (
                    <div>
                      <span className="text-gray-600">Level:</span>
                      <span className="ml-2 font-medium">{product.account_level}</span>
                    </div>
                  )}
                  
                  {product.server_region && (
                    <div>
                      <span className="text-gray-600">Region:</span>
                      <span className="ml-2 font-medium">{product.server_region}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  🛒 Buy Now
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  💬 Contact Seller
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  ❤️ Add to Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  📢 Report
                </Button>
              </div>
            </div>

            {/* Stock & Delivery */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{product.quantity} available</span>
                </div>
                
                {product.delivery_time && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium">{product.delivery_time}</span>
                  </div>
                )}
                
                {product.shipping_available && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                      Available {product.shipping_cost > 0 ? `(${formatPrice(product.shipping_cost)})` : '(Free)'}
                    </span>
                  </div>
                )}
                
                {product.local_pickup && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup:</span>
                    <span className="font-medium">Available</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Product Description & Seller Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Stats */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>👀 {product.view_count || 0} views</span>
                  <span>❤️ {product.favorite_count || 0} favorites</span>
                  <span>📅 Listed {new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Seller Info */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Seller Information</h2>
              
              <div className="space-y-4">
                {/* Seller Profile */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-lg font-bold text-primary-700">
                    {product.seller?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {product.seller?.full_name || product.seller?.username || 'User'}
                    </h3>
                    <div className="flex items-center gap-1">
                      <VerificationBadges 
                        emailVerified={product.seller?.email_verified}
                        phoneVerified={product.seller?.phone_verified}
                        identityVerified={product.seller?.identity_verified}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Seller Stats */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{product.seller?.seller_rating || 0}/5</span>
                      <span className="text-yellow-400">⭐</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales:</span>
                    <span className="font-medium">{product.seller?.total_sales || 0}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-medium">
                      {new Date(product.seller?.created_at || new Date()).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    💬 Message Seller
                  </Button>
                  <Button variant="outline" className="w-full">
                    👤 View Profile
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
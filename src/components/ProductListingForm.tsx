'use client'

import { useState, useRef } from 'react'
import { ProductService } from '@/lib/products'
import { StorageService } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { 
  ProductCategory, 
  ProductCondition, 
  ProductCreateData,
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  GAMING_PLATFORMS,
  POPULAR_GAMES
} from '@/types/product'
import { Input } from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'

interface ProductListingFormProps {
  onSuccess?: (productId: string) => void
  onCancel?: () => void
}

export default function ProductListingForm({ onSuccess, onCancel }: ProductListingFormProps) {
  const [formData, setFormData] = useState<ProductCreateData>({
    title: '',
    description: '',
    category: 'game_accounts',
    price: 0,
    currency: 'PKR',
    condition: 'good',
    quantity: 1,
    is_negotiable: false,
    is_instant_delivery: false,
    shipping_available: false,
    shipping_cost: 0,
    local_pickup: false,
    tags: [],
    status: 'draft'
  })

  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof ProductCreateData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files')
        return false
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Images must be less than 5MB')
        return false
      }
      return true
    })

    if (validFiles.length !== files.length) return

    // Limit total images
    if (images.length + validFiles.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }

    setImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setImageUrls(prev => [...prev, result])
        }
      }
      reader.readAsDataURL(file)
    })

    setError(null)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      errors.title = 'Title must be at least 10 characters long'
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters long'
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = 'Price must be greater than 0'
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0'
    }

    if (formData.shipping_available && formData.shipping_cost < 0) {
      errors.shipping_cost = 'Shipping cost cannot be negative'
    }

    if (images.length === 0) {
      errors.images = 'At least one image is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setError('Please fix the errors above')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to create a listing')
        return
      }

      // Upload images first if any
      let uploadedImageUrls: string[] = []
      if (images.length > 0) {
        const { data: imageUrls, error: uploadError } = await StorageService.uploadProductImages(images, user.id)
        
        if (uploadError) {
          setError(`Failed to upload images: ${uploadError}`)
          return
        }
        
        uploadedImageUrls = imageUrls
      }

      // Generate slug from title
      const slug = generateSlug(formData.title) + '-' + Date.now()

      // Prepare product data with uploaded image URLs
      const productData: ProductCreateData = {
        ...formData,
        slug,
        image_urls: uploadedImageUrls,
        thumbnail_url: uploadedImageUrls[0] || undefined, // Use first image as thumbnail
        status: isDraft ? 'draft' : 'active'
      }

      const { data: product, error } = await ProductService.createProduct(productData)

      if (error) {
        setError(error)
        return
      }

      if (product && onSuccess) {
        onSuccess(product.id)
      }

    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Product creation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = PRODUCT_CATEGORIES[formData.category as ProductCategory]

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Product Listing
          </h1>
          <p className="text-gray-600">
            Fill out the details below to list your {selectedCategory?.name.toLowerCase()} on the marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category *"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                error={validationErrors.category}
              >
                {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.icon} {value.name}
                  </option>
                ))}
              </Select>

              <Input
                label="Subcategory"
                placeholder="e.g., PUBG Mobile, Call of Duty"
                value={formData.subcategory || ''}
                onChange={(e) => handleInputChange('subcategory', e.target.value)}
              />
            </div>

            <Input
              label="Product Title *"
              placeholder="e.g., PUBG Mobile Account - Conqueror Rank with Rare Skins"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={validationErrors.title}
            />

            <Textarea
              label="Description *"
              placeholder="Provide detailed information about your product..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={validationErrors.description}
              rows={4}
            />
          </div>

          {/* Game-Specific Fields */}
          {['game_accounts', 'in_game_currency', 'boosting_services'].includes(formData.category) && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Game Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Game Title"
                  value={formData.game_title || ''}
                  onChange={(e) => handleInputChange('game_title', e.target.value)}
                >
                  <option value="">Select a game...</option>
                  {POPULAR_GAMES.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </Select>

                <Select
                  label="Platform"
                  value={formData.platform || ''}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                >
                  <option value="">Select platform...</option>
                  {GAMING_PLATFORMS.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </Select>
              </div>

              {formData.category === 'game_accounts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Account Level"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.account_level || ''}
                    onChange={(e) => handleInputChange('account_level', parseInt(e.target.value) || 0)}
                  />
                  
                  <Input
                    label="Server/Region"
                    placeholder="e.g., Asia, Europe, NA"
                    value={formData.server_region || ''}
                    onChange={(e) => handleInputChange('server_region', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Pricing & Availability
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Price (PKR) *"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                error={validationErrors.price}
              />

              <Input
                label="Original Price (PKR)"
                type="number"
                placeholder="Optional"
                value={formData.original_price || ''}
                onChange={(e) => handleInputChange('original_price', parseFloat(e.target.value) || undefined)}
              />

              <Input
                label="Quantity *"
                type="number"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                error={validationErrors.quantity}
              />
            </div>

            <div className="space-y-3">
              <Checkbox
                label="Price is negotiable"
                checked={formData.is_negotiable}
                onChange={(e) => handleInputChange('is_negotiable', e.target.checked)}
              />
              
              <Checkbox
                label="Instant delivery available"
                description="Can be delivered immediately after payment"
                checked={formData.is_instant_delivery}
                onChange={(e) => handleInputChange('is_instant_delivery', e.target.checked)}
              />
            </div>
          </div>

          {/* Condition (for physical items) */}
          {['gaming_hardware', 'gift_cards'].includes(formData.category) && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Item Condition
              </h2>
              
              <Select
                label="Condition"
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
              >
                {Object.entries(PRODUCT_CONDITIONS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Shipping */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Delivery Options
            </h2>
            
            <div className="space-y-3">
              <Checkbox
                label="Shipping available"
                description="Can ship to buyer's location"
                checked={formData.shipping_available}
                onChange={(e) => handleInputChange('shipping_available', e.target.checked)}
              />
              
              {formData.shipping_available && (
                <Input
                  label="Shipping Cost (PKR)"
                  type="number"
                  placeholder="0"
                  value={formData.shipping_cost}
                  onChange={(e) => handleInputChange('shipping_cost', parseFloat(e.target.value) || 0)}
                  error={validationErrors.shipping_cost}
                  className="ml-6 max-w-xs"
                />
              )}
              
              <Checkbox
                label="Local pickup available"
                description="Buyer can collect in person"
                checked={formData.local_pickup}
                onChange={(e) => handleInputChange('local_pickup', e.target.checked)}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Product Images *
            </h2>
            
            <div className="space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={images.length >= 5}
                >
                  Upload Images ({images.length}/5)
                </Button>
                <p className="text-sm text-gray-600 mt-1">
                  Upload up to 5 images. Each image should be less than 5MB.
                </p>
                {validationErrors.images && (
                  <p className="text-sm text-red-600">{validationErrors.images}</p>
                )}
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e as any, true)}
              disabled={loading}
              className="flex-1"
            >
              Save as Draft
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
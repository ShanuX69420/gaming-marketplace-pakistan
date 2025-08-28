'use client'

import { useState } from 'react'
import { ProductSearchFilters, ProductCategory, ProductCondition, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS, GAMING_PLATFORMS, POPULAR_GAMES } from '@/types/product'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface FilterSidebarProps {
  filters: ProductSearchFilters
  onFiltersChange: (filters: ProductSearchFilters) => void
  onClearFilters: () => void
  className?: string
}

export default function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  className = "" 
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState({
    min: filters.price_min?.toString() || '',
    max: filters.price_max?.toString() || ''
  })

  const updateFilter = <K extends keyof ProductSearchFilters>(
    key: K,
    value: ProductSearchFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const toggleArrayFilter = <K extends keyof ProductSearchFilters>(
    key: K,
    value: string,
    currentArray: string[] | undefined
  ) => {
    const array = currentArray || []
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value]
    
    updateFilter(key, newArray.length > 0 ? newArray : undefined)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [type]: value }))
    
    const numValue = value ? parseFloat(value) : undefined
    if (type === 'min') {
      updateFilter('price_min', numValue)
    } else {
      updateFilter('price_max', numValue)
    }
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    // Exclude sort parameters from active filter check
    key !== 'sort_by' && key !== 'sort_order' && key !== 'page' && key !== 'limit' &&
    value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  )

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Categories</h4>
        <div className="space-y-2">
          {Object.entries(PRODUCT_CATEGORIES).map(([key, { name, icon }]) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category?.includes(key as ProductCategory) || false}
                onChange={(e) => 
                  toggleArrayFilter('category', key, filters.category as string[])
                }
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 flex items-center space-x-2">
                <span>{icon}</span>
                <span>{name}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Price Range (PKR)</h4>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="text-sm"
            min="0"
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="text-sm"
            min="0"
          />
        </div>
        
        {/* Quick Price Ranges */}
        <div className="flex flex-wrap gap-1">
          {[
            { label: 'Under Rs.1K', min: 0, max: 1000 },
            { label: 'Rs.1K-5K', min: 1000, max: 5000 },
            { label: 'Rs.5K-15K', min: 5000, max: 15000 },
            { label: 'Rs.15K+', min: 15000, max: undefined }
          ].map(({ label, min, max }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('price_min', min)
                updateFilter('price_max', max)
                setPriceRange({
                  min: min.toString(),
                  max: max?.toString() || ''
                })
              }}
              className="text-xs px-2 py-1"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Condition</h4>
        <div className="space-y-2">
          {Object.entries(PRODUCT_CONDITIONS).map(([key, { name }]) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.condition?.includes(key as ProductCondition) || false}
                onChange={(e) => 
                  toggleArrayFilter('condition', key, filters.condition as string[])
                }
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Platform</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {GAMING_PLATFORMS.map((platform) => (
            <label key={platform} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.platform?.includes(platform) || false}
                onChange={(e) => 
                  toggleArrayFilter('platform', platform, filters.platform)
                }
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Game Title */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Popular Games</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {POPULAR_GAMES.slice(0, 15).map((game) => (
            <label key={game} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.game_title === game}
                onChange={(e) => 
                  updateFilter('game_title', e.target.checked ? game : undefined)
                }
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{game}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Location</h4>
        <select
          value={filters.location || ''}
          onChange={(e) => updateFilter('location', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Locations</option>
          <option value="Karachi">Karachi</option>
          <option value="Lahore">Lahore</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Rawalpindi">Rawalpindi</option>
          <option value="Faisalabad">Faisalabad</option>
          <option value="Multan">Multan</option>
          <option value="Peshawar">Peshawar</option>
          <option value="Quetta">Quetta</option>
          <option value="Sialkot">Sialkot</option>
          <option value="Gujranwala">Gujranwala</option>
        </select>
      </div>

      {/* Special Features */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Special Features</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.is_instant_delivery || false}
              onChange={(e) => 
                updateFilter('is_instant_delivery', e.target.checked || undefined)
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 flex items-center space-x-1">
              <span>⚡</span>
              <span>Instant Delivery</span>
            </span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.is_negotiable || false}
              onChange={(e) => 
                updateFilter('is_negotiable', e.target.checked || undefined)
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 flex items-center space-x-1">
              <span>🤝</span>
              <span>Price Negotiable</span>
            </span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.shipping_available || false}
              onChange={(e) => 
                updateFilter('shipping_available', e.target.checked || undefined)
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 flex items-center space-x-1">
              <span>📦</span>
              <span>Shipping Available</span>
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Active Filters</span>
            <span className="text-xs text-gray-500">
              {Object.entries(filters).filter(([key, value]) => 
                key !== 'sort_by' && key !== 'sort_order' && key !== 'page' && key !== 'limit' &&
                value !== undefined && value !== null && 
                (Array.isArray(value) ? value.length > 0 : true)
              ).length}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {filters.category?.map(cat => (
              <span key={cat} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                {PRODUCT_CATEGORIES[cat as ProductCategory].name}
                <button
                  onClick={() => toggleArrayFilter('category', cat, filters.category)}
                  className="ml-1 hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
            
            {filters.price_min && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                Min: Rs.{filters.price_min}
                <button
                  onClick={() => {
                    updateFilter('price_min', undefined)
                    setPriceRange(prev => ({ ...prev, min: '' }))
                  }}
                  className="ml-1 hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.price_max && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                Max: Rs.{filters.price_max}
                <button
                  onClick={() => {
                    updateFilter('price_max', undefined)
                    setPriceRange(prev => ({ ...prev, max: '' }))
                  }}
                  className="ml-1 hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.location && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                {filters.location}
                <button
                  onClick={() => updateFilter('location', undefined)}
                  className="ml-1 hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
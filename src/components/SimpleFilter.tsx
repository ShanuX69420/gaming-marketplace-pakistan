'use client'

import { useState } from 'react'
import { ProductSearchFilters } from '@/types/product'
import { Button } from '@/components/ui/Button'

interface SimpleFilterProps {
  filters: ProductSearchFilters
  onFiltersChange: (filters: ProductSearchFilters) => void
  onClearFilters: () => void
}

export default function SimpleFilter({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: SimpleFilterProps) {
  const [priceMin, setPriceMin] = useState(filters.price_min?.toString() || '')
  const [priceMax, setPriceMax] = useState(filters.price_max?.toString() || '')

  const updateFilter = <K extends keyof ProductSearchFilters>(
    key: K,
    value: ProductSearchFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handlePriceMinChange = (value: string) => {
    setPriceMin(value)
    const numValue = value ? parseFloat(value) : undefined
    updateFilter('price_min', numValue)
  }

  const handlePriceMaxChange = (value: string) => {
    setPriceMax(value)
    const numValue = value ? parseFloat(value) : undefined
    updateFilter('price_max', numValue)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button onClick={onClearFilters} variant="outline" size="sm">
          Clear All
        </Button>
      </div>

      {/* Categories - Simple version */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Categories</h4>
        <div className="space-y-2">
          {['game_accounts', 'in_game_currency', 'top_ups'].map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category?.includes(category as any) || false}
                onChange={(e) => {
                  const currentCategories = filters.category || []
                  const newCategories = e.target.checked
                    ? [...currentCategories, category]
                    : currentCategories.filter(c => c !== category)
                  updateFilter('category', newCategories.length > 0 ? newCategories as any : undefined)
                }}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {category.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range - Simple version */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Price Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => handlePriceMinChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => handlePriceMaxChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Special Features - Simple version */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Features</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.is_instant_delivery || false}
              onChange={(e) => updateFilter('is_instant_delivery', e.target.checked || undefined)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">⚡ Instant Delivery</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.is_negotiable || false}
              onChange={(e) => updateFilter('is_negotiable', e.target.checked || undefined)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">🤝 Negotiable</span>
          </label>
        </div>
      </div>
    </div>
  )
}
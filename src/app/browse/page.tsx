'use client'

import { useState } from 'react'
import ProductGrid from '@/components/ProductGrid'
import SearchBar from '@/components/SearchBar'
import FilterSidebar from '@/components/FilterSidebar'
import SortOptions, { SortButtons } from '@/components/SortOptions'
import { ProductSearchQuery, ProductSearchFilters } from '@/types/product'
import { Button } from '@/components/ui/Button'

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState<ProductSearchQuery>({
    sort_by: 'created_at',
    sort_order: 'desc'
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleSearch = (query: string) => {
    console.log('Browse: handleSearch called with:', query)
    setSearchQuery(prev => {
      const newQuery = {
        ...prev,
        q: query || undefined,
        page: 1 // Reset to first page when searching
      }
      console.log('Browse: New search query:', newQuery)
      return newQuery
    })
  }

  const handleFiltersChange = (filters: ProductSearchFilters) => {
    setSearchQuery(prev => ({
      ...prev,
      ...filters,
      page: 1 // Reset to first page when filtering
    }))
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSearchQuery(prev => ({
      ...prev,
      sort_by: sortBy as any,
      sort_order: sortOrder
    }))
  }

  const handleClearFilters = () => {
    setSearchQuery({
      sort_by: 'created_at',
      sort_order: 'desc'
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Marketplace
          </h1>
          <p className="text-gray-600 mb-6">
            Discover amazing gaming products, accounts, and services
          </p>

          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <SearchBar
              onSearch={handleSearch}
              initialValue={searchQuery.q || ''}
              placeholder="Search for games, accounts, currency..."
            />
          </div>

          {/* Quick Actions - Mobile */}
          <div className="md:hidden flex justify-center space-x-2 mb-4">
            <Button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-4">
              <FilterSidebar
                filters={searchQuery}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <Button
                      onClick={() => setShowMobileFilters(false)}
                      variant="outline"
                      size="sm"
                    >
                      Close
                    </Button>
                  </div>
                  <FilterSidebar
                    filters={searchQuery}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              {/* Desktop Sort */}
              <div className="hidden md:flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {searchQuery.q && (
                    <span>Searching for: <strong>"{searchQuery.q}"</strong></span>
                  )}
                </div>
                <SortOptions
                  sortBy={searchQuery.sort_by}
                  sortOrder={searchQuery.sort_order}
                  onSortChange={handleSortChange}
                />
              </div>

              {/* Mobile Sort */}
              <div className="md:hidden">
                {searchQuery.q && (
                  <div className="text-sm text-gray-600 mb-3">
                    Searching for: <strong>"{searchQuery.q}"</strong>
                  </div>
                )}
                <SortButtons
                  sortBy={searchQuery.sort_by}
                  sortOrder={searchQuery.sort_order}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid 
              searchQuery={searchQuery}
              title=""
              showPagination={true}
              initialLimit={12}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
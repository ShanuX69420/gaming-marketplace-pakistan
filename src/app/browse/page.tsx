'use client'

import { useState } from 'react'
import ProductGrid from '@/components/ProductGrid'
import { ProductSearchQuery } from '@/types/product'

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState<ProductSearchQuery>({
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Marketplace
          </h1>
          <p className="text-gray-600">
            Discover amazing gaming products, accounts, and services
          </p>
        </div>

        {/* Quick Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchQuery({ sort_by: 'created_at', sort_order: 'desc' })}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                searchQuery.sort_by === 'created_at' 
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🕒 Latest
            </button>
            
            <button
              onClick={() => setSearchQuery({ sort_by: 'price', sort_order: 'asc' })}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                searchQuery.sort_by === 'price' && searchQuery.sort_order === 'asc'
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💰 Price: Low to High
            </button>
            
            <button
              onClick={() => setSearchQuery({ sort_by: 'price', sort_order: 'desc' })}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                searchQuery.sort_by === 'price' && searchQuery.sort_order === 'desc'
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💸 Price: High to Low
            </button>
            
            <button
              onClick={() => setSearchQuery({ ...searchQuery, category: ['game_accounts'] })}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                searchQuery.category?.includes('game_accounts')
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👤 Game Accounts
            </button>
            
            <button
              onClick={() => setSearchQuery({ ...searchQuery, category: ['in_game_currency'] })}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                searchQuery.category?.includes('in_game_currency')
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💰 In-Game Currency
            </button>

            <button
              onClick={() => setSearchQuery({ ...searchQuery, is_instant_delivery: true })}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                searchQuery.is_instant_delivery
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚡ Instant Delivery
            </button>

            {/* Clear Filters */}
            {(searchQuery.category || searchQuery.is_instant_delivery) && (
              <button
                onClick={() => setSearchQuery({ sort_by: 'created_at', sort_order: 'desc' })}
                className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid 
          searchQuery={searchQuery}
          title="All Products"
          showPagination={true}
          initialLimit={12}
        />
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { ProductService } from '@/lib/products'
import { Product, ProductSearchQuery, ProductSearchResult } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/Button'

interface ProductGridProps {
  searchQuery?: ProductSearchQuery
  title?: string
  showPagination?: boolean
  initialLimit?: number
}

export default function ProductGrid({ 
  searchQuery = {}, 
  title = "Products", 
  showPagination = true, 
  initialLimit = 12 
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: initialLimit,
    total_count: 0,
    has_next: false,
    has_prev: false
  })

  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(!append) // Don't show loading for "load more"
      setError(null)

      const query: ProductSearchQuery = {
        ...searchQuery,
        page,
        limit: pagination.limit
      }

      console.log('ProductGrid: Searching with query:', query)
      const { data, error } = await ProductService.searchProducts(query)
      console.log('ProductGrid: Search result:', { 
        data, 
        error, 
        productsCount: data?.products?.length,
        totalCount: data?.total_count,
        firstProductTitle: data?.products?.[0]?.title 
      })

      if (error) {
        console.error('ProductGrid: Search error:', error)
        setError(error)
        return
      }

      if (data) {
        const newProducts = append ? [...products, ...data.products] : data.products
        console.log('ProductGrid: Setting products:', {
          append,
          newProductsCount: newProducts.length,
          newProducts: newProducts.map(p => ({ id: p.id, title: p.title }))
        })
        
        setProducts(newProducts)
        setPagination({
          page: data.page,
          limit: data.limit,
          total_count: data.total_count,
          has_next: data.has_next,
          has_prev: data.has_prev
        })
      }
    } catch (err) {
      setError('Failed to load products')
      console.error('Product fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(1, false)
  }, [searchQuery])

  const handleLoadMore = () => {
    fetchProducts(pagination.page + 1, true)
  }

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, false)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchProducts(1, false)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later for new listings.</p>
        </div>
      </div>
    )
  }

  console.log('ProductGrid: Rendering with products:', {
    productsLength: products.length,
    loading,
    error,
    products: products.map(p => ({ id: p.id, title: p.title }))
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-600">
          Showing {products.length} of {pagination.total_count} products
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            showSeller={true}
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && pagination.total_count > pagination.limit && (
        <div className="flex items-center justify-center space-x-4 pt-8">
          {/* Load More Button (for mobile-friendly infinite scroll) */}
          {pagination.has_next && (
            <div className="sm:hidden">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}

          {/* Traditional Pagination (for desktop) */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.has_prev || loading}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ 
                length: Math.min(5, Math.ceil(pagination.total_count / pagination.limit))
              }).map((_, index) => {
                const pageNum = pagination.page - 2 + index
                const totalPages = Math.ceil(pagination.total_count / pagination.limit)
                
                if (pageNum < 1 || pageNum > totalPages) return null

                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    variant={pageNum === pagination.page ? 'default' : 'outline'}
                    size="sm"
                    className="min-w-[2.5rem]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.has_next || loading}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
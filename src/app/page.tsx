'use client'

import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import SupabaseTest from '@/components/SupabaseTest'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gaming Marketplace Pakistan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Buy and sell game accounts, in-game currency, and gaming services safely with escrow protection
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/browse">
                <Button size="lg" className="w-full sm:w-auto">
                  🛒 Browse Products
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  💰 Start Selling
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Verified Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">99%</div>
                <div className="text-sm text-gray-600">Safe Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
          <p className="text-gray-600">Find what you're looking for in our most popular categories</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link href="/browse?category=game_accounts" className="group">
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:bg-primary-50 transition-colors">
              <div className="text-primary-600 text-5xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Game Accounts</h3>
              <p className="text-gray-600">Pre-leveled accounts with rare items and progress</p>
            </div>
          </Link>

          <Link href="/browse?category=in_game_currency" className="group">
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:bg-primary-50 transition-colors">
              <div className="text-primary-600 text-5xl mb-4 group-hover:scale-110 transition-transform">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">In-Game Currency</h3>
              <p className="text-gray-600">Coins, gems, gold and other virtual currencies</p>
            </div>
          </Link>

          <Link href="/browse?category=boosting_services" className="group">
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:bg-primary-50 transition-colors">
              <div className="text-primary-600 text-5xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Gaming Services</h3>
              <p className="text-gray-600">Professional boosting and coaching services</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Hand-picked products from our top sellers</p>
          </div>
          
          <ProductGrid 
            searchQuery={{ 
              sort_by: 'created_at', 
              sort_order: 'desc' 
            }}
            title=""
            showPagination={false}
            initialLimit={8}
          />

          <div className="text-center mt-8">
            <Link href="/browse">
              <Button variant="outline" size="lg">
                View All Products →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Phase Status */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-primary-50 p-8 rounded-xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-primary-700 mb-4 text-center">
            ✅ Phase 12: Product Display Complete!
          </h2>
          <p className="text-primary-600 mb-4 text-center">
            Product grid, cards, and pagination are now working with real data from Supabase
          </p>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Database Connection Status:</h3>
            <SupabaseTest />
          </div>
        </div>
      </div>
    </div>
  );
}

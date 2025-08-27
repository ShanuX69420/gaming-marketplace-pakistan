import { supabase } from './supabase'
import { 
  Product, 
  ProductCreateData, 
  ProductUpdateData, 
  ProductSearchQuery, 
  ProductSearchResult,
  ProductWithSeller,
  ProductStats 
} from '@/types/product'

export class ProductService {
  // Get product by ID
  static async getProductById(productId: string): Promise<{ data: Product | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('status', 'active')
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to fetch product' }
    }
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<{ data: Product | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to fetch product' }
    }
  }

  // Get product with seller information
  static async getProductWithSeller(productId: string): Promise<{ data: ProductWithSeller | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles!seller_id (
            id,
            username,
            full_name,
            avatar_url,
            seller_rating,
            total_sales,
            email_verified,
            phone_verified,
            identity_verified
          )
        `)
        .eq('id', productId)
        .eq('status', 'active')
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to fetch product with seller' }
    }
  }

  // Search products with filters
  static async searchProducts(query: ProductSearchQuery): Promise<{ data: ProductSearchResult | null; error: string | null }> {
    try {
      let supabaseQuery = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('status', 'active')

      // Text search
      if (query.q) {
        supabaseQuery = supabaseQuery.textSearch('search_vector', query.q)
      }

      // Category filter
      if (query.category && query.category.length > 0) {
        supabaseQuery = supabaseQuery.in('category', query.category)
      }

      // Price range filter
      if (query.price_min !== undefined) {
        supabaseQuery = supabaseQuery.gte('price', query.price_min)
      }
      if (query.price_max !== undefined) {
        supabaseQuery = supabaseQuery.lte('price', query.price_max)
      }

      // Condition filter
      if (query.condition && query.condition.length > 0) {
        supabaseQuery = supabaseQuery.in('condition', query.condition)
      }

      // Platform filter
      if (query.platform && query.platform.length > 0) {
        supabaseQuery = supabaseQuery.in('platform', query.platform)
      }

      // Location filter
      if (query.location) {
        supabaseQuery = supabaseQuery.ilike('location', `%${query.location}%`)
      }

      // Game title filter
      if (query.game_title) {
        supabaseQuery = supabaseQuery.ilike('game_title', `%${query.game_title}%`)
      }

      // Boolean filters
      if (query.shipping_available !== undefined) {
        supabaseQuery = supabaseQuery.eq('shipping_available', query.shipping_available)
      }
      if (query.is_negotiable !== undefined) {
        supabaseQuery = supabaseQuery.eq('is_negotiable', query.is_negotiable)
      }
      if (query.is_instant_delivery !== undefined) {
        supabaseQuery = supabaseQuery.eq('is_instant_delivery', query.is_instant_delivery)
      }

      // Tags filter
      if (query.tags && query.tags.length > 0) {
        supabaseQuery = supabaseQuery.overlaps('tags', query.tags)
      }

      // Sorting
      const sortBy = query.sort_by || 'created_at'
      const sortOrder = query.sort_order || 'desc'
      
      if (sortBy === 'relevance' && query.q) {
        // For text search, use relevance ranking
        supabaseQuery = supabaseQuery.order('created_at', { ascending: sortOrder === 'asc' })
      } else {
        supabaseQuery = supabaseQuery.order(sortBy, { ascending: sortOrder === 'asc' })
      }

      // Pagination
      const page = query.page || 1
      const limit = query.limit || 20
      const offset = (page - 1) * limit

      supabaseQuery = supabaseQuery.range(offset, offset + limit - 1)

      const { data, error, count } = await supabaseQuery

      if (error) {
        return { data: null, error: error.message }
      }

      const totalCount = count || 0
      const hasNext = offset + limit < totalCount
      const hasPrev = page > 1

      const result: ProductSearchResult = {
        products: data || [],
        total_count: totalCount,
        page,
        limit,
        has_next: hasNext,
        has_prev: hasPrev
      }

      return { data: result, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to search products' }
    }
  }

  // Get user's products
  static async getUserProducts(userId?: string): Promise<{ data: Product[]; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const targetUserId = userId || user?.id
      
      if (!targetUserId) {
        return { data: [], error: 'User not authenticated' }
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) {
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: 'Failed to fetch user products' }
    }
  }

  // Create new product
  static async createProduct(productData: ProductCreateData): Promise<{ data: Product | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: null, error: 'User not authenticated' }
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          seller_id: user.id
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to create product' }
    }
  }

  // Update product
  static async updateProduct(productId: string, updates: ProductUpdateData): Promise<{ data: Product | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to update product' }
    }
  }

  // Delete product (soft delete)
  static async deleteProduct(productId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'deleted' })
        .eq('id', productId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: 'Failed to delete product' }
    }
  }

  // Increment product view count
  static async incrementViewCount(productId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.rpc('increment_product_views', {
        product_uuid: productId
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: 'Failed to increment view count' }
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 10): Promise<{ data: Product[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: 'Failed to fetch featured products' }
    }
  }

  // Get recent products
  static async getRecentProducts(limit: number = 10): Promise<{ data: Product[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: 'Failed to fetch recent products' }
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string, limit: number = 10): Promise<{ data: Product[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: 'Failed to fetch products by category' }
    }
  }

  // Get product statistics
  static async getProductStats(): Promise<{ data: ProductStats | null; error: string | null }> {
    try {
      // This would typically be implemented as a stored procedure for better performance
      const { data: allProducts, error } = await supabase
        .from('products')
        .select('category, price, status')

      if (error) {
        return { data: null, error: error.message }
      }

      const stats: ProductStats = {
        total_products: allProducts?.length || 0,
        active_products: allProducts?.filter(p => p.status === 'active').length || 0,
        sold_products: allProducts?.filter(p => p.status === 'sold').length || 0,
        average_price: 0,
        categories_count: {
          game_accounts: 0,
          in_game_currency: 0,
          top_ups: 0,
          boosting_services: 0,
          gift_cards: 0,
          gaming_hardware: 0,
          digital_games: 0,
          other: 0
        }
      }

      if (allProducts && allProducts.length > 0) {
        // Calculate average price
        const prices = allProducts.filter(p => p.price).map(p => p.price)
        stats.average_price = prices.length > 0 
          ? prices.reduce((sum, price) => sum + price, 0) / prices.length 
          : 0

        // Count by category
        allProducts.forEach(product => {
          if (product.category in stats.categories_count) {
            stats.categories_count[product.category as keyof typeof stats.categories_count]++
          }
        })
      }

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to fetch product statistics' }
    }
  }
}
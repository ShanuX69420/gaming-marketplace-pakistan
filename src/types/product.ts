// Product type definitions for the gaming marketplace

export type ProductCategory = 
  | 'game_accounts'
  | 'in_game_currency' 
  | 'top_ups'
  | 'boosting_services'
  | 'gift_cards'
  | 'gaming_hardware'
  | 'digital_games'
  | 'other'

export type ProductCondition = 
  | 'new'
  | 'like_new'
  | 'good'
  | 'fair'
  | 'poor'

export type ProductStatus = 
  | 'draft'
  | 'active'
  | 'sold'
  | 'suspended'
  | 'deleted'

export interface Product {
  id: string
  seller_id: string
  
  // Basic product information
  title: string
  description: string
  category: ProductCategory
  subcategory?: string
  
  // Pricing
  price: number
  original_price?: number
  currency: string
  
  // Product details
  condition: ProductCondition
  brand?: string
  model?: string
  platform?: string // For games: PC, PS5, Xbox, Mobile, etc.
  
  // Game-specific fields
  game_title?: string // Which game this is for
  server_region?: string // Game server region
  account_level?: number // For game accounts
  in_game_items?: string[] // Array of in-game items
  
  // Images and media
  image_urls: string[]
  thumbnail_url?: string
  video_url?: string
  
  // Inventory and availability
  quantity: number
  is_negotiable: boolean
  is_instant_delivery: boolean
  delivery_time?: string // e.g., "1-2 hours", "instant", etc.
  
  // Location and shipping
  location?: string
  shipping_available: boolean
  shipping_cost: number
  local_pickup: boolean
  
  // SEO and search
  tags: string[]
  slug: string
  
  // Status and moderation
  status: ProductStatus
  is_featured: boolean
  is_verified: boolean
  moderator_notes?: string
  
  // Analytics
  view_count: number
  favorite_count: number
  
  // Metadata
  created_at: string
  updated_at: string
  published_at?: string
  expires_at?: string
}

export interface ProductCreateData {
  title: string
  description: string
  category: ProductCategory
  subcategory?: string
  price: number
  original_price?: number
  currency?: string
  condition?: ProductCondition
  brand?: string
  model?: string
  platform?: string
  game_title?: string
  server_region?: string
  account_level?: number
  in_game_items?: string[]
  image_urls?: string[]
  thumbnail_url?: string
  video_url?: string
  quantity?: number
  is_negotiable?: boolean
  is_instant_delivery?: boolean
  delivery_time?: string
  location?: string
  shipping_available?: boolean
  shipping_cost?: number
  local_pickup?: boolean
  tags?: string[]
  slug?: string
  status?: ProductStatus
}

export interface ProductUpdateData extends Partial<ProductCreateData> {}

export interface ProductSearchFilters {
  category?: ProductCategory[]
  price_min?: number
  price_max?: number
  condition?: ProductCondition[]
  platform?: string[]
  location?: string
  game_title?: string
  shipping_available?: boolean
  is_negotiable?: boolean
  is_instant_delivery?: boolean
  tags?: string[]
}

export interface ProductSearchQuery extends ProductSearchFilters {
  q?: string // Search query
  sort_by?: 'created_at' | 'price' | 'view_count' | 'relevance'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ProductSearchResult {
  products: Product[]
  total_count: number
  page: number
  limit: number
  has_next: boolean
  has_prev: boolean
}

export interface ProductStats {
  total_products: number
  active_products: number
  sold_products: number
  average_price: number
  categories_count: Record<ProductCategory, number>
}

export interface ProductWithSeller extends Product {
  seller: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    seller_rating: number
    total_sales: number
    email_verified: boolean
    phone_verified: boolean
    identity_verified: boolean
  }
}

// Category display names and descriptions
export const PRODUCT_CATEGORIES: Record<ProductCategory, { name: string; description: string; icon: string }> = {
  game_accounts: {
    name: 'Game Accounts',
    description: 'Pre-leveled gaming accounts with progress and items',
    icon: '👤'
  },
  in_game_currency: {
    name: 'In-Game Currency',
    description: 'Virtual coins, gems, gold and other game currencies',
    icon: '💰'
  },
  top_ups: {
    name: 'Top-ups & Cards',
    description: 'Game credit top-ups and prepaid gaming cards',
    icon: '💳'
  },
  boosting_services: {
    name: 'Boosting Services',
    description: 'Professional gaming services and account boosting',
    icon: '⚡'
  },
  gift_cards: {
    name: 'Gift Cards',
    description: 'Steam, PlayStation, Xbox and other platform gift cards',
    icon: '🎁'
  },
  gaming_hardware: {
    name: 'Gaming Hardware',
    description: 'Gaming peripherals, consoles and computer hardware',
    icon: '🎮'
  },
  digital_games: {
    name: 'Digital Games',
    description: 'Game keys, licenses and digital game downloads',
    icon: '🎯'
  },
  other: {
    name: 'Other',
    description: 'Other gaming-related items and services',
    icon: '📦'
  }
}

// Condition display information
export const PRODUCT_CONDITIONS: Record<ProductCondition, { name: string; description: string; color: string }> = {
  new: {
    name: 'Brand New',
    description: 'Never used, in original packaging',
    color: 'green'
  },
  like_new: {
    name: 'Like New',
    description: 'Barely used, excellent condition',
    color: 'emerald'
  },
  good: {
    name: 'Good',
    description: 'Used with minor signs of wear',
    color: 'blue'
  },
  fair: {
    name: 'Fair',
    description: 'Used with noticeable wear but fully functional',
    color: 'yellow'
  },
  poor: {
    name: 'Poor',
    description: 'Heavily used, may have issues',
    color: 'red'
  }
}

// Popular gaming platforms
export const GAMING_PLATFORMS = [
  'PC',
  'PlayStation 5',
  'PlayStation 4', 
  'Xbox Series X/S',
  'Xbox One',
  'Nintendo Switch',
  'Mobile (iOS)',
  'Mobile (Android)',
  'Steam',
  'Epic Games',
  'Origin',
  'Uplay',
  'Battle.net',
  'Cross-Platform'
]

// Popular games for categorization
export const POPULAR_GAMES = [
  'PUBG Mobile',
  'Call of Duty Mobile',
  'Free Fire',
  'Fortnite',
  'Valorant',
  'Counter-Strike 2',
  'Apex Legends',
  'League of Legends',
  'Dota 2',
  'FIFA 24',
  'GTA V',
  'Minecraft',
  'Roblox',
  'Among Us',
  'Fall Guys',
  'Rocket League',
  'Clash of Clans',
  'Clash Royale',
  'PUBG PC',
  'Call of Duty: Warzone'
]
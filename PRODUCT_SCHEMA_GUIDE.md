# Product Schema Guide

## Overview
The product schema is designed specifically for a gaming marketplace, supporting various types of gaming-related items and services.

## Database Schema

### Products Table (`public.products`)

#### Primary Fields
- **id**: UUID primary key, auto-generated
- **seller_id**: References profiles table (user who created the listing)
- **title**: Product name/title (required)
- **description**: Detailed product description (required)
- **category**: Product category enum (required)
- **subcategory**: Optional sub-categorization

#### Pricing Fields
- **price**: Current selling price (required, must be >= 0)
- **original_price**: Optional original/MSRP price for comparison
- **currency**: Currency code (default: 'PKR')

#### Product Details
- **condition**: Product condition enum (new, like_new, good, fair, poor)
- **brand**: Product manufacturer/brand
- **model**: Product model/version
- **platform**: Gaming platform (PC, PS5, Xbox, Mobile, etc.)

#### Game-Specific Fields
- **game_title**: Which game this product is for
- **server_region**: Game server region (e.g., Asia, EU, NA)
- **account_level**: For game accounts, the character/account level
- **in_game_items**: Array of in-game items included

#### Media Fields
- **image_urls**: Array of product image URLs
- **thumbnail_url**: Main product image for cards/previews
- **video_url**: Optional product demo video

#### Availability Fields
- **quantity**: Available stock (default: 1)
- **is_negotiable**: Whether price is negotiable
- **is_instant_delivery**: Whether delivery is instant/automated
- **delivery_time**: Expected delivery timeframe

#### Location & Shipping
- **location**: Seller's location/city
- **shipping_available**: Whether item can be shipped
- **shipping_cost**: Shipping fee (default: 0)
- **local_pickup**: Whether local pickup is available

#### SEO & Discovery
- **tags**: Array of searchable tags
- **slug**: URL-friendly identifier (auto-generated)
- **search_vector**: Full-text search vector (auto-generated)

#### Status & Moderation
- **status**: Product status (draft, active, sold, suspended, deleted)
- **is_featured**: Whether product is featured/promoted
- **is_verified**: Whether product has been verified by moderators
- **moderator_notes**: Admin notes for moderation

#### Analytics
- **view_count**: Number of times product was viewed
- **favorite_count**: Number of users who favorited

#### Timestamps
- **created_at**: When product was created
- **updated_at**: When product was last modified (auto-updated)
- **published_at**: When product went live
- **expires_at**: Optional expiration date

## Enums

### ProductCategory
```sql
'game_accounts'     -- Pre-leveled gaming accounts
'in_game_currency'  -- Virtual coins, gems, gold
'top_ups'          -- Game credit top-ups, prepaid cards
'boosting_services' -- Professional gaming services
'gift_cards'       -- Platform gift cards (Steam, PSN, etc.)
'gaming_hardware'  -- Gaming peripherals, consoles
'digital_games'    -- Game keys, licenses
'other'           -- Other gaming items
```

### ProductCondition
```sql
'new'       -- Brand new, unused
'like_new'  -- Barely used, excellent condition
'good'      -- Used with minor wear
'fair'      -- Used with noticeable wear
'poor'      -- Heavily used, may have issues
```

### ProductStatus
```sql
'draft'     -- Not yet published
'active'    -- Live and available for purchase
'sold'      -- Successfully sold
'suspended' -- Temporarily suspended
'deleted'   -- Soft deleted
```

## Key Features

### 1. **Full-Text Search**
- Automatic search vector generation from title, description, tags, etc.
- Supports relevance-based ranking
- GIN index for fast text search

### 2. **Smart Slug Generation**
- Automatic URL-friendly slug creation from title
- Unique slug enforcement with counters
- SEO-optimized URLs

### 3. **Advanced Indexing**
- Composite indexes for common query patterns
- Category + date indexing for browsing
- Price range indexing for filtering
- Location-based indexing

### 4. **Gaming-Specific Fields**
- Platform targeting (PC, console, mobile)
- Game title association
- Server region specification
- In-game items tracking

### 5. **Flexible Pricing**
- Support for negotiable pricing
- Original price comparison
- Multi-currency support (PKR default)

### 6. **Smart Analytics**
- View count tracking with dedicated function
- Favorite counting for popularity
- Performance optimization for high-traffic

## Security (RLS Policies)

### Read Access
- **Public**: Can view active products only
- **Sellers**: Can view all their own products (any status)

### Write Access
- **Create**: Authenticated users can create products
- **Update**: Users can only update their own products
- **Delete**: Users can only delete their own products (soft delete)

### Special Functions
- `increment_product_views()`: Secure function for analytics
- Available to authenticated users
- Prevents manual manipulation of view counts

## TypeScript Integration

### Key Types
```typescript
interface Product {
  id: string
  seller_id: string
  title: string
  description: string
  category: ProductCategory
  price: number
  // ... (see product.ts for complete interface)
}

interface ProductCreateData {
  title: string
  description: string
  category: ProductCategory
  price: number
  // ... (all optional fields)
}
```

### Service Methods
```typescript
ProductService.searchProducts(query)     // Advanced search with filters
ProductService.getProductById(id)       // Get single product
ProductService.createProduct(data)      // Create new product
ProductService.updateProduct(id, data)  // Update existing product
ProductService.getFeaturedProducts()    // Get featured listings
```

## Usage Examples

### Creating a Game Account Listing
```typescript
const gameAccount = {
  title: "Level 85 PUBG Mobile Account - Conqueror Tier",
  description: "Fully maxed account with rare skins and weapons...",
  category: "game_accounts",
  price: 15000,
  currency: "PKR",
  game_title: "PUBG Mobile",
  account_level: 85,
  server_region: "Asia",
  platform: "Mobile (Android)",
  in_game_items: ["AWM Glacier", "AKM Fool", "Mythic Outfit"],
  is_instant_delivery: true,
  tags: ["pubg", "mobile", "conqueror", "rare-skins"]
}
```

### Searching Products
```typescript
const searchQuery = {
  q: "PUBG account",
  category: ["game_accounts"],
  price_max: 20000,
  platform: ["Mobile (Android)", "Mobile (iOS)"],
  sort_by: "price",
  sort_order: "asc",
  limit: 20
}
```

## Database Migration

To apply this schema:
1. Run the migration file: `005_create_products_table.sql`
2. Verify table creation in Supabase dashboard
3. Test with sample data creation

## Performance Considerations

1. **Indexes**: All major query patterns are indexed
2. **Search Vector**: Automatically maintained for fast text search  
3. **Pagination**: Built-in support prevents large result sets
4. **View Counting**: Uses dedicated function to avoid race conditions
5. **Soft Deletes**: Status-based deletion preserves referential integrity

This schema provides a solid foundation for Phase 11 (Product Creation) and beyond.
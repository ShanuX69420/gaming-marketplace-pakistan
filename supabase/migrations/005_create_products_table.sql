CREATE TYPE product_category AS ENUM (
      'game_accounts',
      'in_game_currency',
      'top_ups',
      'boosting_services',
      'gift_cards',
      'gaming_hardware',
      'digital_games',
      'other'
  );

  -- Create product condition enum
  CREATE TYPE product_condition AS ENUM (
      'new',
      'like_new',
      'good',
      'fair',
      'poor'
  );

  -- Create product status enum
  CREATE TYPE product_status AS ENUM (
      'draft',
      'active',
      'sold',
      'suspended',
      'deleted'
  );

  -- Create products table
  CREATE TABLE IF NOT EXISTS public.products (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

      -- Basic product information
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category product_category NOT NULL,
      subcategory TEXT,

      -- Pricing
      price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
      original_price DECIMAL(10,2) CHECK (original_price >= price),
      currency TEXT DEFAULT 'PKR' NOT NULL,

      -- Product details
      condition product_condition DEFAULT 'new',
      brand TEXT,
      model TEXT,
      platform TEXT, -- For games: PC, PS5, Xbox, Mobile, etc.

      -- Game-specific fields
      game_title TEXT, -- Which game this is for
      server_region TEXT, -- Game server region
      account_level INTEGER, -- For game accounts
      in_game_items TEXT[], -- Array of in-game items

      -- Images and media
      image_urls TEXT[] DEFAULT '{}',
      thumbnail_url TEXT,
      video_url TEXT,

      -- Inventory and availability
      quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
      is_negotiable BOOLEAN DEFAULT FALSE,
      is_instant_delivery BOOLEAN DEFAULT FALSE,
      delivery_time TEXT, -- e.g., "1-2 hours", "instant", etc.

      -- Location and shipping
      location TEXT,
      shipping_available BOOLEAN DEFAULT FALSE,
      shipping_cost DECIMAL(10,2) DEFAULT 0,
      local_pickup BOOLEAN DEFAULT TRUE,

      -- SEO and search
      tags TEXT[] DEFAULT '{}',
      slug TEXT UNIQUE,

      -- Status and moderation
      status product_status DEFAULT 'draft',
      is_featured BOOLEAN DEFAULT FALSE,
      is_verified BOOLEAN DEFAULT FALSE,
      moderator_notes TEXT,

      -- Analytics
      view_count INTEGER DEFAULT 0,
      favorite_count INTEGER DEFAULT 0,

      -- Metadata
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      published_at TIMESTAMP WITH TIME ZONE,
      expires_at TIMESTAMP WITH TIME ZONE,

      -- Search vector (we'll handle this with triggers instead)
      search_vector tsvector
  );

  -- Create indexes for better query performance
  CREATE INDEX IF NOT EXISTS products_seller_id_idx ON public.products (seller_id);
  CREATE INDEX IF NOT EXISTS products_category_idx ON public.products (category);
  CREATE INDEX IF NOT EXISTS products_status_idx ON public.products (status);
  CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products (created_at DESC);
  CREATE INDEX IF NOT EXISTS products_price_idx ON public.products (price);
  CREATE INDEX IF NOT EXISTS products_location_idx ON public.products (location);
  CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products (is_featured) WHERE is_featured = true;
  CREATE INDEX IF NOT EXISTS products_search_idx ON public.products USING GIN (search_vector);
  CREATE INDEX IF NOT EXISTS products_tags_idx ON public.products USING GIN (tags);
  CREATE INDEX IF NOT EXISTS products_game_title_idx ON public.products (game_title) WHERE game_title IS NOT NULL;
  CREATE INDEX IF NOT EXISTS products_platform_idx ON public.products (platform) WHERE platform IS NOT NULL;

  -- Create composite indexes for common queries
  CREATE INDEX IF NOT EXISTS products_active_category_idx ON public.products (category, created_at DESC) WHERE status =
   'active';
  CREATE INDEX IF NOT EXISTS products_active_price_idx ON public.products (price, created_at DESC) WHERE status =
  'active';
  CREATE INDEX IF NOT EXISTS products_seller_status_idx ON public.products (seller_id, status, created_at DESC);

  -- Function to update updated_at timestamp
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Function to update search vector
  CREATE OR REPLACE FUNCTION update_product_search_vector()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.search_vector := to_tsvector('english',
          coalesce(NEW.title, '') || ' ' ||
          coalesce(NEW.description, '') || ' ' ||
          coalesce(NEW.game_title, '') || ' ' ||
          coalesce(NEW.brand, '') || ' ' ||
          coalesce(array_to_string(NEW.tags, ' '), '')
      );
      RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Create trigger to automatically update updated_at
  CREATE TRIGGER update_products_updated_at
      BEFORE UPDATE ON public.products
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

  -- Create trigger to automatically update search_vector
  CREATE TRIGGER update_products_search_vector_trigger
      BEFORE INSERT OR UPDATE ON public.products
      FOR EACH ROW
      EXECUTE FUNCTION update_product_search_vector();

  -- Function to generate slug from title
  CREATE OR REPLACE FUNCTION generate_product_slug(product_title TEXT, product_id UUID)
  RETURNS TEXT AS $$
  DECLARE
      base_slug TEXT;
      final_slug TEXT;
      counter INTEGER := 0;
  BEGIN
      -- Create base slug from title
      base_slug := lower(regexp_replace(product_title, '[^a-zA-Z0-9\s]', '', 'g'));
      base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
      base_slug := trim(base_slug, '-');

      -- Ensure slug is not empty
      IF base_slug = '' THEN
          base_slug := 'product';
      END IF;

      -- Check if slug exists and make it unique
      final_slug := base_slug;
      WHILE EXISTS (SELECT 1 FROM public.products WHERE slug = final_slug AND id != product_id) LOOP
          counter := counter + 1;
          final_slug := base_slug || '-' || counter;
      END LOOP;

      RETURN final_slug;
  END;
  $$ LANGUAGE plpgsql;

  -- Function to auto-generate slug before insert/update
  CREATE OR REPLACE FUNCTION set_product_slug()
  RETURNS TRIGGER AS $$
  BEGIN
      IF NEW.slug IS NULL OR NEW.slug = '' THEN
          NEW.slug := generate_product_slug(NEW.title, NEW.id);
      END IF;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create trigger to auto-generate slug
  CREATE TRIGGER set_product_slug_trigger
      BEFORE INSERT OR UPDATE ON public.products
      FOR EACH ROW
      EXECUTE FUNCTION set_product_slug();

  -- Function to increment view count
  CREATE OR REPLACE FUNCTION increment_product_views(product_uuid UUID)
  RETURNS VOID AS $$
  BEGIN
      UPDATE public.products
      SET view_count = view_count + 1
      WHERE id = product_uuid AND status = 'active';
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Enable Row Level Security (RLS)
  ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

  -- Create RLS policies
  -- Public can view active products
  CREATE POLICY "Active products are viewable by everyone" ON public.products
      FOR SELECT USING (status = 'active');

  -- Sellers can view their own products
  CREATE POLICY "Users can view their own products" ON public.products
      FOR SELECT USING (auth.uid() = seller_id);

  -- Users can create products
  CREATE POLICY "Authenticated users can create products" ON public.products
      FOR INSERT WITH CHECK (auth.uid() = seller_id);

  -- Users can update their own products
  CREATE POLICY "Users can update their own products" ON public.products
      FOR UPDATE USING (auth.uid() = seller_id);

  -- Users can delete their own products (soft delete by updating status)
  CREATE POLICY "Users can delete their own products" ON public.products
      FOR DELETE USING (auth.uid() = seller_id);

  -- Grant necessary permissions
  GRANT SELECT ON public.products TO authenticated;
  GRANT INSERT ON public.products TO authenticated;
  GRANT UPDATE ON public.products TO authenticated;
  GRANT DELETE ON public.products TO authenticated;
  GRANT EXECUTE ON FUNCTION increment_product_views(UUID) TO authenticated;
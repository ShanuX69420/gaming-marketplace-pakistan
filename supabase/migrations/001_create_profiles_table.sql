-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    location TEXT,
    
    -- Verification status
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    identity_verified BOOLEAN DEFAULT FALSE,
    
    -- Seller information
    is_seller BOOLEAN DEFAULT FALSE,
    seller_rating DECIMAL(3,2) DEFAULT 0.00,
    total_sales INTEGER DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    
    -- Account status
    is_active BOOLEAN DEFAULT TRUE,
    is_suspended BOOLEAN DEFAULT FALSE,
    suspension_reason TEXT,
    
    -- Social links
    discord_username TEXT,
    telegram_username TEXT,
    whatsapp_number TEXT,
    
    -- Preferences
    preferred_currency TEXT DEFAULT 'PKR',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles (username);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);
CREATE INDEX IF NOT EXISTS profiles_seller_idx ON public.profiles (is_seller);
CREATE INDEX IF NOT EXISTS profiles_active_idx ON public.profiles (is_active);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles (created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view all active profiles (public info only)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (is_active = true);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users cannot delete profiles (admin only)
CREATE POLICY "Profiles cannot be deleted by users" ON public.profiles
    FOR DELETE USING (false);
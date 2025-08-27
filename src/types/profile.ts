export interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  full_name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  location: string | null
  
  // Verification status
  email_verified: boolean
  phone_verified: boolean
  identity_verified: boolean
  
  // Seller information
  is_seller: boolean
  seller_rating: number
  total_sales: number
  total_purchases: number
  
  // Account status
  is_active: boolean
  is_suspended: boolean
  suspension_reason: string | null
  
  // Social links
  discord_username: string | null
  telegram_username: string | null
  whatsapp_number: string | null
  
  // Preferences
  preferred_currency: string
  notifications_enabled: boolean
  marketing_emails: boolean
  
  // Metadata
  created_at: string
  updated_at: string
}

export interface ProfileUpdateData {
  first_name?: string
  last_name?: string
  username?: string
  bio?: string
  phone?: string
  location?: string
  discord_username?: string
  telegram_username?: string
  whatsapp_number?: string
  preferred_currency?: string
  notifications_enabled?: boolean
  marketing_emails?: boolean
}

export interface ProfileStats {
  total_sales: number
  total_purchases: number
  seller_rating: number
  reviews_count: number
  verification_badges: string[]
}

export type ProfileVisibility = 'public' | 'private' | 'friends'

export interface ProfileSettings {
  profile_visibility: ProfileVisibility
  show_email: boolean
  show_phone: boolean
  show_location: boolean
  allow_messages: boolean
  notification_preferences: {
    email_notifications: boolean
    sms_notifications: boolean
    push_notifications: boolean
    marketing_emails: boolean
  }
}
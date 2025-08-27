import { supabase } from './supabase'
import { Profile, ProfileUpdateData } from '@/types/profile'

export class ProfileService {
  // Get current user's profile
  static async getCurrentUserProfile(): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: null, error: 'User not authenticated' }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to fetch profile' }
    }
  }

  // Get profile by ID
  static async getProfileById(userId: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to fetch profile' }
    }
  }

  // Get profile by username
  static async getProfileByUsername(username: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to fetch profile' }
    }
  }

  // Update current user's profile
  static async updateProfile(updates: ProfileUpdateData): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: null, error: 'User not authenticated' }
      }

      // If updating first_name or last_name, also update full_name
      const updateData = { ...updates }
      if (updates.first_name || updates.last_name) {
        // Get current profile to build full name
        const { data: currentProfile } = await this.getCurrentUserProfile()
        const firstName = updates.first_name || currentProfile?.first_name || ''
        const lastName = updates.last_name || currentProfile?.last_name || ''
        updateData.full_name = `${firstName} ${lastName}`.trim()
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to update profile' }
    }
  }

  // Generate unique username suggestion
  static async generateUsername(firstName: string, lastName: string): Promise<{ data: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase.rpc('generate_username', {
        first_name: firstName,
        last_name: lastName
      })

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to generate username' }
    }
  }

  // Check if username is available
  static async isUsernameAvailable(username: string): Promise<{ available: boolean; error: string | null }> {
    try {
      const { data, error } = await supabase.rpc('check_username_availability', {
        username_to_check: username
      })

      if (error) {
        return { available: false, error: error.message }
      }

      return { available: data, error: null }
    } catch (error) {
      return { available: false, error: 'Failed to check username availability' }
    }
  }

  // Update avatar URL
  static async updateAvatar(avatarUrl: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: 'Failed to update avatar' }
    }
  }

  // Search profiles
  static async searchProfiles(query: string, limit: number = 10): Promise<{ data: Profile[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .eq('is_active', true)
        .eq('is_suspended', false)
        .limit(limit)
        .order('created_at', { ascending: false })

      if (error) {
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: 'Failed to search profiles' }
    }
  }
}
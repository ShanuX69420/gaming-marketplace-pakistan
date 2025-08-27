import { supabase } from './supabase'

export class StorageService {
  // Upload avatar image
  static async uploadAvatar(file: File, userId: string): Promise<{ data: string | null; error: string | null }> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return { data: null, error: 'Please upload an image file' }
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        return { data: null, error: 'Image size must be less than 5MB' }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/avatar.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Overwrite existing file
        })

      if (error) {
        return { data: null, error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to upload avatar' }
    }
  }

  // Delete avatar image
  static async deleteAvatar(userId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // List all files in user's avatar folder
      const { data: files, error: listError } = await supabase.storage
        .from('avatars')
        .list(userId)

      if (listError) {
        return { success: false, error: listError.message }
      }

      if (!files || files.length === 0) {
        return { success: true, error: null } // No files to delete
      }

      // Delete all avatar files for the user
      const filesToDelete = files.map(file => `${userId}/${file.name}`)
      
      const { error } = await supabase.storage
        .from('avatars')
        .remove(filesToDelete)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: 'Failed to delete avatar' }
    }
  }

  // Get avatar URL
  static getAvatarUrl(fileName: string): string {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    return data.publicUrl
  }

  // Upload product image (for future use)
  static async uploadProductImage(file: File, userId: string, productId: string): Promise<{ data: string | null; error: string | null }> {
    try {
      if (!file.type.startsWith('image/')) {
        return { data: null, error: 'Please upload an image file' }
      }

      const maxSize = 10 * 1024 * 1024 // 10MB for product images
      if (file.size > maxSize) {
        return { data: null, error: 'Image size must be less than 10MB' }
      }

      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      const fileName = `${userId}/${productId}/${timestamp}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600'
        })

      if (error) {
        return { data: null, error: error.message }
      }

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error) {
      return { data: null, error: 'Failed to upload product image' }
    }
  }

  // Generate avatar placeholder based on initials
  static generateAvatarPlaceholder(firstName?: string, lastName?: string): string {
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'
    
    // Generate a consistent color based on initials
    const colors = [
      '#10B981', '#059669', '#047857', '#065F46',
      '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF',
      '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6',
      '#EF4444', '#DC2626', '#B91C1C', '#991B1B'
    ]
    
    const colorIndex = initials.charCodeAt(0) % colors.length
    const backgroundColor = colors[colorIndex]
    
    // Return a data URL for the SVG placeholder
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${backgroundColor}"/>
        <text x="50" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${initials}
        </text>
      </svg>
    `
    
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
}
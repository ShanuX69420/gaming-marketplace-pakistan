import { Profile } from './profile'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
          id: string
        }
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      // Future tables will be added here
      products: {
        Row: any // Will be defined in Phase 10
        Insert: any
        Update: any
      }
      orders: {
        Row: any // Will be defined in Phase 15
        Insert: any
        Update: any
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_username: {
        Args: {
          first_name: string
          last_name: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
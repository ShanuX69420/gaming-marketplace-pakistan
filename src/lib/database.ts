import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('_health_check')
      .select('*')
      .limit(1)
    
    return {
      success: true,
      message: 'Database connection successful',
      error: null
    }
  } catch (err) {
    return {
      success: false,
      message: 'Database connection failed',
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

export async function getDatabaseStatus() {
  try {
    const { data, error } = await supabase.rpc('version')
    
    if (error) {
      return {
        connected: true,
        version: 'Unknown',
        message: 'Connected but version check failed'
      }
    }
    
    return {
      connected: true,
      version: data,
      message: 'Database fully operational'
    }
  } catch (err) {
    return {
      connected: false,
      version: null,
      message: err instanceof Error ? err.message : 'Connection failed'
    }
  }
}
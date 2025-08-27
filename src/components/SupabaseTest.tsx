'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing connection...')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function testConnection() {
      try {
        // Direct test of profiles table (Phase 7)
        console.log('Testing profiles table...')
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, created_at')
          .limit(1)
        
        console.log('Profile test result:', { profileData, profileError })
        
        if (profileError) {
          if (profileError.message.includes('relation "profiles" does not exist')) {
            setConnectionStatus('✅ Connected - Ready to setup Phase 7 database schema')
          } else if (profileError.message.includes('permission denied') || profileError.message.includes('RLS')) {
            setConnectionStatus('✅ Connected - Profile table exists but needs RLS policy fix')
          } else {
            console.log('Profile error details:', profileError)
            setConnectionStatus(`⚠️ Profile table issue: ${profileError.message}`)
          }
        } else {
          // Table exists and is accessible (profileData can be empty array)
          const profileCount = profileData?.length || 0
          setConnectionStatus(`✅ Connected - Profile schema ready! (Phase 7 complete) - ${profileCount} profiles`)
        }
      } catch (err) {
        console.error('Connection test error:', err)
        if (err instanceof Error && err.message.includes('Missing Supabase environment variables')) {
          setConnectionStatus('❌ Please configure Supabase environment variables in .env.local')
        } else {
          setConnectionStatus('❌ Connection failed - check your configuration')
        }
      } finally {
        setIsLoading(false)
      }
    }

    testConnection()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-700 text-sm">Testing Supabase connection...</p>
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border ${
      connectionStatus.includes('✅') 
        ? 'bg-green-50 border-green-200' 
        : connectionStatus.includes('❌')
        ? 'bg-red-50 border-red-200'
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <p className={`text-sm font-medium ${
        connectionStatus.includes('✅')
          ? 'text-green-700'
          : connectionStatus.includes('❌')
          ? 'text-red-700'
          : 'text-yellow-700'
      }`}>
        {connectionStatus}
      </p>
      
      {connectionStatus.includes('❌') && (
        <div className="mt-2 text-xs text-gray-600">
          <p>To fix this:</p>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Go to <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 underline">supabase.com/dashboard</a></li>
            <li>Create a new project</li>
            <li>Go to Settings → API</li>
            <li>Update .env.local with your Project URL and anon key</li>
            <li>Restart the dev server</li>
          </ol>
        </div>
      )}
      
      {connectionStatus.includes('Ready to setup Phase 7') && (
        <div className="mt-2 text-xs text-gray-600">
          <p>📋 <strong>Next Step:</strong> Setup database schema for profiles</p>
          <p className="mt-1">
            See <code className="bg-gray-200 px-1 rounded">DATABASE_SETUP.md</code> for instructions
          </p>
        </div>
      )}
    </div>
  )
}
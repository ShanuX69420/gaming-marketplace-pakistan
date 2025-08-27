'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileService } from '@/lib/profiles'
import { Profile, ProfileUpdateData } from '@/types/profile'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState<ProfileUpdateData>({
    first_name: '',
    last_name: '',
    username: '',
    bio: '',
    phone: '',
    location: '',
    discord_username: '',
    telegram_username: '',
    whatsapp_number: '',
    preferred_currency: 'PKR',
    notifications_enabled: true,
    marketing_emails: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data, error } = await ProfileService.getCurrentUserProfile()
      
      if (error) {
        setError(error)
      } else if (data) {
        setProfile(data)
        // Populate form with existing data
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          username: data.username || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
          discord_username: data.discord_username || '',
          telegram_username: data.telegram_username || '',
          whatsapp_number: data.whatsapp_number || '',
          preferred_currency: data.preferred_currency || 'PKR',
          notifications_enabled: data.notifications_enabled ?? true,
          marketing_emails: data.marketing_emails ?? false,
        })
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProfileUpdateData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear messages when user starts typing
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate username format
      if (formData.username && !/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
        setError('Username must be 3-20 characters and contain only letters, numbers, and underscores')
        setSaving(false)
        return
      }

      // Check username availability if changed
      if (formData.username && formData.username !== profile?.username) {
        const { available, error: usernameError } = await ProfileService.isUsernameAvailable(formData.username)
        if (usernameError) {
          setError(usernameError)
          setSaving(false)
          return
        }
        if (!available) {
          setError('Username is already taken')
          setSaving(false)
          return
        }
      }

      const { data, error } = await ProfileService.updateProfile(formData)
      
      if (error) {
        setError(error)
      } else if (data) {
        setProfile(data)
        setSuccess('Profile updated successfully!')
        // Redirect to public profile after a delay
        setTimeout(() => {
          router.push(`/profile/${data.id}`)
        }, 2000)
      }
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const getVerificationBadges = (profile: Profile) => {
    const badges = []
    if (profile.email_verified) badges.push('Email')
    if (profile.phone_verified) badges.push('Phone')
    if (profile.identity_verified) badges.push('Identity')
    return badges
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Update your profile information and preferences</p>
          </div>

          {/* Verification Status */}
          {profile && (
            <Card className="p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${profile.email_verified ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-gray-600 break-all">{profile.email}</div>
                    </div>
                    {profile.email_verified ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${profile.phone_verified ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-gray-600 break-all">{profile.phone || 'Not provided'}</div>
                    </div>
                    {profile.phone_verified ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${profile.identity_verified ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="font-medium">Identity</div>
                      <div className="text-sm text-gray-600">CNIC/Passport</div>
                    </div>
                    {profile.identity_verified ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              {(!profile.phone_verified || !profile.identity_verified) && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900">Complete your verification</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Verify your phone number and identity to increase trust and unlock seller features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Profile Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      type="text"
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <Input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Choose a unique username"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    3-20 characters, letters, numbers, and underscores only
                  </p>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Pakistan"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Social Media & Contact</h2>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-emerald-900">Privacy Notice</h4>
                      <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                        This contact information is for verification purposes only and will NOT be shown publicly on your profile. 
                        All buyer-seller communication happens through our secure in-platform messaging system.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="discord_username" className="block text-sm font-medium text-gray-700 mb-2">
                      Discord Username
                    </label>
                    <Input
                      type="text"
                      id="discord_username"
                      value={formData.discord_username}
                      onChange={(e) => handleInputChange('discord_username', e.target.value)}
                      placeholder="username#1234"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telegram_username" className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram Username
                    </label>
                    <Input
                      type="text"
                      id="telegram_username"
                      value={formData.telegram_username}
                      onChange={(e) => handleInputChange('telegram_username', e.target.value)}
                      placeholder="username (without @)"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>
                    <Input
                      type="tel"
                      id="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="preferred_currency" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Currency
                    </label>
                    <select
                      id="preferred_currency"
                      value={formData.preferred_currency}
                      onChange={(e) => handleInputChange('preferred_currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="PKR">PKR - Pakistani Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications_enabled"
                        checked={formData.notifications_enabled}
                        onChange={(e) => handleInputChange('notifications_enabled', e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifications_enabled" className="ml-2 text-sm text-gray-700">
                        Enable notifications for orders and messages
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marketing_emails"
                        checked={formData.marketing_emails}
                        onChange={(e) => handleInputChange('marketing_emails', e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <label htmlFor="marketing_emails" className="ml-2 text-sm text-gray-700">
                        Receive marketing emails and promotions
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{success}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(profile ? `/profile/${profile.id}` : '/browse')}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
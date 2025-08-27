'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProfileService } from '@/lib/profiles'
import { Profile } from '@/types/profile'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [params.id])

  const fetchProfile = async () => {
    if (!params.id || typeof params.id !== 'string') {
      setError('Invalid profile ID')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await ProfileService.getProfileById(params.id)
      
      if (error) {
        setError(error)
      } else if (!data) {
        setError('Profile not found')
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const getVerificationBadges = (profile: Profile) => {
    const badges = []
    if (profile.email_verified) badges.push('Email')
    if (profile.phone_verified) badges.push('Phone')
    if (profile.identity_verified) badges.push('Identity')
    return badges
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded mb-2 w-64"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-800 mb-2">Profile Not Found</h1>
            <p className="text-red-600 mb-4">{error || 'This profile does not exist or has been removed.'}</p>
            <Button 
              onClick={() => router.push('/browse')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Back to Browse
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const badges = getVerificationBadges(profile)

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold border-4 border-emerald-200">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Profile'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}</span>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.full_name || profile.username || 'Anonymous User'}
                  </h1>
                  {profile.username && profile.full_name && (
                    <p className="text-gray-600 mb-2">@{profile.username}</p>
                  )}
                  {profile.bio && (
                    <p className="text-gray-700 mb-4">{profile.bio}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {profile.location && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {profile.location}
                      </span>
                    )}
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined {formatJoinDate(profile.created_at)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Report User
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badges */}
          {badges.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Verified Information</h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {badge} Verified
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Stats and Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-2">{profile.seller_rating}/5</div>
            <div className="text-gray-600 text-sm">Seller Rating</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">{profile.total_sales}</div>
            <div className="text-gray-600 text-sm">Total Sales</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">{profile.total_purchases}</div>
            <div className="text-gray-600 text-sm">Total Purchases</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-2">
              {profile.is_seller ? 'Seller' : 'Buyer'}
            </div>
            <div className="text-gray-600 text-sm">Account Type</div>
          </Card>
        </div>

        {/* Platform Features */}
        <Card className="p-8 mb-8 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Communication</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Connect with this seller through our secure messaging system. All conversations are protected and transactions are safely managed through our platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Secure Chat</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Escrow Protection</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h2a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Dispute Support</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity / Listings */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m0 6l2 2-2 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
            <p className="text-gray-600">This user hasn't posted any listings recently.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
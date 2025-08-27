import { Profile } from '@/types/profile'

interface VerificationBadgesProps {
  profile: Profile
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical'
}

export default function VerificationBadges({ 
  profile, 
  size = 'md', 
  layout = 'horizontal' 
}: VerificationBadgesProps) {
  const badges = []
  
  if (profile.email_verified) badges.push('Email')
  if (profile.phone_verified) badges.push('Phone')
  if (profile.identity_verified) badges.push('Identity')

  if (badges.length === 0) {
    return null
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-3 py-1.5'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const containerClasses = layout === 'horizontal' 
    ? 'flex flex-wrap gap-2' 
    : 'flex flex-col space-y-2'

  return (
    <div className={containerClasses}>
      {badges.map((badge) => (
        <span
          key={badge}
          className={`inline-flex items-center rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 ${sizeClasses[size]}`}
        >
          <svg 
            className={`mr-1 ${iconSizes[size]}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
          {badge} Verified
        </span>
      ))}
    </div>
  )
}

export function VerificationStatus({ profile }: { profile: Profile }) {
  const verifications = [
    {
      key: 'email',
      label: 'Email',
      verified: profile.email_verified,
      value: profile.email,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      verified: profile.phone_verified,
      value: profile.phone,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      key: 'identity',
      label: 'Identity',
      verified: profile.identity_verified,
      value: 'CNIC/Passport',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {verifications.map((item) => (
        <div
          key={item.key}
          className={`p-4 rounded-lg border-2 ${
            item.verified 
              ? 'border-emerald-200 bg-emerald-50' 
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${item.verified ? 'text-emerald-600' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-600">
                  {item.value || 'Not provided'}
                </div>
              </div>
            </div>
            <div>
              {item.verified ? (
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
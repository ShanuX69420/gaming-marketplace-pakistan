'use client'

import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import ProductListingForm from '@/components/ProductListingForm'

export default function Sell() {
  const router = useRouter()

  const handleSuccess = (productId: string) => {
    // Navigate to the product page or dashboard
    router.push(`/dashboard?message=Product created successfully!`)
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <ProductListingForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}
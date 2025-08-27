import ProtectedRoute from '@/components/ProtectedRoute'

export default function Sell() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start Selling
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Coming soon in Phase 11: Product Creation
            </p>
            <div className="bg-primary-50 p-8 rounded-lg">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">
                🎉 Authentication Working!
              </h2>
              <p className="text-primary-600 mb-4">
                You're now logged in and can access protected pages.
              </p>
              <p className="text-gray-600">
                This page will contain the product listing form and seller dashboard in Phase 11.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
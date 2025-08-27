import SupabaseTest from '@/components/SupabaseTest'

export default function Home() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Gaming Marketplace Pakistan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy and sell game accounts, in-game currency, and gaming services
          </p>
          
          <div className="space-y-6">
            <div className="bg-primary-50 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-primary-700 mb-4">
                Phase 7: User Profile Schema Complete!
              </h2>
              <p className="text-primary-600 mb-4">
                Database schema created for user profiles, metadata, and avatar uploads
              </p>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Database Connection Status:</h3>
                <SupabaseTest />
              </div>
            </div>

            {/* Hero Section Preview */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-primary-600 text-4xl mb-4">🎮</div>
                <h3 className="font-semibold text-gray-900 mb-2">Game Accounts</h3>
                <p className="text-gray-600 text-sm">Buy and sell verified gaming accounts safely</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-primary-600 text-4xl mb-4">💰</div>
                <h3 className="font-semibold text-gray-900 mb-2">In-Game Currency</h3>
                <p className="text-gray-600 text-sm">Trade in-game currencies and items</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-primary-600 text-4xl mb-4">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-2">Gaming Services</h3>
                <p className="text-gray-600 text-sm">Professional boosting and coaching</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

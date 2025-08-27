'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut, loading } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-primary-600">
                Gaming Market
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Browse
            </Link>
            <Link href="/sell" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Sell
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              How It Works
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : user ? (
              <>
                <div className="text-gray-700 px-3 py-2 text-sm">
                  Welcome, {user.user_metadata?.first_name || user.email}
                </div>
                <button 
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-primary-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/browse" className="block px-3 py-2 text-gray-600 hover:text-primary-600 text-base font-medium">
              Browse
            </Link>
            <Link href="/sell" className="block px-3 py-2 text-gray-600 hover:text-primary-600 text-base font-medium">
              Sell
            </Link>
            <Link href="/how-it-works" className="block px-3 py-2 text-gray-600 hover:text-primary-600 text-base font-medium">
              How It Works
            </Link>
            <hr className="my-2" />
            {user ? (
              <>
                <div className="block px-3 py-2 text-gray-700 text-base font-medium">
                  Welcome, {user.user_metadata?.first_name || user.email}
                </div>
                <button 
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-600 text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-gray-600 hover:text-primary-600 text-base font-medium">
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2 bg-primary-600 text-white rounded-md text-base font-medium hover:bg-primary-700 mx-3">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
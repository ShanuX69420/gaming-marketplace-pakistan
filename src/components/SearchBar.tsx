'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  initialValue?: string
  showSuggestions?: boolean
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search products, games, or accounts...", 
  initialValue = "",
  showSuggestions = true 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)
  const isSelectingSuggestion = useRef(false)
  
  // Popular search suggestions - updated to match actual products
  const popularSearches = [
    "PUBG Mobile account",    // singular, not plural
    "PUBG Mobile", 
    "Free Fire diamonds", 
    "Call of Duty Mobile",
    "Fortnite V-Bucks",
    "PlayStation gift cards",
    "Steam wallet codes",
    "Valorant account",       // singular, not plural
    "FIFA coins",
    "Counter-Strike skins",
    "Xbox Game Pass"
  ]

  useEffect(() => {
    if (query.length > 1 && showSuggestions && !isSelectingSuggestion.current) {
      const filtered = popularSearches.filter(search => 
        search.toLowerCase().includes(query.toLowerCase()) &&
        search.toLowerCase() !== query.toLowerCase() // Don't show exact matches
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestionsList(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestionsList(false)
    }
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('SearchBar: Submitting search for:', query.trim())
    onSearch(query.trim())
    setShowSuggestionsList(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    isSelectingSuggestion.current = true
    setQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestionsList(false)
    
    // Reset the flag after a short delay to prevent suggestions from reappearing
    setTimeout(() => {
      isSelectingSuggestion.current = false
    }, 200)
  }

  // Handle mouse down to prevent input blur/focus cycle
  const handleSuggestionMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent input from losing focus and refocusing
  }

  // Handle input blur to hide suggestions when clicking outside
  const handleBlur = () => {
    // Small delay to allow suggestion click to register
    setTimeout(() => {
      setShowSuggestionsList(false)
    }, 150)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestionsList(false)
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.length > 1 && !isSelectingSuggestion.current && suggestions.length > 0) {
                setShowSuggestionsList(true)
              }
            }}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                onSearch('')
                setShowSuggestionsList(false)
              }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search Button */}
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestionsList && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onMouseDown={handleSuggestionMouseDown}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
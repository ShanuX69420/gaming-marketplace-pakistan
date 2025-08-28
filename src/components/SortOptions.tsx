'use client'


interface SortOption {
  value: string
  label: string
  sort_by: string
  sort_order: 'asc' | 'desc'
}

const SORT_OPTIONS: SortOption[] = [
  {
    value: 'created_at_desc',
    label: '🕒 Latest First',
    sort_by: 'created_at',
    sort_order: 'desc'
  },
  {
    value: 'created_at_asc',
    label: '📅 Oldest First',
    sort_by: 'created_at',
    sort_order: 'asc'
  },
  {
    value: 'price_asc',
    label: '💰 Price: Low to High',
    sort_by: 'price',
    sort_order: 'asc'
  },
  {
    value: 'price_desc',
    label: '💸 Price: High to Low',
    sort_by: 'price',
    sort_order: 'desc'
  },
  {
    value: 'view_count_desc',
    label: '👁️ Most Popular',
    sort_by: 'view_count',
    sort_order: 'desc'
  },
  {
    value: 'relevance',
    label: '🎯 Most Relevant',
    sort_by: 'relevance',
    sort_order: 'desc'
  }
]

interface SortOptionsProps {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  className?: string
  showLabel?: boolean
}

export default function SortOptions({ 
  sortBy = 'created_at', 
  sortOrder = 'desc',
  onSortChange,
  className = "",
  showLabel = true
}: SortOptionsProps) {
  const currentValue = `${sortBy}_${sortOrder}`
  
  const handleChange = (value: string) => {
    const option = SORT_OPTIONS.find(opt => opt.value === value)
    if (option) {
      onSortChange(option.sort_by, option.sort_order)
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Sort by:
        </label>
      )}
      <select
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        className="min-w-[180px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Mobile-friendly sort buttons component
interface SortButtonsProps {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  className?: string
}

export function SortButtons({ 
  sortBy = 'created_at', 
  sortOrder = 'desc',
  onSortChange,
  className = ""
}: SortButtonsProps) {
  const currentValue = `${sortBy}_${sortOrder}`
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.sort_by, option.sort_order)}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap ${
            currentValue === option.value
              ? 'bg-primary-100 text-primary-700 border border-primary-200 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
'use client'

import { cn } from '@/lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export function Checkbox({ 
  label, 
  description,
  className, 
  ...props 
}: CheckboxProps) {
  return (
    <div className="flex items-start space-x-2">
      <input
        type="checkbox"
        className={cn(
          "mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded",
          "focus:ring-2 focus:ring-primary-500",
          className
        )}
        {...props}
      />
      {(label || description) && (
        <div className="space-y-1">
          {label && (
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Checkbox
'use client'

import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export default function Textarea({ 
  label, 
  error, 
  className, 
  ...props 
}: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg",
          "focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "disabled:bg-gray-50 disabled:cursor-not-allowed",
          "resize-vertical min-h-[100px]",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
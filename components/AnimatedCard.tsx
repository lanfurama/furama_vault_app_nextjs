'use client'

import { useState } from 'react'
import { LucideIcon } from 'lucide-react'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
  icon?: LucideIcon
  title?: string
  description?: string
}

export default function AnimatedCard({ 
  children, 
  className = '', 
  hover = true, 
  clickable = false,
  onClick,
  icon: Icon,
  title,
  description 
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const baseClasses = `
    card transition-all duration-300 ease-in-out
    ${hover ? 'hover:shadow-medium hover:-translate-y-1' : ''}
    ${clickable ? 'cursor-pointer active:scale-95' : ''}
    ${isHovered && hover ? 'shadow-medium -translate-y-1' : ''}
    ${className}
  `

  return (
    <div
      className={baseClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {(Icon || title || description) && (
        <div className="mb-4">
          {Icon && (
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              {title && (
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {title}
                </h3>
              )}
            </div>
          )}
          {description && (
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

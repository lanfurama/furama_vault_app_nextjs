'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: LucideIcon
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary'
  loading?: boolean
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-50 dark:bg-primary-900/20',
    icon: 'text-primary-600 dark:text-primary-400',
    iconBg: 'bg-primary-100 dark:bg-primary-800',
  },
  success: {
    bg: 'bg-success-50 dark:bg-success-900/20',
    icon: 'text-success-600 dark:text-success-400',
    iconBg: 'bg-success-100 dark:bg-success-800',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-900/20',
    icon: 'text-warning-600 dark:text-warning-400',
    iconBg: 'bg-warning-100 dark:bg-warning-800',
  },
  danger: {
    bg: 'bg-danger-50 dark:bg-danger-900/20',
    icon: 'text-danger-600 dark:text-danger-400',
    iconBg: 'bg-danger-100 dark:bg-danger-800',
  },
  secondary: {
    bg: 'bg-secondary-50 dark:bg-secondary-800',
    icon: 'text-secondary-600 dark:text-secondary-400',
    iconBg: 'bg-secondary-100 dark:bg-secondary-700',
  },
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color = 'primary',
  loading = false 
}: StatsCardProps) {
  const colors = colorClasses[color]

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-24"></div>
            <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-secondary-200 dark:bg-secondary-700 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`card-hover ${colors.bg} p-3`}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
            {title}
          </p>
          <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {changeType === 'increase' ? (
                <TrendingUp className="w-3 h-3 text-success-600 dark:text-success-400" />
              ) : changeType === 'decrease' ? (
                <TrendingDown className="w-3 h-3 text-danger-600 dark:text-danger-400" />
              ) : null}
              <span className={`text-xs font-medium ${
                changeType === 'increase' 
                  ? 'text-success-600 dark:text-success-400' 
                  : changeType === 'decrease'
                  ? 'text-danger-600 dark:text-danger-400'
                  : 'text-secondary-500 dark:text-secondary-400'
              }`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-1.5 rounded-md ${colors.iconBg}`}>
          <Icon className={`w-4 h-4 ${colors.icon}`} />
        </div>
      </div>
    </div>
  )
}

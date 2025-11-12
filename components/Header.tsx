'use client'

import { useState } from 'react'
import { Menu, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void
  title: string
  subtitle?: string
}

export default function Header({ onToggleSidebar, title, subtitle }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="header relative z-40">
      <div className="flex items-center justify-between px-4 py-2 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-charcoal-800 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-charcoal-500 dark:text-secondary-300" />
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-charcoal-700 dark:text-secondary-100">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400 dark:text-secondary-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Search button for mobile */}
          <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-charcoal-800 transition-colors">
            <Search className="w-5 h-5 text-charcoal-500 dark:text-secondary-300" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-charcoal-800 transition-colors"
            >
              <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-700 dark:text-primary-200" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-charcoal-700 dark:text-secondary-100">
                  Admin User
                </div>
                <div className="text-xs text-charcoal-400 dark:text-secondary-400">
                  Studio Admin
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-charcoal-400 dark:text-secondary-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-charcoal-800 rounded-lg shadow-large border border-secondary-200 dark:border-charcoal-700 z-50">
                <div className="py-1">
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-charcoal-600 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-charcoal-700 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-charcoal-600 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-charcoal-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-secondary-200 dark:border-charcoal-700 my-1"></div>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

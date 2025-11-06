'use client'

import { useState } from 'react'
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void
  title: string
  subtitle?: string
}

export default function Header({ onToggleSidebar, title, subtitle }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="header relative z-40">
      <div className="flex items-center justify-between px-4 py-2 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 dark:placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Search button for mobile */}
          <button className="md:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
            <Search className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-lg shadow-large border border-secondary-200 dark:border-secondary-700 z-50">
                <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
                  <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                    Notifications
                  </h3>
                </div>
                <div className="p-4">
                  <div className="text-sm text-secondary-500 dark:text-secondary-400 text-center">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  Admin User
                </div>
                <div className="text-xs text-secondary-500 dark:text-secondary-400">
                  Administrator
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-large border border-secondary-200 dark:border-secondary-700 z-50">
                <div className="py-1">
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-secondary-200 dark:border-secondary-700 my-1"></div>
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

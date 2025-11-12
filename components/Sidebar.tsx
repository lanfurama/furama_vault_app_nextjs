'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  Menu,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  FlaskConical,
  Languages,
  ChevronDown,
  Map,
  Sparkles,
  ExternalLink,
  Workflow,
  PenSquare,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
  external?: boolean
}

const navigation: NavItem[] = [
  { name: 'Studio Overview', href: '/', icon: LayoutDashboard },
  { name: 'Furama PMS', href: '/furama-pms', icon: Users },
  {
    name: 'AI Toolkit',
    href: '/ai-lab',
    icon: FlaskConical,
    children: [
      { name: 'AI Writer', href: '/ai-writer', icon: PenSquare },
    ],
  },
  {
    name: 'Guest Experience',
    href: '/guest-experience',
    icon: Sparkles,
    children: [
      { name: 'Nearby Discovery', href: '/nearby-discovery', icon: Map },
      { name: 'Live Translator', href: '/translator', icon: Languages },
    ],
  },
  {
    name: 'Operations',
    href: '/operations',
    icon: Workflow,
    children: [
      {
        name: 'Opslink',
        href: 'https://opslink-fe-web-app.vercel.app/',
        icon: ExternalLink,
        external: true,
      },
    ],
  },
]

export default function Sidebar({ isOpen, onToggle, darkMode, onToggleDarkMode }: SidebarProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === null) {
      localStorage.setItem('darkMode', 'true')
    }
  }, [])

  useEffect(() => {
    navigation.forEach(item => {
      if (!item.children) {
        return
      }

      const matchesParent =
        pathname === item.href || pathname.startsWith(`${item.href}/`)
      const matchesChild = item.children.some(
        child =>
          pathname === child.href || pathname.startsWith(`${child.href}/`),
      )

      if (matchesParent || matchesChild) {
        setOpenMenus(prev => ({ ...prev, [item.href]: true }))
      }
    })
  }, [pathname])

  const toggleMenu = (href: string) => {
    setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }))
  }

  const renderNavItem = (item: NavItem) => {
    const matchesParent =
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    const matchesChild = item.children?.some(
      child => pathname === child.href || pathname.startsWith(`${child.href}/`),
    )

    const isActive = matchesParent || Boolean(matchesChild)
    const hasChildren = Boolean(item.children?.length)
    const isOpen = openMenus[item.href]

    if (!hasChildren) {
      if (item.external) {
        return (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 rounded-lg px-2 py-2 text-sm font-medium text-charcoal-500 transition-all duration-200 hover:bg-secondary-100 hover:text-charcoal-700 dark:text-secondary-400 dark:hover:bg-charcoal-800 dark:hover:text-secondary-200"
            onClick={() => {
              if (window.innerWidth < 1024) {
                onToggle()
              }
            }}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </a>
        )
      }

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center space-x-2 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200 border-r-2 border-primary-500'
              : 'text-charcoal-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-charcoal-800 hover:text-charcoal-700 dark:hover:text-secondary-200'
          }`}
          onClick={() => {
            if (window.innerWidth < 1024) {
              onToggle()
            }
          }}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </Link>
      )
    }

    return (
      <div key={item.href} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleMenu(item.href)}
          className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-semibold transition-all duration-200 ${
            isActive
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200 border-r-2 border-primary-500'
              : 'text-charcoal-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-charcoal-800 hover:text-charcoal-700 dark:hover:text-secondary-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <item.icon className="w-5 h-5" />
            {item.name}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && item.children && (
          <div className="ml-6 space-y-1">
            {item.children.map(child => {
              const childActive = pathname === child.href
              return (
                child.external ? (
                  <a
                    key={child.href}
                    href={child.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 rounded-lg px-2 py-2 text-sm text-charcoal-500 transition-all duration-200 hover:bg-secondary-100 hover:text-charcoal-700 dark:text-secondary-400 dark:hover:bg-charcoal-800 dark:hover:text-secondary-200"
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onToggle()
                      }
                    }}
                  >
                    <child.icon className="h-4 w-4" />
                    <span>{child.name}</span>
                  </a>
                ) : (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`flex items-center space-x-2 rounded-lg px-2 py-2 text-sm transition-all duration-200 ${
                      childActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200'
                        : 'text-charcoal-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-charcoal-800 hover:text-charcoal-700 dark:hover:text-secondary-200'
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onToggle()
                      }
                    }}
                  >
                    <child.icon className="h-4 w-4" />
                    <span>{child.name}</span>
                  </Link>
                )
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-charcoal-900 border-r border-secondary-200 dark:border-charcoal-700 shadow-medium transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-charcoal-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-charcoal-700 dark:text-secondary-100">Furama Studio</h1>
              <p className="text-xs text-charcoal-400 dark:text-secondary-400 uppercase tracking-[0.3em]">
                Digital Add-on Hub
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5 text-charcoal-500 dark:text-secondary-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map(renderNavItem)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-secondary-200 dark:border-charcoal-700">
          <div className="flex items-center justify-between">
            <div className="text-xs text-charcoal-400 dark:text-secondary-400">Version 1.0.0</div>
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-charcoal-800 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-charcoal-500 dark:text-secondary-300" />
              ) : (
                <Moon className="w-4 h-4 text-charcoal-500 dark:text-secondary-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

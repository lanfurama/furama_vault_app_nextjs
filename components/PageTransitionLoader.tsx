'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import LoadingSpinner from './LoadingSpinner'

export default function PageTransitionLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Listen for link clicks to show loader immediately
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      
      if (link) {
        const href = link.getAttribute('href')
        // Only show loader for internal navigation (not external links)
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          setLoading(true)
        }
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  useEffect(() => {
    // Handle pathname changes - show loader when route changes
    setLoading(true)
    
    // Hide loader after page transition completes
    const timer = setTimeout(() => {
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl p-8 border border-secondary-200 dark:border-secondary-700">
        <LoadingSpinner size="lg" text="Loading page..." />
      </div>
    </div>
  )
}


'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import LoadingSpinner from './LoadingSpinner'

export default function PageTransitionLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const fallbackTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement | null

      if (link) {
        const href = link.getAttribute('href')

        if (href && href.startsWith('/') && !href.startsWith('//')) {
          const nextUrl = new URL(href, window.location.origin)
          const nextPath = nextUrl.pathname

          if (nextPath !== pathname) {
            setLoading(true)

            if (fallbackTimer.current) {
              clearTimeout(fallbackTimer.current)
            }
            fallbackTimer.current = setTimeout(() => {
              setLoading(false)
            }, 1000)
          }
        }
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
      if (fallbackTimer.current) {
        clearTimeout(fallbackTimer.current)
      }
    }
  }, [pathname])

  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
      if (fallbackTimer.current) {
        clearTimeout(fallbackTimer.current)
        fallbackTimer.current = null
      }
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


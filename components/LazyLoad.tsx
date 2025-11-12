'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export default function LazyLoad({ 
  children, 
  fallback = <div className="loading-spinner h-8 w-8" />,
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver((entries) => {
      const [{ isIntersecting }] = entries

      if (isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, {
      threshold,
      rootMargin
    })

    const currentEl = elementRef.current
    observer.observe(currentEl)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie'
  data: ChartData
  options?: any
  className?: string
}

export default function Chart({ type, data, options = {}, className = '' }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Dynamic import of Chart.js
    import('chart.js/auto').then(({ Chart }) => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }

      const ctx = canvasRef.current!.getContext('2d')
      if (!ctx) return

      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        ...options
      }

      chartRef.current = new Chart(ctx, {
        type,
        data,
        options: defaultOptions
      })
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [type, data, options])

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  )
}

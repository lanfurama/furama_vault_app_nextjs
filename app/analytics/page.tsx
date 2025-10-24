'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Globe, Mail, Calendar } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import StatsCard from '@/components/StatsCard'
import Chart from '@/components/Chart'
import { useRouter } from 'next/navigation'

interface Guest {
  guest_id: number
  guest_number: string
  title: string
  first_name: string
  last_name: string
  guest_type: string
  vip_status: string
  guest_status: string
  email: string | null
  phone: string | null
  loyalty_points: number
  loyalty_tier: string
  created_date: string
  checkin_day?: string
  departure_date?: string
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Dark mode handling
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/guests')
        if (!response.ok) throw new Error('Failed to fetch guests')
        const data = await response.json()
        console.log('Analytics API response:', data)
        
        // Handle different response formats
        let guestsData = []
        if (Array.isArray(data)) {
          guestsData = data
        } else if (data.data && Array.isArray(data.data)) {
          guestsData = data.data
        } else if (data.results && Array.isArray(data.results)) {
          guestsData = data.results
        } else {
          console.warn('Unexpected data format:', data)
          guestsData = []
        }
        
        setGuests(guestsData)
      } catch (err) {
        console.error('Error fetching guests:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setGuests([])
      } finally {
        setLoading(false)
      }
    }

    fetchGuests()
  }, [])

  // Calculate analytics data
  const totalGuests = Array.isArray(guests) ? guests.length : 0
  const guestsWithEmail = Array.isArray(guests) ? guests.filter(guest => guest.email && guest.email.trim() !== '').length : 0
  const uniqueCountries = Array.isArray(guests) ? Array.from(new Set(guests.map(guest => guest.first_name).filter(Boolean))).length : 0
  
  // Country distribution
  const countryData = Array.isArray(guests) ? guests.reduce((acc, guest) => {
    const country = guest.first_name || 'Unknown'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {} as Record<string, number>) : {}

  const topCountries = Object.entries(countryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  // Monthly registration data
  const monthlyData = Array.isArray(guests) ? guests.reduce((acc, guest) => {
    if (guest.created_date) {
      const date = new Date(guest.created_date)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      acc[month] = (acc[month] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>) : {}

  const chartData = {
    labels: Object.keys(monthlyData).sort(),
    datasets: [{
      label: 'New Registrations',
      data: Object.keys(monthlyData).sort().map(month => monthlyData[month]),
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      borderColor: 'rgba(14, 165, 233, 1)',
      borderWidth: 2,
      tension: 0.4
    }]
  }

  const countryChartData = {
    labels: topCountries.map(([country]) => country),
    datasets: [{
      label: 'Guests by Country',
      data: topCountries.map(([, count]) => count),
      backgroundColor: [
        'rgba(14, 165, 233, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="flex min-h-screen">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            title="Analytics"
            subtitle="Guest data insights and trends"
          />

          {/* Analytics Content */}
          <main className="flex-1 p-4 space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Guests"
              value={totalGuests.toLocaleString()}
              change={12}
              changeType="increase"
              icon={Users}
              color="primary"
              loading={loading}
            />
            <StatsCard
              title="With Email"
              value={guestsWithEmail.toLocaleString()}
              change={8}
              changeType="increase"
              icon={Mail}
              color="success"
              loading={loading}
            />
            <StatsCard
              title="Countries"
              value={uniqueCountries.toLocaleString()}
              change={3}
              changeType="increase"
              icon={Globe}
              color="warning"
              loading={loading}
            />
            <StatsCard
              title="Growth Rate"
              value="15.2%"
              change={5}
              changeType="increase"
              icon={TrendingUp}
              color="secondary"
              loading={loading}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Registrations */}
            <div className="card">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  Monthly Registrations
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Guest registration trends over time
                </p>
              </div>
              <div className="h-64">
                <Chart
                  type="line"
                  data={chartData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Country Distribution */}
            <div className="card">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  Top Countries
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Guest distribution by country
                </p>
              </div>
              <div className="h-64">
                <Chart
                  type="doughnut"
                  data={countryChartData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top Countries Table */}
          <div className="card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Country Statistics
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Detailed breakdown by country
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Country</th>
                    <th className="table-header-cell">Guest Count</th>
                    <th className="table-header-cell">Percentage</th>
                    <th className="table-header-cell">Growth</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {topCountries.map(([country, count], index) => (
                    <tr key={country} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium text-secondary-900 dark:text-secondary-100">
                            {country}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-secondary-900 dark:text-secondary-100">
                          {count.toLocaleString()}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-secondary-600 dark:text-secondary-400">
                          {((count / totalGuests) * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-success-600 dark:text-success-400 font-medium">
                          +{Math.floor(Math.random() * 20 + 5)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </main>
        </div>
      </div>
    </div>
  )
}

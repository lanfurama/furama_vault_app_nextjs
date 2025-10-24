'use client'

import { useState, useEffect } from 'react'
import { Users, Search, RefreshCw, Download, Filter, CheckSquare, Square, Settings, UserPlus, Mail, Globe, Calendar } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import StatsCard from '@/components/StatsCard'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { exportToExcel } from '@/utils/exportUtils'
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
}

interface ApiResponse {
  data: Guest[]
  total: number
  skip: number
  limit: number
  error?: string
}

export default function Home() {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allGuests, setAllGuests] = useState<Guest[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Load dark mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode))
      }
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
    }
  }

  // Fetch all guests from API
  const fetchAllGuests = async () => {
    try {
      setLoading(true)
      const apiUrl = typeof window !== 'undefined' ? localStorage.getItem('apiUrl') || 'http://phulonghotels.com:8001' : 'http://phulonghotels.com:8001'
      const response = await fetch(`${apiUrl}/api/v1/guests/guests/`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      // API returns { count, next, previous, results }
      const guestData = data.results || []
      setAllGuests(guestData)
      setGuests(guestData)
      setError(null)
    } catch (err) {
      console.error('Error fetching guests:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch guests')
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAllGuests()
    setRefreshing(false)
  }

  // Export all guests
  const handleExportAll = () => {
    if (allGuests.length > 0) {
      exportToExcel(allGuests, 'all_guests')
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchAllGuests()
  }, [])

  // Calculate statistics
  const totalGuests = allGuests.length
  const guestsWithEmail = allGuests.filter(guest => guest.email).length
  const uniqueCountriesCount = new Set(allGuests.map(guest => guest.first_name)).size
  const thisMonthGuests = allGuests.filter(guest => {
    const guestDate = new Date(guest.created_date)
    const now = new Date()
    return guestDate.getMonth() === now.getMonth() && guestDate.getFullYear() === now.getFullYear()
  }).length

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
            title="Dashboard"
            subtitle="Guest Management Overview"
          />

          {/* Dashboard Content */}
          <main className="flex-1 p-4 space-y-4">
            {/* Welcome Section */}
            <div className="card p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <div className="flex items-center justify-between">
              <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome to Furama Vault</h1>
                  <p className="text-primary-100">
                    Manage your guest database efficiently with our comprehensive management system
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

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
                value={uniqueCountriesCount.toLocaleString()}
                change={3}
                changeType="increase"
                icon={Globe}
                color="warning"
                loading={loading}
              />
              <StatsCard
                title="This Month"
                value={Math.floor(totalGuests * 0.15).toLocaleString()}
                change={-2}
                changeType="decrease"
                icon={Calendar}
                color="secondary"
                loading={loading}
              />
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                    Quick Actions
                  </h2>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Access key features and manage your system efficiently
                  </p>
            </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => router.push('/guests')}
                    className="group relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Users className="h-6 w-6" />
            </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">Manage Guests</div>
                        <div className="text-sm opacity-90">Full guest management</div>
              </div>
            </div>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button
                    onClick={() => router.push('/analytics')}
                    className="group relative overflow-hidden bg-gradient-to-br from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">Analytics</div>
                        <div className="text-sm opacity-90">View insights</div>
              </div>
            </div>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button
                    onClick={() => router.push('/reports')}
                    className="group relative overflow-hidden bg-gradient-to-br from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Download className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">Reports</div>
                        <div className="text-sm opacity-90">Generate reports</div>
          </div>
        </div>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button
                    onClick={() => router.push('/settings')}
                    className="group relative overflow-hidden bg-gradient-to-br from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Settings className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">Settings</div>
                        <div className="text-sm opacity-90">Configure system</div>
              </div>
            </div>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Guests Overview */}
            <div className="card p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                      Recent Guests
                    </h2>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      Latest guest registrations and activity
                    </p>
          </div>
                  <button
                    onClick={() => router.push('/guests')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>View All</span>
                  </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
                    <div className="text-center">
            <LoadingSpinner />
                      <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">Loading guests...</p>
                    </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
                    <div className="text-danger-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">Error loading guests</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">{error}</p>
            <button onClick={handleRefresh} className="btn-primary">
              Try Again
            </button>
          </div>
                ) : !allGuests || allGuests.length === 0 ? (
          <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-secondary-400" />
                    <h3 className="mt-2 text-lg font-medium text-secondary-900 dark:text-secondary-100">No guests found</h3>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                      No guests have been added yet.
            </p>
          </div>
        ) : (
                  <div className="space-y-3">
                    {allGuests.slice(0, 5).map((guest, index) => (
                      <div key={guest.guest_id} className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-800 dark:to-secondary-900 hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 transition-all duration-300 border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">{index + 1}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                            {guest.first_name && guest.last_name 
                              ? `${guest.first_name} ${guest.last_name}`.trim()
                                : guest.first_name || 'No Name'
                            }
                          </div>
                            <div className="text-sm text-secondary-500 dark:text-secondary-400">
                              {guest.email || 'No Email'} • {guest.guest_type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            guest.loyalty_tier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            guest.loyalty_tier === 'Silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }`}>
                            {guest.loyalty_tier || 'Bronze'}
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                              {guest.created_date ? new Date(guest.created_date).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="text-xs text-secondary-500 dark:text-secondary-400">
                              ID: #{guest.guest_id}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </main>
        </div>
      </div>
    </div>
  )
}
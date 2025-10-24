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
  id?: number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  country?: string
  created_at?: string
  updated_at?: string
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
  const [searchTerm, setSearchTerm] = useState('')
  const [allGuests, setAllGuests] = useState<Guest[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState<number[]>([])
  const [emailFilter, setEmailFilter] = useState<'all' | 'with_email' | 'without_email'>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const fetchAllGuests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Fetching all guests...')
      const apiUrl = `/api/guests`
      console.log('📡 API URL:', apiUrl)
      
      const response = await fetch(apiUrl)
      console.log('📊 Response status:', response.status)
      console.log('📊 Response ok:', response.ok)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: any = await response.json()
      console.log('📦 Full response data:', data)
      console.log('📦 Response keys:', Object.keys(data))
      
      // Handle different response structures
      let guestsData = []
      
      if (data.data) {
        guestsData = data.data
        console.log('✅ Using data.data structure')
      } else if (Array.isArray(data)) {
        guestsData = data
        console.log('✅ Using direct array structure')
      } else if (data.results) {
        guestsData = data.results
        console.log('✅ Using data.results structure')
      } else {
        console.log('❌ Unknown response structure:', data)
        setError('Unknown response format from API')
        setAllGuests([])
        return
      }
      
      console.log('👥 Final guests data:', guestsData)
      
      // Check if response has error
      if (data.error) {
        console.warn('⚠️ API returned error:', data.error)
        setError(data.error)
        setAllGuests([])
      } else {
        setAllGuests(guestsData || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('❌ Error fetching guests:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAllGuests()
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleExportAll = () => {
    const filename = exportToExcel(allGuests, 'all_guests_export')
    console.log(`Exported all ${allGuests.length} guests to ${filename}`)
  }

  const handleSelectGuest = (guestId: number) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    )
  }

  const handleSelectAll = () => {
    if (selectedGuests.length === paginatedGuests.length) {
      setSelectedGuests([])
    } else {
      setSelectedGuests(paginatedGuests.map(guest => guest.id || 0).filter(id => id > 0))
    }
  }

  const handleExportSelected = () => {
    const selectedGuestsData = allGuests.filter(guest => selectedGuests.includes(guest.id || 0))
    const filename = exportToExcel(selectedGuestsData, 'selected_guests_export')
    console.log(`Exported ${selectedGuestsData.length} selected guests to ${filename}`)
  }

  // Get unique countries for filter
  const uniqueCountries = Array.from(new Set(allGuests.map(guest => guest.country).filter(Boolean)))

  // Apply search and filters
  const filteredGuests = allGuests?.filter(guest => {
    const fullName = `${guest.first_name || ''} ${guest.last_name || ''}`.trim() || guest.name || ''
    const matchesSearch = (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (guest.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (guest.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (guest.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    
    const matchesEmailFilter = (() => {
      switch (emailFilter) {
        case 'with_email':
          return guest.email && guest.email.trim() !== ''
        case 'without_email':
          return !guest.email || guest.email.trim() === ''
        default:
          return true
      }
    })()
    
    const matchesCountryFilter = countryFilter === 'all' || guest.country === countryFilter
    
    return matchesSearch && matchesEmailFilter && matchesCountryFilter
  }) || []

  // Frontend pagination
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGuests = filteredGuests.slice(startIndex, endIndex)

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
    fetchAllGuests()
  }, [])

  // Calculate statistics
  const totalGuests = allGuests.length
  const guestsWithEmail = allGuests.filter(guest => guest.email && guest.email.trim() !== '').length
  const guestsWithoutEmail = totalGuests - guestsWithEmail
  const uniqueCountriesCount = Array.from(new Set(allGuests.map(guest => guest.country).filter(Boolean))).length

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Dashboard"
          subtitle="Guest Management Overview"
        />

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
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
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  Quick Actions
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Manage your guest data efficiently
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedGuests.length > 0 && (
                  <button
                    onClick={handleExportSelected}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Selected ({selectedGuests.length})</span>
                  </button>
                )}
                <button
                  onClick={handleExportAll}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export All</span>
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="btn-primary flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
          {/* Filters and Search */}
          <div className="card">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  Guest Management
                </h3>
                <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
                  <span>Filtered: <strong className="text-secondary-900 dark:text-secondary-100">{filteredGuests.length}</strong></span>
                  <span>•</span>
                  <span>Selected: <strong className="text-primary-600 dark:text-primary-400">{selectedGuests.length}</strong></span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Search Guests
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Email Filter
                  </label>
                  <select
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value as any)}
                    className="select"
                  >
                    <option value="all">All Guests</option>
                    <option value="with_email">With Email Only</option>
                    <option value="without_email">Without Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Country Filter
                  </label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="select"
                  >
                    <option value="all">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Data Table */}
          {loading ? (
            <div className="card">
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            </div>
          ) : error ? (
            <div className="card">
              <div className="text-center py-12">
                <div className="text-danger-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">Error loading guests</h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">{error}</p>
                <button onClick={handleRefresh} className="btn-primary">
                  Try Again
                </button>
              </div>
            </div>
          ) : !filteredGuests || filteredGuests.length === 0 ? (
            <div className="card">
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-secondary-400" />
                <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-secondary-100">No guests found</h3>
                <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No guests have been added yet.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">
                        <button
                          onClick={handleSelectAll}
                          className="flex items-center space-x-2 text-sm font-medium text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors"
                        >
                          {selectedGuests.length === paginatedGuests.length ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                          <span>Select All</span>
                        </button>
                      </th>
                      <th className="table-header-cell">Name</th>
                      <th className="table-header-cell">Email</th>
                      <th className="table-header-cell">Country</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {paginatedGuests.map((guest) => (
                      <tr key={guest.id} className="table-row">
                        <td className="table-cell">
                          <input
                            type="checkbox"
                            checked={selectedGuests.includes(guest.id || 0)}
                            onChange={() => handleSelectGuest(guest.id || 0)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-secondary-600 rounded"
                          />
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                                {guest.first_name && guest.last_name 
                                  ? `${guest.first_name} ${guest.last_name}`.trim()
                                  : guest.name || 'No Name'
                                }
                              </div>
                              <div className="text-xs text-secondary-500 dark:text-secondary-400">
                                ID: #{guest.id || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="text-sm text-secondary-900 dark:text-secondary-100">
                            {guest.email || 'No Email'}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="text-sm text-secondary-900 dark:text-secondary-100">
                            {guest.country || 'No Country'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Showing page <span className="font-medium text-secondary-900 dark:text-secondary-100">{currentPage + 1}</span> of{' '}
                      <span className="font-medium text-secondary-900 dark:text-secondary-100">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-soft -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                            i === currentPage
                              ? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400'
                              : 'bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
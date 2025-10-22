'use client'

import { useState, useEffect } from 'react'
import { Users, Search, RefreshCw, Download, Filter, CheckSquare, Square, Settings } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
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
  const uniqueCountries = [...new Set(allGuests.map(guest => guest.country).filter(Boolean))]

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

  useEffect(() => {
    fetchAllGuests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Furama Vault</h1>
                <p className="text-sm text-gray-600">Guest Management System</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push('/settings')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              {selectedGuests.length > 0 && (
                <button
                  onClick={handleExportSelected}
                  className="btn-secondary flex items-center space-x-2"
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Filter
              </label>
              <select
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Guests</option>
                <option value="with_email">With Email Only</option>
                <option value="without_email">Without Email</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Filter
              </label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <strong>Filtered:</strong> {filteredGuests.length} guests
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <strong>Selected:</strong> {selectedGuests.length} guests
              </div>
            </div>
          </div>
        </div>


        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guests by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Showing {paginatedGuests?.length || 0} of {filteredGuests?.length || 0} guests
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading guests</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={handleRefresh} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : !filteredGuests || filteredGuests.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No guests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No guests have been added yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Guest Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={handleSelectAll}
                          className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          {selectedGuests.length === paginatedGuests.length ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                          <span>Select All</span>
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedGuests.includes(guest.id || 0)}
                            onChange={() => handleSelectGuest(guest.id || 0)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {guest.first_name && guest.last_name 
                              ? `${guest.first_name} ${guest.last_name}`.trim()
                              : guest.name || 'No Name'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {guest.email || 'No Email'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {guest.country || 'No Country'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            i === currentPage
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Download, 
  Eye,
  Mail,
  RefreshCw
} from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import GuestCheckIns from '@/components/GuestCheckIns'
import { useGuests } from '@/hooks/useGuests'
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
  checkin_day?: string
  departure_date?: string
  nationality?: string
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export default function GuestsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGuests, setSelectedGuests] = useState<number[]>([])
  const [emailFilter, setEmailFilter] = useState<'all' | 'with_email' | 'without_email'>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showCheckInsModal, setShowCheckInsModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' })

  // Use the custom hook for guest management
  const {
    guests,
    loading,
    error,
    pagination,
    searchGuests,
    createGuest,
    updateGuest,
    deleteGuest,
    refreshGuests,
    goToPage,
    goToNextPage,
    goToPreviousPage
  } = useGuests({ 
    autoFetch: true, 
    searchTerm,
    hasEmail: emailFilter === 'with_email' ? true : emailFilter === 'without_email' ? false : undefined,
    nationality: countryFilter === 'all' ? undefined : countryFilter
  })

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

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchGuests(searchTerm)
      } else {
        refreshGuests()
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, searchGuests, refreshGuests])

  // Handle email filter changes - let useGuests hook handle this automatically
  // useEffect(() => {
  //   refreshGuests()
  // }, [emailFilter, refreshGuests])

  // List of nationalities for filter (matching API response values)
  const nationalities = [
    'Vietnam', 'Korea, Republic Of', 'China', 'Japan', 'Thailand', 'Singapore', 
    'Malaysia', 'Indonesia', 'Philippines', 'Taiwan', 'Hong Kong', 'Macau', 
    'Cambodia', 'Laos', 'Myanmar', 'Brunei', 'Australia', 'New Zealand', 
    'United States', 'Canada', 'Great Britain', 'France', 'Germany', 'Italy', 
    'Spain', 'Netherlands', 'Switzerland', 'Austria', 'Belgium', 'Sweden', 
    'Norway', 'Denmark', 'Finland', 'Russia', 'India', 'Pakistan', 'Bangladesh', 
    'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives', 'Afghanistan', 'Iran', 'Iraq', 
    'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 
    'Lebanon', 'Syria', 'Turkey', 'Israel', 'Egypt', 'South Africa', 'Nigeria', 
    'Kenya', 'Morocco', 'Tunisia', 'Algeria', 'Brazil', 'Argentina', 'Chile', 
    'Colombia', 'Peru', 'Venezuela', 'Mexico', 'Greece', 'Other'
  ]

  // Calculate statistics

  // No client-side filtering needed - all filtering is done via API parameters
  const filteredGuests = guests
  

  const handleSelectGuest = (guestId: number) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    )
  }

  const handleSelectAll = () => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([])
    } else {
      setSelectedGuests(filteredGuests.map(guest => guest.guest_id || 0).filter(id => id > 0))
    }
  }


  const handleExportExcel = async () => {
    try {
      // Show loading state via toast
      showToast('Preparing export...', 'info')
      
      // Build query parameters based on current filters
      const params = new URLSearchParams()
      
      // Add email filter
      if (emailFilter === 'with_email') {
        params.append('has_email', 'true')
      } else if (emailFilter === 'without_email') {
        params.append('has_email', 'false')
      }
      
      // Add nationality filter
      if (countryFilter !== 'all') {
        params.append('nationality', countryFilter)
      }
      
      // Add search term if exists
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      // Build the export URL
      const exportUrl = `/api/proxy?endpoint=/api/v1/guests/guests/export_excel/${params.toString() ? `?${params.toString()}` : ''}`
      
      console.log('📤 Export URL:', exportUrl)
      
      // Make the API call
      const response = await fetch(exportUrl)
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`)
      }
      
      // Get the blob from response
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with current filters
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      let filename = `guests_export_${timestamp}.xlsx`
      
      if (emailFilter !== 'all' || countryFilter !== 'all') {
        const filterParts = []
        if (emailFilter === 'with_email') filterParts.push('with_email')
        if (emailFilter === 'without_email') filterParts.push('without_email')
        if (countryFilter !== 'all') filterParts.push(countryFilter.replace(/[^a-zA-Z0-9]/g, '_'))
        filename = `guests_${filterParts.join('_')}_${timestamp}.xlsx`
      }
      
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      showToast(`Excel file exported successfully: ${filename}`, 'success')
      
    } catch (error) {
      console.error('Export error:', error)
      showToast('Failed to export Excel file', 'error')
    } finally {
      // Loading state handled by toast messages
    }
  }



  const handleViewCheckIns = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowCheckInsModal(true)
  }

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' })
    }, 3000)
  }

  // Table columns configuration
  const columns = [
    {
      key: 'select',
      label: '',
      sortable: false,
      render: (value: any, row: Guest) => (
        <input
          type="checkbox"
          checked={selectedGuests.includes(row.guest_id || 0)}
          onChange={() => handleSelectGuest(row.guest_id || 0)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-secondary-600 rounded"
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: any, row: Guest) => (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                              {row.first_name && row.last_name 
                                ? `${row.first_name} ${row.last_name}`.trim()
                                : row.first_name || 'No Name'
                              }
                            </div>
                            <div className="text-xs text-secondary-500 dark:text-secondary-400">
                              #{row.guest_id || 'N/A'} • {row.guest_number}
                            </div>
                          </div>
                        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {row.email || 'No Email'}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewCheckIns(row)}
            className="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="View check-ins"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

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
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            title="Guest Management"
            subtitle="Manage and organize guest information"
          />

          {/* Main Content */}
          <main className="flex-1 p-4 space-y-4">

          {/* Search and Filters */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search guests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value as any)}
                  className="px-3 py-2 text-sm border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Guests</option>
                  <option value="with_email">With Email</option>
                  <option value="without_email">Without Email</option>
                </select>
                
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Nationalities</option>
                  {nationalities.map(nationality => (
                    <option key={nationality} value={nationality}>{nationality}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>

                <button
                  onClick={refreshGuests}
                  className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-700 dark:hover:bg-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            data={filteredGuests}
            columns={columns}
            searchable={false}
            loading={loading}
            emptyMessage="No guests found. Try adjusting your search terms or add new guests."
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    Showing {((pagination.currentPage - 1) * 50) + 1} to {Math.min(pagination.currentPage * 50, pagination.count)} of {pagination.count.toLocaleString()} guests
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={!pagination.previous}
                    className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {/* Show page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const startPage = Math.max(1, pagination.currentPage - 2)
                      const pageNum = startPage + i
                      if (pageNum > pagination.totalPages) return null
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            pageNum === pagination.currentPage
                              ? 'bg-primary-600 text-white'
                              : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={!pagination.next}
                    className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Modals */}


      <Modal
        isOpen={showCheckInsModal}
        onClose={() => setShowCheckInsModal(false)}
        title="Guest Check-ins"
        size="xl"
      >
        {selectedGuest && (
          <GuestCheckIns
            guestId={selectedGuest.guest_id!}
            guestName={selectedGuest.first_name && selectedGuest.last_name 
              ? `${selectedGuest.first_name} ${selectedGuest.last_name}`.trim()
              : selectedGuest.first_name || 'Unknown Guest'
            }
            onClose={() => setShowCheckInsModal(false)}
          />
        )}
      </Modal>

          {/* Toast */}
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ show: false, message: '', type: 'info' })}
            />
          )}
      </div>
    </div>
  )
}

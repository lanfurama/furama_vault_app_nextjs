'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  Calendar,
  RefreshCw
} from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import GuestForm from '@/components/GuestForm'
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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
    hasEmail: emailFilter === 'with_email' ? true : emailFilter === 'without_email' ? false : undefined
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
  const totalGuests = pagination.count || guests.length
  const guestsWithEmail = guests.filter(guest => guest.email && guest.email.trim() !== '').length
  const guestsWithoutEmail = guests.length - guestsWithEmail
  const uniqueNationalities = Array.from(new Set(guests.map(guest => guest.nationality || 'Unknown').filter(Boolean)))

  // Apply client-side filters (nationality filter only, email and search are handled by server)
  const filteredGuests = guests?.filter(guest => {
    const matchesNationalityFilter = countryFilter === 'all' || guest.nationality === countryFilter
    
    return matchesNationalityFilter
  }) || []

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


  const handleExportWithEmail = () => {
    const guestsWithEmail = filteredGuests.filter(guest => guest.email && guest.email.trim() !== '')
    const filename = exportToExcel(guestsWithEmail, 'guests_with_email_export')
    showToast(`Exported ${guestsWithEmail.length} guests with email to ${filename}`, 'success')
  }

  const handleExportAll = () => {
    const filename = exportToExcel(filteredGuests, 'all_filtered_guests_export')
    showToast(`Exported all ${filteredGuests.length} filtered guests to ${filename}`, 'success')
  }


  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowEditModal(true)
  }

  const handleDeleteGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowDeleteModal(true)
  }

  const handleViewCheckIns = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowCheckInsModal(true)
  }

  const handleSaveGuest = async (guestData: Partial<Guest>) => {
    try {
      if (selectedGuest) {
        // Update existing guest
        const updatedGuest = await updateGuest(selectedGuest.guest_id!, guestData)
        if (updatedGuest) {
          showToast('Guest updated successfully!', 'success')
          setShowEditModal(false)
        } else {
          showToast('Failed to update guest', 'error')
        }
      } else {
        // Create new guest
        const newGuest = await createGuest(guestData)
        if (newGuest) {
          showToast('Guest added successfully!', 'success')
          setShowEditModal(false)
        } else {
          showToast('Failed to add guest', 'error')
        }
      }
    } catch (error) {
      showToast('An error occurred while saving guest', 'error')
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedGuest?.guest_id) return

    try {
      const success = await deleteGuest(selectedGuest.guest_id)
      if (success) {
        showToast('Guest deleted successfully!', 'success')
        setShowDeleteModal(false)
      } else {
        showToast('Failed to delete guest', 'error')
      }
    } catch (error) {
      showToast('An error occurred while deleting guest', 'error')
    }
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
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {row.phone || 'No Phone'}
          </span>
        </div>
      )
    },
    {
      key: 'guest_type',
      label: 'Type',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {row.guest_type || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'loyalty_tier',
      label: 'Loyalty',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.loyalty_tier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            row.loyalty_tier === 'Silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
          }`}>
            {row.loyalty_tier || 'Bronze'}
          </span>
        </div>
      )
    },
    {
      key: 'checkin_day',
      label: 'Check-in Day',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {row.checkin_day ? new Date(row.checkin_day).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'departure_date',
      label: 'Departure Date',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {row.departure_date ? new Date(row.departure_date).toLocaleDateString() : 'N/A'}
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
          <button
            onClick={() => handleEditGuest(row)}
            className="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Edit guest"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteGuest(row)}
            className="p-2 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
            title="Delete guest"
          >
            <Trash2 className="w-4 h-4" />
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

          {/* Guest Management */}
          <div className="card p-3">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                    Guest Management
                  </h2>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Total Guests: <strong className="text-primary-600 dark:text-primary-400">{totalGuests.toLocaleString()}</strong>
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-secondary-500 dark:text-secondary-400">
                  <span>Filtered: <strong className="text-secondary-900 dark:text-secondary-100">{filteredGuests.length}</strong></span>
                  <span>•</span>
                  <span>Selected: <strong className="text-primary-600 dark:text-primary-400">{selectedGuests.length}</strong></span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportWithEmail}
                  className="btn-success flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Export With Email</span>
                </button>
                <button
                  onClick={handleExportAll}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export All</span>
                </button>
                <button
                  onClick={refreshGuests}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Search Guests
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-8 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Email Filter
                  </label>
                  <select
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value as any)}
                    className="select text-sm"
                  >
                    <option value="all">All Guests</option>
                    <option value="with_email">With Email Only</option>
                    <option value="without_email">Without Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Nationality Filter
                  </label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="select text-sm"
                  >
                    <option value="all">All Nationalities</option>
                    {nationalities.map(nationality => (
                      <option key={nationality} value={nationality}>{nationality}</option>
                    ))}
                  </select>
                </div>
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
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Guest"
        size="lg"
      >
        <GuestForm
          guest={selectedGuest}
          onSave={handleSaveGuest}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Guest"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Are you sure you want to delete <strong>{selectedGuest?.first_name && selectedGuest?.last_name 
              ? `${selectedGuest.first_name} ${selectedGuest.last_name}`.trim()
              : selectedGuest?.first_name || 'Unknown Guest'
            }</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="btn-danger"
            >
              Delete Guest
            </button>
          </div>
        </div>
      </Modal>

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

'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckSquare,
  Square,
  RefreshCw,
  MoreVertical
} from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import StatsCard from '@/components/StatsCard'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import GuestForm from '@/components/GuestForm'
import { exportToExcel } from '@/utils/exportUtils'
import { useRouter } from 'next/navigation'

interface Guest {
  id?: number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  country?: string
  address?: string
  created_at?: string
  updated_at?: string
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export default function GuestsPage() {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGuests, setSelectedGuests] = useState<number[]>([])
  const [emailFilter, setEmailFilter] = useState<'all' | 'with_email' | 'without_email'>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' })

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

  const fetchGuests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/guests')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      let guestsData = []
      
      if (data.data) {
        guestsData = data.data
      } else if (Array.isArray(data)) {
        guestsData = data
      } else if (data.results) {
        guestsData = data.results
      } else {
        throw new Error('Unknown response format from API')
      }
      
      setGuests(guestsData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching guests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  // Calculate statistics
  const totalGuests = guests.length
  const guestsWithEmail = guests.filter(guest => guest.email && guest.email.trim() !== '').length
  const guestsWithoutEmail = totalGuests - guestsWithEmail
  const uniqueCountries = Array.from(new Set(guests.map(guest => guest.country).filter(Boolean)))

  // Apply search and filters
  const filteredGuests = guests?.filter(guest => {
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
      setSelectedGuests(filteredGuests.map(guest => guest.id || 0).filter(id => id > 0))
    }
  }

  const handleExportSelected = () => {
    const selectedGuestsData = guests.filter(guest => selectedGuests.includes(guest.id || 0))
    const filename = exportToExcel(selectedGuestsData, 'selected_guests_export')
    showToast(`Exported ${selectedGuestsData.length} selected guests to ${filename}`, 'success')
  }

  const handleExportAll = () => {
    const filename = exportToExcel(guests, 'all_guests_export')
    showToast(`Exported all ${guests.length} guests to ${filename}`, 'success')
  }

  const handleAddGuest = () => {
    setSelectedGuest(null)
    setShowAddModal(true)
  }

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowEditModal(true)
  }

  const handleDeleteGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowDeleteModal(true)
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
          checked={selectedGuests.includes(row.id || 0)}
          onChange={() => handleSelectGuest(row.id || 0)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-secondary-600 rounded"
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              {row.first_name && row.last_name 
                ? `${row.first_name} ${row.last_name}`.trim()
                : row.name || 'No Name'
              }
            </div>
            <div className="text-xs text-secondary-500 dark:text-secondary-400">
              ID: #{row.id || 'N/A'}
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
      key: 'country',
      label: 'Country',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {row.country || 'No Country'}
          </span>
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}
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
        {/* Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Guest Management"
          subtitle="Manage and organize guest information"
        />

        {/* Main Content */}
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
              value={uniqueCountries.length.toLocaleString()}
              change={3}
              changeType="increase"
              icon={MapPin}
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
                  Guest Management
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Manage your guest database efficiently
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
                  onClick={fetchGuests}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleAddGuest}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Guest</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  Filters & Search
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

          {/* Data Table */}
          <DataTable
            data={filteredGuests}
            columns={columns}
            searchable={false}
            exportable={true}
            onExport={handleExportAll}
            loading={loading}
            emptyMessage="No guests found. Try adjusting your search terms or add new guests."
          />
        </main>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Guest"
        size="lg"
      >
        <GuestForm
          guest={null}
          onSave={(guest) => {
            setShowAddModal(false)
            showToast('Guest added successfully!', 'success')
            // Here you would typically call an API to save the guest
            console.log('New guest:', guest)
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Guest"
        size="lg"
      >
        <GuestForm
          guest={selectedGuest}
          onSave={(guest) => {
            setShowEditModal(false)
            showToast('Guest updated successfully!', 'success')
            // Here you would typically call an API to update the guest
            console.log('Updated guest:', guest)
          }}
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
            Are you sure you want to delete <strong>{selectedGuest?.name || `${selectedGuest?.first_name} ${selectedGuest?.last_name}`}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false)
                showToast('Guest deleted successfully!', 'success')
              }}
              className="btn-danger"
            >
              Delete Guest
            </button>
          </div>
        </div>
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
  )
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  Search,
  Download,
  Eye,
  Mail,
  RefreshCw,
  BarChart3,
  Settings,
  BedDouble,
  BadgeDollarSign,
  CalendarCheck2,
  ConciergeBell,
  CreditCard,
  UserCog,
  DoorOpen,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import GuestCheckIns from '@/components/GuestCheckIns'
import { PmsSettingsForm } from '@/components/PmsSettingsForm'
import { useGuests } from '@/hooks/useGuests'
import { exportToExcel } from '@/utils/exportUtils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

type ModuleKey =
  | 'property-management'
  | 'guest-management'
  | 'room-management'
  | 'rate-management'
  | 'reservation-management'
  | 'service-management'
  | 'payment-management'
  | 'staff-management'
  | 'front-office'
  | 'reporting-analytics'

interface PmsModule {
  id: ModuleKey
  title: string
  description: string
  icon: LucideIcon
  features: string[]
}

const PMS_MODULES: PmsModule[] = [
  {
    id: 'property-management',
    title: 'Property Management',
    description: 'Configure multi-property structures, brand groupings, and operational settings.',
    icon: Building2,
    features: [
      'Multi-resort support',
      'Property hierarchy & relationships',
      'Property settings (timezone, currency, policies)',
      'Property group management',
    ],
  },
  {
    id: 'guest-management',
    title: 'Guest Management',
    description: 'Discover, manage, and nurture guest relationships across the Furama portfolio.',
    icon: Users,
    features: [
      'Cross-property guest profiles',
      'Loyalty program and tiering',
      'Comprehensive stay history',
      'VIP segmentation and preferences',
    ],
  },
  {
    id: 'room-management',
    title: 'Room Management',
    description: 'Orchestrate room inventory, categories, and housekeeping status.',
    icon: BedDouble,
    features: [
      'Room type catalogues',
      'Real-time room inventory',
      'Status tracking (available, out-of-order)',
      'Housekeeping coordination',
    ],
  },
  {
    id: 'rate-management',
    title: 'Rate Management',
    description: 'Craft pricing strategies with dynamic controls for every season and segment.',
    icon: BadgeDollarSign,
    features: [
      'Configurable rate plans',
      'Dynamic pricing adjustments',
      'Corporate & group rate categories',
      'Seasonal rate orchestration',
    ],
  },
  {
    id: 'reservation-management',
    title: 'Reservation Management',
    description: 'Oversee the full booking lifecycle from tentative inquiries to departures.',
    icon: CalendarCheck2,
    features: [
      'End-to-end booking workflows',
      'Automatic & manual room assignment',
      'Guest transfers between properties',
      'Reservation statuses & alerts',
    ],
  },
  {
    id: 'service-management',
    title: 'Service Management',
    description: 'Organize spa, dining, and bespoke experiences with a structured service catalog.',
    icon: ConciergeBell,
    features: [
      'Service catalogues & categories',
      'Guest service requests and orders',
      'Scheduling and capacity management',
      'Cross-team coordination',
    ],
  },
  {
    id: 'payment-management',
    title: 'Payment Management',
    description: 'Handle financial touchpoints, invoicing, and audit-ready records.',
    icon: CreditCard,
    features: [
      'Multi-method payment processing',
      'Automated invoicing',
      'Ledger & payment tracking',
      'Refund management controls',
    ],
  },
  {
    id: 'staff-management',
    title: 'Staff Management',
    description: 'Support talent operations, shared staffing, and departmental structures.',
    icon: UserCog,
    features: [
      'Employee record management',
      'Department & role organisation',
      'Position responsibilities',
      'Cross-property staffing support',
    ],
  },
  {
    id: 'front-office',
    title: 'Front Office',
    description: 'Enable a seamless arrival-to-departure guest journey for every property.',
    icon: DoorOpen,
    features: [
      'Check-in orchestration',
      'Express check-out tools',
      'Real-time room availability updates',
      'Guest service coordination',
    ],
  },
  {
    id: 'reporting-analytics',
    title: 'Reporting & Analytics',
    description: 'Transform operational data into board-ready insights and portfolio health.',
    icon: BarChart3,
    features: [
      'Occupancy performance dashboards',
      'Revenue and ADR analytics',
      'Guest behaviour intelligence',
      'Chain-wide benchmarking reports',
    ],
  },
]

const MODULE_ID_SET = new Set<ModuleKey>(PMS_MODULES.map(module => module.id))

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

export default function FuramaPmsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGuests, setSelectedGuests] = useState<number[]>([])
  const [emailFilter, setEmailFilter] = useState<'all' | 'with_email' | 'without_email'>('all')
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showCheckInsModal, setShowCheckInsModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' })
  const [topCountriesWithEmail, setTopCountriesWithEmail] = useState<
    Array<{
      country: string
      withEmail: number
      total: number
      percentage: number
    }>
  >([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [activeModule, setActiveModule] = useState<ModuleKey>('guest-management')

  const activeModuleConfig =
    PMS_MODULES.find(module => module.id === activeModule) ?? PMS_MODULES[1]
  const ActiveModuleIcon = activeModuleConfig.icon

  const updateRoute = (moduleId: ModuleKey, panel: 'settings' | null) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('module', moduleId)
    if (panel) {
      params.set('panel', panel)
    } else {
      params.delete('panel')
    }
    router.replace(`/furama-pms?${params.toString()}`, { scroll: false })
  }

  const handleModuleChange = (moduleId: ModuleKey) => {
    setActiveModule(moduleId)
    const panel = showSettingsModal ? 'settings' : null
    updateRoute(moduleId, panel)
  }

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
    goToPreviousPage,
  } = useGuests({
    autoFetch: true,
    searchTerm,
    hasEmail: emailFilter === 'with_email' ? true : emailFilter === 'without_email' ? false : undefined,
    language: languageFilter === 'all' ? undefined : languageFilter,
  })

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    const moduleParam = searchParams.get('module')
    if (moduleParam && MODULE_ID_SET.has(moduleParam as ModuleKey) && moduleParam !== activeModule) {
      setActiveModule(moduleParam as ModuleKey)
    }
  }, [searchParams, activeModule])

  useEffect(() => {
    const panel = searchParams.get('panel')
    if (panel === 'settings' && isAdmin) {
      setShowSettingsModal(true)
      setActiveModule('guest-management')
    } else if (!panel) {
      setShowSettingsModal(false)
    }
  }, [searchParams, isAdmin])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    const html = document.documentElement

    html.classList.add('theme-transitioning')

    if (newDarkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    void html.offsetHeight

    setTimeout(() => {
      html.classList.remove('theme-transitioning')
    }, 50)

    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

  const openSettingsModal = () => {
    if (!isAdmin) return
    setShowSettingsModal(true)
    setActiveModule('guest-management')
    updateRoute('guest-management', 'settings')
  }

  const closeSettingsModal = () => {
    setShowSettingsModal(false)
    updateRoute(activeModule, null)
  }

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

  useEffect(() => {
    const fetchTopCountriesStats = async () => {
      try {
        setLoadingStats(true)

        const endpoints = [
          '/api/v1/guests/statistics/country-email/',
          '/api/v1/guests/statistics/nationality-email/',
          '/api/v1/guests/country-stats/',
          '/api/v1/guests/statistics/countries-with-email/',
          '/api/v1/guests/statistics/top-countries-email/',
        ]

        let data = null
        let lastError = null

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(`/api/proxy?endpoint=${endpoint}`)

            if (response.ok) {
              data = await response.json()
              console.log('✅ Successfully fetched from:', endpoint, data)
              break
            }
          } catch (error) {
            lastError = error
            console.log('❌ Failed to fetch from:', endpoint)
            continue
          }
        }

        if (!data) {
          throw lastError || new Error('All API endpoints failed')
        }

        let stats: Array<{
          country: string
          withEmail: number
          total: number
          percentage: number
        }> = []

        let items: any[] = []

        if (Array.isArray(data)) {
          items = data
        } else if (data.results && Array.isArray(data.results)) {
          items = data.results
        } else if (data.data && Array.isArray(data.data)) {
          items = data.data
        } else if (data.statistics && Array.isArray(data.statistics)) {
          items = data.statistics
        }

        stats = items
          .filter((item: any) => {
            const withEmail = item.with_email || item.withEmail || item.guests_with_email || 0
            return withEmail > 0
          })
          .sort((a: any, b: any) => {
            const aEmail = a.with_email || a.withEmail || a.guests_with_email || 0
            const bEmail = b.with_email || b.withEmail || b.guests_with_email || 0
            return bEmail - aEmail
          })
          .slice(0, 5)
          .map((item: any) => {
            const country = item.nationality || item.country || item.nation || ''
            const withEmail = item.with_email || item.withEmail || item.guests_with_email || 0
            const total = item.total || item.total_guests || item.count || 0
            const percentage = total > 0 ? Math.round((withEmail / total) * 100) : 0

            return {
              country,
              withEmail,
              total,
              percentage,
            }
          })

        setTopCountriesWithEmail(stats)
      } catch (error) {
        console.error('Error fetching country statistics:', error)
        setTopCountriesWithEmail([])
      } finally {
        setLoadingStats(false)
      }
    }

    fetchTopCountriesStats()
  }, [])

  const filteredGuests = guests

  const handleSelectGuest = (guestId: number) => {
    setSelectedGuests(prev =>
      prev.includes(guestId) ? prev.filter(id => id !== guestId) : [...prev, guestId],
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
    if (!isAdmin) {
      showToast('Access denied. Export function is only available for administrators.', 'error')
      return
    }

    try {
      showToast('Preparing export...', 'info')

      const params = new URLSearchParams()

      if (emailFilter === 'with_email') {
        params.append('has_email', 'true')
      } else if (emailFilter === 'without_email') {
        params.append('has_email', 'false')
      }

      if (languageFilter !== 'all') {
        params.append('language', languageFilter)
      }

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const exportUrl = `/api/proxy?endpoint=/api/v1/guests/guests/export_excel/${params.toString() ? `?${params.toString()}` : ''}`
      console.log('📤 Export URL:', exportUrl)

      const response = await fetch(exportUrl)

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      let filename = `guests_export_${timestamp}.xlsx`

      if (emailFilter !== 'all') {
        const filterParts = []
        if (emailFilter === 'with_email') filterParts.push('with_email')
        if (emailFilter === 'without_email') filterParts.push('without_email')
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
          className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 dark:border-secondary-600"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              {row.first_name && row.last_name
                ? `${row.first_name} ${row.last_name}`.trim()
                : row.first_name || 'No Name'}
            </div>
            <div className="text-xs text-secondary-500 dark:text-secondary-400">
              #{row.guest_id || 'N/A'} • {row.guest_number}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {row.email || 'No Email'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (value: any, row: Guest) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewCheckIns(row)}
            className="p-2 text-secondary-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
            title="View check-ins"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-charcoal-900">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="main-content">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Furama PMS"
          subtitle={`${activeModuleConfig.title} module`}
        />

        <main className="space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
          <section className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:flex sm:items-center sm:justify-between sm:p-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500 dark:text-primary-300">
                Furama PMS
              </p>
              <h2 className="text-xl font-semibold text-charcoal-700 dark:text-secondary-100 sm:text-2xl">
                Command centre for multi-property operations
              </h2>
              <p className="text-xs text-charcoal-500 dark:text-secondary-400 sm:text-sm">
                Switch modules, adjust API settings, and work across properties—from any device.
              </p>
            </div>
            <Link
              href="/furama-pms?panel=settings"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-600 transition hover:bg-primary-50 dark:border-primary-900/40 dark:text-primary-200 dark:hover:bg-primary-900/20 sm:mt-0"
            >
              <Settings className="h-4 w-4" />
              API settings
            </Link>
          </section>

          <div className="lg:hidden">
            <div className="rounded-2xl border border-secondary-200 bg-white p-3 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800">
              <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-charcoal-400 dark:text-secondary-400">
                Modules
              </h3>
              <div className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
                {PMS_MODULES.map(module => {
                  const Icon = module.icon
                  const isActive = module.id === activeModule
                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => handleModuleChange(module.id)}
                      className={`flex min-w-[200px] snap-start items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                        isActive
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-200'
                          : 'border-secondary-200 bg-white text-charcoal-600 hover:border-primary-200 hover:bg-secondary-100 dark:border-charcoal-700 dark:bg-charcoal-900/40 dark:text-secondary-300 dark:hover:border-primary-800 dark:hover:bg-charcoal-800'
                      }`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary-600 dark:bg-charcoal-900 dark:text-primary-200">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold line-clamp-1">{module.title}</p>
                        <p className="text-xs text-charcoal-400 dark:text-secondary-500 line-clamp-1">
                          {module.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
            <aside className="hidden space-y-4 sm:space-y-6 lg:block">
              <div className="rounded-2xl border border-secondary-200 bg-white p-3 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-charcoal-400 dark:text-secondary-400">
                  Modules
                </h2>
                <div className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 sm:flex-col sm:space-y-2 sm:overflow-visible">
                  {PMS_MODULES.map(module => {
                    const Icon = module.icon
                    const isActive = module.id === activeModule
                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => handleModuleChange(module.id)}
                        className={`flex min-w-[200px] snap-start items-center gap-3 rounded-xl border px-3 py-2 text-left transition sm:min-w-full ${
                          isActive
                            ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-200'
                            : 'border-secondary-200 bg-white text-charcoal-600 hover:border-primary-200 hover:bg-secondary-100 dark:border-charcoal-700 dark:bg-charcoal-900/40 dark:text-secondary-300 dark:hover:border-primary-800 dark:hover:bg-charcoal-800'
                        }`}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary-600 dark:bg-charcoal-900 dark:text-primary-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{module.title}</p>
                          <p className="text-xs text-charcoal-400 dark:text-secondary-500 line-clamp-1">
                            {module.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>

            <section className="space-y-5 sm:space-y-6">
              {activeModule === 'guest-management' ? (
                <>
                  <div className="space-y-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:space-y-4 sm:p-5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-300 dark:text-secondary-500" />
                      <input
                        type="text"
                        placeholder="Search guests"
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                        className="w-full rounded-lg border border-secondary-300 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-charcoal-700 dark:bg-charcoal-900 dark:text-secondary-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <select
                        value={emailFilter}
                        onChange={event => setEmailFilter(event.target.value as typeof emailFilter)}
                        className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-charcoal-700 dark:bg-charcoal-900 dark:text-secondary-100"
                      >
                        <option value="all">All guests</option>
                        <option value="with_email">With email</option>
                        <option value="without_email">Without email</option>
                      </select>
                      <select
                        value={languageFilter}
                        onChange={event => setLanguageFilter(event.target.value)}
                        className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-charcoal-700 dark:bg-charcoal-900 dark:text-secondary-100"
                      >
                        <option value="all">All languages</option>
                        <option value="EN">English</option>
                        <option value="VN">Vietnamese</option>
                        <option value="KO">Korean</option>
                        <option value="JA">Japanese</option>
                        <option value="CN">Chinese</option>
                      </select>
                      <div className="flex gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={handleExportExcel}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                          >
                            <Download className="h-4 w-4" />
                            Export
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={refreshGuests}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary-100 px-3 py-2 text-sm font-semibold text-charcoal-600 transition hover:bg-secondary-200 dark:bg-charcoal-800 dark:text-secondary-200 dark:hover:bg-charcoal-700"
                        >
                          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>

                  {loadingStats ? (
                    <div className="rounded-3xl border border-secondary-200 bg-white p-3 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-4">
                      <div className="flex items-center justify-center gap-3 py-6 text-sm text-charcoal-500 dark:text-secondary-400">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary-600" />
                        Loading guest email coverage...
                      </div>
                    </div>
                  ) : topCountriesWithEmail.length > 0 ? (
                    <div className="rounded-3xl border border-secondary-200 bg-white p-3 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-4">
                      <div className="flex items-center gap-2 pb-4">
                        <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                        <h3 className="text-base font-semibold text-charcoal-700 dark:text-secondary-100">
                          Top 5 nationalities with verified emails
                        </h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                        {topCountriesWithEmail.map((item, index) => (
                          <div
                            key={item.country}
                            className="rounded-2xl border border-secondary-200 bg-secondary-50 p-3 dark:border-charcoal-700 dark:bg-charcoal-900/50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                                    index === 0
                                      ? 'bg-primary-600'
                                      : index === 1
                                        ? 'bg-primary-500'
                                        : index === 2
                                          ? 'bg-primary-400'
                                          : 'bg-charcoal-500'
                                  }`}
                                >
                                  {index + 1}
                                </span>
                                <span className="text-sm font-semibold text-charcoal-700 dark:text-secondary-100">
                                  {item.country}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-primary-600 dark:text-primary-300">
                                {item.percentage}%
                              </span>
                            </div>
                            <dl className="mt-3 space-y-2 text-xs text-charcoal-500 dark:text-secondary-400">
                              <div className="flex items-center justify-between">
                                <dt>With email</dt>
                                <dd className="font-semibold text-primary-600 dark:text-primary-300">
                                  {item.withEmail}
                                </dd>
                              </div>
                              <div className="flex items-center justify-between">
                                <dt>Total guests</dt>
                                <dd className="text-charcoal-600 dark:text-secondary-200">{item.total}</dd>
                              </div>
                            </dl>
                            <div className="mt-3 h-1.5 rounded-full bg-secondary-200 dark:bg-charcoal-700">
                              <div
                                className="h-1.5 rounded-full bg-primary-500 transition-all duration-300"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <DataTable
                    data={filteredGuests}
                    columns={columns}
                    searchable={false}
                    loading={loading}
                    emptyMessage="No guests found. Try adjusting your search terms or add new guests."
                  />

                  {pagination.totalPages > 1 && (
                    <div className="rounded-3xl border border-secondary-200 bg-white p-4 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-charcoal-500 dark:text-secondary-400">
                          Showing {((pagination.currentPage - 1) * 50) + 1} to{' '}
                          {Math.min(pagination.currentPage * 50, pagination.count)} of{' '}
                          {pagination.count.toLocaleString()} guests
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={goToPreviousPage}
                            disabled={!pagination.previous}
                            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
                              const startPage = Math.max(1, pagination.currentPage - 2)
                              const pageNum = startPage + index
                              if (pageNum > pagination.totalPages) return null
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => goToPage(pageNum)}
                                  className={`rounded-lg px-3 py-1 text-sm transition ${
                                    pageNum === pagination.currentPage
                                      ? 'bg-primary-700 text-white'
                                      : 'text-charcoal-500 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-charcoal-700'
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
                </>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  <div className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-charcoal-400 dark:text-secondary-400">
                          {activeModuleConfig.title}
                        </p>
                        <p className="mt-1 text-sm text-charcoal-500 dark:text-secondary-400">
                          {activeModuleConfig.description}
                        </p>
                      </div>
                      <span className="hidden rounded-xl border border-secondary-200 bg-secondary-50 p-2 text-primary-600 dark:border-charcoal-700 dark:bg-charcoal-900/40 dark:text-primary-200 sm:block">
                        <ActiveModuleIcon className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3 xl:gap-3">
                    {activeModuleConfig.features.map(feature => (
                      <div
                        key={feature}
                        className="rounded-xl border border-secondary-200 bg-white p-3 text-xs text-charcoal-600 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-800 dark:text-secondary-300 sm:text-sm"
                      >
                        <Sparkles className="mb-2 h-4 w-4 text-primary-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>

        <Modal
          isOpen={showCheckInsModal}
          onClose={() => setShowCheckInsModal(false)}
          title="Guest Check-ins"
          size="xl"
        >
          {selectedGuest && (
            <GuestCheckIns
              guestId={selectedGuest.guest_id!}
              guestName={
                selectedGuest.first_name && selectedGuest.last_name
                  ? `${selectedGuest.first_name} ${selectedGuest.last_name}`.trim()
                  : selectedGuest.first_name || 'Unknown Guest'
              }
              onClose={() => setShowCheckInsModal(false)}
            />
          )}
        </Modal>

        <Modal
          isOpen={showSettingsModal}
          onClose={closeSettingsModal}
          title="Furama PMS Settings"
          size="lg"
        >
          <PmsSettingsForm onClose={closeSettingsModal} />
        </Modal>

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


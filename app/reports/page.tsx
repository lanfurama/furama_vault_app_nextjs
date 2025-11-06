'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Filter, BarChart3 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function ReportsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedReport, setSelectedReport] = useState<string>('')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
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
    const html = document.documentElement
    
    // Disable ALL transitions to prevent lag during theme switch
    html.classList.add('theme-transitioning')
    
    // Apply theme change immediately (no transition)
    if (newDarkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // Force a reflow to ensure DOM updates
    void html.offsetHeight
    
    // Re-enable transitions after DOM has updated
    setTimeout(() => {
      html.classList.remove('theme-transitioning')
    }, 50)
    
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

  const reportTypes = [
    {
      id: 'guest-list',
      name: 'Guest List Report',
      description: 'Complete list of all guests with contact information',
      icon: FileText,
      color: 'primary'
    },
    {
      id: 'email-list',
      name: 'Email List Report',
      description: 'Guests with valid email addresses for marketing',
      icon: Download,
      color: 'success'
    },
    {
      id: 'country-analysis',
      name: 'Country Analysis',
      description: 'Geographic distribution of guests by country',
      icon: BarChart3,
      color: 'warning'
    },
    {
      id: 'registration-trends',
      name: 'Registration Trends',
      description: 'Monthly and yearly registration patterns',
      icon: Calendar,
      color: 'secondary'
    }
  ]

  const handleGenerateReport = () => {
    if (!selectedReport) return
    
    // Simulate report generation
    console.log('Generating report:', selectedReport, 'for date range:', dateRange)
    
    // Here you would implement actual report generation logic
    alert(`Report "${selectedReport}" will be generated for the selected date range.`)
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
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
          title="Reports"
          subtitle="Generate and export guest data reports"
        />

        {/* Reports Content */}
        <main className="flex-1 p-4 space-y-4">
          {/* Report Configuration */}
          <div className="card">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Report Configuration
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Select report type and date range to generate your report
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Report Type
                </label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="select"
                >
                  <option value="">Select a report type</option>
                  {reportTypes.map((report) => (
                    <option key={report.id} value={report.id}>
                      {report.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="input"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="input"
                    placeholder="End Date"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGenerateReport}
                disabled={!selectedReport}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          {/* Report Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report) => {
              const Icon = report.icon
              const isSelected = selectedReport === report.id
              
              return (
                <div
                  key={report.id}
                  className={`card-hover cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      report.color === 'primary' ? 'bg-primary-100 dark:bg-primary-900' :
                      report.color === 'success' ? 'bg-success-100 dark:bg-success-900' :
                      report.color === 'warning' ? 'bg-warning-100 dark:bg-warning-900' :
                      'bg-secondary-100 dark:bg-secondary-800'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        report.color === 'primary' ? 'text-primary-600 dark:text-primary-400' :
                        report.color === 'success' ? 'text-success-600 dark:text-success-400' :
                        report.color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                        'text-secondary-600 dark:text-secondary-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        {report.name}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {report.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Reports */}
          <div className="card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Recent Reports
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Your recently generated reports
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Guest List - December 2024', date: '2024-12-15', size: '2.3 MB' },
                { name: 'Email List - Q4 2024', date: '2024-12-10', size: '1.8 MB' },
                { name: 'Country Analysis - November 2024', date: '2024-12-05', size: '1.2 MB' }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {report.name}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        Generated on {report.date} • {report.size}
                      </p>
                    </div>
                  </div>
                  <button className="btn-ghost text-xs">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

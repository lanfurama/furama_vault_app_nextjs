'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, RefreshCw, CheckCircle, AlertCircle, Moon, Sun } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [apiUrl, setApiUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
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
    // Load saved API URL from localStorage
    const savedApiUrl = localStorage.getItem('api_url') || 'http://localhost:8001'
    setApiUrl(savedApiUrl)
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      // Test API connection
      const testUrl = `${apiUrl}/api/v1/guest/`
      const response = await fetch(`/api/test-connection?url=${encodeURIComponent(testUrl)}`)
      const result = await response.json()

      if (result.success) {
        // Save to localStorage
        localStorage.setItem('api_url', apiUrl)
        setMessage('API URL saved successfully!')
        setMessageType('success')
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setMessage(`Connection failed: ${result.error}`)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Failed to test connection. Please check your API URL.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const testUrl = `${apiUrl}/api/v1/guest/`
      const response = await fetch(`/api/test-connection?url=${encodeURIComponent(testUrl)}`)
      const result = await response.json()

      if (result.success) {
        setMessage('Connection successful!')
        setMessageType('success')
      } else {
        setMessage(`Connection failed: ${result.error}`)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Failed to test connection. Please check your API URL.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

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
          title="Settings"
          subtitle="Configure API connection and preferences"
        />

        {/* Settings Content */}
        <main className="p-6 space-y-6">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                API Configuration
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Configure the backend API URL for guest data. Make sure your API is running and accessible.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  API Base URL
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8001"
                  className="input"
                />
                <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                  Enter the base URL of your backend API (without /api/v1/guest/)
                </p>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  messageType === 'success' 
                    ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800' 
                    : 'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800'
                }`}>
                  <div className="flex items-center">
                    {messageType === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400 mr-2" />
                    )}
                    <span className={`text-sm ${
                      messageType === 'success' ? 'text-success-800 dark:text-success-200' : 'text-danger-800 dark:text-danger-200'
                    }`}>
                      {message}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleTestConnection}
                  disabled={loading || !apiUrl}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !apiUrl}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save & Apply</span>
                </button>
              </div>
            </div>

            {/* API Requirements */}
            <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">
                API Requirements
              </h3>
              <div className="text-sm text-primary-700 dark:text-primary-300">
                <p className="mb-2">Your API should:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Accept GET requests to <code className="bg-primary-100 dark:bg-primary-800 px-1 rounded">/api/v1/guest/</code></li>
                  <li>Return JSON response with guest data</li>
                  <li>Include fields: <code className="bg-primary-100 dark:bg-primary-800 px-1 rounded">id, name, first_name, last_name, email, country</code></li>
                  <li>Support CORS for frontend requests</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

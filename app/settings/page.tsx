'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [apiUrl, setApiUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">Configure API connection</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="btn-secondary"
            >
              Back to Guests
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">API Configuration</h2>
            <p className="text-sm text-gray-600">
              Configure the backend API URL for guest data. Make sure your API is running and accessible.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Base URL
              </label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the base URL of your backend API (without /api/v1/guest/)
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-md ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {messageType === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  )}
                  <span className={`text-sm ${
                    messageType === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
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
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">API Requirements</h3>
            <div className="text-sm text-blue-700">
              <p className="mb-2">Your API should:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Accept GET requests to <code className="bg-blue-100 px-1 rounded">/api/v1/guest/</code></li>
                <li>Return JSON response with guest data</li>
                <li>Include fields: <code className="bg-blue-100 px-1 rounded">id, name, first_name, last_name, email, country</code></li>
                <li>Support CORS for frontend requests</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

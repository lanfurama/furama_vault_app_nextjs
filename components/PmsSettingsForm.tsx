'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, Save, CheckCircle, AlertCircle } from 'lucide-react'

interface PmsSettingsFormProps {
  onClose?: () => void
}

type MessageType = 'success' | 'error' | ''

export function PmsSettingsForm({ onClose }: PmsSettingsFormProps) {
  const [apiUrl, setApiUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<MessageType>('')

  useEffect(() => {
    const savedApiUrl = localStorage.getItem('api_url') || 'http://phulonghotels.com:8001'
    setApiUrl(savedApiUrl)
  }, [])

  const handleTest = async () => {
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
      setMessage('Failed to test connection. Please verify your API URL.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const testUrl = `${apiUrl}/api/v1/guest/`
      const response = await fetch(`/api/test-connection?url=${encodeURIComponent(testUrl)}`)
      const result = await response.json()

      if (result.success) {
        localStorage.setItem('api_url', apiUrl)
        setMessage('API URL saved successfully!')
        setMessageType('success')
        setTimeout(() => {
          onClose?.()
        }, 800)
      } else {
        setMessage(`Connection failed: ${result.error}`)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Failed to test connection. Please verify your API URL.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal-600 dark:text-secondary-300">
          API base URL
        </label>
        <input
          type="url"
          value={apiUrl}
          onChange={event => setApiUrl(event.target.value)}
          placeholder="http://phulonghotels.com:8001"
          className="input"
        />
        <p className="mt-1 text-xs text-charcoal-400 dark:text-secondary-400">
          Provide the base URL only (Studio appends <code>/api/v1/guest/</code> for requests).
        </p>
      </div>

      {message && (
        <div
          className={`rounded-xl border p-4 ${
            messageType === 'success'
              ? 'border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/20'
              : 'border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-900/20'
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            {messageType === 'success' ? (
              <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-300" />
            ) : (
              <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-300" />
            )}
            <span
              className={
                messageType === 'success'
                  ? 'text-success-700 dark:text-success-200'
                  : 'text-danger-700 dark:text-danger-200'
              }
            >
              {message}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTest}
          disabled={loading || !apiUrl}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Test connection</span>
        </button>
        <button
          onClick={handleSave}
          disabled={loading || !apiUrl}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Save & apply</span>
        </button>
      </div>

      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20">
        <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200">API expectations</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-primary-700 dark:text-primary-300">
          <li>
            GET <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">/api/v1/guest/</code> must
            return JSON
          </li>
          <li>Include identifiers, names, emails, nationality, stay dates</li>
          <li>Enable CORS for Furama Studio&apos;s domain</li>
        </ul>
      </div>
    </div>
  )
}


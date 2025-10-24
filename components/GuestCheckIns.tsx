'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Bed, Clock, CheckCircle, XCircle } from 'lucide-react'
import GuestService, { CheckIn } from '@/services/guestService'

interface GuestCheckInsProps {
  guestId: number
  guestName: string
  onClose: () => void
}

export default function GuestCheckIns({ guestId, guestName, onClose }: GuestCheckInsProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await GuestService.getGuestCheckIns(guestId)
        setCheckIns(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching check-ins:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCheckIns()
  }, [guestId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'checked_in':
        return <CheckCircle className="w-4 h-4 text-success-600" />
      case 'checked_out':
        return <XCircle className="w-4 h-4 text-danger-600" />
      default:
        return <Clock className="w-4 h-4 text-warning-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'checked_in':
        return 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
      case 'checked_out':
        return 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
      default:
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            Check-in History
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {guestName}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
        >
          <XCircle className="w-5 h-5 text-secondary-500" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="loading-spinner h-8 w-8"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-danger-600 mb-4">
            <XCircle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            Error loading check-ins
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">{error}</p>
        </div>
      ) : checkIns.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-secondary-400" />
          <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-secondary-100">
            No check-ins found
          </h3>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            This guest has no check-in history.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {checkIns.map((checkIn) => (
            <div key={checkIn.checkin_id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <Bed className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Room {checkIn.room_number}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(checkIn.status)}`}>
                        {getStatusIcon(checkIn.status)}
                        <span className="ml-1 capitalize">
                          {checkIn.status.replace('_', ' ')}
                        </span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        <span className="text-secondary-600 dark:text-secondary-400">
                          Check-in: {formatDate(checkIn.check_in_date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        <span className="text-secondary-600 dark:text-secondary-400">
                          Check-out: {formatDate(checkIn.check_out_date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-secondary-400" />
                        <span className="text-secondary-600 dark:text-secondary-400">
                          Property ID: {checkIn.property_id}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-secondary-400" />
                        <span className="text-secondary-600 dark:text-secondary-400">
                          Created: {formatDate(checkIn.created_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { User, Mail, Phone, MapPin, Calendar, Edit, Trash2, Eye } from 'lucide-react'

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

interface GuestCardProps {
  guest: Guest
  onEdit?: (guest: Guest) => void
  onDelete?: (guest: Guest) => void
  onView?: (guest: Guest) => void
  showActions?: boolean
}

export default function GuestCard({ 
  guest, 
  onEdit, 
  onDelete, 
  onView, 
  showActions = true 
}: GuestCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
            <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              {guest.first_name && guest.last_name 
                ? `${guest.first_name} ${guest.last_name}`.trim()
                : guest.name || 'No Name'
              }
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Guest ID: #{guest.id || 'N/A'}
            </p>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-1">
            {onView && (
              <button
                onClick={() => onView(guest)}
                className="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="View details"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(guest)}
                className="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Edit guest"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(guest)}
                className="p-2 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
                title="Delete guest"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {guest.email || 'No Email'}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {guest.phone || 'No Phone'}
          </span>
        </div>
        
        {guest.country && (
          <div className="flex items-center space-x-3">
          <MapPin className="h-4 w-4 text-secondary-400" />
          <span className="text-sm text-secondary-900 dark:text-secondary-100">
            {guest.country}
          </span>
        </div>
        )}
        
        {guest.address && (
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 text-secondary-400 mt-0.5" />
            <span className="text-sm text-secondary-900 dark:text-secondary-100">
              {guest.address}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Created: {guest.created_at ? formatDate(guest.created_at) : 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Updated: {guest.updated_at ? formatDate(guest.updated_at) : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


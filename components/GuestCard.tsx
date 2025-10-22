import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

interface Guest {
  id?: number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  created_at?: string
  updated_at?: string
}

interface GuestCardProps {
  guest: Guest
}

export default function GuestCard({ guest }: GuestCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-2 rounded-full">
            <User className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {guest.first_name && guest.last_name 
                ? `${guest.first_name} ${guest.last_name}`.trim()
                : guest.name || 'No Name'
              }
            </h3>
            <p className="text-sm text-gray-500">Guest ID: #{guest.id || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{guest.email || 'No Email'}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{guest.phone || 'No Phone'}</span>
        </div>
        
        <div className="flex items-start space-x-3">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
          <span className="text-sm text-gray-600">{guest.address || 'No Address'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
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

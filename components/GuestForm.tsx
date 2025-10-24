'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Save, X } from 'lucide-react'

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
}

interface GuestFormProps {
  guest?: Guest | null
  onSave: (guest: Guest) => void
  onCancel: () => void
  loading?: boolean
}

export default function GuestForm({ guest, onSave, onCancel, loading = false }: GuestFormProps) {
  const [formData, setFormData] = useState({
    first_name: guest?.first_name || '',
    last_name: guest?.last_name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    title: guest?.title || 'mr',
    guest_type: guest?.guest_type || 'individual'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const guestData: Partial<Guest> = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      title: formData.title,
      guest_type: formData.guest_type
    }

    onSave(guestData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              className={`input pl-10 ${errors.first_name ? 'input-error' : ''}`}
              placeholder="Enter first name"
            />
          </div>
          {errors.first_name && (
            <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
              {errors.first_name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              className={`input pl-10 ${errors.last_name ? 'input-error' : ''}`}
              placeholder="Enter last name"
            />
          </div>
          {errors.last_name && (
            <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
              {errors.last_name}
            </p>
          )}
        </div>
      </div>

      {/* Title and Type Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Title
          </label>
          <select
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="select"
          >
            <option value="mr">Mr.</option>
            <option value="mrs">Mrs.</option>
            <option value="ms">Ms.</option>
            <option value="dr">Dr.</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Guest Type
          </label>
          <select
            value={formData.guest_type}
            onChange={(e) => handleChange('guest_type', e.target.value)}
            className="select"
          >
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
            <option value="group">Group</option>
          </select>
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter email address"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="input pl-10"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>


      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200 dark:border-secondary-700">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex items-center space-x-2"
          disabled={loading}
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center space-x-2"
          disabled={loading}
        >
          <Save className="h-4 w-4" />
          <span>{loading ? 'Saving...' : guest ? 'Update Guest' : 'Add Guest'}</span>
        </button>
      </div>
    </form>
  )
}

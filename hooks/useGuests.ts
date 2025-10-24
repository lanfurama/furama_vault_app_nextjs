'use client'

import { useState, useEffect, useCallback } from 'react'
import GuestService, { Guest, GuestResponse } from '@/services/guestService'

interface UseGuestsOptions {
  autoFetch?: boolean
  searchTerm?: string
  propertyId?: number
}

export function useGuests(options: UseGuestsOptions = {}) {
  const { autoFetch = true, searchTerm = '', propertyId } = options
  
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
    totalPages: 0
  })

  const fetchGuests = useCallback(async (page = 1, search = searchTerm) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await GuestService.getGuests({
        page,
        search: search || undefined,
        property_id: propertyId
      })
      
      setGuests(response.results)
      
      // Calculate total pages (assuming 50 items per page based on API)
      const itemsPerPage = 50
      const totalPages = Math.ceil(response.count / itemsPerPage)
      
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
        currentPage: page,
        totalPages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching guests:', err)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, propertyId])

  const searchGuests = useCallback(async (search: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await GuestService.searchGuestsCrossProperty({
        search,
        property_id: propertyId
      })
      
      setGuests(response.results)
      
      // Calculate total pages for search results
      const itemsPerPage = 50
      const totalPages = Math.ceil(response.count / itemsPerPage)
      
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
        currentPage: 1,
        totalPages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error searching guests:', err)
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  const getGuestById = useCallback(async (id: number): Promise<Guest | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const guest = await GuestService.getGuestById(id)
      return guest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching guest:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createGuest = useCallback(async (guestData: Partial<Guest>): Promise<Guest | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const newGuest = await GuestService.createGuest(guestData)
      
      // Refresh the list
      await fetchGuests(pagination.currentPage, searchTerm)
      
      return newGuest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error creating guest:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchGuests, pagination.currentPage, searchTerm])

  const updateGuest = useCallback(async (id: number, guestData: Partial<Guest>): Promise<Guest | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const updatedGuest = await GuestService.updateGuest(id, guestData)
      
      // Update the guest in the list
      setGuests(prev => prev.map(guest => 
        guest.id === id ? updatedGuest : guest
      ))
      
      return updatedGuest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error updating guest:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteGuest = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      await GuestService.deleteGuest(id)
      
      // Remove the guest from the list
      setGuests(prev => prev.filter(guest => guest.id !== id))
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error deleting guest:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshGuests = useCallback(() => {
    fetchGuests(pagination.currentPage, searchTerm)
  }, [fetchGuests, pagination.currentPage, searchTerm])

  const goToPage = useCallback((page: number) => {
    fetchGuests(page, searchTerm)
  }, [fetchGuests, searchTerm])

  const goToNextPage = useCallback(() => {
    if (pagination.next) {
      fetchGuests(pagination.currentPage + 1, searchTerm)
    }
  }, [fetchGuests, pagination.next, pagination.currentPage, searchTerm])

  const goToPreviousPage = useCallback(() => {
    if (pagination.previous) {
      fetchGuests(pagination.currentPage - 1, searchTerm)
    }
  }, [fetchGuests, pagination.previous, pagination.currentPage, searchTerm])

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchGuests()
    }
  }, [autoFetch, fetchGuests])

  return {
    guests,
    loading,
    error,
    pagination,
    fetchGuests,
    searchGuests,
    getGuestById,
    createGuest,
    updateGuest,
    deleteGuest,
    refreshGuests,
    goToPage,
    goToNextPage,
    goToPreviousPage
  }
}

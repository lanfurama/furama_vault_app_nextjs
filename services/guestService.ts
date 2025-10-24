const API_BASE_URL = '/api/proxy?endpoint=/api/v1/guests'

export interface Guest {
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
}

export interface GuestResponse {
  count: number
  next: string | null
  previous: string | null
  results: Guest[]
}

export interface CheckIn {
  checkin_id: number
  guest_id: number
  property_id: number
  check_in_date: string
  check_out_date: string
  room_number: string
  status: string
  created_date: string
}

export class GuestService {
  private static async makeRequest<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  /**
   * Get all guests with pagination
   * GET /api/v1/guests/guests/
   */
  static async getGuests(params?: {
    page?: number
    search?: string
    property_id?: number
    has_email?: boolean
  }): Promise<GuestResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.property_id) searchParams.append('property_id', params.property_id.toString())
    if (params?.has_email !== undefined) searchParams.append('has_email', params.has_email.toString())

    const url = `${API_BASE_URL}/guests/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return this.makeRequest<GuestResponse>(url)
  }

  /**
   * Get guests by page URL (for pagination)
   * GET /api/v1/guests/guests/?page=X
   */
  static async getGuestsByUrl(url: string): Promise<GuestResponse> {
    return this.makeRequest<GuestResponse>(url)
  }

  /**
   * Get specific guest details
   * GET /api/v1/guests/guests/{id}/
   */
  static async getGuestById(id: number): Promise<Guest> {
    const url = `${API_BASE_URL}/guests/${id}/`
    return this.makeRequest<Guest>(url)
  }

  /**
   * Search guests across all properties
   * GET /api/v1/guests/guests/cross_property/
   */
  static async searchGuestsCrossProperty(params?: {
    search?: string
    property_id?: number
    page?: number
  }): Promise<GuestResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.search) searchParams.append('search', params.search)
    if (params?.property_id) searchParams.append('property_id', params.property_id.toString())
    if (params?.page) searchParams.append('page', params.page.toString())

    const url = `${API_BASE_URL}/guests/cross_property/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return this.makeRequest<GuestResponse>(url)
  }

  /**
   * Get guest check-in history
   * GET /api/v1/guests/guests/{id}/checkins/
   */
  static async getGuestCheckIns(guestId: number): Promise<CheckIn[]> {
    const url = `${API_BASE_URL}/guests/${guestId}/checkins/`
    return this.makeRequest<CheckIn[]>(url)
  }

  /**
   * Create new guest
   * POST /api/v1/guests/guests/
   */
  static async createGuest(guestData: Partial<Guest>): Promise<Guest> {
    const url = `${API_BASE_URL}/guests/`
    return this.makeRequest<Guest>(url, {
      method: 'POST',
      body: JSON.stringify(guestData),
    })
  }

  /**
   * Update guest
   * PUT /api/v1/guests/guests/{id}/
   */
  static async updateGuest(id: number, guestData: Partial<Guest>): Promise<Guest> {
    const url = `${API_BASE_URL}/guests/${id}/`
    return this.makeRequest<Guest>(url, {
      method: 'PUT',
      body: JSON.stringify(guestData),
    })
  }

  /**
   * Delete guest
   * DELETE /api/v1/guests/guests/{id}/
   */
  static async deleteGuest(id: number): Promise<void> {
    const url = `${API_BASE_URL}/guests/${id}/`
    return this.makeRequest<void>(url, {
      method: 'DELETE',
    })
  }
}

export default GuestService

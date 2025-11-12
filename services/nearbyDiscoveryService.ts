'use client'

import type { SearchResult } from '@/types/nearby-discovery'

interface SearchParams {
  categories: string[]
  radius: number
  isThinkingMode: boolean
  location: {
    latitude: number
    longitude: number
  }
}

const handleResponse = async (response: Response) => {
  const data = await response.json()

  if (!response.ok) {
    const message =
      typeof data?.error === 'string' ? data.error : 'Unexpected server error.'
    throw new Error(message)
  }

  return data as SearchResult
}

export const requestNearbyDiscovery = async (
  params: SearchParams,
): Promise<SearchResult> => {
  const response = await fetch('/api/nearby-discovery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  return handleResponse(response)
}

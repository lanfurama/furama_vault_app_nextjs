export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Restaurant {
  name: string
  address: string
  rating?: number
  imageUrl?: string
  distanceKm?: number
}

export interface GroundingSource {
  uri: string
  title: string
}

export interface SearchResult {
  restaurants: Restaurant[]
  sources: GroundingSource[]
}


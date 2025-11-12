export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Restaurant {
  name: string
  address: string
  description: string
}

export interface GroundingSource {
  uri: string
  title: string
}

export interface SearchResult {
  restaurants: Restaurant[]
  sources: GroundingSource[]
}


'use server'

import { GoogleGenAI } from '@google/genai'

import type {
  Coordinates,
  GroundingSource,
  Restaurant,
  SearchResult,
} from '@/types/nearby-discovery'

let cachedClient: GoogleGenAI | null = null

const getClient = () => {
  if (cachedClient) {
    return cachedClient
  }

  const apiKey =
    process.env.GOOGLE_GENAI_API_KEY ??
    process.env.GEMINI_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY ??
    process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Missing GOOGLE_GENAI_API_KEY environment variable.')
  }

  cachedClient = new GoogleGenAI({ apiKey })
  return cachedClient
}

interface SearchParams {
  categories: string[]
  radius: number
  isThinkingMode: boolean
  location: Coordinates
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1555992336-cbf54f7d7621?auto=format&fit=crop&w=800&q=80'

const sanitizeRestaurant = (candidate: any): Restaurant | null => {
  if (!candidate || typeof candidate !== 'object') {
    return null
  }

  const name = String(candidate.name ?? '').trim()
  const address = String(candidate.address ?? '').trim()
  const description = String(candidate.description ?? '').trim()

  if (!name || !description) {
    return null
  }

  const rawRating = Number(candidate.rating)
  const rating =
    Number.isFinite(rawRating) && rawRating >= 0
      ? Math.min(5, Math.max(0, rawRating))
      : undefined

  const imageUrl =
    typeof candidate.imageUrl === 'string' && candidate.imageUrl.trim().length > 0
      ? candidate.imageUrl.trim()
      : FALLBACK_IMAGE

  return {
    name,
    address,
    description,
    rating,
    imageUrl,
  }
}

const parseRestaurantsFromJson = (text: string): Restaurant[] => {
  try {
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed)) {
      return []
    }
    const restaurants = parsed
      .map(item => sanitizeRestaurant(item))
      .filter((item): item is Restaurant => item !== null)
    return restaurants
  } catch {
    return []
  }
}

const parseRestaurantsFromText = (text: string): Restaurant[] => {
  const jsonParsed = parseRestaurantsFromJson(text)
  if (jsonParsed.length > 0) {
    return jsonParsed
  }

  const restaurants: Restaurant[] = []
  const regex =
    /^\s*\d+\.\s*\*?\s*([^-\n]+?)\s*-\s*([^-\n]+?)\s*-\s*([\s\S]+?)(?=\n\s*\d+\.\s*\*?|$)/gm
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    restaurants.push({
      name: match[1].replace(/\*\*/g, '').trim(),
      address: match[2].trim(),
      description: match[3].trim(),
      imageUrl: FALLBACK_IMAGE,
    })
  }

  return restaurants
}

export const findNearbyEateries = async ({
  categories,
  radius,
  isThinkingMode,
  location,
}: SearchParams): Promise<SearchResult> => {
  const ai = getClient()

  const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash'
  const query = categories.join(' or ')

  const prompt = isThinkingMode
    ? `You are assisting a hospitality concierge. Recommend the best matches for "${query}" within a ${radius} kilometer radius of the provided coordinates. Respond with **only valid JSON** (no markdown, no explanations). The JSON must be an array where every item has the shape:
{
  "name": string,
  "address": string,
  "description": string,
  "rating": number (0-5, round to one decimal place),
  "imageUrl": string (high-quality photo URL or Google Maps photo URL)
}
Ensure descriptions capture unique highlights, rating reflects overall guest sentiment, and imageUrl is a direct link to a representative photo.`
    : `Find top matches for "${query}" within a ${radius} kilometer radius from the provided location. Reply with **only a JSON array** of objects containing: name, address, description, rating (0-5), imageUrl (direct photo URL). Keep descriptions concise and highlight what makes each spot special.`

  const config: Record<string, unknown> = isThinkingMode
    ? {
        thinkingConfig: { thinkingBudget: 32768 },
      }
    : {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config,
  })

  const textResponse = response.text
  const restaurants = parseRestaurantsFromText(textResponse)

  const groundingChunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []
  const sources: GroundingSource[] = groundingChunks
    .map(chunk => {
      const mapData = (chunk as any).maps
      if (mapData && mapData.uri && mapData.title) {
        return { uri: mapData.uri, title: mapData.title }
      }
      return null
    })
    .filter((source): source is GroundingSource => source !== null)

  if (restaurants.length === 0 && textResponse) {
    return {
      restaurants: [
        { name: 'Response', address: '', description: textResponse },
      ],
      sources,
    }
  }

  return { restaurants, sources }
}


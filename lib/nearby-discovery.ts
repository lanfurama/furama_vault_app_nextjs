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

const parseRestaurantsFromText = (text: string): Restaurant[] => {
  const restaurants: Restaurant[] = []
  const regex =
    /^\s*\d+\.\s*\*?\s*([^-\n]+?)\s*-\s*([^-\n]+?)\s*-\s*([\s\S]+?)(?=\n\s*\d+\.\s*\*?|$)/gm
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    restaurants.push({
      name: match[1].replace(/\*\*/g, '').trim(),
      address: match[2].trim(),
      description: match[3].trim(),
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
    ? `I'm looking for a thoughtful recommendation for "${query}" within a ${radius} kilometer radius of my location. Provide a detailed analysis for each suggestion. For each place, give its name, full address, and a comprehensive description of why it's a good choice. Format the output as a numbered list. Example: 1. [Name] - [Address] - [Description]`
    : `Find "${query}" within a ${radius} kilometer radius from my current location. For each place, provide its name, its address, and a short description. Format the output as a numbered list. Example: 1. [Name] - [Address] - [Description]`

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


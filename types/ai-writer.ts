export interface FormState {
  topic: string
  keywords: string
  tone: string
}

export interface GroundingChunk {
  web?: {
    uri: string
    title: string
  }
}

export interface GeneratedPost {
  title: string
  content: string
  sources: GroundingChunk[]
}

